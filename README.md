# 🌬️ AeroMesh PNA — Mobile NOₓ Purification for Baku

> **WUF13 Competition Project** — World Urban Forum 2026, Baku, Azerbaijan

AeroMesh converts city buses into mobile NOₓ air-purification nodes using a roof-mounted 3-layer filter module (PM pre-filter → activated carbon guard bed → AgX zeolite PNA core) with IoT-connected ESP32 monitoring.

---

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Access
- **App**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **Sentinel PWA**: http://localhost:5173/app

---

## 📡 API Endpoints

| Route | Method | Description |
|---|---|---|
| `/api/fleet` | GET | Fleet status — 12 buses with NOₓ, GPS, saturation |
| `/api/sensors/all` | GET | All sensor readings |
| `/api/sensors/{bus_id}` | GET | Single bus sensor reading |
| `/api/ingest` | POST | ESP32 data ingestion (every 5s) |
| `/api/regenerate/{bus_id}` | POST | Trigger filter regeneration |
| `/api/heatmap` | GET | Pollution intensity points for Leaflet.heat |
| `/api/alerts` | GET | Last 20 fleet alert events |
| `/api/alerts` | POST | Add new alert event |

---

## 🏗️ Architecture

```
ESP32 Module (per bus)
  ├── Electrochemical NOₓ sensors (upstream + downstream)
  ├── GPS module
  ├── DC fan (activates below 15 km/h)
  ├── BLE advertisement (BakuBus_{id}_AeroMesh)
  └── HTTP POST → /api/ingest (every 5 seconds)

FastAPI Backend
  ├── In-memory fleet state (12 buses)
  ├── Sensor simulator (fallback when no hardware)
  ├── MQTT listener (optional real-time ingestion)
  └── SQLite database (async via aiosqlite)

React Frontend (Vite)
  ├── Main site (/) — competition showcase
  └── Sentinel PWA (/app) — field technician companion
```

---

## 🧪 ESP32 JSON Payload

```json
{
  "bus_id": "14",
  "lat": 40.37,
  "lng": 49.85,
  "nox_in": 120,
  "nox_out": 10,
  "saturation": 8,
  "status": "Active"
}
```

**Saturation formula**: `saturation_pct = (sensor_B / sensor_A) * 100`  
**Fan logic**: `if speed < 15 km/h → fan ON, else fan OFF`  
**BLE name**: `BakuBus_{id}_AeroMesh` (clean) or `BakuBus_{id}_Hazard_Warning` (saturation > 90%)
