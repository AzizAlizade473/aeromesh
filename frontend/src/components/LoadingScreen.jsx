import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_MESSAGES = [
  'CONNECTING TO BAKU SENSOR NETWORK',
  'LOADING FLEET DATA',
  'CALIBRATING NOₓ SENSORS',
  'SYSTEM READY',
];

export default function LoadingScreen({ onComplete }) {
  const [statusIndex, setStatusIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => setProgress(100), 100);

    const statusInterval = setInterval(() => {
      setStatusIndex(prev => Math.min(prev + 1, STATUS_MESSAGES.length - 1));
    }, 400);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => {
      clearInterval(statusInterval);
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'white',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L22 7.5V16.5L12 22L2 16.5V7.5L12 2Z"
                stroke="var(--primary)" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="var(--primary)" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--primary)',
              letterSpacing: '-0.02em',
            }}>
              AeroMesh
            </span>
          </div>

          <div style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
          }}>
            Loading system...
          </div>

          <div style={{
            width: '260px', height: '4px',
            background: 'var(--bg-elevated)',
            borderRadius: '2px', overflow: 'hidden',
            marginBottom: '1rem',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--primary)',
              transition: 'width 2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              borderRadius: '2px',
            }} />
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            color: statusIndex === STATUS_MESSAGES.length - 1 ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            {STATUS_MESSAGES[statusIndex]}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
