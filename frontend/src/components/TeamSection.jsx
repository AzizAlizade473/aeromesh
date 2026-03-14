import { useState } from 'react';
import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';

const TRANSITION = { duration: 0.6, ease: 'easeOut' };

const TEAM = [
  {
    name: 'Aziz Alizade',
    role: 'Full-Stack Developer · Presenter',
    photo: '/team/aziz.jpeg',
    quote: 'The system runs in simulation during the pitch. When the ESP32 connects, it just works — zero code changes.',
    initials: 'AA',
    color: '#1B4F8A'
  },
  {
    name: 'Ziyad Shiraliyev',
    role: 'Project Manager · Researcher',
    photo: '/team/ziyad.jpeg',
    quote: 'The chemistry is proven. AgX zeolites will work. We just need to field-validate at ambient concentrations.',
    initials: 'ZŞ',
    color: '#2E7D32'
  },
  {
    name: 'Muhammad Teymurlu',
    role: 'Full-Stack Developer',
    photo: '/team/muhammad.jpeg',
    quote: 'The heatmap doesn\'t just show pollution — it tells AYNA where to route buses tomorrow.',
    initials: 'MT',
    color: '#6A1B9A'
  },
  {
    name: 'Farid Valimammadov',
    role: 'Designer',
    photo: '/team/farid.jpeg',
    quote: 'Mounting on the roof with a Venturi intake was the key insight. Front grille mounting would starve the engine.',
    initials: 'FV',
    color: '#E65100'
  },
];

function Avatar({ member }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{ width:90, height:90, borderRadius:'50%', overflow:'hidden',
      border:`3px solid ${member.color}`, marginBottom:16, flexShrink:0,
      background: err ? member.color : 'var(--border)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      {!err ? (
        <img
          src={member.photo}
          alt={member.name}
          onError={() => setErr(true)}
          style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
        />
      ) : (
        <span style={{ color:'white', fontSize:'1.4rem', fontWeight:700 }}>{member.initials}</span>
      )}
    </div>
  );
}

export default function TeamSection() {
  const [ref, inView] = useInView(0.1);
  return (
    <section id="team" ref={ref} style={{ padding: '100px 20px 80px', background: 'var(--bg-elevated)' }}>
      <div className="section-container">
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={TRANSITION}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 3vw, 32px)', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '12px', fontWeight: 700 }}>
          The Team Behind AeroMesh
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ ...TRANSITION, delay: 0.1 }}
          style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '50px', maxWidth: 600, margin: '0 auto 50px', fontSize: '0.95rem' }}>
          Engineers, developers, and researchers united by one goal: Baku's air quality.
        </motion.p>
        <div className="team-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {TEAM.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ ...TRANSITION, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: 'var(--shadow-sm)', transition: 'box-shadow 0.3s, transform 0.3s' }}>
              <Avatar member={m} />
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{m.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600, marginBottom: 8, marginTop: 4 }}>{m.role}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.5, flex: 1 }}>"{m.quote}"</p>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 16 }}>WUF13 Hackathon 2026 · Baku, AZ</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
