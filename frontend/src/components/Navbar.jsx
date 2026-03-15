import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import useScrollSpy from '../hooks/useScrollSpy';
import useTheme from '../hooks/useTheme';

const NAV_LINKS = [
  { id: 'problem',      label: 'How It Works' },
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
  const { mode, toggleTheme } = useTheme();
  const isDark = mode === 'dark';

  const logoColor = isDark ? 'var(--color-primary)' : 'var(--color-text)';
  const navActiveColor = 'var(--color-primary)';
  const navInactiveColor = isDark ? 'rgba(230,238,245,0.85)' : 'rgba(11,27,34,0.78)';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <>
      <nav
        className="navbar"
        style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        height: 'var(--navbar-height, 60px)',
        zIndex: 1000,
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
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
                stroke={logoColor} strokeWidth="2" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="3" fill={logoColor} />
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 700,
              color: logoColor,
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
                  color: activeSection === link.id ? navActiveColor : navInactiveColor,
                  transition: 'color 0.2s',
                  borderBottom: activeSection === link.id ? `2px solid ${navActiveColor}` : '2px solid transparent',
                }}
              >
                {link.label}
              </div>
            ))}
          </div>

          {/* Right Side: Theme Toggle + Status Pill + Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Theme toggle */}
            <button
              id="theme-toggle"
              type="button"
              className="theme-toggle"
              aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={mode === 'dark'}
              onClick={toggleTheme}
            >
              <span
                className="theme-icon theme-icon-sun"
                aria-hidden={mode === 'dark'}
              >
                ☀
              </span>
              <span
                className="theme-icon theme-icon-moon"
                aria-hidden={mode !== 'dark'}
              >
                ☾
              </span>
            </button>

            {/* Status Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: 'rgba(39,211,162,0.12)',
              borderRadius: '20px',
              fontSize: '0.7rem',
              color: 'var(--color-text)',
              fontWeight: 500,
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#27D3A2',
                animation: 'blink 1.5s infinite',
              }} />
              <span>System Active</span>
            </div>

            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ padding: '4px', display: 'none' }}
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
              background: 'var(--bg-dark)',
              borderBottom: '1px solid rgba(0,163,255,0.25)',
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
                  color: activeSection === link.id ? navActiveColor : navInactiveColor,
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

        .navbar {
          color: var(--color-text);
          backdrop-filter: blur(10px);
        }

        .theme-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: 1px solid var(--color-border);
          background: var(--color-surface-alt);
          color: var(--color-text);
          transition: background 0.18s ease, border-color 0.18s ease, transform 0.1s ease, box-shadow 0.18s ease;
        }

        .theme-toggle:hover {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 1px rgba(39,211,162,0.12);
        }

        .theme-toggle:focus-visible {
          outline: 3px solid var(--focus-ring);
          outline-offset: 2px;
        }

        .theme-icon {
          font-size: 1rem;
          line-height: 1;
        }

        .theme-icon-sun {
          display: ${'${mode === "dark" ? "none" : "inline"}'};
        }

        .theme-icon-moon {
          display: ${'${mode === "dark" ? "inline" : "none"}'};
        }
      `}</style>
    </>
  );
}
