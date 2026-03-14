"""
AeroMesh Fleet Manager
======================
In-memory fleet state manager for all AeroMesh-equipped buses.
Simulates bus filter filling and NOₓ readings when no real ESP32
hardware is connected. Real hardware data overwrites simulation
via update_bus_from_esp32().
"""

import random
from typing import Dict, List
from models.bus import Bus, BusStatus, FleetResponse
from models.esp32 import ESP32Payload
from database.seed import SEED_BUSES

# ── In-memory fleet state ──────────────────────────────────────────
_fleet: Dict[int, dict] = {}


def _init_fleet():
    """Initialize fleet from seed data on first call."""
    global _fleet
    if not _fleet:
        for bus in SEED_BUSES:
            _fleet[bus["id"]] = {
                "id": bus["id"],
                "name": bus["name"],
                "route": bus["route"],
                "filter_pct": float(bus["filter_pct"]),
                "upstream_nox": float(bus["upstream_nox"]),
                "downstream_nox": float(bus["downstream_nox"]),
                "status": bus["status"],
                "lat": bus["lat"],
                "lng": bus["lng"],
                "nox_captured_grams": round(
                    (bus["upstream_nox"] - bus["downstream_nox"]) * 0.012, 3
                ),
            }


def _compute_status(filter_pct: float) -> str:
    """Determine bus status from filter saturation percentage."""
    if filter_pct < 5:
        return BusStatus.regenerating.value
    elif filter_pct > 90:
        return BusStatus.critical.value
    elif filter_pct > 70:
        return BusStatus.warning.value
    else:
        return BusStatus.active.value


def get_fleet_state() -> FleetResponse:
    """
    Return current fleet snapshot.
    Simulates filter filling at +0.05% per call with gaussian noise on NOₓ.
    """
    _init_fleet()

    buses: List[Bus] = []
    active = regen = critical = 0
    total_captured = 0.0

    for bus_id, state in _fleet.items():
        # Simulate filter filling
        state["filter_pct"] += 0.05
        if state["filter_pct"] >= 100:
            state["filter_pct"] = 0.0  # Wrap at 100

        # Add gaussian noise to NOₓ readings
        state["upstream_nox"] = max(
            10, state["upstream_nox"] + random.gauss(0, 3)
        )
        state["downstream_nox"] = max(
            2, state["downstream_nox"] + random.gauss(0, 1.5)
        )

        # Recompute status
        state["status"] = _compute_status(state["filter_pct"])

        # Accumulate captured NOₓ
        captured = max(0, state["upstream_nox"] - state["downstream_nox"]) * 0.001
        state["nox_captured_grams"] += captured
        total_captured += state["nox_captured_grams"]

        # Count statuses
        if state["status"] == "active":
            active += 1
        elif state["status"] == "regen":
            regen += 1
        elif state["status"] == "critical":
            critical += 1

        buses.append(
            Bus(
                id=state["id"],
                name=state["name"],
                route=state["route"],
                filter_pct=round(state["filter_pct"], 2),
                upstream_nox=round(state["upstream_nox"], 1),
                downstream_nox=round(state["downstream_nox"], 1),
                status=state["status"],
                lat=state["lat"],
                lng=state["lng"],
                nox_captured_grams=round(state["nox_captured_grams"], 3),
            )
        )

    return FleetResponse(
        buses=buses,
        active_count=active,
        regen_count=regen,
        critical_count=critical,
        total_nox_captured_grams=round(total_captured, 3),
    )


def update_bus_from_esp32(payload: ESP32Payload):
    """
    Overwrite a bus's state with real hardware data from an ESP32 POST.
    Called by the ingest router when the ESP32 sends its 5-second payload.
    """
    _init_fleet()
    bus_id = int(payload.bus_id)

    if bus_id not in _fleet:
        # New bus detected — register it
        _fleet[bus_id] = {
            "id": bus_id,
            "name": f"Bus #{bus_id:02d}",
            "route": "Unknown Route",
            "filter_pct": payload.saturation,
            "upstream_nox": payload.nox_in,
            "downstream_nox": payload.nox_out,
            "status": payload.status.lower(),
            "lat": payload.lat,
            "lng": payload.lng,
            "nox_captured_grams": 0.0,
        }
    else:
        state = _fleet[bus_id]
        state["filter_pct"] = payload.saturation
        state["upstream_nox"] = payload.nox_in
        state["downstream_nox"] = payload.nox_out
        state["status"] = payload.status.lower()
        state["lat"] = payload.lat
        state["lng"] = payload.lng
        captured = max(0, payload.nox_in - payload.nox_out) * 0.001
        state["nox_captured_grams"] += captured


def reset_bus_filter(bus_id: int) -> dict:
    """
    Reset a bus filter to 0% for regeneration.
    Returns info about the regeneration schedule.
    """
    _init_fleet()
    if bus_id in _fleet:
        _fleet[bus_id]["filter_pct"] = 0.0
        _fleet[bus_id]["status"] = BusStatus.regenerating.value
    return {
        "bus_id": bus_id,
        "message": f"Bus #{bus_id:02d} filter reset to 0% — regeneration initiated",
        "scheduled": "Tonight 02:00 AM depot cycle",
        "energy_kwh": 0.28,
    }
