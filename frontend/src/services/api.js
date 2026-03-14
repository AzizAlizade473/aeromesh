// src/services/api.js
// Reads VITE_API_URL from environment variables.
// In production (Vercel): set VITE_API_URL = https://your-backend-domain.com
// In development (local): leave VITE_API_URL empty or unset — falls back to '' (relative path, uses Vite proxy)

const BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')  // strip trailing slash if present
  : ''                                                 // empty string = relative path = Vite proxy works

export const apiUrl = (path) => {
  // path must start with /api/...
  // e.g. apiUrl('/api/fleet') returns:
  //   production: 'https://aeromesh-backend.onrender.com/api/fleet'
  //   development: '/api/fleet'  (Vite proxy forwards to localhost:8000)
  return `${BASE_URL}${path}`
}

// Pre-built endpoint URLs — use these instead of hardcoding strings
export const API = {
  fleet:       () => apiUrl('/api/fleet'),
  sensors:     (id = 'all') => apiUrl(`/api/sensors/${id}`),
  ingest:      () => apiUrl('/api/ingest'),
  regenerate:  (busId) => apiUrl(`/api/regenerate/${busId}`),
  heatmap:     () => apiUrl('/api/heatmap'),
  alerts:      () => apiUrl('/api/alerts'),
}
