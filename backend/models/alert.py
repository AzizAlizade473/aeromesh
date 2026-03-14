"""Alert event models for AeroMesh fleet monitoring."""

from typing import Literal
from pydantic import BaseModel, Field


class AlertEvent(BaseModel):
    """A fleet alert event logged by the monitoring system."""

    timestamp: str
    bus_id: int
    level: str = Field(..., description="Alert severity: info, warning, critical")
    message: str
    event_type: Literal["saturation", "fan", "ble", "regen", "ingest"] = Field(
        ..., description="Category of the alert event"
    )
