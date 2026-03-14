"""Sensor reading models for AeroMesh."""

from typing import List
from pydantic import BaseModel, Field


class SensorReading(BaseModel):
    """A single NOₓ sensor reading from a bus module."""

    bus_id: int
    upstream_nox: float = Field(..., description="Upstream NOₓ µg/m³")
    downstream_nox: float = Field(..., description="Downstream NOₓ µg/m³")
    timestamp: str


class SensorResponse(BaseModel):
    """Response containing one or more sensor readings."""

    readings: List[SensorReading]
