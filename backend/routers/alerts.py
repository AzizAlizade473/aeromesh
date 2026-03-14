"""Fleet alert events API router."""

from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter
from models.alert import AlertEvent

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

# ── Pre-populated alert events ────────────────────────────────────
_alerts: List[dict] = [
    {
        "timestamp": "2026-03-13T14:22:10Z",
        "bus_id": 42,
        "level": "critical",
        "message": "🔴 Bus #42 filter saturation at 91% — regeneration required immediately",
        "event_type": "saturation",
    },
    {
        "timestamp": "2026-03-13T14:18:45Z",
        "bus_id": 61,
        "level": "critical",
        "message": "🔴 Bus #61 filter saturation at 94% — critical threshold exceeded",
        "event_type": "saturation",
    },
    {
        "timestamp": "2026-03-13T14:15:30Z",
        "bus_id": 7,
        "level": "warning",
        "message": "⚠️ Bus #07 filter at 87% — approaching critical zone on Neftçilər → Airport",
        "event_type": "saturation",
    },
    {
        "timestamp": "2026-03-13T14:12:00Z",
        "bus_id": 42,
        "level": "info",
        "message": "📡 BLE name changed to BakuBus_42_Hazard_Warning — saturation > 90%",
        "event_type": "ble",
    },
    {
        "timestamp": "2026-03-13T14:08:20Z",
        "bus_id": 11,
        "level": "info",
        "message": "✅ Bus #11 regeneration cycle completed — filter reset to 3%",
        "event_type": "regen",
    },
    {
        "timestamp": "2026-03-13T14:05:15Z",
        "bus_id": 9,
        "level": "info",
        "message": "💨 Bus #09 fan activated — GPS speed dropped below 15 km/h near 28 May station",
        "event_type": "fan",
    },
    {
        "timestamp": "2026-03-13T14:01:00Z",
        "bus_id": 14,
        "level": "info",
        "message": "📥 ESP32 payload ingested from Bus #14 — NOₓ in: 135 µg/m³, out: 24 µg/m³",
        "event_type": "ingest",
    },
    {
        "timestamp": "2026-03-13T13:55:40Z",
        "bus_id": 28,
        "level": "warning",
        "message": "⚠️ Bus #28 filter at 72% — warning threshold on Binəqədi → Downtown route",
        "event_type": "saturation",
    },
]


@router.get("", response_model=List[AlertEvent])
async def get_alerts():
    """
    Get the last 20 fleet alert events.

    Returns pre-populated events covering saturation warnings,
    BLE name changes, fan activations, regeneration completions,
    and ESP32 data ingestion confirmations.
    """
    return _alerts[-20:]


@router.post("", response_model=AlertEvent)
async def add_alert(alert: AlertEvent):
    """
    Add a new alert event to the log.

    Event types: saturation | fan | ble | regen | ingest
    """
    _alerts.append(alert.model_dump())
    # Keep only last 100 events in memory
    if len(_alerts) > 100:
        _alerts.pop(0)
    return alert
