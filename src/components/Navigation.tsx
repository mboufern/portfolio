import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
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
          const isExpanded = isActive || (!isMobile && isHovered);
          const dotSize = isMobile ? 11 : 12;
          const expandedHeight = isMobile ? 24 : 26;

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
              className="group relative flex items-center justify-center min-w-[28px] min-h-[34px] sm:min-h-[32px] px-1.5 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 rounded-full"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Minimalist Dot / Always-Expanded Active Badge / Hover Badge with 6s Sinusoidal Wave */}
              <div
                className="nav-dot-wave flex items-center justify-center"
                style={{
                  animationDelay: `${idx * 0.055}s`,
                  animationPlayState: isHovered ? 'paused' : 'running',
                }}
              >
                <motion.div
                  initial={false}
                  animate={{
                    width: isExpanded ? 'auto' : dotSize,
                    height: isExpanded ? expandedHeight : dotSize,
                  }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center justify-center overflow-hidden rounded-full"
                  style={{
                    backgroundColor:
                      isActive || isHovered
                        ? item.accent
                        : isDark
                          ? 'rgba(203, 213, 225, 0.36)'
                          : 'rgba(113, 113, 122, 0.38)',
                    boxShadow: isActive
                      ? `0 0 12px ${item.accent}99`
                      : isHovered
                        ? `0 0 10px ${item.accent}77`
                        : 'none',
                  }}
                >
                  <span
                    className="px-2.5 sm:px-3 text-[11px] sm:text-xs font-bold tracking-wider whitespace-nowrap leading-none select-none transition-opacity duration-200"
                    style={{
                      opacity: isExpanded ? 1 : 0,
                      color: '#0e0d18',
                    }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </div>
            </button>
          );
        })}
      </nav>
    </>
  );
};
