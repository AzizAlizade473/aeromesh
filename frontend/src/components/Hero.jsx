import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';
import useFleetData from '../hooks/useFleetData';
import useCountUp from '../hooks/useCountUp';

const TRANSITION = { duration: 0.6, ease: 'easeOut' };

export default function Hero() {
  const [ref, inView] = useInView(0.1);
  const { fleet } = useFleetData();

  const activeCount = fleet?.active_count || 0;
  const totalUpstream = fleet ? fleet.buses.reduce((sum, b) => sum + (b.upstream_nox ?? b.upstreamNox ?? 0), 0) : 0;
  const totalDownstream = fleet ? fleet.buses.reduce((sum, b) => sum + (b.downstream_nox ?? b.downstreamNox ?? 0), 0) : 0;
  const busCount = fleet ? fleet.buses.length : 1;
  const avgUp = Math.round(totalUpstream / busCount);
  const avgDown = Math.round(totalDownstream / busCount);

  const countUpValue = useCountUp(avgUp, 2000);
  const countDownValue = useCountUp(avgDown, 2000);
  const countBuses = useCountUp(activeCount, 1500);

  const headlineWords = ["BAKU'S BUSES.", 'NOW PURIFYING', 'THE AIR THEY', 'MOVE THROUGH.'];

  const scrollTo = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <section id="hero" ref={ref} style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      overflow: 'hidden',
      paddingTop: '60px',
      background: 'var(--bg-dark)',
      color: 'var(--text-on-dark)',
    }}>
      {/* Subtle diagonal pattern */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: 'linear-gradient(135deg, #1A2332 25%, #1E2A3E 25%, #1E2A3E 50%, #1A2332 50%, #1A2332 75%, #1E2A3E 75%)',
        backgroundSize: '40px 40px',
        opacity: 0.5,
      }} />

      {/* Content */}
      <div className="section-container" style={{ width: '100%', zIndex: 10 }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '3rem', alignItems: 'center' }}>

          {/* Left Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',   // all elements left-aligned
            gap: 0,                     // control spacing manually per element
            maxWidth: 620,
          }}>

            {/* ── LIVE BADGE ── */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...TRANSITION, delay: 0.3 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                padding: '5px 14px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.08)',
                marginBottom: 20,
              }}
            >
              <span style={{
                width: 7, height: 7,
                borderRadius: '50%',
                background: '#43A047',
                animation: 'blink 1.5s infinite',
                flexShrink: 0,
              }} />
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-body)',
              }}>
                LIVE SYSTEM ACTIVE
              </span>
            </motion.div>

            {/* ── HEADLINE ── */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              margin: 0,
              marginBottom: 20,
            }}>
              {headlineWords.map((word, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 0.4 + (i * 0.08) }} style={{ display: 'inline-block', marginRight: '0.2em' }}>
                  {word}
                </motion.div>
              ))}
            </h1>

            {/* ── SUBTITLE ── */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...TRANSITION, delay: 0.8 }}
              style={{
                fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.7,
                maxWidth: 480,
                margin: 0,
                marginBottom: 28,
                fontFamily: 'var(--font-body)',
              }}
            >
              AeroMesh PNA converts 800 municipal transit vehicles into a
              city-wide mobile NOₓ filtration network — active today,
              no infrastructure rebuild required.
            </motion.p>

            {/* ── BUTTONS — side by side, identical height ── */}
            {/* They must render side by side on desktop using flexDirection: row */}
            <motion.div
              className="hero-ctas"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...TRANSITION, delay: 1 }}
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                alignItems: 'stretch',
                marginBottom: '32px'
              }}
            >
              <motion.button 
                onClick={() => scrollTo('problem')} 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                style={{ 
                  padding: '12px 28px', 
                  border: 'none', 
                  background: 'linear-gradient(135deg, var(--color-primary, #00A3FF), var(--color-primary-700, #0078c9))', 
                  color: 'white', 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '0.9rem', 
                  fontWeight: 700, 
                  borderRadius: 'var(--radius-md)', 
                  boxShadow: 'var(--shadow-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '48px'
                }}
              >
                ▶ How It Works
              </motion.button>
              <motion.button 
                onClick={() => scrollTo('dashboard')} 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                style={{ 
                  padding: '12px 28px', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  background: 'transparent', 
                  color: 'white', 
                  fontFamily: 'var(--font-display)', 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '48px'
                }}
              >
                Live Dashboard
              </motion.button>
            </motion.div>

            {/* ── STAT PILLS — three in a row, equal width ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...TRANSITION, delay: 1.2 }}
              style={{
                display: 'flex',
                flexDirection: 'row',         // ← MUST be row
                alignItems: 'stretch',        // ← equal height
                gap: 10,
                flexWrap: 'wrap',
              }}
            >
              {[
                {
                  label: 'NOₓ CAPTURED',
                  value: `↑ ${countUpValue} → ↓ ${countDownValue} µg/m³`,
                },
                {
                  label: 'BUSES ACTIVE',
                  value: `🚌 ${countBuses}`,
                },
                {
                  label: 'LOCATION',
                  value: '📍 BAKU, AZ',
                },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  flex: 1,
                  minWidth: 120,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    fontSize: '0.62rem',
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    marginBottom: 5,
                    fontFamily: 'var(--font-body)',
                  }}>
                    {label}
                  </div>
                  <div style={{
                    fontSize: '0.82rem',
                    color: 'white',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                  }}>
                    {value}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column — Animated Bus SVG */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ ...TRANSITION, delay: 0.8 }}
            className="bus-illustration-container"
            style={{ position: 'relative', height: '400px', width: '100%' }}
          >
            <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
              {/* Wrapper with bus-drive animation */}
              <div style={{
                animation: 'bus-drive 8s ease-in-out infinite',
                willChange: 'transform',
              }}>
                <svg viewBox="0 0 600 300" width="100%" height="100%" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>
                  {/* Main Body */}
                  <rect x="50" y="100" width="450" height="150" rx="20" fill="#22304A" stroke="#3B5068" strokeWidth="3" />
                  {/* Windows */}
                  <rect x="70" y="115" width="410" height="60" rx="10" fill="#1A2332" />
                  {/* Screen */}
                  <rect x="420" y="185" width="60" height="40" rx="5" fill="#1A2332" />
                  <rect x="430" y="195" width="40" height="20" rx="2" fill="var(--accent)" opacity="0.8" />
                  {/* Wheels */}
                  <circle cx="120" cy="250" r="30" fill="#111" stroke="#3B5068" strokeWidth="3" />
                  <circle cx="120" cy="250" r="15" fill="#22304A" />
                  <circle cx="380" cy="250" r="30" fill="#111" stroke="#3B5068" strokeWidth="3" />
                  <circle cx="380" cy="250" r="15" fill="#22304A" />
                  {/* AeroMesh Module */}
                  <g>
                    <rect x="200" y="70" width="160" height="30" rx="4" fill="var(--primary)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <path d="M360 85 L400 70 L400 100 Z" fill="#1A2332" stroke="#3B5068" strokeWidth="1" />
                    <path d="M160 85 L200 75 L200 95 Z" fill="#1A2332" stroke="#3B5068" strokeWidth="1" />
                    <rect x="220" y="78" width="120" height="14" rx="2" fill="url(#coreGradient)" />
                    <defs>
                      <linearGradient id="coreGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#C62828" />
                        <stop offset="50%" stopColor="#E65100" />
                        <stop offset="100%" stopColor="#2E8B57" />
                      </linearGradient>
                    </defs>
                  </g>
                </svg>
              </div>

              {/* Floating Labels */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.5 }}
                  style={{ position: 'absolute', top: '20px', left: '75%', transform: 'translateX(-50%)', background: 'rgba(26,35,50,0.9)', padding: '4px 8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-on-dark-muted)' }}>
                  Venturi Intake
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.7, duration: 0.5 }}
                  style={{ position: 'absolute', top: '10px', left: '55%', transform: 'translateX(-50%)', background: 'rgba(27,79,138,0.3)', padding: '4px 8px', border: '1px solid var(--primary)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.9)' }}>
                  AgX Zeolite Core
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9, duration: 0.5 }}
                  style={{ position: 'absolute', top: '20px', left: '25%', transform: 'translateX(-50%)', background: 'rgba(26,35,50,0.9)', padding: '4px 8px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-on-dark-muted)' }}>
                  ESP32 IoT Node
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-grid { grid-template-columns: 1fr 480px !important; }
        }
        .hero-ctas button { min-inline-size: 120px; border-radius: var(--radius-md) !important; }
        .hero-ctas button:focus-visible { outline: 3px solid var(--color-primary, #00A3FF); outline-offset: 2px; }
      `}</style>
    </section>
  );
}
