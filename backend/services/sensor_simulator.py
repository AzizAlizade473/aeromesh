"""
AeroMesh Sensor Simulator
=========================
Generates realistic NOₓ time-series data for demonstration when
no real ESP32 hardware is connected.

Upstream NOₓ: ~120-200 µg/m³ (ambient Baku urban air)
Downstream NOₓ: ~15-40 µg/m³ (after 3-layer PNA filter)
"""

import random
from datetime import datetime, timezone

from models.sensor import SensorReading


def get_sensor_reading(bus_id: int) -> SensorReading:
    """
    Generate a single realistic NOₓ sensor reading for a given bus.

    Returns upstream ~120-200 µg/m³ with random gaussian noise
    and downstream ~15-40 µg/m³ with random gaussian noise.
    """
    upstream = round(random.gauss(160, 25), 1)
    upstream = max(120, min(200, upstream))

    downstream = round(random.gauss(27, 7), 1)
    downstream = max(15, min(40, downstream))

    return SensorReading(
        bus_id=bus_id,
        upstream_nox=upstream,
        downstream_nox=downstream,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


def get_all_sensor_readings(bus_ids: list[int]) -> list[SensorReading]:
    """Generate sensor readings for all given bus IDs."""
    return [get_sensor_reading(bid) for bid in bus_ids]
