import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useFleetData from '../hooks/useFleetData';
import useInView from '../hooks/useInView';
import BakuMap from './BakuMap';
import SensorCharts from './SensorCharts';
import FleetAlertLog from './FleetAlertLog';

export default function Dashboard() {
  const [ref, inView] = useInView(0.05);
  const { fleet } = useFleetData();
  const [clock, setClock] = useState('');

  useEffect(() => {
    const tick = () => setClock(new Date().toTimeString().slice(0, 8));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = fleet?.active_count ?? 0;
  const regenCount = fleet?.regen_count ?? 0;
  const criticalCount = fleet?.critical_count ?? 0;
  const hasCritical = criticalCount > 0;

  return (
    <section id="dashboard" ref={ref} style={{ minHeight: '100vh', padding: '100px 20px 60px', background: 'var(--bg-dark)', color: 'var(--text-on-dark)' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
        style={{
          position: 'sticky', top: '60px', zIndex: 100,
          background: 'var(--bg-dark-surface)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-md)', padding: '12px 20px', marginBottom: '24px',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
          maxWidth: '1200px', margin: '0 auto 24px',
        }}>
        <span style={{ fontSize: '11px', color: 'var(--text-on-dark-muted)', letterSpacing: '0.08em', fontWeight: 600 }}>AeroMesh Fleet Intelligence — AYNA</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'white', fontWeight: 700 }}>{clock}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px',
            background: hasCritical ? 'rgba(198,40,40,0.15)' : 'rgba(46,125,50,0.15)',
            border: `1px solid ${hasCritical ? '#C62828' : '#2E7D32'}`,
            fontSize: '0.7rem', color: hasCritical ? '#EF9A9A' : '#A5D6A7', fontWeight: 600,
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: hasCritical ? '#C62828' : '#4ADE80', animation: 'blink 1.5s infinite' }} />
            {hasCritical ? '⚠ ATTENTION REQUIRED' : '● System Nominal'}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)' }}>
            <span style={{ color: '#4ADE80' }}>{activeCount}</span> Active | <span style={{ color: '#90CAF9' }}>{regenCount}</span> Regen | <span style={{ color: '#EF9A9A' }}>{criticalCount}</span> Critical
          </span>
        </div>
      </motion.div>
      <div className="section-container">
        <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          <div className="dashboard-top" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
            <div style={{ overflow: 'hidden', borderRadius: 'var(--radius-md)', minHeight: '400px', border: '1px solid rgba(255,255,255,0.1)' }}><BakuMap /></div>
            <div><SensorCharts /></div>
          </div>
          <FleetAlertLog />
        </div>
      </div>
      <style>{`@media (min-width: 992px) { .dashboard-top { grid-template-columns: 60% 40% !important; } }`}</style>
    </section>
  );
}
