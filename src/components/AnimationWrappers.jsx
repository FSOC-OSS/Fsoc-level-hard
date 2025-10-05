// src/components/AnimationWrappers.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useAnimations } from '../context/AnimationContext';

// Page Transition Component
export const PageTransition = ({ children, direction = 'forward' }) => {
  const { getAnimationClass } = useAnimations();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, [children]);

  const animationClass = direction === 'forward' 
    ? getAnimationClass('animate-slide-in-right') 
    : getAnimationClass('animate-slide-in-left');

  return (
    <div className={`${isVisible ? animationClass : 'opacity-0'}`}>
      {children}
    </div>
  );
};

// Fade In Component
export const FadeIn = ({ children, delay = 0, className = '' }) => {
  const { enabled, getAnimationClass } = useAnimations();
  const [isVisible, setIsVisible] = useState(!enabled);

  useEffect(() => {
    if (enabled) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay, enabled]);

  return (
    <div 
      className={`${getAnimationClass(isVisible ? 'animate-fade-in' : 'opacity-0')} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Slide In Component
export const SlideIn = ({ children, delay = 0, className = '' }) => {
  const { enabled, getAnimationClass } = useAnimations();
  const [isVisible, setIsVisible] = useState(!enabled);

  useEffect(() => {
    if (enabled) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay, enabled]);

  return (
    <div 
      className={`${getAnimationClass(isVisible ? 'animate-slide-in-left' : 'opacity-0')} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Scale In Component
export const ScaleIn = ({ children, delay = 0, className = '' }) => {
  const { enabled, getAnimationClass } = useAnimations();
  const [isVisible, setIsVisible] = useState(!enabled);

  useEffect(() => {
    if (enabled) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay, enabled]);

  return (
    <div 
      className={`${getAnimationClass(isVisible ? 'animate-scale-in' : 'opacity-0 scale-95')} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Slide Up Component (Scroll Triggered)
export const SlideUp = ({ children, delay = 0, className = '' }) => {
  const { enabled, getAnimationClass } = useAnimations();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, enabled]);

  return (
    <div 
      ref={ref}
      className={`${getAnimationClass(isVisible ? 'animate-fade-in-up' : 'opacity-0')} ${className}`}
    >
      {children}
    </div>
  );
};

// Stagger List Component
export const StaggerList = ({ children, staggerDelay = 50, className = '' }) => {
  const { enabled } = useAnimations();
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    if (!enabled) {
      setVisibleItems(new Set(React.Children.map(children, (_, i) => i)));
      return;
    }

    React.Children.forEach(children, (_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]));
      }, index * staggerDelay);
    });
  }, [children, staggerDelay, enabled]);

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <div 
          key={index}
          className={enabled ? (visibleItems.has(index) ? 'animate-slide-in-left' : 'opacity-0') : ''}
          style={{ animationFillMode: 'both' }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

// Stagger Children Component (alias for StaggerList)
export const StaggerChildren = ({ children, staggerDelay = 100, className = '' }) => {
  return <StaggerList staggerDelay={staggerDelay} className={className}>{children}</StaggerList>;
};

// Animated Card Component
export const AnimatedCard = ({ children, delay = 0, className = '', onClick }) => {
  const { enabled, getAnimationClass } = useAnimations();
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay, enabled]);

  return (
    <div 
      ref={ref}
      onClick={onClick}
      className={`transition-all duration-300 hover:shadow-xl hover:scale-102 ${
        getAnimationClass(isVisible ? 'animate-fade-in-up' : 'opacity-0')
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Animated Modal Component
export const AnimatedModal = ({ isOpen, onClose, title, children, className = '' }) => {
  const { getAnimationClass } = useAnimations();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimating(true);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  const handleBackdropAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        getAnimationClass(isAnimating ? 'animate-backdrop-in' : 'animate-backdrop-out')
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
      onAnimationEnd={handleBackdropAnimationEnd}
    >
      <div 
        className={`bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto ${
          getAnimationClass(isAnimating ? 'animate-modal-in' : 'animate-modal-out')
        } ${className}`}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <h3 className="text-xl font-bold">{title}</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};