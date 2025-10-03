import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const THEME_KEY = 'app_theme_preference'; // 'light' | 'dark' | 'system'

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  useSystem: true,
  setUseSystem: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [preference, setPreference] = useState(() => {
    try {
      const raw = localStorage.getItem(THEME_KEY);
      if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;
    } catch {
      // ignore
    }
    return 'system';
  });

  const systemPrefersDark = () =>
    typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const resolveTheme = useCallback(() => {
    if (preference === 'system') return systemPrefersDark() ? 'dark' : 'light';
    return preference === 'dark' ? 'dark' : 'light';
  }, [preference]);

  const [theme, setThemeState] = useState(() => (typeof window !== 'undefined' ? (localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : (localStorage.getItem(THEME_KEY) === 'light' ? 'light' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))) : 'light'));

  // Apply theme class on documentElement
  useEffect(() => {
    const resolved = resolveTheme();
    setThemeState(resolved);
    if (typeof document !== 'undefined') {
      if (resolved === 'dark') {
        document.documentElement.classList.add('theme-dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('theme-dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
  }, [preference, resolveTheme]);

  // Listen to system changes when preference === 'system'
  useEffect(() => {
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (!mq || preference !== 'system') return;
    const onChange = () => {
      const resolved = resolveTheme();
      setThemeState(resolved);
      if (resolved === 'dark') document.documentElement.classList.add('theme-dark');
      else document.documentElement.classList.remove('theme-dark');
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, [preference, resolveTheme]);

  const setPreferenceSafe = useCallback((value) => {
    try {
      localStorage.setItem(THEME_KEY, value);
    } catch (e) {
      // ignore
    }
    setPreference(value);
  }, []);

  const context = useMemo(() => ({
    theme,
    setTheme: (t) => setPreferenceSafe(t === 'system' ? 'system' : t === 'dark' ? 'dark' : 'light'),
    preference,
    setPreference: setPreferenceSafe,
  }), [theme, setPreferenceSafe, preference]);

  return <ThemeContext.Provider value={context}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
