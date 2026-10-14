import React, { useState, useEffect } from 'react';
import { NAVIGATION_ITEMS } from '../data/portfolioData';

interface NavigationProps {
  activeSectionIdx: number;
  onNavigate: (index: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSectionIdx, onNavigate }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav
      className="fixed bottom-3 sm:bottom-auto left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 z-50 flex flex-row sm:flex-col items-center gap-2.5 sm:gap-3.5 px-3 py-2 sm:p-2 rounded-full pointer-events-auto"
      style={{
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.85)',
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
      }}
      aria-label="Section Navigation"
    >
      {NAVIGATION_ITEMS.map((item, idx) => {
        const isActive = activeSectionIdx === idx;
        const width = isMobile ? (isActive ? 22 : 7) : 7;
        const height = isMobile ? 7 : (isActive ? 22 : 7);

        return (
          <button
            key={`dot-${item.key}`}
            onClick={() => onNavigate(idx)}
            className="group relative flex items-center justify-center p-1 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 rounded-full transition-transform duration-200"
            aria-label={item.label}
            aria-current={isActive ? 'step' : undefined}
          >
            {/* Tooltip on hover */}
            <span
              className="absolute -top-8 left-1/2 -translate-x-1/2 sm:top-auto sm:left-auto sm:right-8 sm:-translate-x-1 sm:group-hover:translate-x-0 px-2.5 py-1 rounded-md text-white text-[11px] font-bold tracking-wider opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg"
              style={{
                background: '#1c1b20',
                letterSpacing: '0.06em',
              }}
            >
              {item.label}
            </span>

            {/* Dot / Pill indicator */}
            <div
              className="transition-all duration-300 ease-out"
              style={{
                width,
                height,
                borderRadius: 9999,
                backgroundColor: isActive ? item.accent : 'rgba(120, 117, 138, 0.38)',
                boxShadow: isActive ? `0 0 12px ${item.accent}99` : 'none',
              }}
            />
          </button>
        );
      })}
    </nav>
  );
};
