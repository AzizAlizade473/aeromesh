import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useInView from '../hooks/useInView';
import { RESEARCH_PAPERS as researchPapers } from '../data/researchPapers';

export default function ResearchCards() {
  const [ref, inView] = useInView(0.1);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef(null);

  const scrollToCard = (idx) => {
    setActiveIdx(idx);
    if (scrollRef.current) scrollRef.current.scrollTo({ left: idx * 356, behavior: 'smooth' });
  };
  const handleScroll = () => {
    if (scrollRef.current) setActiveIdx(Math.round(scrollRef.current.scrollLeft / 356));
  };

  return (
    <section id="science" ref={ref} style={{ minHeight: '80vh', padding: '100px 20px 80px', background: 'var(--bg-elevated)' }}>
      <div className="section-container">
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 3vw, 28px)', color: 'var(--text-primary)', textAlign: 'center', marginBottom: '12px', fontWeight: 700 }}>
          Built on Peer-Reviewed Science
        </motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
          style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Every technical claim is backed by published research
        </motion.p>

        <div style={{ position: 'relative' }}>
          <button onClick={() => scrollToCard(Math.max(0, activeIdx - 1))} className="scroll-arrow scroll-arrow-left" aria-label="Previous">←</button>
          <button onClick={() => scrollToCard(Math.min(researchPapers.length - 1, activeIdx + 1))} className="scroll-arrow scroll-arrow-right" aria-label="Next">→</button>

          <div ref={scrollRef} onScroll={handleScroll} style={{ display: 'flex', gap: '16px', overflowX: 'auto', scrollSnapType: 'x mandatory', padding: '10px 0 20px', scrollbarWidth: 'none' }}>
            {researchPapers.map((paper, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                style={{
                  minWidth: '340px', maxWidth: '340px', minHeight: '280px', scrollSnapAlign: 'start', flexShrink: 0,
                  background: 'var(--bg-surface)', border: '1px solid var(--border)', borderLeft: `3px solid ${paper.doi ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', padding: '24px',
                  display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow-sm)',
                }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ padding: '3px 10px', background: 'var(--primary)', color: 'white', borderRadius: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700 }}>{paper.year}</span>
                </div>
                <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px' }}>{paper.journal}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{paper.authors}</div>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.9rem', lineHeight: 1.5, flex: 1 }}>{paper.finding}</p>
                {paper.doi && (
                  <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: '12px', padding: '8px 16px', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--primary)', textDecoration: 'none', textAlign: 'center', fontWeight: 600 }}>
                    Read Paper →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
          {researchPapers.map((_, i) => (
            <div key={i} onClick={() => scrollToCard(i)} style={{ width: activeIdx === i ? '20px' : '8px', height: '8px', borderRadius: '4px', background: activeIdx === i ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>
      <style>{`
        .scroll-arrow { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; width: 40px; height: 40px; border-radius: 50%; background: var(--bg-surface); border: 1px solid var(--border); color: var(--primary); font-size: 1.2rem; cursor: pointer; display: none; align-items: center; justify-content: center; box-shadow: var(--shadow-sm); }
        .scroll-arrow-left { left: -20px; }
        .scroll-arrow-right { right: -20px; }
        @media (min-width: 992px) { .scroll-arrow { display: flex; } }
      `}</style>
    </section>
  );
}
