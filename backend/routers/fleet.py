"""Fleet status API router."""

from fastapi import APIRouter
from models.bus import FleetResponse
from services.fleet_manager import get_fleet_state

router = APIRouter(prefix="/api/fleet", tags=["Fleet"])


@router.get("", response_model=FleetResponse)
async def fleet_status():
    """
    Get current fleet status with all 12 AeroMesh buses.

    Returns bus positions, filter saturation, NOₓ readings,
    and aggregate statistics (active, regen, critical counts).
    """
    return get_fleet_state()
