import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';
import { SDG_DATA as sdgData } from '../data/sdgData';

const TRANSITION = { duration: 0.6, ease: 'easeOut' };
const SDG_COLORS = { 3: '#4C9F38', 9: '#F36D25', 11: '#F99D26', 13: '#3F7E44' };

const SDG_IMAGES = {
  3:  '/sdg/sdg3.png',
  9:  '/sdg/sdg9.png',
  11: '/sdg/sdg11.png',
  13: '/sdg/sdg13.png',
};

const SDG_CONNECTIONS = {
  3: 'Direct street-level NOₓ reduction at pedestrian breathing height. Every bus active near a school or hospital actively reduces respiratory disease triggers.',
  9: 'Introduces TRL-4 advanced materials science (ion-exchanged zeolites) to municipal transit — the first application of industrial exhaust-aftertreatment chemistry to ambient urban air.',
  11: 'Real-time GPS telemetry and sensor data gives Baku city planners dynamic pollution corridor maps — enabling evidence-based fleet routing decisions.',
  13: 'Bridge technology for the 15–20 year fleet electrification transition. AeroMesh cleans the air today while EVs are being procured.',
};

export default function SDGSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="sdg" ref={ref} style={{ padding: '100px 20px 80px', background: 'var(--bg-surface)' }}>
      <div className="section-container">
        {/* WUF13 Callout */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={TRANSITION}
          style={{ padding: '30px', marginBottom: '50px', borderRadius: 'var(--radius-md)', border: '2px solid var(--primary)', background: 'var(--primary-pale)', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 28px)', color: 'var(--primary)', marginBottom: '16px', fontWeight: 700 }}>WUF13 · BAKU 2026</div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7, fontSize: '1rem' }}>
            AeroMesh is engineered for WUF13's theme — transforming existing urban infrastructure into resilient, sustainable networks.
          </p>
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 0.2 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 32px)', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '50px', fontWeight: 700 }}>
          Aligned with Global Goals
        </motion.h2>

        <div className="sdg-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {sdgData.map((sdg, i) => {
            const color = SDG_COLORS[sdg.number] || '#1B4F8A';
            return (
              <motion.div key={sdg.number} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -4 }}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.3s, transform 0.3s' }}>
                <div style={{ height: '4px', background: color }} />
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                    <img src={SDG_IMAGES[sdg.number]} alt={`SDG ${sdg.number}`} onError={(e) => { e.target.style.display = 'none' }}
                      style={{ width: 90, height: 90, borderRadius: 8, objectFit: 'contain' }} />
                    <div>
                      <div style={{ fontSize: '0.75rem', color, fontWeight: 700, letterSpacing: '0.05em' }}>SDG {sdg.number}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{sdg.title}</div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{SDG_CONNECTIONS[sdg.number] || sdg.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
