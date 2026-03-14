import { useState, useEffect } from 'react';

/**
 * useScrollSpy — Returns the currently active section ID based on scroll position.
 * @param {string[]} sectionIds - Array of section element IDs to observe
 * @param {number} offset - Offset from top in pixels (default: 100)
 * @returns {string} Currently active section ID
 */
export default function useScrollSpy(sectionIds, offset = 100) {
  const [activeId, setActiveId] = useState(sectionIds[0] || '');

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollY) {
          setActiveId(sectionIds[i]);
          return;
        }
      }

      setActiveId(sectionIds[0] || '');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeId;
}
