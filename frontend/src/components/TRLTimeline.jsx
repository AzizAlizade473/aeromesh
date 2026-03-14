import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';
import SaturationDemo from './SaturationDemo';

const TRL_ITEMS = [
  { level: 1, status: 'done', label: 'Basic principles documented' },
  { level: 2, status: 'done', label: 'Technology concept formulated' },
  { level: 3, status: 'done', label: 'Analytical proof-of-concept' },
  { level: 4, status: 'current', label: 'Component validation — lab environment', desc: 'Hardware mockup built. IT saturation-detection logic operational. Fluid dynamic PVC pipe demo constructed. Chemical mass balances calculated.' },
  { level: 5, status: 'future', label: 'Validation in relevant environment (field AgX ambient testing)' },
  { level: 6, status: 'future', label: 'Prototype demo in Baku traffic conditions' },
  { level: 7, status: 'future', label: 'Pilot: 10-bus AYNA fleet trial' },
  { level: 8, status: 'future', label: 'System complete and qualified' },
  { level: 9, status: 'future', label: 'Full fleet deployment — 800 AYNA buses' },
];

export default function TRLTimeline() {
  const [ref, inView] = useInView(0.1);

  return (
    <section id="trl-demo" ref={ref} style={{ padding: '100px 20px 80px', background: 'var(--bg-elevated)' }}>
      <div className="section-container">
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 32px)', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '60px', fontWeight: 700 }}>
          TECHNOLOGY <span style={{ color: 'var(--primary)' }}>READINESS</span>
        </motion.h2>

        <div className="trl-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
          <div style={{ position: 'relative', paddingLeft: '40px' }}>
            <svg style={{ position: 'absolute', left: '15px', top: 0, width: '2px', height: '100%', overflow: 'visible' }}>
              <motion.line x1="1" y1="0" x2="1" y2="100%" stroke="var(--primary)" strokeWidth="2"
                initial={{ pathLength: 0 }} animate={inView ? { pathLength: 1 } : {}} transition={{ duration: 1.5, ease: 'easeOut' }}
                strokeDasharray="1000" strokeDashoffset={inView ? 0 : 1000}
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
            </svg>

            {TRL_ITEMS.map((item, i) => {
              const isDone = item.status === 'done';
              const isCurrent = item.status === 'current';
              const nodeColor = isDone ? 'var(--accent)' : isCurrent ? 'var(--primary)' : 'var(--text-muted)';

              return (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{ position: 'relative', marginBottom: '20px', paddingLeft: '20px' }}>
                  <div style={{
                    position: 'absolute', left: '-32px', top: '4px',
                    width: isCurrent ? '22px' : '14px', height: isCurrent ? '22px' : '14px',
                    borderRadius: '50%', background: isDone || isCurrent ? nodeColor : 'transparent',
                    border: `2px solid ${nodeColor}`, animation: isCurrent ? 'blink 1.5s infinite' : 'none',
                    marginTop: isCurrent ? '-4px' : 0,
                  }} />

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: nodeColor, minWidth: '50px', fontWeight: 600 }}>TRL {item.level}</span>
                    {isCurrent && (
                      <span style={{ padding: '2px 10px', background: 'var(--primary-pale)', border: '1px solid var(--primary)', borderRadius: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600 }}>● CURRENT</span>
                    )}
                    <span className={`trl-item ${item.status}`} style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>{item.label}</span>
                  </div>
                  {item.desc && (
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.6, paddingLeft: '60px' }}>{item.desc}</p>
                  )}
                </motion.div>
              );
            })}
          </div>

          <SaturationDemo />
        </div>
      </div>
      <style>{`@media (min-width: 992px) { .trl-grid { grid-template-columns: 1fr 1fr !important; } }`}</style>
    </section>
  );
}
