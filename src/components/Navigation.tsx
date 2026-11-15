import React, { useState, useEffect, useRef } from 'react';
import { NAVIGATION_ITEMS } from '../data/portfolioData';
import { SidebarVineNav } from './SidebarVineNav';

interface NavigationProps {
  activeSectionIdx: number;
  onNavigate: (index: number) => void;
  isDarkSurface?: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSectionIdx,
  onNavigate,
  isDarkSurface,
}) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Dark backdrop when on dark project pages (Software, GameDev, 3D Art) or dark Experience company
  const isDark =
    isDarkSurface ??
    (activeSectionIdx === 2 || activeSectionIdx === 3 || activeSectionIdx === 4);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {/* Organic Tree Vein Navigation Branches (Home Route Only) */}
      <SidebarVineNav
        activeSectionIdx={activeSectionIdx}
        onNavigate={onNavigate}
        hoveredIdx={hoveredIdx}
        onHoverChange={setHoveredIdx}
        dotRefs={dotRefs}
      />

      {/* Minimalist Floating Pill Navigation (Top-Right on Desktop, Bottom-Center on Mobile) */}
      <nav
        className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] sm:bottom-auto left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:top-5 sm:translate-x-0 z-50 flex flex-row items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full pointer-events-auto"
        style={{
          background: isDark
            ? 'rgba(14, 13, 24, 0.72)'
            : 'rgba(255, 255, 255, 0.78)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          border: isDark
            ? '1px solid rgba(255, 255, 255, 0.14)'
            : '1px solid rgba(28, 27, 32, 0.08)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0, 0, 0, 0.55)'
            : '0 8px 28px rgba(28, 27, 32, 0.09)',
          transition: 'background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease',
        }}
        aria-label="Primary Navigation"
      >
        {NAVIGATION_ITEMS.map((item, idx) => {
          const isActive = activeSectionIdx === idx;
          const isHovered = hoveredIdx === idx;
          const width = isActive ? (isMobile ? 22 : 24) : 8;
          const height = 8;

          return (
            <button
              key={`dot-${item.key}`}
              ref={(el) => {
                dotRefs.current[idx] = el;
              }}
              type="button"
              onClick={() => onNavigate(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onFocus={() => setHoveredIdx(idx)}
              onBlur={() => setHoveredIdx(null)}
              className="group relative flex items-center justify-center min-w-[30px] min-h-[30px] sm:min-w-[28px] sm:min-h-[28px] outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 rounded-full transition-transform duration-200"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Hover/Focus Tooltip on non-Home pages (Home displays labels at vine tips) */}
              {activeSectionIdx !== 0 && (
                <span
                  className="absolute -top-9 sm:top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-white text-[11px] font-bold tracking-wider opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-lg"
                  style={{
                    background: isDark ? '#181626' : '#1c1b20',
                    border: isDark ? '1px solid rgba(255,255,255,0.14)' : 'none',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.label}
                </span>
              )}

              {/* Minimalist Dot / Active Pill Indicator */}
              <div
                className="transition-all duration-300 ease-out"
                style={{
                  width,
                  height,
                  borderRadius: 9999,
                  backgroundColor:
                    isActive || isHovered
                      ? item.accent
                      : isDark
                        ? 'rgba(203, 213, 225, 0.36)'
                        : 'rgba(113, 113, 122, 0.38)',
                  boxShadow:
                    isActive
                      ? `0 0 12px ${item.accent}99`
                      : isHovered
                        ? `0 0 8px ${item.accent}66`
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
