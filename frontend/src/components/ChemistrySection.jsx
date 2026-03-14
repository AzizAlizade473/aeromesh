// src/components/ChemistrySection.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useInView from '../hooks/useInView'

// ─── Molecule particle system ─────────────────────────────────────────────────
function MoleculeField({ type }) {
  // type: 'polluted' | 'clean'
  const count = 18
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 4 + Math.random() * 5,
    dur: 2.5 + Math.random() * 2,
    delay: Math.random() * 2,
    color: type === 'polluted'
      ? ['#EF5350','#FF7043','#FFA726'][i % 3]
      : ['#66BB6A','#26A69A','#42A5F5'][i % 3],
    label: type === 'polluted'
      ? ['NO₂','NO','NOₓ'][i % 3]
      : ['N₂','O₂','H₂O'][i % 3],
  }))

  return (
    <div style={{ position:'relative', width:'100%', height:180, overflow:'hidden',
      background: type === 'polluted' ? '#FFF8F7' : '#F0FFF4',
      borderRadius: 12, border: `1px solid ${type === 'polluted' ? '#FFCDD2' : '#C8E6C9'}` }}>
      {particles.map(p => (
        <motion.div key={p.id}
          style={{ position:'absolute', left:`${p.x}%`, top:`${p.y}%` }}
          animate={{ y: [0, -12, 0], x: [0, 6, -4, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease:'easeInOut' }}>
          <div style={{
            width: p.size * 2, height: p.size * 2, borderRadius:'50%',
            background: p.color, opacity: 0.85,
            display:'flex', alignItems:'center', justifyContent:'center',
            boxShadow: `0 2px 8px ${p.color}55`,
          }}>
            <span style={{ fontSize: 5, color:'white', fontWeight:700, whiteSpace:'nowrap' }}>{p.label}</span>
          </div>
        </motion.div>
      ))}
      <div style={{ position:'absolute', bottom:8, left:0, right:0, textAlign:'center',
        fontSize:'0.75rem', fontWeight:600,
        color: type === 'polluted' ? '#C62828' : '#2E7D32' }}>
        {type === 'polluted' ? '⚠ Polluted City Air' : '✓ Clean Filtered Air'}
      </div>
    </div>
  )
}

// ─── Zeolite honeycomb animated ───────────────────────────────────────────────
function ZeoliteHoneycomb({ active }) {
  const hexes = [
    {cx:80,  cy:60},  {cx:120, cy:60},  {cx:160, cy:60},  {cx:200, cy:60},  {cx:240, cy:60},
    {cx:60,  cy:95},  {cx:100, cy:95},  {cx:140, cy:95},  {cx:180, cy:95},  {cx:220, cy:95},  {cx:260, cy:95},
    {cx:80,  cy:130}, {cx:120, cy:130}, {cx:160, cy:130}, {cx:200, cy:130}, {cx:240, cy:130},
    {cx:60,  cy:165}, {cx:100, cy:165}, {cx:140, cy:165}, {cx:180, cy:165}, {cx:220, cy:165},
  ]

  // Captured NOₓ sites (subset of hex positions)
  const capturedIdx = [1, 4, 7, 9, 12, 15, 18]

  return (
    <svg viewBox="0 0 320 210" width="100%" style={{ maxWidth:340 }}>
      {/* Hexagon cells */}
      {hexes.map(({cx, cy}, i) => {
        const isCaptured = capturedIdx.includes(i)
        return (
          <g key={i}>
            <polygon
              points={`${cx},${cy-18} ${cx+16},${cy-9} ${cx+16},${cy+9} ${cx},${cy+18} ${cx-16},${cy+9} ${cx-16},${cy-9}`}
              fill={isCaptured ? '#E3F2FD' : '#EEF1F5'}
              stroke={isCaptured ? '#1B4F8A' : '#CBD5E1'}
              strokeWidth={isCaptured ? 1.8 : 1}
            />
            {/* Ag+ ion in center */}
            <circle cx={cx} cy={cy} r={5} fill={isCaptured ? '#1B4F8A' : '#90A4AE'} />
            <text x={cx} y={cy+2} textAnchor="middle" fontSize={4.5}
              fill="white" fontWeight={700} fontFamily="monospace">Ag⁺</text>
            {/* Captured NOₓ dot */}
            {isCaptured && active && (
              <motion.g
                initial={{ scale:0, opacity:0 }}
                animate={{ scale:1, opacity:1 }}
                transition={{ delay: i * 0.1, duration:0.4 }}>
                <circle cx={cx+11} cy={cy-11} r={6} fill="#EF5350" />
                <text x={cx+11} y={cy-9} textAnchor="middle" fontSize={4}
                  fill="white" fontWeight={700}>NO₂</text>
              </motion.g>
            )}
          </g>
        )
      })}

      {/* Incoming NOₓ molecules animated */}
      {active && [0,1,2].map(i => (
        <motion.g key={i}
          initial={{ x: 340, y: 30 + i*50 }}
          animate={{ x: 260, y: 60 + i*35 }}
          transition={{ duration:1.8, repeat:Infinity, delay: i*0.6, ease:'easeIn' }}>
          <circle r={7} fill="#FF7043" opacity={0.9} />
          <text y={2} textAnchor="middle" fontSize={4.5} fill="white" fontWeight={700}>NOₓ</text>
        </motion.g>
      ))}

      {/* Label */}
      <text x={160} y={200} textAnchor="middle" fontSize={9} fill="#1B4F8A" fontWeight={700} fontFamily="Inter, sans-serif">
        AgX Zeolite — Silver ions trap NOₓ instantly
      </text>
    </svg>
  )
}

// ─── Regeneration cycle mini visual ───────────────────────────────────────────
function RegenVisual({ active }) {
  const steps = ['200°C\nJoule\nHeat', 'NOₓ\nReleased', 'NaOH\nScrubber', 'NaNO₃\nSafe Salt']
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, flexWrap:'wrap', padding:'1rem 0' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
          <motion.div
            animate={active ? { scale:[1,1.08,1], borderColor:['#D1D9E6','#1B4F8A','#D1D9E6'] } : {}}
            transition={{ duration:1.5, repeat:Infinity, delay: i*0.4 }}
            style={{
              width:72, height:72, borderRadius:'50%',
              border:'2px solid #D1D9E6',
              background:'white', boxShadow:'0 2px 8px rgba(0,0,0,0.07)',
              display:'flex', alignItems:'center', justifyContent:'center',
              textAlign:'center', fontSize:'0.65rem', fontWeight:600,
              color:'#1B4F8A', padding:'4px',
              whiteSpace:'pre-line', lineHeight:1.3,
            }}>
            {step}
          </motion.div>
          {i < steps.length - 1 && (
            <motion.div
              animate={active ? { opacity:[0.3,1,0.3] } : { opacity:0.3 }}
              transition={{ duration:1.5, repeat:Infinity, delay: i*0.4 }}
              style={{ fontSize:'1rem', color:'#1B4F8A' }}>→</motion.div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ChemistrySection() {
  const [ref, inView]       = useInView(0.15)
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: 'The Problem',     icon: '🏙' },
    { label: 'The Capture',     icon: '⚗️' },
    { label: 'Regeneration',    icon: '♻️' },
    { label: 'The Result',      icon: '✅' },
  ]

  const panels = [
    {
      heading: 'NOₓ is trapped in Baku\'s streets',
      body: 'Buildings create "street canyons" — tall walls that trap nitrogen oxides (NOₓ) at exactly the height people breathe. These gases are invisible but cause respiratory disease, especially in children and the elderly. The source: thousands of combustion engines idling in traffic every day.',
      visual: <MoleculeField type="polluted" />,
      stat: { value: '187 µg/m³', label: 'Average NOₓ in Baku street canyons', color: '#C62828' },
    },
    {
      heading: 'AgX zeolite grabs NOₓ like a molecular magnet',
      body: 'Inside the AeroMesh module sits a cordierite honeycomb coated with Silver-Exchanged Zeolite X (AgX). The silver ions (Ag⁺) capture NO₂ molecules through electron donation — the moment the pollutant touches the surface, it is trapped. No light needed. No heat needed. No energy consumed. Just chemistry.',
      visual: <ZeoliteHoneycomb active={inView && activeTab === 1} />,
      stat: { value: 'Milliseconds', label: 'Time to capture a NOₓ molecule', color: '#1B4F8A' },
    },
    {
      heading: 'Every night at the depot: the filter is reborn',
      body: 'When the filter is full, the bus returns to the depot. The module is plugged into a DC dock. 0.28 kWh of electricity (less than charging a phone for a day) heats the ceramic to 200°C via Joule heating, releasing the stored NOₓ. That gas is immediately captured by a NaOH wet scrubber and neutralised into harmless sodium nitrate salt.',
      visual: <RegenVisual active={inView && activeTab === 2} />,
      stat: { value: '0.28 kWh', label: 'Energy per regeneration cycle', color: '#E65100' },
    },
    {
      heading: '82% less NOₓ in the air around every bus',
      body: 'Each bus running AeroMesh captures pollutants that would otherwise be breathed by pedestrians, cyclists, and passengers at every stop. Deploy across AYNA\'s 800-bus fleet and you have a city-wide, mobile air filtration network — active today, no infrastructure rebuild required.',
      visual: (
        <div style={{ padding:'0.5rem 0' }}>
          {[
            { label:'Upstream (city air entering module)', pct:100, value:'~162 µg/m³', color:'#EF5350' },
            { label:'Downstream (air leaving module)',      pct:18,  value:'~29 µg/m³',  color:'#43A047' },
          ].map(({ label, pct, value, color }) => (
            <div key={label} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.8rem', marginBottom:6 }}>
                <span style={{ color:'var(--text-secondary)' }}>{label}</span>
                <span style={{ fontFamily:'var(--font-mono)', fontWeight:700, color }}>{value}</span>
              </div>
              <div style={{ height:22, background:'var(--border)', borderRadius:4, overflow:'hidden' }}>
                <motion.div
                  initial={{ width:0 }}
                  animate={inView && activeTab === 3 ? { width:`${pct}%` } : { width:0 }}
                  transition={{ duration:1.2, ease:'easeOut', delay: pct === 100 ? 0.2 : 0.6 }}
                  style={{ height:'100%', background:color, borderRadius:4,
                    display:'flex', alignItems:'center', paddingLeft:8 }}>
                  {pct === 100 && <span style={{ fontSize:'0.7rem', color:'white', fontWeight:600 }}>Polluted</span>}
                  {pct < 50 && <span style={{ fontSize:'0.7rem', color:'white', fontWeight:600 }}>Clean</span>}
                </motion.div>
              </div>
            </div>
          ))}
          <motion.div
            initial={{ opacity:0, y:10 }}
            animate={inView && activeTab === 3 ? { opacity:1, y:0 } : {}}
            transition={{ delay:1.4 }}
            style={{ background:'#E8F5E9', border:'1px solid #A5D6A7', borderRadius:8,
              padding:'10px 14px', fontSize:'0.85rem', color:'#2E7D32', fontWeight:600, textAlign:'center' }}>
            ✓ 82% NOₓ reduction — zero power consumed during capture
          </motion.div>
        </div>
      ),
      stat: { value: '82%', label: 'Average NOₓ reduction per bus', color: '#2E7D32' },
    },
  ]

  return (
    <section id="chemistry" style={{ background:'var(--bg-elevated)', padding:'5rem 1.5rem' }}>
      <div ref={ref} style={{ maxWidth:1100, margin:'0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity:0, y:24 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ duration:0.55 }}
          style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <span style={{ background:'var(--primary-pale)', color:'var(--primary)', padding:'4px 14px',
            borderRadius:999, fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.05em' }}>
            THE SCIENCE — MADE SIMPLE
          </span>
          <h2 className="section-title" style={{ marginTop:12, marginBottom:8 }}>
            How Does a Bus Clean the Air?
          </h2>
          <p style={{ color:'var(--text-secondary)', maxWidth:560, margin:'0 auto', fontSize:'0.95rem', lineHeight:1.7 }}>
            You don't need to be a chemical engineer. Here's what AeroMesh does — step by step.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="chemistry-tabs" style={{ display:'flex', gap:8, justifyContent:'center', marginBottom:'2rem', flexWrap:'wrap' }}>
          {tabs.map((tab, i) => (
            <motion.button key={i}
              onClick={() => setActiveTab(i)}
              whileHover={{ y:-2 }}
              whileTap={{ scale:0.97 }}
              style={{
                padding:'0.55rem 1.2rem', borderRadius:999, border:'none', cursor:'pointer',
                background: activeTab === i ? 'var(--primary)' : 'var(--bg-surface)',
                color: activeTab === i ? 'white' : 'var(--text-secondary)',
                fontWeight: activeTab === i ? 700 : 500,
                fontSize:'0.85rem',
                border: activeTab === i ? 'none' : '1px solid var(--border)',
                transition:'all 0.2s',
                fontFamily:'var(--font-body)',
                boxShadow: activeTab === i ? '0 4px 12px rgba(27,79,138,0.25)' : 'none',
              }}>
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Panel */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-12 }}
            transition={{ duration:0.35 }}
            className="chemistry-panel"
            style={{
              display:'grid',
              gridTemplateColumns:'1fr 1fr',
              gap:'2rem',
              background:'var(--bg-surface)',
              borderRadius:'var(--radius-lg)',
              border:'1px solid var(--border)',
              padding:'2rem',
              boxShadow:'var(--shadow-md)',
            }}>

            {/* Left: text */}
            <div style={{ display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div>
                <h3 style={{ fontSize:'1.2rem', fontWeight:700, color:'var(--text-primary)', marginBottom:12, lineHeight:1.3 }}>
                  {panels[activeTab].heading}
                </h3>
                <p style={{ color:'var(--text-secondary)', lineHeight:1.75, fontSize:'0.9rem' }}>
                  {panels[activeTab].body}
                </p>
              </div>

              {/* Stat card */}
              <div style={{
                marginTop:24, padding:'1rem 1.2rem',
                background: `${panels[activeTab].stat.color}0F`,
                border: `1px solid ${panels[activeTab].stat.color}30`,
                borderLeft: `4px solid ${panels[activeTab].stat.color}`,
                borderRadius:'var(--radius-sm)',
              }}>
                <div style={{ fontSize:'1.6rem', fontWeight:800, color:panels[activeTab].stat.color, fontFamily:'var(--font-mono)' }}>
                  {panels[activeTab].stat.value}
                </div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>
                  {panels[activeTab].stat.label}
                </div>
              </div>
            </div>

            {/* Right: visual */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
              {panels[activeTab].visual}
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Bottom equation bar */}
        <motion.div
          initial={{ opacity:0, y:16 }}
          animate={inView ? { opacity:1, y:0 } : {}}
          transition={{ delay:0.5 }}
          style={{
            marginTop:'2rem', padding:'1.4rem 2rem',
            background:'var(--primary)', borderRadius:'var(--radius-md)',
            display:'flex', alignItems:'center', justifyContent:'space-between',
            gap:'1.5rem', flexWrap:'wrap',
          }}>
          <div>
            <div style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.08em', marginBottom:6 }}>
              CAPTURE REACTION (AgX Zeolite)
            </div>
            <div style={{ fontFamily:'var(--font-mono)', fontSize:'1rem', color:'white', fontWeight:500 }}>
              NO₂ + AgX → [NO₂···Ag⁺] + e⁻
            </div>
          </div>
          <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
            {[
              { label:'Speed',      value:'Milliseconds' },
              { label:'Light',      value:'Not needed' },
              { label:'Humidity',   value:'Resistant' },
              { label:'Temp',       value:'Ambient' },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.7rem' }}>{label}</div>
                <div style={{ color:'white', fontWeight:700, fontSize:'0.85rem' }}>{value}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
