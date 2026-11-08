import React, { useState, useEffect, useRef } from 'react';
import { NAVIGATION_ITEMS } from '../data/portfolioData';
import { SidebarVineNav } from './SidebarVineNav';

interface NavigationProps {
  activeSectionIdx: number;
  onNavigate: (index: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSectionIdx, onNavigate }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const isDarkSection = activeSectionIdx === 4 || activeSectionIdx === 5;
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Organic Vine Navigation Callouts (Hero Section Only) */}
      <SidebarVineNav
        activeSectionIdx={activeSectionIdx}
        onNavigate={onNavigate}
        hoveredIdx={hoveredIdx}
        onHoverChange={setHoveredIdx}
        dotRefs={dotRefs}
      />

      {/* Main Sidebar Navigation Pill */}
      <nav
        className="fixed bottom-3 sm:bottom-auto left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 z-50 flex flex-row sm:flex-col items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:p-2 rounded-full pointer-events-auto"
        style={{
          background: isDarkSection ? 'rgba(16, 14, 26, 0.85)' : 'rgba(255, 255, 255, 0.82)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isDarkSection ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(255, 255, 255, 0.90)',
          boxShadow: isDarkSection ? '0 4px 24px rgba(0, 0, 0, 0.5)' : '0 4px 24px rgba(0, 0, 0, 0.08)',
          transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        }}
        aria-label="Section Navigation"
      >
        {NAVIGATION_ITEMS.map((item, idx) => {
          const isActive = activeSectionIdx === idx;
          const isHovered = hoveredIdx === idx;
          const width = isMobile ? (isActive ? 24 : 8) : 8;
          const height = isMobile ? 8 : (isActive ? 24 : 8);

          return (
            <button
              key={`dot-${item.key}`}
              ref={(el) => {
                dotRefs.current[idx] = el;
              }}
              onClick={() => onNavigate(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onFocus={() => setHoveredIdx(idx)}
              onBlur={() => setHoveredIdx(null)}
              className="group relative flex items-center justify-center min-w-[36px] min-h-[36px] sm:min-w-[32px] sm:min-h-[32px] outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 rounded-full transition-transform duration-200"
              aria-label={item.label}
              aria-current={isActive ? 'step' : undefined}
            >
              {/* Tooltip on hover (only when not in hero to prevent double label) */}
              {activeSectionIdx !== 0 && (
                <span
                  className="absolute -top-9 left-1/2 -translate-x-1/2 sm:top-auto sm:left-auto sm:right-9 sm:-translate-x-1 sm:group-hover:translate-x-0 px-2.5 py-1 rounded-md text-white text-[11px] font-bold tracking-wider opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg"
                  style={{
                    background: '#1c1b20',
                    letterSpacing: '0.06em',
                  }}
                >
                  {item.label}
                </span>
              )}

              {/* Dot / Pill indicator */}
              <div
                className="transition-all duration-300 ease-out"
                style={{
                  width,
                  height,
                  borderRadius: 9999,
                  backgroundColor:
                    isActive || isHovered
                      ? item.accent
                      : isDarkSection
                        ? 'rgba(160, 155, 185, 0.45)'
                        : 'rgba(120, 117, 138, 0.38)',
                  boxShadow:
                    isActive || isHovered
                      ? '0 2px 6px rgba(0, 0, 0, 0.16)'
                      : 'none',
                  transform: isHovered && !isActive ? 'scale(1.25)' : 'none',
                }}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
};
