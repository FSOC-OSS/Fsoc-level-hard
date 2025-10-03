import { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { preference, setPreference, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);

  const toggleOpen = () => setOpen((s) => !s);

  const select = (value) => {
    setPreference(value);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={btnRef}
        onClick={toggleOpen}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Theme: ${preference || 'system'}`}
        className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200"
        style={{ color: 'var(--text)', background: 'transparent', border: '1px solid rgba(0,0,0,0.06)' }}
      >
        {theme === 'dark' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 100 10 5 5 0 000-10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {open && (
        <div role="menu" aria-label="Theme options" className="absolute right-0 mt-2 w-44 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5" style={{ background: 'var(--card-bg)', color: 'var(--text)' }}>
          <button role="menuitem" onClick={() => select('light')} className={`w-full text-left px-4 py-2 hover:opacity-90 ${preference === 'light' ? 'font-semibold' : ''}`}>Light</button>
          <button role="menuitem" onClick={() => select('dark')} className={`w-full text-left px-4 py-2 hover:opacity-90 ${preference === 'dark' ? 'font-semibold' : ''}`}>Dark</button>
          <button role="menuitem" onClick={() => select('system')} className={`w-full text-left px-4 py-2 hover:opacity-90 ${preference === 'system' ? 'font-semibold' : ''}`}>Use System</button>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
