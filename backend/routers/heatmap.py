"""Heatmap data API router for Leaflet.heat overlay."""

from fastapi import APIRouter
from services.fleet_manager import get_fleet_state

router = APIRouter(prefix="/api/heatmap", tags=["Heatmap"])


@router.get("")
async def get_heatmap_data():
    """
    Get pollution intensity points for the Leaflet.heat map overlay.

    Returns a list of `{lat, lng, intensity}` objects derived from
    each bus's upstream NOₓ readings. Intensity is normalized 0–1
    based on max observed NOₓ across the fleet.
    """
    fleet = get_fleet_state()
    if not fleet.buses:
        return []

    max_nox = max(b.upstream_nox for b in fleet.buses)
    if max_nox == 0:
        max_nox = 1  # Avoid division by zero

    points = []
    for bus in fleet.buses:
        intensity = round(bus.upstream_nox / max_nox, 3)
        points.append({
            "lat": bus.lat,
            "lng": bus.lng,
            "intensity": intensity,
        })

    return points
