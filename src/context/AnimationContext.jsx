// src/context/AnimationContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AnimationContext = createContext({
  enabled: true,
  speed: 'normal',
  toggleAnimations: () => {},
  setSpeed: () => {},
  getAnimationClass: () => '',
  getAnimationDuration: () => 300
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAnimations = () => useContext(AnimationContext);

export function AnimationProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('animationsEnabled');
      if (saved !== null) {
        return JSON.parse(saved);
      }
    }
    
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !prefersReduced;
  });

  const [speed, setSpeed] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('animationSpeed') || 'normal';
    }
    return 'normal';
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('animationsEnabled', JSON.stringify(enabled));
      } catch (e) {
        console.warn('Could not save animation preference:', e);
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('animationSpeed', speed);
      } catch (e) {
        console.warn('Could not save animation speed:', e);
      }
    }
    
    const speedMultiplier = speed === 'slow' ? '1.5' : speed === 'fast' ? '0.5' : '1';
    document.documentElement.style.setProperty('--animation-speed', speedMultiplier);
  }, [speed]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e) => {
      if (e.matches) {
        setEnabled(false);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleAnimations = () => setEnabled(!enabled);

  const getAnimationClass = (animationName) => {
    return enabled ? animationName : '';
  };

  const getAnimationDuration = (baseDuration = 300) => {
    if (!enabled) return 0;
    const multiplier = speed === 'slow' ? 1.5 : speed === 'fast' ? 0.5 : 1;
    return baseDuration * multiplier;
  };

  const value = {
    enabled,
    speed,
    toggleAnimations,
    setSpeed,
    getAnimationClass,
    getAnimationDuration
  };

  return (
    <AnimationContext.Provider value={value}>
      {children}
    </AnimationContext.Provider>
  );
}