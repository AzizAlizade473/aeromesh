// src/components/SystemExplainer.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import useInView from '../hooks/useInView'

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

          {/* RIGHT: Real Baku bus photo with animated overlays */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'relative' }}
              >
                {/* ── REAL BAKU BUS PHOTO ── */}
                <img
                  src="/hero-bus.png"
                  alt="Baku AeroMesh Bus"
                  style={{
                    width: '100%',
                    maxWidth: 520,
                    objectFit: 'contain',
                    display: 'block',
                    margin: '0 auto',
                    filter: 'none',           // natural colors — no tinting whatsoever
                  }}
                />

                {/* ── AEROMESH MODULE HIGHLIGHT ON BUS ROOF ── */}
                {/* Adjust top/left/width percentages to match the roof position
                    in the actual hero-bus.png photo */}
                <motion.div
                  animate={{
                    opacity: [0.6, 1, 0.6],
                    boxShadow: [
                      '0 0 8px rgba(27,79,138,0.4)',
                      '0 0 20px rgba(27,79,138,0.8)',
                      '0 0 8px rgba(27,79,138,0.4)',
                    ]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    top: '6%',       /* ← adjust to sit on bus roof */
                    left: '18%',     /* ← adjust to start at front of roof */
                    width: '58%',    /* ← adjust to span full roof length */
                    height: '9%',    /* ← adjust to match roof height */
                    background: 'rgba(27, 79, 138, 0.35)',
                    border: '2px solid #1B4F8A',
                    borderRadius: 4,
                  }}
                />

                {/* ── STEP-SPECIFIC ANIMATED OVERLAY ── */}
                {/* Step 0: orange NOₓ particles entering from the left */}
                {activeStep === 0 && [0,1,2,3,4,5].map(i => (
                  <motion.div key={i}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: `${28 + i * 7}%`,
                      width: 9, height: 9,
                      borderRadius: '50%',
                      background: ['#FF6B35','#FF8C42','#E64A19'][i % 3],
                    }}
                    animate={{ x: ['0%', '30%'], opacity: [0.9, 0] }}
                    transition={{ duration: 1.3, repeat: Infinity, delay: i * 0.22, ease: 'easeIn' }}
                  />
                ))}

                {/* Step 2: green clean air particles exiting from the right */}
                {activeStep === 2 && [0,1,2,3,4].map(i => (
                  <motion.div key={i}
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: `${30 + i * 8}%`,
                      width: 8, height: 8,
                      borderRadius: '50%',
                      background: ['#43A047','#66BB6A','#81C784'][i % 3],
                    }}
                    animate={{ x: ['0%', '40%'], opacity: [0, 0.8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3, ease: 'easeOut' }}
                  />
                ))}

                {/* Step 3: heat waves above the roof module */}
                {activeStep === 3 && [0,1,2].map(i => (
                  <motion.div key={i}
                    style={{
                      position: 'absolute',
                      top: '0%',
                      left: `${30 + i * 10}%`,
                      width: 3,
                      background: 'linear-gradient(to top, #FF6B35, transparent)',
                      height: 24,
                      borderRadius: 2,
                    }}
                    animate={{ y: [0, -14], opacity: [0.8, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.35, ease: 'easeOut' }}
                  />
                ))}

                {/* ── FLOATING LABELS ── */}
                {/* Label 1: AeroMesh PNA Module */}
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  style={{
                    position: 'absolute',
                    top: '-2%',
                    left: '20%',
                    background: '#1B4F8A',
                    color: 'white',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    zIndex: 2,
                  }}
                >
                  AeroMesh PNA Module
                </motion.div>

                {/* Label 2: AgX Zeolite Core */}
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  style={{
                    position: 'absolute',
                    top: '10%',
                    right: '2%',
                    background: '#2E7D32',
                    color: 'white',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    zIndex: 2,
                  }}
                >
                  AgX Zeolite Core
                </motion.div>

                {/* Label 3: ESP32 IoT Node */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  style={{
                    position: 'absolute',
                    top: '20%',
                    left: '2%',
                    background: '#6A1B9A',
                    color: 'white',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    zIndex: 2,
                  }}
                >
                  ESP32 IoT Node
                </motion.div>

                {/* Step stat overlay — bottom right of image */}
                <motion.div
                  key={`stat-${activeStep}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  style={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: `${STEPS[activeStep].color}EE`,
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    zIndex: 2,
                  }}
                >
                  {STEPS[activeStep].stat.value} — {STEPS[activeStep].stat.label}
                </motion.div>

              </motion.div>
            </AnimatePresence>

            <div style={{
              textAlign: 'center',
              marginTop: 10,
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
            }}>
              AeroMesh PNA — Live on BakuBus Fleet
            </div>
          </motion.div>

        </div>



      </div>
    </section>
  )
}
