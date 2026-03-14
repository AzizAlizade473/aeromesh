export default function Footer() {
  const scrollTo = (id) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 50);
  };

  const navLinks = {
    'how-it-works': 'How It Works',
    'dashboard':    'Dashboard',
    'science':      'Science',
    'business':     'Economics',
    'team':         'Team',
  };

  return (
    <footer style={{ padding: '60px 20px 20px', background: 'var(--bg-dark)', color: 'var(--text-on-dark)' }}>
      <div className="section-container">
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'white', marginBottom: '8px', fontWeight: 700 }}>AeroMesh</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-on-dark-muted)', marginBottom: '12px' }}>PNA — Active-Flow Passive NOₓ Adsorbing Membranes</div>
            <p style={{ fontStyle: 'italic', color: 'var(--text-on-dark-muted)', marginBottom: '16px', fontSize: '0.95rem' }}>
              "The city breathes. We help it breathe cleaner."
            </p>
            <span style={{ display: 'inline-block', padding: '4px 14px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '20px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
              TRL-4 VALIDATED
            </span>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', marginTop: '8px' }}>WUF13 Hackathon · Baku 2026</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', marginBottom: '16px', letterSpacing: '0.1em', fontWeight: 600 }}>NAVIGATE</div>
            {Object.entries(navLinks).map(([id, label]) => (
              <div key={id} onClick={() => scrollTo(id)} style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '8px', cursor: 'pointer' }}>{label}</div>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {[{ n: 3, c: '#4C9F38' }, { n: 9, c: '#F36D25' }, { n: 11, c: '#F99D26' }, { n: 13, c: '#3F7E44' }].map((s) => (
                <div key={s.n} style={{ width: '32px', height: '32px', borderRadius: '4px', background: s.c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', fontWeight: 700 }}>{s.n}</div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', marginBottom: '16px', letterSpacing: '0.1em', fontWeight: 600 }}>PROJECT INFO</div>
            {[
              { l: 'TARGET CLIENT', v: 'Baku Transport Agency (AYNA)' },
              { l: 'CATEGORY', v: 'Climate-Resilient & Green Urban Mobility' },
              { l: 'HARDWARE', v: 'ESP32 + AgX Zeolite + Electrochemical Sensors' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-on-dark-muted)', marginBottom: '2px', fontWeight: 600 }}>{item.l}</div>
                <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>{item.v}</div>
              </div>
            ))}
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-on-dark-muted)', marginBottom: '2px', fontWeight: 600 }}>API</div>
              <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.8rem', color: 'var(--accent-light)', textDecoration: 'underline' }}>http://localhost:8000/docs</a>
            </div>
          </div>
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '16px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', marginBottom: '6px' }}>AeroMesh PNA · WUF13 Hackathon · Baku 2026</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-light)', marginBottom: '10px' }}>NO₂ + AgX(Zeolite) → [NO₂···Ag⁺]</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-on-dark-muted)', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
          Developed by <span style={{ color: 'white', fontWeight: 600 }}>Aziz Alizade</span> ·{' '}
          <a href="https://github.com/AzizAlizade473" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-light)', textDecoration: 'underline' }}>
            github.com/AzizAlizade473
          </a>
        </div>
      </div>
      <style>{`@media (min-width: 768px) { .footer-grid { grid-template-columns: 1.2fr 1fr 1fr !important; } }`}</style>
    </footer>
  );
}
