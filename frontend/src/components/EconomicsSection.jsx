// src/components/EconomicsSection.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useInView from '../hooks/useInView'
import useCountUp from '../hooks/useCountUp'

// ─── ANIMATED CASH FLOW CHART ─────────────────────────────────────────────────
function CashFlowChart({ inView }) {
  // Real 24-month data from business model
  const DATA = [
    { month: 0,  label: 'M0',  balance: 55000,  phase: 'seed',    color: '#43A047' },
    { month: 2,  label: 'M2',  balance: 43500,  phase: 'pilot',   color: '#43A047' },
    { month: 4,  label: 'M4',  balance: 35500,  phase: 'wait',    color: '#FFC107' },
    { month: 6,  label: 'M6',  balance: 27500,  phase: 'wait',    color: '#FF6B35' },
    { month: 8,  label: 'M8',  balance: 25500,  phase: 'build',   color: '#FF6B35' },
    { month: 10, label: 'M10', balance: 13500,  phase: 'valley',  color: '#F44336' },
    { month: 12, label: 'M12', balance: 92500,  phase: 'payday',  color: '#43A047' },
    { month: 14, label: 'M14', balance: 52000,  phase: 'build2',  color: '#FFC107' },
    { month: 16, label: 'M16', balance: 49000,  phase: 'wait2',   color: '#FFC107' },
    { month: 18, label: 'M18', balance: 216500, phase: 'breakeven', color: '#1B4F8A' },
    { month: 20, label: 'M20', balance: 189000, phase: 'build3',  color: '#43A047' },
    { month: 22, label: 'M22', balance: 194000, phase: 'wait3',   color: '#43A047' },
    { month: 24, label: 'M24', balance: 370500, phase: 'complete', color: '#2E7D32' },
  ]

  const W = 600, H = 220
  const PAD = { top: 30, right: 20, bottom: 40, left: 60 }
  const maxVal = 400000
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const xScale = (i) => PAD.left + (i / (DATA.length - 1)) * chartW
  const yScale = (v) => PAD.top + (1 - v / maxVal) * chartH

  // Build SVG path
  const pathD = DATA.map((d, i) =>
    `${i === 0 ? 'M' : 'L'} ${xScale(i)} ${yScale(d.balance)}`
  ).join(' ')

  const areaD = pathD + ` L ${xScale(DATA.length-1)} ${H - PAD.bottom} L ${PAD.left} ${H - PAD.bottom} Z`

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ minWidth: 340 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B4F8A" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1B4F8A" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF6B35" />
            <stop offset="45%" stopColor="#FF6B35" />
            <stop offset="55%" stopColor="#1B4F8A" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0, 100000, 200000, 300000, 400000].map(v => (
          <g key={v}>
            <line x1={PAD.left} y1={yScale(v)} x2={W - PAD.right} y2={yScale(v)}
              stroke="var(--border)" strokeWidth={1} strokeDasharray="4,4" />
            <text x={PAD.left - 6} y={yScale(v) + 4} textAnchor="end"
              fontSize={8} fill="var(--text-muted)" fontFamily="monospace">
              {v >= 1000 ? `${v/1000}k` : v}₼
            </text>
          </g>
        ))}

        {/* Zero line */}
        <line x1={PAD.left} y1={yScale(0)} x2={W - PAD.right} y2={yScale(0)}
          stroke="var(--border-strong)" strokeWidth={1.5} />

        {/* Valley of death annotation */}
        <rect x={xScale(3) - 5} y={PAD.top} width={xScale(5) - xScale(3) + 10} height={chartH}
          fill="rgba(244,67,54,0.05)" rx={2} />
        <text x={(xScale(3) + xScale(5)) / 2} y={PAD.top + 12}
          textAnchor="middle" fontSize={8} fill="#F44336" fontWeight={600} fontFamily="Inter, sans-serif">
          Valley of Death
        </text>

        {/* Break-even annotation */}
        <line x1={xScale(9)} y1={PAD.top} x2={xScale(9)} y2={H - PAD.bottom}
          stroke="#1B4F8A" strokeWidth={1} strokeDasharray="4,3" />
        <text x={xScale(9)} y={PAD.top - 4}
          textAnchor="middle" fontSize={8} fill="#1B4F8A" fontWeight={700} fontFamily="Inter, sans-serif">
          Break-Even
        </text>

        {/* Area fill */}
        {inView && (
          <motion.path d={areaD} fill="url(#areaGrad)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} />
        )}

        {/* Main line — draws on scroll */}
        {inView && (
          <motion.path d={pathD} fill="none"
            stroke="url(#lineGrad)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.3 }}
          />
        )}

        {/* Data points */}
        {DATA.map((d, i) => (
          <g key={i}>
            <motion.circle
              cx={xScale(i)} cy={yScale(d.balance)} r={5}
              fill={d.color} stroke="white" strokeWidth={2}
              initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.3 }}
            />
            {/* Month label */}
            <text x={xScale(i)} y={H - PAD.bottom + 14}
              textAnchor="middle" fontSize={7.5} fill="var(--text-muted)" fontFamily="monospace">
              {d.label}
            </text>
          </g>
        ))}

        {/* Final balance label */}
        <motion.g initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 2.5 }}>
          <rect x={xScale(12) - 30} y={yScale(370500) - 24} width={62} height={20} rx={4} fill="#2E7D32" />
          <text x={xScale(12) - 1} y={yScale(370500) - 10} textAnchor="middle"
            fontSize={8.5} fill="white" fontWeight={800} fontFamily="monospace">
            370,500 ₼
          </text>
        </motion.g>
      </svg>
    </div>
  )
}

// ─── COMPARISON TABLE ─────────────────────────────────────────────────────────
function ComparisonTable({ inView }) {
  const rows = [
    { label: 'Unit Cost',             aeromesh: '350 ₼',       tower: '150,000 ₼',    win: true },
    { label: 'Sale Price',            aeromesh: '750 ₼',       tower: '—',             win: true },
    { label: 'Monthly SaaS',          aeromesh: '30 ₼/bus',    tower: '—',             win: true },
    { label: 'Fleet Retrofit (800)',   aeromesh: '600,000 ₼',   tower: '120M ₼',        win: true },
    { label: 'Coverage',              aeromesh: 'City-wide',   tower: '1 intersection', win: true },
    { label: 'Works at night',        aeromesh: '✓ Yes',       tower: '✗ No',           win: true },
    { label: 'Works in traffic jams', aeromesh: '✓ Active fan', tower: '✗ Static',      win: true },
    { label: 'NOₓ/₼ efficiency',      aeromesh: '5.8 g/₼',     tower: '0.3 g/₼',       win: true },
    { label: 'Real-time telemetry',   aeromesh: '✓ IoT + GPS', tower: '✗ None',         win: true },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px', minWidth: 380 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 14px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, fontFamily: 'var(--font-body)' }}>Metric</th>
            <th style={{ textAlign: 'center', padding: '8px 14px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, background: 'var(--primary-pale)', borderRadius: '8px 8px 0 0' }}>AeroMesh PNA</th>
            <th style={{ textAlign: 'center', padding: '8px 14px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Smog Tower</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <motion.tr key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.07, duration: 0.35 }}
            >
              <td style={{ padding: '9px 14px', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{row.label}</td>
              <td style={{ padding: '9px 14px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)', textAlign: 'center', background: 'var(--primary-pale)', borderRadius: 6 }}>{row.aeromesh}</td>
              <td style={{ padding: '9px 14px', fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center' }}>{row.tower}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── BOM VISUAL ───────────────────────────────────────────────────────────────
function BOMBreakdown({ inView }) {
  const items = [
    { label: 'Chemicals', sublabel: 'AgNO₃ 32g + Zeolite 2kg + Carbon', cost: 40,  color: '#43A047', pct: 11 },
    { label: 'Mechanical', sublabel: 'Cordierite + ABS shell + fans',    cost: 125, color: '#1B4F8A', pct: 36 },
    { label: 'IoT & Sensors', sublabel: 'Alphasense + ESP32 + GPS',      cost: 130, color: '#6A1B9A', pct: 37 },
    { label: 'Production', sublabel: 'Calcination + assembly labor',     cost: 22,  color: '#E65100', pct: 6  },
    { label: 'Logistics', sublabel: 'Customs & freight (~10%)',          cost: 15,  color: '#00838F', pct: 4  },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: i * 0.1 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 5 }}>
            <div>
              <span style={{ fontWeight: 700, color: item.color }}>{item.label}</span>
              <span style={{ color: 'var(--text-muted)', marginLeft: 6, fontSize: '0.72rem' }}>{item.sublabel}</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)', flexShrink: 0, marginLeft: 8 }}>{item.cost} ₼</span>
          </div>
          <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${item.pct * 2.7}%` } : {}}
              transition={{ duration: 1, delay: i * 0.1 + 0.3, ease: 'easeOut' }}
              style={{ height: '100%', background: item.color, borderRadius: 4 }}
            />
          </div>
        </motion.div>
      ))}
      <div style={{ borderTop: '2px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.88rem' }}>Total COGS</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--primary)', fontSize: '1rem' }}>~332 ₼</span>
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        * We quote 350 ₼ — leaving a buffer for currency fluctuations. Assembly in Sumgayit Chemical Industrial Park (7-year customs duty exemption).
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function EconomicsSection() {
  const TABS_ORDER = ['overview', 'bom', 'comparison', 'model'];

  const [tab, setTab]           = useState('overview');
  const [userPaused, setUserPaused] = useState(false);
  const pauseTimer               = useRef(null);
  const [ref, inView]            = useInView(0.15);

  // Auto-advance through tabs
  useEffect(() => {
    if (!inView || userPaused) return;
    const id = setInterval(() => {
      setTab(current => {
        const idx = TABS_ORDER.indexOf(current);
        return TABS_ORDER[(idx + 1) % TABS_ORDER.length];
      });
    }, 6000);
    return () => clearInterval(id);
  }, [inView, userPaused]);

  // Manual click — pause 10s then resume
  const handleTabClick = (tabId) => {
    setTab(tabId);
    setUserPaused(true);
    clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(() => setUserPaused(false), 10000);
  };

  useEffect(() => () => clearTimeout(pauseTimer.current), []);
  const balance24       = useCountUp(inView ? 370500 : 0, 2000)
  const buses24         = useCountUp(inView ? 800 : 0, 1800)
  const saas24          = useCountUp(inView ? 24000 : 0, 2000)
  const efficiency      = useCountUp(inView ? 19 : 0, 1500)

  const TABS = [
    { id: 'overview',   label: '📊 24-Month Plan' },
    { id: 'bom',        label: '🔩 Cost Breakdown' },
    { id: 'comparison', label: '⚖️ vs Competitors' },
    { id: 'model',      label: '💰 Business Model' },
  ]

  return (
    <section id="business" style={{ background: 'var(--bg-void)', padding: '6rem 1.5rem' }}>
      <div ref={ref} style={{ maxWidth: 1140, margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <span style={{ background: 'var(--primary-pale)', color: 'var(--primary)', padding: '4px 16px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em' }}>
            ECONOMICS
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, color: 'var(--text-primary)', marginTop: 14, marginBottom: 10 }}>
            The Business of Clean Air
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Hardware + SaaS. 53% gross margin. Break-even at Month 18. 370,000 ₼ cash reserve at Month 24.
          </p>
        </motion.div>

        {/* Top KPI strip */}
        <motion.div
          className="kpi-strip"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: '2.5rem' }}
        >
          {[
            { value: `${balance24.toLocaleString()} ₼`, label: 'Cash reserve at Month 24', color: '#2E7D32', icon: '🏦' },
            { value: buses24, label: 'AYNA buses retrofitted', color: '#1B4F8A', icon: '🚌' },
            { value: `${saas24.toLocaleString()} ₼`, label: 'Monthly SaaS revenue (M24)', color: '#6A1B9A', icon: '📡' },
            { value: `${efficiency}×`, label: 'More efficient than smog towers', color: '#E65100', icon: '⚡' },
          ].map(({ value, label, color, icon }, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1 }}
              style={{ background: 'var(--bg-surface)', border: `1px solid ${color}25`, borderTop: `3px solid ${color}`, borderRadius: 'var(--radius-md)', padding: '1.2rem', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: 6 }}>{icon}</div>
              <div style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', fontWeight: 900, color, fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.3 }}>{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
          {TABS.map(t => (
            <button key={t.id}
              onClick={() => handleTabClick(t.id)}
              style={{
                position: 'relative', overflow: 'hidden',
                padding: '0.5rem 1rem', borderRadius: 6, cursor: 'pointer',
                background: tab === t.id ? 'var(--primary)' : 'var(--bg-surface)',
                color: tab === t.id ? 'white' : 'var(--text-secondary)',
                fontWeight: tab === t.id ? 700 : 500, fontSize: '0.82rem',
                border: tab === t.id ? 'none' : '1px solid var(--border)',
                fontFamily: 'var(--font-body)', transition: 'all 0.2s',
              }}>
              {t.label}
              {tab === t.id && !userPaused && (
                <motion.div
                  key={`tab-progress-${tab}`}
                  style={{
                    position: 'absolute',
                    bottom: 0, left: 0,
                    height: 3,
                    background: 'white',
                    borderRadius: '0 0 4px 4px',
                    opacity: 0.6,
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 6, ease: 'linear' }}
                />
              )}
            </button>
          ))}
          {/* Right side of tabs row */}
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
              marginLeft: 'auto',
              display: 'flex', alignItems: 'center', gap: 5,
            }}
          >
            {userPaused ? '▶ Auto' : '⏸ Pause'}
          </button>
        </div>

        {/* Tab panels */}
        <AnimatePresence mode="wait">
          <motion.div key={tab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', padding: '2rem', boxShadow: 'var(--shadow-md)' }}
          >
            {tab === 'overview' && (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 6, color: 'var(--text-primary)' }}>24-Month Cash Flow — The Real World Model</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
                  We modeled the <strong>B2G bureaucracy trap</strong> (0 sales months 1–6), the <strong>Net-60 payment delay</strong>, and the <strong>Valley of Death</strong> at Month 10 — then engineered a way to survive each. 75,000 ₼ seed capital. 80,000 ₼ bridge loan at Month 8. 30% upfront payments from Month 14.
                </p>
                <CashFlowChart inView={inView} />
                <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--primary-pale)', borderRadius: 8, fontSize: '0.82rem', color: 'var(--primary)', fontStyle: 'italic', borderLeft: '3px solid var(--primary)' }}>
                  "Most hackathon teams show a graph that goes straight up. We modeled the real world — and engineered a way to survive it."
                </div>
              </div>
            )}
            {tab === 'bom' && (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>Bill of Materials — 1 AeroMesh Unit</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                  Manufactured in <strong>Sumgayit Chemical Industrial Park</strong> — 7-year customs duty exemption saves 15% on imports.
                </p>
                <BOMBreakdown inView={inView} />
              </div>
            )}
            {tab === 'comparison' && (
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>AeroMesh vs. Every Alternative</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                  <strong>5.8 g NOₓ removed per ₼ spent</strong> — 19× more efficient than stationary smog towers over 5 years.
                </p>
                <ComparisonTable inView={inView} />
              </div>
            )}
            {tab === 'model' && (
              <div className="model-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Revenue Streams</h3>
                  {[
                    { stream: 'Hardware Sale', detail: '750 ₼ per unit to AYNA', margin: '53%', color: '#1B4F8A', icon: '🔧' },
                    { stream: 'SaaS Subscription', detail: '30 ₼/bus/month — heatmap + alerts', margin: 'Recurring', color: '#6A1B9A', icon: '📡' },
                    { stream: 'Phase 3 B2B', detail: 'Bolt Food, Wolt, cargo trucks', margin: 'Expansion', color: '#E65100', icon: '🚚' },
                  ].map((r, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.1 }}
                      style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16, padding: '1rem', background: 'var(--bg-elevated)', borderRadius: 8, border: `1px solid ${r.color}20` }}
                    >
                      <div style={{ fontSize: '1.4rem' }}>{r.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: r.color, fontSize: '0.88rem' }}>{r.stream}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>{r.detail}</div>
                      </div>
                      <div style={{ padding: '2px 8px', background: `${r.color}15`, color: r.color, borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, flexShrink: 0 }}>{r.margin}</div>
                    </motion.div>
                  ))}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>Market Size</h3>
                  {[
                    { label: 'TAM — Global bus/truck retrofits', value: '$4.2B', color: '#1B4F8A', w: 100 },
                    { label: 'SAM — CIS & Eastern Europe smart cities', value: '$300M', color: '#43A047', w: 60 },
                    { label: 'SOM — Baku AYNA + Təmiz Şəhər', value: '1,000 units', color: '#E65100', w: 20 },
                  ].map((m, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: 6 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                        <span style={{ fontWeight: 700, color: m.color, fontFamily: 'var(--font-mono)' }}>{m.value}</span>
                      </div>
                      <div style={{ height: 10, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${m.w}%` } : {}}
                          transition={{ duration: 1.2, delay: i * 0.15 + 0.3, ease: 'easeOut' }}
                          style={{ height: '100%', background: m.color, borderRadius: 5 }}
                        />
                      </div>
                    </div>
                  ))}
                  {/* Circular economy box */}
                  <div style={{ marginTop: 20, padding: '1rem', background: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 8 }}>
                    <div style={{ fontWeight: 700, color: '#2E7D32', fontSize: '0.85rem', marginBottom: 6 }}>♻️ Zero-Waste Circular Economy</div>
                    <div style={{ fontSize: '0.78rem', color: '#388E3C', lineHeight: 1.5 }}>
                      800 buses → ~730 kg KNO₃/year → Donated to Baku Boulevard & Central Park greenery. The buses that pollute the air produce the fertilizer that keeps Baku's parks green.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
