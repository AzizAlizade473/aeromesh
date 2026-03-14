import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import useFleetData from '../hooks/useFleetData';
import { triggerRegen } from '../services/api';
import 'leaflet/dist/leaflet.css';
import BusModel3D from './BusModel3D';

const CARTO_LIGHT = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const MAP_CENTER = [40.4093, 49.8671];

const statusColors = {
  active:       { bg: '#E8F5E9', text: '#2E7D32' },
  warning:      { bg: '#FFF3E0', text: '#E65100' },
  critical:     { bg: '#FFEBEE', text: '#C62828' },
  regenerating: { bg: '#E3F2FD', text: '#1565C0' },
};

const FALLBACK_ROUTES = [
  {
    id: 1, number: '1', color: '#1B4F8A',
    name: 'Neftçilər → 28 May',
    waypoints: [
      [40.3667,49.8359],[40.3697,49.8371],[40.3708,49.8421],[40.3729,49.8393],
      [40.3752,49.8360],[40.3775,49.8440],[40.3794,49.8530],
    ]
  },
  {
    id: 2, number: '2', color: '#C62828',
    name: 'Avtovağzal → Neftçilər',
    waypoints: [
      [40.4100,49.7970],[40.3990,49.7980],[40.3880,49.8160],[40.3840,49.8210],
      [40.3790,49.8290],[40.3752,49.8360],[40.3729,49.8393],[40.3708,49.8421],[40.3667,49.8359],
    ]
  },
  {
    id: 3, number: '44', color: '#2E7D32',
    name: 'Həzi Aslanov → Memar Əcəmi',
    waypoints: [
      [40.3784,49.9193],[40.3800,49.9050],[40.3810,49.8900],[40.3820,49.8750],
      [40.3870,49.8600],[40.3900,49.8420],[40.3960,49.8300],[40.4000,49.8200],[40.4080,49.8120],
    ]
  },
  {
    id: 4, number: '65', color: '#E65100',
    name: 'Koroğlu → Zabrat',
    waypoints: [
      [40.4093,49.8671],[40.4155,49.8530],[40.4220,49.8530],[40.4285,49.8430],
      [40.4350,49.8400],[40.4420,49.8600],[40.4520,49.8750],[40.4580,49.8950],
    ]
  },
  {
    id: 5, number: '88', color: '#6A1B9A',
    name: '28 May → Maştağa',
    waypoints: [
      [40.3794,49.8530],[40.4068,49.8510],[40.4093,49.8671],
      [40.4280,49.8700],[40.4420,49.8820],[40.4630,49.8980],[40.5220,49.9580],
    ]
  },
  {
    id: 6, number: 'H1', color: '#1565C0',
    name: 'Airport Express',
    waypoints: [
      [40.4675,50.0467],[40.4600,50.0000],[40.4520,49.9700],
      [40.4280,49.9000],[40.4093,49.8671],
    ]
  },
];

// Keep old exported const for potential external refs
export const BAKU_BUS_ROUTES = FALLBACK_ROUTES;

const routeAssignment = {
  7:  0,  // Bus #07 → Route 1
  3:  1,  // Bus #03 → Route 2
  11: 2,  // Bus #11 → Route 44
  42: 3,  // Bus #42 → Route 65
  5:  4,  // Bus #05 → Route 88
  17: 5,  // Bus #17 → Route 125
  28: 5,  // Bus #28 → Route H1
  9:  0,  // Bus #09 → Route 1
  33: 0,  // Bus #33 → Route 1
  14: 2,  // Bus #14 → Route 44
  56: 3,  // Bus #56 → Route 65
  61: 4,  // Bus #61 → Route 88
};

function createBusIcon(status, color) {
  let bgColor = '#1B4F8A';
  let dotColor = '#4ADE80';
  if (status === 'critical') { bgColor = '#C62828'; dotColor = '#EF9A9A'; }
  else if (status === 'warning') { bgColor = '#E65100'; dotColor = '#FFB74D'; }
  else if (status === 'regenerating') { bgColor = '#1565C0'; dotColor = '#90CAF9'; }
  else if (color) { bgColor = color; }

  const svg = `
    <svg width="28" height="28" viewBox="0 0 28 28" xmlns="http://www.w3.org/2000/svg">
      <circle cx="14" cy="14" r="12" fill="${bgColor}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="14" r="4" fill="${dotColor}">
        <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
      </circle>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
}

function interpolatePosition(points, progress) {
  if (!points || points.length < 2) return MAP_CENTER;
  const totalSegments = points.length - 1;
  const scaledProgress = progress * totalSegments;
  const index = Math.min(Math.floor(scaledProgress), totalSegments - 1);
  const remainder = scaledProgress - index;
  const p1 = points[index];
  const p2 = points[index + 1];
  return [
    p1[0] + (p2[0] - p1[0]) * remainder,
    p1[1] + (p2[1] - p1[1]) * remainder,
  ];
}

function BoundsWrapper({ buses }) {
  const map = useMap();
  useEffect(() => {
    if (buses.length > 0) {
      const validBuses = buses.filter(b => b.lat != null && b.lng != null);
      if (validBuses.length > 0) {
        const bounds = L.latLngBounds(validBuses.map(b => [b.lat, b.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [map]);
  return null;
}

export default function BakuMap() {
  const { fleet, refetch } = useFleetData();
  const [buses, setBuses] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const mapContainerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // OSM route fetching
  const [osmRoutes, setOsmRoutes] = useState([]);
  const [routesLoading, setRoutesLoading] = useState(true);

  useEffect(() => {
    const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
    
    // Fetch specifically the major bus routes in Baku to keep payload size manageable
    const query = `
      [out:json][timeout:25];
      (
        relation["type"="route"]["route"="bus"]["ref"~"^(1|2|44|65|88|H1|125)$"](40.30,49.70,40.60,50.15);
      );
      out body;
      >;
      out skel qt;
    `;

    fetch(OVERPASS_URL, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
      .then(r => r.json())
      .then(data => {
        const nodes = {};
        data.elements
          .filter(e => e.type === 'node')
          .forEach(n => { nodes[n.id] = [n.lat, n.lon]; });

        const ways = {};
        data.elements
          .filter(e => e.type === 'way')
          .forEach(w => {
            ways[w.id] = w.nodes.map(nid => nodes[nid]).filter(Boolean);
          });

        const ROUTE_COLORS = ['#1B4F8A','#C62828','#2E7D32','#E65100','#6A1B9A','#00838F','#1565C0','#AD1457'];

        const routes = data.elements
          .filter(e => e.type === 'relation' && e.tags?.route === 'bus')
          .map((rel, i) => {
            const wayIds = (rel.members || [])
              .filter(m => m.type === 'way' && (m.role === '' || m.role === 'forward'))
              .map(m => m.ref);
            
            // Stitch ways together end-to-end for a continuous polyline
            const coords = [];
            if (wayIds.length > 0) {
                const firstWay = ways[wayIds[0]] || [];
                coords.push(...firstWay);
                
                let lastPoint = coords[coords.length - 1];
                for (let j = 1; j < wayIds.length; j++) {
                    const currentWay = ways[wayIds[j]] || [];
                    if (currentWay.length === 0) continue;
                    
                    const distToStart = Math.pow(currentWay[0][0] - lastPoint[0], 2) + Math.pow(currentWay[0][1] - lastPoint[1], 2);
                    const distToEnd = Math.pow(currentWay[currentWay.length-1][0] - lastPoint[0], 2) + Math.pow(currentWay[currentWay.length-1][1] - lastPoint[1], 2);
                    
                    if (distToEnd < distToStart) {
                        coords.push(...currentWay.slice().reverse());
                    } else {
                        coords.push(...currentWay);
                    }
                    lastPoint = coords[coords.length - 1];
                }
            }

            return {
              id:        rel.id,
              number:    rel.tags?.ref || `${i+1}`,
              name:      rel.tags?.name || (rel.tags?.from && rel.tags?.to ? `${rel.tags.from} → ${rel.tags.to}` : `BakuBus Route ${rel.tags?.ref||''}`),
              color:     ROUTE_COLORS[i % ROUTE_COLORS.length],
              waypoints: coords,
            };
          })
          .filter(r => r.waypoints.length > 20); // Only keep routes with enough points to draw a real path

        if (routes.length > 0) {
            console.log(`✅ Successfully loaded ${routes.length} live routes from OpenStreetMap!`);
            setOsmRoutes(routes);
        } else {
            console.warn("⚠️ OSM returned empty geometry, falling back to local routes.");
            setOsmRoutes(FALLBACK_ROUTES);
        }
        setRoutesLoading(false);
      })
      .catch(err => {
        console.error('❌ OSM fetch failed explicitly:', err.message);
        setOsmRoutes(FALLBACK_ROUTES);
        setRoutesLoading(false);
      });
  }, []);

  // Get active routes (OSM or fallback)
  const activeRoutes = osmRoutes.length > 0 ? osmRoutes : FALLBACK_ROUTES;

  useEffect(() => {
    const id = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!fleet?.buses || buses.length > 0) return;
    
    const parseBusId = (id) => parseInt(String(id).replace(/[^0-9]/g, ''), 10) || 0;

    const assignedBuses = fleet.buses.map((bus) => {
      const numericId = parseBusId(bus.id);
      const routeIndex = routeAssignment[numericId] !== undefined ? routeAssignment[numericId] : (numericId % FALLBACK_ROUTES.length);
      const route = FALLBACK_ROUTES[routeIndex];
      const progress = Math.random();
      const points = route?.waypoints;
      const [lat, lng] = interpolatePosition(points, progress);

      return {
        ...bus,
        routeIndex,
        routeObj: route,
        progress: progress,
        direction: Math.random() > 0.5 ? 1 : -1,
        lat,
        lng,
      };
    });
    setBuses(assignedBuses);
  }, [fleet, buses.length]);

  useEffect(() => {
    if (buses.length === 0) return;
    const interval = setInterval(() => {
      setBuses(prev => prev.map(bus => {
        let newProgress = bus.progress + (0.0004 * bus.direction);
        let newDirection = bus.direction;
        if (newProgress >= 1) { newProgress = 1; newDirection = -1; }
        else if (newProgress <= 0) { newProgress = 0; newDirection = 1; }
        const points = bus.routeObj?.waypoints;
        if (!points) return bus;
        const [lat, lng] = interpolatePosition(points, newProgress);
        return { ...bus, progress: newProgress, direction: newDirection, lat, lng };
      }));
    }, 200);
    return () => clearInterval(interval);
  }, [buses.length]);

  // Fullscreen handling
  const toggleFullscreen = () => {
    const el = mapContainerRef.current;
    if (!isFullscreen) {
      if (el.requestFullscreen) el.requestFullscreen();
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
    setIsFullscreen(f => !f);
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const handleRegen = useCallback(async (id) => {
    const success = await triggerRegen(id);
    if (success) {
      setBuses(prev => prev.map(b => b.id === id ? { ...b, status: 'regenerating', filter_pct: 0 } : b));
      refetch();
    }
  }, [refetch]);

  if (!mapReady) return (
    <div style={{
      height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8f9fa', borderRadius: 'var(--radius-md)',
      color: 'var(--text-secondary)', fontFamily: 'var(--font-body)',
      flexDirection: 'column', gap: 12,
    }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <span>Loading Baku map...</span>
    </div>
  );

  return (
    <div ref={mapContainerRef} className="baku-map-wrapper" style={{ height: isFullscreen ? '100vh' : '100%', width: '100%', background: 'var(--bg-surface)', position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <MapContainer center={MAP_CENTER} zoom={12} zoomControl={false} style={{ height: '100%', width: '100%', borderRadius: 'var(--radius-md)', zIndex: 1 }}>
        <TileLayer url={CARTO_LIGHT} attribution='&copy; OpenStreetMap contributors' />

        {/* Loading indicator for routes */}
        {routesLoading && (
          <div style={{ position:'absolute', top:10, left:'50%', transform:'translateX(-50%)',
            zIndex:999, background:'white', padding:'6px 14px', borderRadius:20,
            fontSize:'0.75rem', boxShadow:'var(--shadow-md)', color:'var(--text-secondary)' }}>
            Loading bus routes from OpenStreetMap...
          </div>
        )}

        {/* Route Polylines */}
        {!routesLoading && activeRoutes.map((route) => (
          <Polyline key={route.id} positions={route.waypoints}
            pathOptions={{ color: route.color, weight: 4, opacity: 0.8, lineJoin: 'round', lineCap: 'round' }}>
            <Tooltip sticky>{route.number} — {route.name}</Tooltip>
          </Polyline>
        ))}

        {/* Bus Markers */}
        {buses.map((bus) => {
          const routeForBus = bus.routeObj;
          return (
            <Marker key={bus.id} position={[bus.lat || MAP_CENTER[0], bus.lng || MAP_CENTER[1]]} icon={createBusIcon(bus.status, routeForBus?.color)}>
              <Popup maxWidth={280} className="aeromesh-popup">
                <div style={{ fontFamily: 'var(--font-body)', minWidth: 230 }}>

                  {/* 3D rotating bus */}
                  <div style={{ background:'var(--bg-elevated)', padding:'16px 12px 12px', borderRadius:8, marginBottom:12, textAlign:'center' }}>
                    <BusModel3D color={routeForBus?.color ?? '#1B4F8A'} size={0.9} />
                    <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginTop:6, fontFamily:'var(--font-mono)' }}>
                      360° — AeroMesh PNA Module
                    </div>
                  </div>

                  {/* Bus name header */}
                  <div style={{
                    fontWeight: 700, fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    borderBottom: '1px solid var(--border)',
                    paddingBottom: 8, marginBottom: 10,
                  }}>
                    {bus.name}
                    <span style={{
                      marginLeft: 8, fontSize: '0.72rem', fontWeight: 600,
                      padding: '2px 7px', borderRadius: 999,
                      background: statusColors[bus.status]?.bg,
                      color: statusColors[bus.status]?.text,
                    }}>
                      {bus.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Route */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    🛣 {routeForBus?.name}
                  </div>

                  {/* Data rows */}
                  {[
                    { label: 'Filter Capacity', value: `${(bus.filter_pct ?? 0).toFixed(1)}%`, bar: true },
                    { label: 'NOₓ Upstream',   value: `${Math.round(bus.upstream_nox ?? 0)} µg/m³` },
                    { label: 'NOₓ Downstream', value: `${Math.round(bus.downstream_nox ?? 0)} µg/m³` },
                    { label: 'Efficiency',     value: `${Math.round((1 - (bus.downstream_nox ?? 0) / (bus.upstream_nox ?? 1)) * 100)}%` },
                    { label: 'BLE Signal',     value: `BakuBus_${bus.id}_${(bus.filter_pct ?? 0) > 90 ? 'Hazard' : 'AeroMesh'}` },
                  ].map(({ label, value, bar }) => (
                    <div key={label} style={{ marginBottom: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value}</span>
                      </div>
                      {bar && (
                        <div style={{ marginTop: 3, height: 5, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${bus.filter_pct}%`,
                            background: bus.filter_pct > 90 ? 'var(--status-critical)' : bus.filter_pct > 70 ? 'var(--status-warn)' : 'var(--status-ok)',
                            borderRadius: 3, transition: 'width 0.5s ease',
                          }} />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Regen button */}
                  <button
                    onClick={() => handleRegen(bus.id)}
                    style={{
                      marginTop: 10, width: '100%', padding: '7px',
                      background: 'var(--primary)', color: 'white',
                      border: 'none', borderRadius: 'var(--radius-sm)',
                      fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    ↻ Trigger Regeneration
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {buses.length > 0 && <BoundsWrapper buses={buses} />}
      </MapContainer>

      {/* Fullscreen button */}
      <button
        onClick={toggleFullscreen}
        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen map'}
        style={{
          position:'absolute', top:10, right:10, zIndex:1000,
          background:'white', border:'1px solid var(--border)',
          borderRadius:6, padding:'6px 10px', cursor:'pointer',
          boxShadow:'var(--shadow-sm)', fontSize:'0.8rem',
          color:'var(--text-primary)', fontWeight:600,
          display:'flex', alignItems:'center', gap:5,
        }}>
        {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
      </button>

      {/* Legend Overlay */}
      <div style={{
        position: 'absolute', bottom: 20, right: 20, zIndex: 1000,
        background: 'white', padding: '12px', borderRadius: 'var(--radius-md)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid var(--border)',
        fontFamily: 'var(--font-body)', fontSize: '0.75rem',
      }}>
        <div style={{ fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>ROUTES</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
          {(routesLoading ? FALLBACK_ROUTES : activeRoutes).map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 3, background: r.color }} />
              <span style={{ color: 'var(--text-secondary)' }}>{r.number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
