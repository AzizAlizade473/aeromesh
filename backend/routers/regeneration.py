"""Filter regeneration API router."""

from fastapi import APIRouter
from services.fleet_manager import reset_bus_filter

router = APIRouter(prefix="/api/regenerate", tags=["Regeneration"])


@router.post("/{bus_id}")
async def trigger_regeneration(bus_id: int):
    """
    Trigger filter regeneration for a specific bus.

    Resets the bus filter saturation to 0% and schedules
    the Joule-heating regeneration cycle at the depot.

    - **bus_id**: Bus identifier (e.g. 7, 14, 42)

    Returns regeneration schedule and energy estimate (0.28 kWh).
    """
    return reset_bus_filter(bus_id)
