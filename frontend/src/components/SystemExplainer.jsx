// src/components/SystemExplainer.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import useInView from '../hooks/useInView'

// ─── ANIMATED BUS CROSS-SECTION ──────────────────────────────────────────────
// Full SVG showing bus top-view cross section with animated airflow
function BusCrossSection({ step }) {
  // step 0: bus moving, dirty air entering
  // step 1: air passing through 3 filter layers
  // step 2: clean air exiting, NOₓ trapped
  // step 3: depot regeneration
  return (
    <svg viewBox="0 0 600 280" width="100%" style={{ maxWidth: 680, display: 'block', margin: '0 auto' }}>
      <defs>
        {/* Dirty air gradient */}
        <linearGradient id="dirtyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.1" />
        </linearGradient>
        {/* Clean air gradient */}
        <linearGradient id="cleanGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#43A047" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#43A047" stopOpacity="0.8" />
        </linearGradient>
        {/* Filter layer gradient */}
        <linearGradient id="filterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1B4F8A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0D47A1" stopOpacity="0.7" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── ROAD ── */}
      <rect x={0} y={230} width={600} height={50} fill="#2D3748" />
      {[0,1,2,3,4,5,6,7,8].map(i => (
        <rect key={i} x={i*70+10} y={252} width={45} height={5} rx={2} fill="rgba(255,255,255,0.3)" />
      ))}

      {/* ── BUS BODY ── */}
      <rect x={60} y={140} width={480} height={90} rx={8} fill="#1B4F8A" />
      {/* Bus windows */}
      {[80,140,200,260,380,440,500].map(wx => (
        <rect key={wx} x={wx} y={150} width={45} height={28} rx={3}
          fill="rgba(200,230,255,0.6)" stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      ))}
      {/* Bus wheel wells */}
      <ellipse cx={130} cy={232} rx={32} ry={18} fill="#1A202C" />
      <ellipse cx={470} cy={232} rx={32} ry={18} fill="#1A202C" />
      <ellipse cx={130} cy={232} rx={22} ry={12} fill="#2D3748" />
      <ellipse cx={470} cy={232} rx={22} ry={12} fill="#2D3748" />

      {/* ── AEROMESH MODULE ON ROOF ── */}
      <rect x={160} y={108} width={280} height={32} rx={4} fill="#0D47A1"
        stroke="rgba(255,255,255,0.3)" strokeWidth={1} />
      {/* Venturi intake grille */}
      <rect x={160} y={108} width={50} height={32} rx={4} fill="#0A3880" />
      {[0,1,2,3].map(i => (
        <rect key={i} x={167} y={114 + i*6} width={36} height={3} rx={1} fill="rgba(255,255,255,0.4)" />
      ))}
      {/* Module label */}
      <text x={300} y={129} textAnchor="middle" fontSize={9} fill="white"
        fontWeight={700} fontFamily="monospace" letterSpacing={1}>
        AEROMESH PNA MODULE
      </text>
      {/* Exhaust side */}
      <rect x={390} y={108} width={50} height={32} rx={4} fill="#0A3880" />
      {[0,1,2,3].map(i => (
        <rect key={i} x={397} y={114 + i*6} width={36} height={3} rx={1} fill="rgba(255,255,255,0.4)" />
      ))}

      {/* ── FILTER LAYERS (visible inside module) ── */}
      {step >= 1 && (
        <>
          {/* Layer 1: PM filter */}
          <motion.rect x={222} y={110} width={14} height={28}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.1 }}
            fill="#78909C" opacity={0.9} />
          {/* Layer 2: Guard bed */}
          <motion.rect x={242} y={110} width={14} height={28}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.2 }}
            fill="#455A64" opacity={0.9} />
          {/* Layer 3: AgX core */}
          <motion.rect x={262} y={110} width={20} height={28}
            initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.3 }}
            fill="#43A047" opacity={0.95} filter="url(#glow)" />
          <text x={272} y={130} textAnchor="middle" fontSize={5} fill="white" fontWeight={700}>AgX</text>
        </>
      )}

      {/* ── DIRTY AIR PARTICLES ENTERING (step 0 + 1) ── */}
      {(step === 0 || step === 1) && [0,1,2,3,4,5,6,7].map(i => (
        <motion.circle key={i}
          r={3 + (i%3)}
          fill={['#FF6B35','#FF8C42','#E64A19'][i%3]}
          initial={{ cx: 60, cy: 115 + (i%5)*4 - 8 }}
          animate={{ cx: step === 0 ? 165 : 220, cy: 115 + (i%5)*4 - 8 }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i*0.15, ease: 'linear' }}
          opacity={0.85}
        />
      ))}

      {/* ── CLEAN AIR PARTICLES EXITING (step 2+) ── */}
      {step >= 2 && [0,1,2,3,4,5].map(i => (
        <motion.circle key={i}
          r={3}
          fill={['#43A047','#66BB6A','#81C784'][i%3]}
          initial={{ cx: 440, cy: 115 + (i%4)*5 - 8 }}
          animate={{ cx: 540, cy: 115 + (i%4)*5 - 8 }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i*0.2, ease: 'linear' }}
          opacity={0.8}
        />
      ))}

      {/* ── TRAPPED NOₓ DOTS IN FILTER (step 2) ── */}
      {step === 2 && [0,1,2,3,4].map(i => (
        <motion.circle key={i}
          cx={272} cy={114 + i*4}
          r={2}
          fill="#FF6B35"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.9 }}
          transition={{ delay: i*0.1, duration: 0.4 }}
        />
      ))}

      {/* ── DEPOT REGENERATION (step 3) ── */}
      {step === 3 && (
        <>
          {/* Heat waves */}
          {[0,1,2].map(i => (
            <motion.path key={i}
              d={`M ${258+i*8} 140 Q ${262+i*8} 148 ${258+i*8} 156`}
              stroke="#FF6B35" strokeWidth={2} fill="none"
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0,1,0], y: -15 }}
              transition={{ duration: 1, repeat: Infinity, delay: i*0.3 }}
            />
          ))}
          {/* Power plug icon */}
          <circle cx={272} cy={80} r={16} fill="#FFC107" opacity={0.9} />
          <text x={272} y={85} textAnchor="middle" fontSize={14}>⚡</text>
          <text x={272} y={100} textAnchor="middle" fontSize={8} fill="#FFC107" fontWeight={700}>0.28 kWh</text>
        </>
      )}

      {/* ── STEP LABELS ── */}
      <text x={122} y={100} textAnchor="middle" fontSize={9} fill="#FF6B35" fontWeight={600} fontFamily="Inter, sans-serif">
        {step === 0 ? 'NOₓ in city air' : step === 3 ? 'Depot charging' : ''}
      </text>
      <text x={475} y={100} textAnchor="middle" fontSize={9} fill={step >= 2 ? '#43A047' : '#8A9BB0'} fontWeight={600} fontFamily="Inter, sans-serif">
        {step >= 2 ? 'Clean air out' : ''}
      </text>

      {/* ── STAT OVERLAY ── */}
      <rect x={10} y={10} width={130} height={50} rx={6} fill="rgba(26,32,50,0.85)" />
      <text x={20} y={28} fontSize={8} fill="rgba(255,255,255,0.7)" fontFamily="Inter, sans-serif">NOₓ Upstream</text>
      <text x={20} y={42} fontSize={13} fill="#FF6B35" fontWeight={800} fontFamily="monospace">162 µg/m³</text>
      <text x={20} y={52} fontSize={7} fill="rgba(255,255,255,0.5)" fontFamily="Inter, sans-serif">6.5× WHO limit</text>

      {step >= 2 && (
        <motion.g initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.5 }}>
          <rect x={460} y={10} width={130} height={50} rx={6} fill="rgba(26,32,50,0.85)" />
          <text x={470} y={28} fontSize={8} fill="rgba(255,255,255,0.7)" fontFamily="Inter, sans-serif">NOₓ Downstream</text>
          <text x={470} y={42} fontSize={13} fill="#43A047" fontWeight={800} fontFamily="monospace">29 µg/m³</text>
          <text x={470} y={52} fontSize={7} fill="rgba(255,255,255,0.5)" fontFamily="Inter, sans-serif">82% captured ✓</text>
        </motion.g>
      )}
    </svg>
  )
}

// ─── STEP DATA ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 0,
    icon: '🏙',
    title: 'City Air Enters',
    subtitle: 'NOₓ trapped in Baku street canyons',
    description: 'As the bus moves through traffic, the Venturi/NACA roof scoop forces polluted city air — containing invisible nitrogen oxides (NOₓ) at 6× the WHO safe limit — directly into the AeroMesh module.',
    stat: { value: '187 ppb', label: 'Avg NO₂ in Baku street canyons', color: '#FF6B35' },
    color: '#FF6B35',
  },
  {
    id: 1,
    icon: '🧱',
    title: '3-Layer Defense',
    subtitle: 'PM filter → Guard bed → AgX core',
    description: 'Air passes through three layers: (1) ceramic PM2.5 pre-filter blocks soot, (2) activated carbon guard bed neutralizes SO₂ to prevent zeolite poisoning, (3) the AgX zeolite core captures NOₓ instantly via silver ion electron donation.',
    stat: { value: '3 layers', label: 'PM filter → SO₂ guard → AgX zeolite', color: '#1B4F8A' },
    color: '#1B4F8A',
  },
  {
    id: 2,
    icon: '⚗️',
    title: 'NOₓ Captured',
    subtitle: 'Silver ions grab pollutants instantly',
    description: 'The AgX zeolite silver ions (Ag⁺) trap NO₂ molecules through π-complexation — instantaneously, without light, heat, or power. The reaction: NO₂ + AgX → [NO₂···Ag⁺]. Clean air exits the back. The zeolite "sponge" fills over hours.',
    stat: { value: '82%', label: 'NOₓ captured per pass through module', color: '#43A047' },
    color: '#43A047',
  },
  {
    id: 3,
    icon: '♻️',
    title: 'Nightly Regeneration',
    subtitle: 'Depot → 200°C → KNO₃ fertilizer',
    description: 'At the depot, 0.28 kWh of electricity heats the ceramic to 200°C. NOₓ is released into a KOH scrubber, neutralized into potassium nitrate (KNO₃) — premium fertilizer donated to sustain Baku Boulevard. Zero waste. Filter resets for tomorrow.',
    stat: { value: '0.28 kWh', label: 'Energy per full regeneration cycle', color: '#FFC107' },
    color: '#FFC107',
  },
]

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function SystemExplainer() {
  const [activeStep, setActiveStep] = useState(0)
  const [autoPlay, setAutoPlay]     = useState(true)
  const [ref, inView]               = useInView(0.2)

  // Auto-advance steps
  useEffect(() => {
    if (!inView || !autoPlay) return
    const id = setInterval(() => {
      setActiveStep(s => (s + 1) % STEPS.length)
    }, 3500)
    return () => clearInterval(id)
  }, [inView, autoPlay])

  const step = STEPS[activeStep]

  return (
    <section id="problem" style={{ background: 'var(--bg-surface)', padding: '6rem 1.5rem', position: 'relative' }}>
      <div ref={ref} style={{ maxWidth: 1140, margin: '0 auto' }}>

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3rem' }}
        >
          <span style={{ background: 'var(--primary-pale)', color: 'var(--primary)', padding: '4px 16px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em' }}>
            HOW IT WORKS
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 14, marginBottom: 10, lineHeight: 1.2 }}>
            A Bus That Cleans<br />the Air It Moves Through
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto', fontSize: '1rem', lineHeight: 1.7 }}>
            Watch the system in action. Click any step or let it play automatically.
          </p>
        </motion.div>

        {/* ── STEP PILLS ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: '2.5rem', flexWrap: 'wrap' }}>
          {STEPS.map((s, i) => (
            <motion.button
              key={i}
              onClick={() => { setActiveStep(i); setAutoPlay(false) }}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '0.55rem 1.2rem',
                borderRadius: 999,
                border: `2px solid ${activeStep === i ? s.color : 'var(--border)'}`,
                background: activeStep === i ? `${s.color}12` : 'var(--bg-surface)',
                color: activeStep === i ? s.color : 'var(--text-secondary)',
                fontWeight: activeStep === i ? 700 : 500,
                fontSize: '0.85rem', cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'all 0.25s',
                boxShadow: activeStep === i ? `0 4px 16px ${s.color}25` : 'none',
              }}
            >
              <span>{s.icon}</span>
              <span>{s.title}</span>
              {activeStep === i && autoPlay && (
                <motion.div
                  style={{ width: 20, height: 3, background: s.color, borderRadius: 2, overflow: 'hidden' }}
                >
                  <motion.div
                    style={{ height: '100%', background: s.color, opacity: 0.4, borderRadius: 2 }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3.5, ease: 'linear' }}
                    key={activeStep}
                  />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        {/* ── MAIN PANEL ── */}
        <div className="main-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '2rem', alignItems: 'center' }}>

          {/* LEFT: step info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              {/* Step number */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: step.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, boxShadow: `0 4px 16px ${step.color}40` }}>
                  {step.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem', color: step.color }}>{step.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{step.subtitle}</div>
                </div>
              </div>

              {/* Description */}
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.92rem' }}>
                {step.description}
              </p>

              {/* Stat card */}
              <div style={{ padding: '1.1rem 1.3rem', background: `${step.color}0E`, border: `1px solid ${step.color}30`, borderLeft: `4px solid ${step.color}`, borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: step.color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{step.stat.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{step.stat.label}</div>
              </div>

              {/* Step progress dots */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {STEPS.map((s, i) => (
                  <motion.div
                    key={i}
                    onClick={() => { setActiveStep(i); setAutoPlay(false) }}
                    animate={{ width: activeStep === i ? 28 : 8, background: activeStep === i ? s.color : 'var(--border)' }}
                    style={{ height: 8, borderRadius: 4, cursor: 'pointer' }}
                  />
                ))}
                <button onClick={() => setAutoPlay(a => !a)} style={{ marginLeft: 8, fontSize: '0.75rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  {autoPlay ? '⏸ Pause' : '▶ Play'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT: 3D bus animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '1.5rem', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BusCrossSection step={activeStep} />
              </motion.div>
            </AnimatePresence>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              AeroMesh PNA — Animated System Cross-Section
            </div>
          </motion.div>

        </div>



      </div>
    </section>
  )
}
