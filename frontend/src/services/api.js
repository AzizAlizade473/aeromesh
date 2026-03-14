/**
 * AeroMesh API Service
 * Axios instance configured for the FastAPI backend.
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

/** Get sensor reading for a specific bus */
export const getSensorData = (busId) => api.get(`/api/sensors/${busId}`).then((r) => r.data);

/** Get full fleet status with all buses */
export const getFleetStatus = () => api.get('/api/fleet').then((r) => r.data);

/** Get pollution heatmap data points */
export const getHeatmap = () => api.get('/api/heatmap').then((r) => r.data);

/** Get recent alert events */
export const getAlerts = () => api.get('/api/alerts').then((r) => r.data);

/** Trigger filter regeneration for a bus */
export const triggerRegen = (busId) => api.post(`/api/regenerate/${busId}`).then((r) => r.data);

/** Send ESP32 payload to ingest endpoint */
export const ingestPayload = (data) => api.post('/api/ingest', data).then((r) => r.data);

export default api;
