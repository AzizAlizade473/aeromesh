import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';

const NODES = [
  { angle: -90,  icon: '🚌', label: 'Bus on Route' },
  { angle:   0,  icon: '🧲', label: 'Filter Captures NOₓ' },
  { angle:  72,  icon: '⚠️', label: 'Saturation Hits 90%' },
  { angle: 144,  icon: '🏭', label: 'Return to Depot' },
  { angle: 216,  icon: '🔥', label: 'Thermal Desorption (150°C)' },
];

const R_ICON  = 130;
const R_LABEL = 195;
const CX = 200;
const CY = 200;

export default function RegenerationCycle() {
  const [ref, inView] = useInView(0.3);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % NODES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [inView]);

  return (
    <section id="regeneration-cycle" ref={ref} style={{ padding: '100px 20px', background: 'var(--bg-elevated)' }}>
      <div className="section-container" style={{ textAlign: 'center' }}>
        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 3.5vw, 36px)', color: 'var(--text-primary)', marginBottom: '50px', fontWeight: 700 }}>
          The Regeneration Cycle
        </motion.h2>

        <div style={{ margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', maxWidth: 420 }}>
          <svg viewBox="0 0 400 400" width="100%" height="100%" style={{ overflow: 'visible' }}>
            {/* Dashed connecting circle path */}
            <circle cx={CX} cy={CY} r={R_ICON} fill="none" stroke="#CBD5E1" strokeWidth={1.5} strokeDasharray="6 4" />
            
            {/* Animated dot traveling along the dashed circle */}
            <circle r={5} fill="#1B4F8A">
              <animateMotion dur="6s" repeatCount="indefinite" path="M 200,70 A 130,130 0 1,1 199.9,70" />
            </circle>

            {/* Central Hub */}
            <circle cx={CX} cy={CY} r={65} fill="#1B4F8A" />
            <text x={CX} y={CY - 5} textAnchor="middle" fill="white" fontFamily="var(--font-mono)" fontSize="14" fontWeight="700">AgX Zeolite</text>
            <text x={CX} y={CY + 15} textAnchor="middle" fill="white" fontFamily="var(--font-mono)" fontSize="14" fontWeight="700">Core</text>

            {/* Outer Nodes */}
            {NODES.map(({ angle, icon, label }, i) => {
              const rad = (angle * Math.PI) / 180;
              const iconX  = CX + R_ICON  * Math.cos(rad);
              const iconY  = CY + R_ICON  * Math.sin(rad);
              const labelX = CX + R_LABEL * Math.cos(rad);
              const labelY = CY + R_LABEL * Math.sin(rad);
              const isActive = i === activeIndex;
              const isPast = i <= activeIndex;
              
              const words = label.split(' ');
              const mid = Math.ceil(words.length / 2);
              const line1 = words.slice(0, mid).join(' ');
              const line2 = words.slice(mid).join(' ');

              return (
                <g key={label} style={{ transition: 'opacity 0.4s', opacity: isActive || isPast ? 1 : 0.5 }}>
                  <circle cx={iconX} cy={iconY} r={28} fill={isActive ? 'var(--primary)' : isPast ? 'var(--primary-pale)' : 'white'} stroke={isActive || isPast ? 'var(--primary)' : '#D1D9E6'} strokeWidth={2} style={{ transition: 'all 0.4s' }} />
                  <text x={iconX} y={iconY + 6} textAnchor="middle" fontSize={24} style={{ transition: 'all 0.4s' }}>{icon}</text>
                  <text
                    x={labelX} y={labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={11}
                    fontFamily="Inter, sans-serif"
                    fill={isActive ? 'var(--primary)' : '#4A5568'}
                    fontWeight={isActive ? 700 : 500}
                    style={{ transition: 'all 0.4s' }}
                  >
                    {label.includes(' ') ? (
                      <>
                        <tspan x={labelX} dy="-0.6em">{line1}</tspan>
                        <tspan x={labelX} dy="1.3em">{line2}</tspan>
                      </>
                    ) : label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }}
          style={{ marginTop: '0px', maxWidth: '600px', margin: '40px auto 0', color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Filters don't end up in landfills. When a module hits 90% saturation, it is swapped at the designated AYNA depot. The saturated module is heated to 150°C to release harmless nitrogen gas, completely restoring its capacity.
        </motion.p>
      </div>
    </section>
  );
}
