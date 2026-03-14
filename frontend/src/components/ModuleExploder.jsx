import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useInView from '../hooks/useInView';

const LAYERS = [
  {
    id: 'intake',
    label: 'Venturi / NACA Intake',
    sublabel: 'Ram-air + GPS-activated axial fans',
    color: '#1B4F8A',
    icon: '🌬️',
    info: 'Directs ambient air into the system utilizing the natural forward motion of the vehicle (bus movement creates forced airflow). A NACA-style scoop generates ram-air pressure; when the bus is stationary or below 15 km/h, a GPS-triggered DC axial fan activates to maintain constant airflow. Zero parasitic energy draw while in motion.',
  },
  {
    id: 'filter',
    label: 'PM2.5 Pre-Filter',
    sublabel: 'Ceramic fiber — blocks soot & road dust',
    color: '#78909C',
    icon: '🧱',
    info: 'A mechanical ceramic fiber mesh designed to capture large particulate matter (PM10 and PM2.5), road dust, and debris. This critical first stage protects the downstream zeolite core from physical fouling, ensuring maximum NOₓ adsorption efficiency. Washable and reusable for 12+ months.',
  },
  {
    id: 'guard',
    label: 'SO₂ Guard Bed',
    sublabel: 'Activated carbon — prevents zeolite poisoning',
    color: '#455A64',
    icon: '🛡',
    info: 'An activated carbon guard bed that selectively adsorbs SO₂ and volatile organic compounds (VOCs) before they reach the AgX zeolite. Sulfur dioxide is a known "poison" for silver-exchanged zeolites — this layer ensures the NOₓ core maintains peak efficiency over thousands of cycles.',
  },
  {
    id: 'core',
    label: 'AgX Zeolite Core ⭐',
    sublabel: 'Silver-exchanged zeolite — captures NOₓ instantly',
    color: '#2E7D32',
    icon: '⚗️',
    info: 'The heart of the AeroMesh system. Silver-exchanged (AgX) zeolites provide highly selective physicochemical adsorption of NO and NO₂ molecules at ambient atmospheric temperatures (even below 25°C). The silver ions donate electrons to NOₓ, trapping the molecules in the zeolite cage structure — no light, no heat, no external energy required.',
  },
  {
    id: 'sensor',
    label: 'Sensor Chamber',
    sublabel: 'Alphasense electrochemical NO₂ sensors',
    color: '#0277BD',
    icon: '📡',
    info: 'Dual-calibrated Alphasense electrochemical NOₓ sensors (upstream and downstream) continuously measure real-time filtration efficiency. An ESP32 telemetry module transmits sensor data every 5 seconds via Cellular/BLE bridge to the central AYNA dashboard. BLE name switches to "Hazard_Warning" when saturation exceeds 90%.',
  },
];

export default function ModuleExploder() {
  const [activeLayer, setActiveLayer]   = useState(0);
  const [userPaused, setUserPaused]     = useState(false);
  const pauseTimer                       = useRef(null);
  const [ref, inView]                    = useInView(0.2);

  // Auto-advance
  useEffect(() => {
    if (!inView || userPaused) return;
    const id = setInterval(() => {
      setActiveLayer(l => (l + 1) % LAYERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [inView, userPaused]);

  // Manual click — pause for 8s then resume
  const handleLayerClick = (i) => {
    setActiveLayer(i);
    setUserPaused(true);
    clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setUserPaused(false), 8000);
  };

  // Cleanup
  useEffect(() => () => clearTimeout(pauseTimer.current), []);

  return (
    <section id="module-exploder" ref={ref} style={{ padding: '100px 20px 80px', background: 'var(--bg-surface)' }}>
      <div className="section-container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span style={{ background:'var(--primary-pale)', color:'var(--primary)', padding:'4px 14px',
            borderRadius:999, fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.05em' }}>
            ENGINEERING
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 4vw, 42px)',
            color: 'var(--text-primary)',
            marginTop: 12, marginBottom: 8,
            letterSpacing: '-0.02em', fontWeight: 700,
          }}>
            Hardware Architecture
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--primary)', letterSpacing: '0.05em', fontWeight: 600, margin: 0 }}>
              AeroMesh PNA-v3 — 5 Layer Filter Stack
            </p>
            <button
              onClick={() => {
                setUserPaused(p => !p)
                if (userPaused) clearTimeout(pauseTimer.current)
              }}
              style={{
                background: 'none', border: '1px solid var(--border)',
                borderRadius: 999, padding: '3px 10px',
                fontSize: '0.72rem', color: 'var(--text-muted)',
                cursor: 'pointer', fontFamily: 'var(--font-body)',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              {userPaused ? '▶ Resume' : '⏸ Pause'}
            </button>
          </div>
        </motion.div>

        {/* Two-column layout: layers left, info right */}
        <div className="exploder-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem', alignItems: 'start' }}>

          {/* Left: Layer selector cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {LAYERS.map((layer, i) => (
              <motion.div
                key={layer.id}
                onClick={() => handleLayerClick(i)}
                whileHover={{ x: 6 }}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                style={{
                  padding:'1rem 1.2rem',
                  borderRadius:'var(--radius-md)',
                  border:`2px solid ${activeLayer === i ? layer.color : 'var(--border)'}`,
                  background: activeLayer === i ? `${layer.color}0D` : 'var(--bg-surface)',
                  cursor:'pointer',
                  transition:'all 0.25s',
                  display:'flex', alignItems:'center', gap:14,
                  boxShadow: activeLayer === i ? `0 4px 16px ${layer.color}20` : 'var(--shadow-sm)',
                  position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Layer number badge */}
                <div style={{
                  width:36, height:36, borderRadius:'50%', flexShrink:0,
                  background: activeLayer === i ? layer.color : 'var(--border)',
                  color:'white', display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.85rem', fontWeight:800, transition:'background 0.25s',
                }}>
                  {i === 0 ? '▲' : i}
                </div>

                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:'0.9rem',
                    color: activeLayer === i ? layer.color : 'var(--text-primary)' }}>
                    {layer.label}
                  </div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:2 }}>
                    {layer.sublabel}
                  </div>
                </div>

                {/* Active indicator arrow */}
                {activeLayer === i && (
                  <motion.div
                    initial={{ opacity:0, x:-5 }}
                    animate={{ opacity:1, x:0 }}
                    style={{ color: layer.color, fontSize:'1rem' }}>→</motion.div>
                )}

                {/* Progress Bar */}
                {activeLayer === i && !userPaused && (
                  <motion.div
                    key={`progress-${activeLayer}`}
                    style={{
                      position: 'absolute',
                      bottom: 0, left: 0,
                      height: 3,
                      background: LAYERS[i].color,
                      borderRadius: '0 0 var(--radius-md) var(--radius-md)',
                      opacity: 0.7,
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3, ease: 'linear' }}
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Right: Info panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLayer}
              initial={{ opacity:0, x:20 }}
              animate={{ opacity:1, x:0 }}
              exit={{ opacity:0, x:-10 }}
              transition={{ duration:0.3 }}
              className="exploder-info-panel"
              style={{
                background:'var(--bg-surface)',
                border:`2px solid ${LAYERS[activeLayer].color}30`,
                borderTop:`4px solid ${LAYERS[activeLayer].color}`,
                borderRadius:'var(--radius-md)',
                padding:'1.8rem',
                boxShadow:'var(--shadow-md)',
                minHeight:280,
              }}
            >
              {/* Icon + title */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <span style={{ fontSize:'2rem' }}>{LAYERS[activeLayer].icon}</span>
                <div>
                  <h3 style={{ fontWeight:800, color:LAYERS[activeLayer].color, fontSize:'1.05rem' }}>
                    {LAYERS[activeLayer].label}
                  </h3>
                  <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>
                    {LAYERS[activeLayer].sublabel}
                  </div>
                </div>
              </div>

              {/* Info text */}
              <p style={{ color:'var(--text-secondary)', lineHeight:1.75, fontSize:'0.88rem' }}>
                {LAYERS[activeLayer].info}
              </p>

              {/* Layer 3 (AgX) gets extra chemistry badge */}
              {activeLayer === 3 && (
                <div style={{ marginTop:16, padding:'10px 14px',
                  background:'var(--primary-pale)', borderRadius:'var(--radius-sm)',
                  fontFamily:'var(--font-mono)', fontSize:'0.82rem', color:'var(--primary)' }}>
                  NO₂ + AgX(zeolite) → [NO₂···Ag⁺] + e⁻
                </div>
              )}

              {/* Layer position indicator */}
              <div style={{ marginTop:20, display:'flex', gap:6, alignItems:'center' }}>
                {LAYERS.map((_, i) => (
                  <div key={i} style={{
                    height:4, flex:1, borderRadius:2,
                    background: i <= activeLayer ? LAYERS[activeLayer].color : 'var(--border)',
                    opacity: i <= activeLayer ? 1 : 0.4,
                    transition:'all 0.3s',
                  }} />
                ))}
              </div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:6 }}>
                Layer {activeLayer + 1} of {LAYERS.length} — airflow direction →
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
