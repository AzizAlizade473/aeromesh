import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import useScrollSpy from '../hooks/useScrollSpy';

const NAV_LINKS = [
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'dashboard',    label: 'Dashboard' },
  { id: 'chemistry',    label: 'Chemistry' },
  { id: 'science',      label: 'Science' },
  { id: 'business',     label: 'Economics' },
  { id: 'team',         label: 'Team' },
];

const SECTION_IDS = NAV_LINKS.map(link => link.id);

const scrollToSection = (id, closeMobile) => {
  if (closeMobile) closeMobile();
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, 50);
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeSection = useScrollSpy(SECTION_IDS, 100);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: '60px',
        zIndex: 1000,
        background: 'var(--primary)',
        borderBottom: '3px solid #14396B',
        transition: 'all 0.3s ease',
      }}>
        <div className="section-container" style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L22 7.5V16.5L12 22L2 16.5V7.5L12 2Z"
                stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" fill="white" />
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: 'white',
            }}>AEROMESH</span>
          </div>

          {/* Desktop Nav Links */}
          <div style={{ display: 'none' }} className="desktop-nav">
            {NAV_LINKS.map(link => (
              <div
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                style={{
                  position: 'relative',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: activeSection === link.id ? 'white' : 'rgba(255,255,255,0.85)',
                  transition: 'color 0.2s',
                  borderBottom: activeSection === link.id ? '2px solid white' : '2px solid transparent',
                }}
              >
                {link.label}
              </div>
            ))}
          </div>

          {/* Right Side: Status Pill + Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Status Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: '20px',
              fontSize: '0.7rem',
              color: 'white',
              fontWeight: 500,
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#4ADE80',
                animation: 'blink 1.5s infinite',
              }} />
              System Active
            </div>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ padding: '4px', color: 'white', display: 'none' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '60px',
              left: 0,
              width: '100%',
              background: 'var(--primary)',
              borderBottom: '2px solid #14396B',
              padding: '2rem',
              zIndex: 999,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            {NAV_LINKS.map(link => (
              <div
                key={link.id}
                onClick={() => scrollToSection(link.id, closeMobile)}
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  color: activeSection === link.id ? 'white' : 'rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                }}
              >
                {link.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; gap: 0.5rem; }
          .mobile-menu-btn { display: none !important; }
        }
        @media (max-width: 991px) {
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </>
  );
}
