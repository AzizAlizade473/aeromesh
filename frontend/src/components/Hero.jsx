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
          <div>
            {/* Live Pill */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...TRANSITION, delay: 0.3 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '20px', background: 'rgba(255,255,255,0.08)',
                color: '#4ADE80', fontSize: '0.75rem', fontWeight: 600,
                marginBottom: '2rem',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ADE80', animation: 'blink 1.5s infinite' }} />
              LIVE SYSTEM ACTIVE
            </motion.div>

            {/* Headline */}
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 5.5vw, 72px)',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: 'white',
              fontWeight: 700,
            }}>
              {headlineWords.map((word, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 0.4 + (i * 0.08) }}>
                  {word}
                </motion.div>
              ))}
            </h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...TRANSITION, delay: 0.8 }}
              style={{
                fontSize: '1.05rem', color: 'var(--text-on-dark-muted)',
                maxWidth: '560px', marginBottom: '2.5rem', lineHeight: 1.7,
              }}
            >
              AeroMesh PNA converts 800 municipal transit vehicles into a city-wide mobile NOₓ filtration network — active today, no infrastructure rebuild required.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...TRANSITION, delay: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'row',     // side by side, NOT column
                alignItems: 'center',
                gap: 12,
                marginTop: 28,
                marginBottom: '3rem',
                flexWrap: 'wrap',         // wraps to next line on very small screens
              }}
            >
              <motion.button
                onClick={() => scrollTo('problem')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '0.75rem 1.6rem',
                  background: 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 14px rgba(27,79,138,0.4)',
                }}
              >
                ▶ How It Works
              </motion.button>

              <motion.button
                onClick={() => scrollTo('dashboard')}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '0.75rem 1.6rem',
                  background: 'transparent',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                Live Dashboard
              </motion.button>
            </motion.div>

            {/* Live Stats */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 1.2 }}
              style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', marginBottom: '4px', fontWeight: 500 }}>NOₓ CAPTURED</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>
                  <span style={{ color: '#EF4444' }}>⬆ {countUpValue}</span> → <span style={{ color: '#4ADE80' }}>⬇ {countDownValue}</span> <span style={{ fontSize: '0.8rem', color: 'var(--text-on-dark-muted)' }}>µg/m³</span>
                </span>
              </div>
              <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', marginBottom: '4px', fontWeight: 500 }}>BUSES ACTIVE</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'white', fontSize: '1.1rem', fontWeight: 600 }}>🚌 {countBuses}</span>
              </div>
              <div style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-on-dark-muted)', fontSize: '0.8rem' }}>📍 40.4093°N 49.8671°E<br/>BAKU, AZ</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column — Real Bus Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ ...TRANSITION, delay: 0.8 }}
            className="bus-illustration-container"
          >
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: 580,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}>
              {/* Bus image — user will provide the file */}
              <motion.div
                animate={{ x: [40, -40, 40] }}
                transition={{ duration: 8, ease: 'easeInOut', repeat: Infinity }}
                style={{ position: 'relative', width: '100%' }}
              >
                <img
                  src="/hero-bus.png"
                  alt="Baku AeroMesh Bus"
                  style={{
                    width: '100%',
                    maxWidth: 520,
                    objectFit: 'contain',
                    display: 'block',
                    // Natural colors — no tinting, no filters, no color overlays
                    filter: 'none',
                  }}
                />

                {/* AeroMesh module highlight on roof — overlaid on real bus photo */}
                <motion.div
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute',
                    // Adjust top/left/width to align with roof of the real bus photo
                    top: '8%',
                    left: '20%',
                    width: '55%',
                    height: '10%',
                    background: 'rgba(27, 79, 138, 0.5)',
                    border: '2px solid rgba(27, 79, 138, 0.9)',
                    borderRadius: 4,
                    boxShadow: '0 0 16px rgba(27, 79, 138, 0.6)',
                  }}
                />

                {/* Floating label — AeroMesh Module */}
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '2%',
                    left: '22%',
                    background: '#1B4F8A',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  AeroMesh PNA Module
                </motion.div>

                {/* Floating label — AgX Zeolite Core */}
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '12%',
                    right: '5%',
                    background: '#2E7D32',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  AgX Zeolite Core
                </motion.div>

                {/* Floating label — ESP32 IoT */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '22%',
                    left: '5%',
                    background: '#6A1B9A',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  ESP32 IoT Node
                </motion.div>

                {/* NOₓ particle stream entering the bus (left side) */}
                {[0,1,2,3,4].map(i => (
                  <motion.div key={i}
                    style={{
                      position: 'absolute',
                      left: '-20px',
                      top: `${30 + i * 8}%`,
                      width: 8, height: 8,
                      borderRadius: '50%',
                      background: ['#FF6B35','#FF8C42','#E64A19'][i % 3],
                      opacity: 0.8,
                    }}
                    animate={{ x: [0, 60], opacity: [0.8, 0] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.28, ease: 'easeIn' }}
                  />
                ))}

                {/* Clean air particles exiting the bus (right side) */}
                {[0,1,2,3].map(i => (
                  <motion.div key={i}
                    style={{
                      position: 'absolute',
                      right: '-20px',
                      top: `${32 + i * 9}%`,
                      width: 7, height: 7,
                      borderRadius: '50%',
                      background: ['#43A047','#66BB6A','#81C784'][i % 3],
                      opacity: 0.7,
                    }}
                    animate={{ x: [0, 40], opacity: [0, 0.7, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.35, ease: 'easeOut' }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (min-width: 992px) {
          .hero-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
