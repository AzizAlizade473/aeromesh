import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useInView from '../hooks/useInView'

const NODES = [
  { angle: -90, icon: '🚌', label: 'Bus on Route',            color: '#1B4F8A' },
  { angle: -18, icon: '🧲', label: 'Filter Captures NOₓ',     color: '#43A047' },
  { angle:  54, icon: '⚠️', label: 'Saturation 90%',          color: '#E65100' },
  { angle: 126, icon: '🏭', label: 'Return to Depot',          color: '#455A64' },
  { angle: 198, icon: '🔥', label: 'Thermal Desorption 200°C', color: '#C62828' },
]

const R = 130, CX = 210, CY = 210, SIZE = 420

const toXY = (deg, r) => ({
  x: CX + r * Math.cos(deg * Math.PI / 180),
  y: CY + r * Math.sin(deg * Math.PI / 180),
})

export default function RegenerationCycle() {
  const [ref, inView] = useInView(0.2)
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => setActive(a => (a + 1) % 5), 1500)
    return () => clearInterval(id)
  }, [inView])

  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'center' }}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width="100%" style={{ maxWidth: 400 }}>

        {/* Dashed ring */}
        <circle cx={CX} cy={CY} r={R} fill="none"
          stroke="var(--border)" strokeWidth={1.5} strokeDasharray="6 4" />

        {/* Traveling dot */}
        {inView && (
          <circle r={5} fill="var(--primary)" opacity={0.8}>
            <animateMotion dur="7.5s" repeatCount="indefinite"
              path={`M ${CX} ${CY-R} A ${R} ${R} 0 1 1 ${CX-0.001} ${CY-R}`} />
          </circle>
        )}

        {/* Center */}
        <circle cx={CX} cy={CY} r={60} fill="var(--primary)" />
        {['AgX', 'Zeolite', 'Core'].map((t, i) => (
          <text key={t} x={CX} y={CY - 8 + i * 15} textAnchor="middle"
            fontSize={11} fill="white" fontWeight={800} fontFamily="Inter, sans-serif">{t}</text>
        ))}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const n = toXY(node.angle, R)
          const l = toXY(node.angle, R + 60)
          const on = active === i
          const words = node.label.split(' ')
          const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ')
          const line2 = words.slice(Math.ceil(words.length / 2)).join(' ')

          return (
            <g key={i} onClick={() => setActive(i)} style={{ cursor: 'pointer' }}>
              {/* Smooth ripple — easeOut only, no jarring ping */}
              {on && (
                <motion.circle cx={n.x} cy={n.y} r={22} fill="none"
                  stroke={node.color} strokeWidth={1.5}
                  initial={{ r: 22, opacity: 0.7 }}
                  animate={{ r: 36, opacity: 0 }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                />
              )}

              {/* Node */}
              <motion.circle cx={n.x} cy={n.y}
                animate={{ r: on ? 24 : 21 }}
                fill={on ? node.color : 'white'}
                stroke={node.color} strokeWidth={on ? 0 : 1.5}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
              <text x={n.x} y={n.y + 6} textAnchor="middle" fontSize={15}>{node.icon}</text>

              {/* Label — always 2 clean lines, never overlapping */}
              <text x={l.x} y={l.y - 7} textAnchor="middle" fontSize={10}
                fontFamily="Inter, sans-serif"
                fontWeight={on ? 700 : 500}
                fill={on ? node.color : 'var(--text-secondary)'}>
                {line1}
              </text>
              {line2 && (
                <text x={l.x} y={l.y + 7} textAnchor="middle" fontSize={10}
                  fontFamily="Inter, sans-serif"
                  fontWeight={on ? 700 : 500}
                  fill={on ? node.color : 'var(--text-secondary)'}>
                  {line2}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
