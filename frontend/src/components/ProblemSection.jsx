import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';

const TRANSITION = { duration: 0.6, ease: 'easeOut' };

export default function ProblemSection() {
  const [ref, inView] = useInView(0.2);

  return (
    <section id="problem" ref={ref} style={{ minHeight: '100vh', padding: '100px 20px', background: 'var(--bg-surface)' }}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={TRANSITION} style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 36px)', color: 'var(--text-primary)', fontWeight: 700 }}>
            Urban Air Quality Crisis in Baku
          </h2>
        </motion.div>

        <div className="problem-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '60px' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 0.2 }} whileHover={{ y: -4 }}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '12px', fontWeight: 700 }}>Trapped Pollution</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Buildings create "street canyon" effects trapping NOₓ at pedestrian breathing level.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 0.4 }} whileHover={{ y: -4 }}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '12px', fontWeight: 700 }}>Paint Doesn't Work</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px', fontSize: '0.95rem' }}>At 40 km/h, air contacts TiO₂ paint for only milliseconds — the photocatalytic reaction cannot physically occur.</p>
            <div>
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}><span>Contact time needed</span><span>3000ms</span></div>
                <div style={{ width: '100%', height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: '0%' }} animate={inView ? { width: '100%' } : {}} transition={{ duration: 1.5, delay: 0.8 }} style={{ height: '100%', background: 'var(--accent)' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}><span>Actual contact at 40km/h</span><span style={{ color: 'var(--status-critical)' }}>2ms</span></div>
                <div style={{ width: '100%', height: '4px', background: 'var(--bg-elevated)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div initial={{ width: '0%' }} animate={inView ? { width: '0.5%' } : {}} transition={{ duration: 0.5, delay: 1 }} style={{ height: '100%', background: 'var(--status-critical)' }} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 0.6 }} whileHover={{ y: -4 }}
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '30px', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '12px', fontWeight: 700 }}><span style={{ color: 'var(--status-warn)' }}>100,000 AZN</span> / Intersection</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>Stationary smog towers clean only one point. Baku has thousands of intersections.</p>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ ...TRANSITION, delay: 1 }} style={{ textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 2.5vw, 22px)', color: 'var(--text-primary)', marginBottom: '30px', fontWeight: 700 }}>
            THE PARADIGM SHIFT: Chemical Destruction → Instant Physical Adsorption
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ background: '#FFEBEE', border: '1px solid #EF9A9A', padding: '12px 24px', borderRadius: '30px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--status-critical)', marginRight: '8px' }}>❌</span>TiO₂ Paint — slow · light-dependent · ms contact
            </div>
            <div style={{ background: '#E8F5E9', border: '1px solid #A5D6A7', padding: '12px 24px', borderRadius: '30px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
              <span style={{ color: 'var(--status-ok)', marginRight: '8px' }}>✅</span>AgX Zeolite PNA — instant · weather-independent · direct adsorption
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
