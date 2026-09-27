import React from 'react';
import { NAVIGATION_ITEMS } from '../data/portfolioData';

interface NavigationProps {
  activeSectionIdx: number;
  onNavigate: (index: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSectionIdx, onNavigate }) => {
  return (
    <nav
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3.5 p-2 rounded-full pointer-events-auto"
      style={{
        background: 'rgba(255, 255, 255, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.65)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      }}
      aria-label="Section Navigation"
    >
      {NAVIGATION_ITEMS.map((item, idx) => {
        const isActive = activeSectionIdx === idx;
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
              className="absolute right-8 px-2.5 py-1 rounded-md text-white text-[11px] font-bold tracking-wider opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg -translate-x-1 group-hover:translate-x-0"
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
                width: 8,
                height: isActive ? 22 : 8,
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

