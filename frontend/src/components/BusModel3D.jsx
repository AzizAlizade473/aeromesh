// src/components/BusModel3D.jsx
import { useEffect, useRef } from 'react'

export default function BusModel3D({ color = '#1B4F8A', size = 1 }) {
  const W = 100 * size   // bus width
  const H = 42  * size   // bus height
  const D = 42  * size   // bus depth

  const face = (transform, bg, children, opacity = 1) => (
    <div style={{
      position:'absolute',
      width: W, height: H,
      background: bg,
      border: '1px solid rgba(0,0,0,0.18)',
      transform,
      backfaceVisibility:'hidden',
      display:'flex', alignItems:'center', justifyContent:'center',
      opacity,
      overflow:'hidden',
    }}>
      {children}
    </div>
  )

  const Windows = ({ count = 4 }) => (
    <div style={{ display:'flex', gap: 4 * size, padding: `${4*size}px ${6*size}px` }}>
      {Array.from({length: count}).map((_, i) => (
        <div key={i} style={{
          width: 12 * size, height: 10 * size,
          background:'rgba(200,230,255,0.85)',
          borderRadius: 2 * size,
          border:'1px solid rgba(255,255,255,0.6)',
        }} />
      ))}
    </div>
  )

  const AeroMeshModule = () => (
    <div style={{
      position:'absolute', top: -10 * size, left: 10 * size,
      right: 10 * size, height: 9 * size,
      background:'#0D47A1',
      border:'1px solid rgba(255,255,255,0.3)',
      borderRadius: `${2*size}px ${2*size}px 0 0`,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <span style={{
        fontSize: 5 * size, color:'white', fontWeight:700,
        letterSpacing: 0.5, fontFamily:'monospace',
      }}>AEROMESH</span>
    </div>
  )

  return (
    <div style={{ perspective: 350 * size, width: W, height: H + 20 * size, margin:'0 auto' }}>
      <div style={{
        position:'relative',
        width: W, height: H,
        transformStyle:'preserve-3d',
        animation:'bus-rotate-3d 4s linear infinite',
        marginTop: 10 * size,
      }}>

        {/* Front */}
        {face(`translateZ(${D/2}px)`, color,
          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'space-around', padding:`${4*size}px` }}>
            <div style={{ display:'flex', gap: 4*size }}>
              <div style={{ width:14*size, height:10*size, background:'rgba(200,230,255,0.8)', borderRadius:2*size, border:'1px solid rgba(255,255,255,0.5)' }} />
              <div style={{ width:14*size, height:10*size, background:'rgba(200,230,255,0.8)', borderRadius:2*size, border:'1px solid rgba(255,255,255,0.5)' }} />
            </div>
            <div style={{ width:10*size, height:10*size, background:'#FDD835', borderRadius:'50%', border:'2px solid #F9A825' }} />
          </div>
        )}

        {/* Back */}
        {face(`rotateY(180deg) translateZ(${D/2}px)`, `color-mix(in srgb, ${color} 80%, black)`,
          <div style={{ display:'flex', gap: 4*size, padding:`${4*size}px` }}>
            <div style={{ width:10*size, height:10*size, background:'#EF5350', borderRadius:2*size }} />
            <div style={{ width:10*size, height:10*size, background:'#EF5350', borderRadius:2*size }} />
          </div>
        , 0.85)}

        {/* Right side */}
        {face(`rotateY(90deg) translateZ(${W/2}px)`, `color-mix(in srgb, ${color} 90%, black)`,
          <div style={{ position:'relative', width:'100%', height:'100%' }}>
            <Windows count={3} />
            <AeroMeshModule />
          </div>
        , 0.9)}

        {/* Left side */}
        {face(`rotateY(-90deg) translateZ(${W/2}px)`, `color-mix(in srgb, ${color} 90%, black)`,
          <div style={{ position:'relative', width:'100%', height:'100%' }}>
            <Windows count={3} />
            <AeroMeshModule />
          </div>
        , 0.9)}

        {/* Top — AeroMesh roof */}
        <div style={{
          position:'absolute',
          width: W, height: D,
          background:'#0D47A1',
          border:'1px solid rgba(255,255,255,0.2)',
          transform:`rotateX(90deg) translateZ(${H/2}px)`,
          backfaceVisibility:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <span style={{ fontSize:6*size, color:'white', fontWeight:700, letterSpacing:1, fontFamily:'monospace' }}>
            PNA MODULE
          </span>
        </div>

        {/* Bottom */}
        {face(`rotateX(-90deg) translateZ(${H/2}px)`, '#1a1a2e', null, 0.6)}

      </div>
    </div>
  )
}
