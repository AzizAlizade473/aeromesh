"""Sensor readings API router."""

from fastapi import APIRouter
from models.sensor import SensorReading, SensorResponse
from services.sensor_simulator import get_sensor_reading, get_all_sensor_readings
from database.seed import SEED_BUSES

router = APIRouter(prefix="/api/sensors", tags=["Sensors"])

_bus_ids = [b["id"] for b in SEED_BUSES]


@router.get("/all", response_model=SensorResponse)
async def all_sensor_readings():
    """
    Get current NOₓ sensor readings for all buses in the fleet.
    Returns simulated data when no real ESP32 hardware is connected.
    """
    readings = get_all_sensor_readings(_bus_ids)
    return SensorResponse(readings=readings)


@router.get("/{bus_id}", response_model=SensorReading)
async def sensor_reading(bus_id: int):
    """
    Get current NOₓ sensor reading for a specific bus.

    - **bus_id**: Bus identifier (e.g. 7, 14, 42)
    """
    return get_sensor_reading(bus_id)
