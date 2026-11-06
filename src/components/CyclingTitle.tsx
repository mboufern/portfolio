import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface CyclingTitleProps {
  onColorChange?: (color: string) => void;
}

export const CyclingTitle: React.FC<CyclingTitleProps> = ({ onColorChange }) => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const color = PERSONAL_INFO.titleColors[idx % PERSONAL_INFO.titleColors.length];

  useEffect(() => {
    if (onColorChange) {
      onColorChange(color);
    }
  }, [color, onColorChange]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % PERSONAL_INFO.titles.length);
        setVisible(true);
      }, 350);
    }, 2600);

    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <div
      className="inline-flex items-center min-h-[2.4em]"
      aria-live="polite"
      aria-atomic="true"
    >
      <span
        style={{
          display: 'inline-block',
          fontSize: 'clamp(1.25rem, 2.6vw, 1.85rem)',
          fontWeight: 600,
          letterSpacing: '-0.02em',
          opacity: visible ? 1 : 0,
          transform: prefersReducedMotion
            ? 'none'
            : visible
              ? 'translateY(0)'
              : 'translateY(8px)',
          transition: prefersReducedMotion
            ? 'none'
            : 'opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          color,
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {PERSONAL_INFO.titles[idx]}
      </span>
    </div>
  );
};
