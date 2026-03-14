import { useEffect, useState } from 'react';

const THEME_KEY = 'theme-preference';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light';

  const saved = window.localStorage.getItem(THEME_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  const systemPrefersDark =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches;

  return systemPrefersDark ? 'dark' : 'light';
};

const applyThemeClass = (mode) => {
  const root = document.documentElement;
  if (!root) return;

  if (mode === 'dark') {
    root.classList.add('theme-dark');
  } else {
    root.classList.remove('theme-dark');
  }

  document.dispatchEvent(
    new CustomEvent('theme:changed', { detail: { mode } })
  );
};

export default function useTheme() {
  const [mode, setMode] = useState(getInitialTheme);

  useEffect(() => {
    applyThemeClass(mode);
    window.localStorage.setItem(THEME_KEY, mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return { mode, toggleTheme };
}

