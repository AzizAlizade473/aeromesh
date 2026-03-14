"""
ESP32 Payload Model
====================
Represents the exact JSON payload sent by the ESP32 microcontroller
mounted on each AeroMesh bus module every 5 seconds via HTTP POST.

Hardware JSON format:
{
    "bus_id": "14",
    "lat": 40.37,
    "lng": 49.85,
    "nox_in": 120,
    "nox_out": 10,
    "saturation": 8,
    "status": "Active"
}

Saturation formula (computed on ESP32):
    saturation_pct = (sensor_B / sensor_A) * 100
    where sensor_A = upstream electrochemical NOₓ sensor
          sensor_B = downstream electrochemical NOₓ sensor

Fan logic (computed on ESP32):
    if GPS_speed < 15 km/h → DC fan ON (forced convection)
    else → DC fan OFF (passive ram-air intake)

BLE advertisement name:
    Clean:   "BakuBus_{id}_AeroMesh"
    Hazard:  "BakuBus_{id}_Hazard_Warning"  (when saturation > 90%)
"""

from pydantic import BaseModel, Field


class ESP32Payload(BaseModel):
    """Pydantic model matching the exact JSON the ESP32 sends every 5 seconds."""

    bus_id: str = Field(..., description="Bus identifier, e.g. '14'")
    lat: float = Field(..., description="GPS latitude")
    lng: float = Field(..., description="GPS longitude")
    nox_in: float = Field(..., description="Upstream NOₓ reading (µg/m³)")
    nox_out: float = Field(..., description="Downstream NOₓ reading (µg/m³)")
    saturation: float = Field(
        ..., description="Filter saturation percentage (sensor_B / sensor_A * 100)"
    )
    status: str = Field(
        ..., description="Module status string: Active, Warning, Critical, Regen"
    )

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "bus_id": "14",
                    "lat": 40.37,
                    "lng": 49.85,
                    "nox_in": 120,
                    "nox_out": 10,
                    "saturation": 8,
                    "status": "Active",
                }
            ]
        }
    }
