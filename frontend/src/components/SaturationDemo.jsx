import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SaturationDemo() {
  const [upstream, setUpstream] = useState(145);
  const [downstream, setDownstream] = useState(22);
  const [filterPct, setFilterPct] = useState(0);
  const [exposure, setExposure] = useState(150);
  const [isAlarming, setIsAlarming] = useState(false);
  const [regenMsg, setRegenMsg] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const noise = (Math.random() - 0.5) * 20;
      setUpstream(Math.max(10, exposure + noise));
      setDownstream(Math.max(2, exposure * 0.15 + (Math.random() - 0.5) * 8));
      setFilterPct((prev) => {
        const rate = 0.05 + (exposure / 500) * 0.45;
        const next = Math.min(100, prev + rate);
        if (next >= 90) setIsAlarming(true);
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [exposure]);

  const handleRegen = useCallback(() => {
    setFilterPct(0);
    setIsAlarming(false);
    setRegenMsg('REGENERATION COMPLETE ✓');
    setTimeout(() => setRegenMsg(''), 2000);
  }, []);

  const barColor = filterPct > 90 ? 'var(--status-critical)' : filterPct > 70 ? 'var(--status-warn)' : 'var(--accent)';
  const satFormula = upstream > 0 ? ((downstream / upstream) * 100).toFixed(1) : '0';

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `2px solid ${isAlarming ? 'var(--status-critical)' : 'var(--border)'}`,
      borderRadius: 'var(--radius-md)', padding: '24px',
      animation: isAlarming ? 'alarm-flash 0.8s infinite' : 'none',
      transition: 'border-color 0.3s', position: 'relative', boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '20px', letterSpacing: '0.1em', fontWeight: 700 }}>
        SATURATION DEMO WIDGET
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ padding: '12px', textAlign: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px' }}>UPSTREAM</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: 'var(--status-critical)' }}>{upstream.toFixed(1)}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>µg/m³</div>
        </div>
        <div style={{ padding: '12px', textAlign: 'center', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '4px' }}>DOWNSTREAM</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', color: 'var(--accent)' }}>{downstream.toFixed(1)}</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>µg/m³</div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>FILTER CAPACITY</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: barColor, fontWeight: 700 }}>{filterPct.toFixed(1)}%</span>
        </div>
        <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${filterPct}%`, background: barColor, transition: 'width 0.3s, background 0.3s' }} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px' }}>SIMULATE NOₓ EXPOSURE LEVEL</div>
        <input type="range" min="0" max="500" value={exposure} onChange={(e) => setExposure(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
          <span>0</span><span>{exposure} µg/m³</span><span>500</span>
        </div>
      </div>

      <motion.button onClick={handleRegen} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        style={{ width: '100%', padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
        ⚡ REGENERATE NOW
      </motion.button>

      {regenMsg && <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent)', marginTop: '10px' }}>{regenMsg}</div>}

      <AnimatePresence>
        {isAlarming && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(198, 40, 40, 0.95)', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center', zIndex: 10 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#fff', marginBottom: '12px' }}>⚠ DEPOT ALERT TRIGGERED</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', marginBottom: '8px' }}>Filter capacity: {filterPct.toFixed(1)}%</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginBottom: '8px' }}>Saturation: ({downstream.toFixed(0)} / {upstream.toFixed(0)}) × 100 = {satFormula}%</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#4ADE80', marginBottom: '16px' }}>SMS to depot manager: SENT ✓</div>
            <motion.button onClick={handleRegen} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ padding: '10px 24px', background: '#fff', color: 'var(--status-critical)', border: 'none', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>REGENERATE</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes alarm-flash { 0%, 100% { border-color: var(--status-critical); } 50% { border-color: var(--border); } }`}</style>
    </div>
  );
}
