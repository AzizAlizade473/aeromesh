import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import useInView from '../hooks/useInView';
import useCountUp from '../hooks/useCountUp';

const TRANSITION = { duration: 0.6, ease: 'easeOut' };
const OPEX_DATA = [
  { name: 'Energy', value: 1, color: '#1B4F8A' },
  { name: 'Consumables', value: 5, color: '#E65100' },
  { name: 'IT Infrastructure', value: 2, color: '#2E7D32' },
];

export default function BusinessCase() {
  const [ref, inView] = useInView(0.1);
  const capex = useCountUp(inView ? 160000 : 0, 2500);
  const opex = useCountUp(inView ? 6400 : 0, 2500);
  const eff = useCountUp(inView ? 82 : 0, 2000);

  const COMPARISON = [
    { metric: 'Unit Cost', aero: '200 AZN', tower: '100,000 AZN' },
    { metric: 'Coverage', aero: 'Mobile, city-wide', tower: 'Single intersection' },
    { metric: 'Fleet Retrofit (800 buses)', aero: '160,000 AZN', tower: '80,000,000 AZN' },
    { metric: 'Monthly OPEX/unit', aero: '8 AZN', tower: '~500 AZN' },
    { metric: 'Works in traffic jams', aero: '✅', tower: '❌', isCheck: true },
    { metric: 'Works at night / rain', aero: '✅', tower: '❌ UV-dependent', isCheck: true },
    { metric: 'Real-time telemetry', aero: '✅ GPS + sensors', tower: '❌', isCheck: true },
  ];

  return (
    <section id="business" ref={ref} style={{ minHeight: '100vh', padding: '100px 20px 80px', background: 'var(--bg-elevated)' }}>
      <div className="section-container">
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={TRANSITION}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3vw, 36px)', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '50px', fontWeight: 700 }}>
          The Economics of Clean Air
        </motion.h2>

        <div className="biz-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem', marginBottom: '50px' }}>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '12px', padding: '10px 18px', marginBottom: '4px' }}>
              <span></span><span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>AeroMesh PNA</span><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stationary Smog Tower</span>
            </div>
            {COMPARISON.map((row, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: i * 0.06 }}
                style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '12px', padding: '14px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', marginBottom: '6px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{row.metric}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>{row.aero}</span>
                <span style={{ fontSize: '0.8rem', color: row.isCheck ? 'var(--status-critical)' : 'var(--text-muted)' }}>{row.tower}</span>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ ...TRANSITION, delay: 0.5 }}>
            <svg viewBox="0 0 300 300" width="100%" style={{ maxWidth: '320px', margin: '0 auto', display: 'block' }}>
              <circle cx="150" cy="150" r="140" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="8 4" />
              <text x="150" y="30" textAnchor="middle" fill="var(--text-muted)" fontSize="10" fontFamily="var(--font-display)" fontWeight="600">500× MORE COST-EFFECTIVE</text>
              <circle cx="150" cy="150" r="90" fill="none" stroke="var(--status-warn)" strokeWidth="2" />
              <text x="150" y="80" textAnchor="middle" fill="var(--status-warn)" fontSize="11" fontFamily="var(--font-mono)">vs 100,000 AZN</text>
              <circle cx="150" cy="150" r="45" fill="var(--primary-pale)" stroke="var(--primary)" strokeWidth="2" />
              <text x="150" y="148" textAnchor="middle" fill="var(--primary)" fontSize="16" fontFamily="var(--font-display)" fontWeight="700">200 AZN</text>
              <text x="150" y="165" textAnchor="middle" fill="var(--text-muted)" fontSize="9" fontFamily="var(--font-mono)">per bus</text>
            </svg>
            <div style={{ position: 'relative', marginTop: '20px' }}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart><Pie data={OPEX_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">{OPEX_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}</Pie></PieChart>
              </ResponsiveContainer>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.1rem', color: 'var(--primary)', fontWeight: 700 }}>8 AZN</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>/ bus / month</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
              {OPEX_DATA.map((d, i) => <span key={i} style={{ fontSize: '0.65rem', color: d.color, fontWeight: 500 }}>● {d.name} {d.value} AZN</span>)}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 0.8 }}
          style={{ padding: '24px 28px', background: 'var(--bg-surface)', borderLeft: '4px solid var(--primary)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', marginBottom: '50px', border: '1px solid var(--border)', borderLeftWidth: '4px', borderLeftColor: 'var(--primary)' }}>
          <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
            "Even 100% EV fleets don't solve existing pollution. Tire and brake wear still emits PM2.5. The 15-year fleet transition leaves millions of old combustion vehicles on the road today. AeroMesh cleans the air for everyone."
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {[
            { val: capex, label: '800 buses × 200 AZN', suffix: ' AZN total CAPEX', note: '(less than 2 stationary towers)' },
            { val: opex, label: '800 buses × 8 AZN/mo', suffix: ' AZN/month total OPEX', note: '' },
            { val: eff, label: 'Average NOₓ capture', suffix: '% efficiency', note: '(upstream → downstream)' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: 1 + i * 0.15 }}
              style={{ padding: '20px', textAlign: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2rem', color: 'var(--primary)', fontWeight: 700 }}>{item.val.toLocaleString()}<span style={{ fontSize: '0.9rem' }}>{item.suffix}</span></div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>{item.label} {item.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
      <style>{`@media (min-width: 992px) { .biz-grid { grid-template-columns: 1.2fr 1fr !important; } }`}</style>
    </section>
  );
}
