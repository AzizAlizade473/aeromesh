"""
AeroMesh PNA — FastAPI Backend
==============================
Converts Baku city buses into mobile NOₓ air-purification nodes.
WUF13 (World Urban Forum 2026, Baku, Azerbaijan)

API docs: http://localhost:8000/docs
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import fleet, sensors, ingest, regeneration, heatmap, alerts
# from services.mqtt_listener import connect as mqtt_connect, disconnect as mqtt_disconnect


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown events."""
    # ── Startup ──
    # Uncomment below to enable real ESP32 MQTT hardware ingestion:
    # mqtt_connect()
    print("🚌 AeroMesh backend started — 12 buses online")
    yield
    # ── Shutdown ──
    # mqtt_disconnect()
    print("🛑 AeroMesh backend stopped")


app = FastAPI(
    title="AeroMesh PNA API",
    description="Mobile NOₓ purification fleet management for Baku city buses",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ───────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────
app.include_router(sensors.router)
app.include_router(fleet.router)
app.include_router(ingest.router)
app.include_router(regeneration.router)
app.include_router(heatmap.router)
app.include_router(alerts.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "AeroMesh PNA",
        "version": "1.0.0",
        "status": "operational",
        "buses_online": 12,
    }
