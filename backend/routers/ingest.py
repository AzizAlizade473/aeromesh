"""ESP32 data ingestion API router."""

from datetime import datetime, timezone
from fastapi import APIRouter
from models.esp32 import ESP32Payload
from services.fleet_manager import update_bus_from_esp32

router = APIRouter(prefix="/api/ingest", tags=["Ingest"])


@router.post("")
async def ingest_esp32_data(payload: ESP32Payload):
    """
    Receive sensor data from an ESP32 microcontroller.

    This is the exact endpoint the ESP32 HTTP POSTs to every 5 seconds.
    The payload overwrites the bus's simulated state with real hardware data.

    **ESP32 payload format:**
    ```json
    {"bus_id": "14", "lat": 40.37, "lng": 49.85, "nox_in": 120, "nox_out": 10, "saturation": 8, "status": "Active"}
    ```
    """
    update_bus_from_esp32(payload)
    return {
        "received": True,
        "bus_id": payload.bus_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
