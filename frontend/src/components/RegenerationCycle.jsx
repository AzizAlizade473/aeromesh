import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useInView from '../hooks/useInView'

const NODES = [
  { angle: -90,  icon: '🚌', label: 'Bus on Route',            color: '#1B4F8A' },
  { angle:  -18, icon: '🧲', label: 'Filter Captures NOₓ',     color: '#43A047' },
  { angle:   54, icon: '⚠️', label: 'Saturation 90%',          color: '#E65100' },
  { angle:  126, icon: '🏭', label: 'Return to Depot',          color: '#455A64' },
  { angle:  198, icon: '🔥', label: 'Thermal Desorption 200°C', color: '#C62828' },
]

const R     = 130   // radius for nodes
const CX    = 210   // SVG center X
const CY    = 210   // SVG center Y
const SIZE  = 420   // SVG viewBox size

function polarToXY(angleDeg, radius) {
  const rad = (angleDeg * Math.PI) / 180
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) }
}

export default function RegenerationCycle() {
  const [ref, inView] = useInView(0.2)
  const [active, setActive] = useState(0)

  // Smooth auto-advance — one node at a time, every 1.5 seconds
  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => {
      setActive(a => (a + 1) % NODES.length)
    }, 1500)
    return () => clearInterval(id)
  }, [inView])

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        style={{ maxWidth: 420, display: 'block' }}
      >
        {/* ── Dashed circle path ── */}
        <circle
          cx={CX} cy={CY} r={R}
          fill="none"
          stroke="var(--border)"
          strokeWidth={1.5}
          strokeDasharray="6 4"
        />

        {/* ── Animated traveling dot along the circle ── */}
        {inView && (
          <circle r={5} fill="var(--primary)" opacity={0.85}>
            <animateMotion
              dur="7.5s"
              repeatCount="indefinite"
              path={`M ${CX} ${CY - R} A ${R} ${R} 0 1 1 ${CX - 0.001} ${CY - R}`}
            />
          </circle>
        )}

        {/* ── Center circle ── */}
        <circle cx={CX} cy={CY} r={62} fill="var(--primary)" />
        <text x={CX} y={CY - 10} textAnchor="middle" fontSize={11} fill="white" fontWeight={800} fontFamily="Inter, sans-serif">AgX</text>
        <text x={CX} y={CY + 5}  textAnchor="middle" fontSize={11} fill="white" fontWeight={800} fontFamily="Inter, sans-serif">Zeolite</text>
        <text x={CX} y={CY + 20} textAnchor="middle" fontSize={11} fill="white" fontWeight={800} fontFamily="Inter, sans-serif">Core</text>

        {/* ── Nodes ── */}
        {NODES.map((node, i) => {
          const nodePos  = polarToXY(node.angle, R)
          // Label sits at R + 52px from center, same angle
          const labelPos = polarToXY(node.angle, R + 58)
          const isActive = active === i

          return (
            <g key={i} onClick={() => setActive(i)} style={{ cursor: 'pointer' }}>
              {/* Active ring — smooth scale transition only, no jagged ping */}
              {isActive && (
                <motion.circle
                  cx={nodePos.x} cy={nodePos.y} r={28}
                  fill="none"
                  stroke={node.color}
                  strokeWidth={2}
                  initial={{ r: 22, opacity: 0.8 }}
                  animate={{ r: 32, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                />
              )}

              {/* Node circle */}
              <motion.circle
                cx={nodePos.x} cy={nodePos.y} r={22}
                fill={isActive ? node.color : 'white'}
                stroke={node.color}
                strokeWidth={isActive ? 0 : 1.5}
                animate={{ r: isActive ? 24 : 22 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />

              {/* Icon */}
              <text
                x={nodePos.x} y={nodePos.y + 6}
                textAnchor="middle"
                fontSize={16}
                style={{ userSelect: 'none' }}
              >
                {node.icon}
              </text>

              {/* Label — split into max 2 lines, always outside the circle */}
              {node.label.split(' ').length <= 2 ? (
                <text
                  x={labelPos.x} y={labelPos.y + 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fontFamily="Inter, sans-serif"
                  fontWeight={isActive ? 700 : 500}
                  fill={isActive ? node.color : 'var(--text-secondary)'}
                >
                  {node.label}
                </text>
              ) : (
                <>
                  <text
                    x={labelPos.x}
                    y={labelPos.y - 6}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily="Inter, sans-serif"
                    fontWeight={isActive ? 700 : 500}
                    fill={isActive ? node.color : 'var(--text-secondary)'}
                  >
                    {node.label.split(' ').slice(0, 2).join(' ')}
                  </text>
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 8}
                    textAnchor="middle"
                    fontSize={10}
                    fontFamily="Inter, sans-serif"
                    fontWeight={isActive ? 700 : 500}
                    fill={isActive ? node.color : 'var(--text-secondary)'}
                  >
                    {node.label.split(' ').slice(2).join(' ')}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
