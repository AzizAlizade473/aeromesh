"""Bus fleet models for AeroMesh."""

from enum import Enum
from typing import List
from pydantic import BaseModel, Field


class BusStatus(str, Enum):
    active = "active"
    warning = "warning"
    critical = "critical"
    regenerating = "regen"
    clean = "clean"


class Bus(BaseModel):
    """Represents a single AeroMesh-equipped bus in the fleet."""

    id: int
    name: str
    route: str
    filter_pct: float = Field(..., description="Filter saturation percentage (0-100)")
    upstream_nox: float = Field(..., description="Upstream NOₓ µg/m³")
    downstream_nox: float = Field(..., description="Downstream NOₓ µg/m³")
    status: BusStatus
    lat: float
    lng: float
    nox_captured_grams: float = Field(
        default=0.0, description="Cumulative NOₓ captured in grams"
    )


class FleetResponse(BaseModel):
    """Fleet-level response with aggregate statistics."""

    buses: List[Bus]
    active_count: int
    regen_count: int
    critical_count: int
    total_nox_captured_grams: float
