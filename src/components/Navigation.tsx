import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../data/portfolioData';

interface NavigationProps {
  activeSectionIdx: number;
  onNavigate: (index: number) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeSectionIdx, onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [jumping, setJumping] = useState<string | null>(null);

  const handleNavClick = (idx: number, route: string) => {
    onNavigate(idx);
    navigate(route);
  };

  const triggerJump = (key: string) => {
    setJumping(key);
    setTimeout(() => setJumping(null), 500);
  };

  return (
    <>
      {/* ── Top Floating Navigation Bar ── */}
      <header
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        style={{ maxWidth: '92vw' }}
      >
        <nav
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 rounded-full pointer-events-auto shadow-2xl backdrop-blur-xl border border-white/40"
          style={{
            background: 'rgba(255, 255, 255, 0.88)',
            boxShadow: '0 10px 35px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
          aria-label="Main Navigation"
        >
          {NAVIGATION_ITEMS.map((item, idx) => {
            const isActive = activeSectionIdx === idx || location.pathname === item.route;
            const isJumping = jumping === item.key;
            return (
              <button
                key={item.key}
                onClick={() => handleNavClick(idx, item.route)}
                onMouseEnter={() => triggerJump(item.key)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 outline-none cursor-pointer ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: item.accent,
                        boxShadow: `0 4px 14px ${item.accent}55`,
                      }
                    : {}
                }
                title={item.label}
              >
                <span
                  className={`material-symbols-rounded text-base sm:text-lg transition-transform duration-300 ${
                    isJumping ? 'animate-[icon-jump_0.5s_ease-in-out]' : ''
                  }`}
                  style={{ lineHeight: 1 }}
                >
                  {item.icon}
                </span>
                <span className="hidden sm:inline tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* ── Right Side Navigation Dots ── */}
      <nav
        className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3"
        aria-label="Section Indicator"
      >
        {NAVIGATION_ITEMS.map((item, idx) => {
          const isActive = activeSectionIdx === idx;
          return (
            <button
              key={`dot-${item.key}`}
              onClick={() => handleNavClick(idx, item.route)}
              className="group relative flex items-center justify-end p-1 outline-none cursor-pointer"
              aria-label={`Jump to ${item.label}`}
            >
              {/* Tooltip on hover */}
              <span
                className="absolute right-7 px-2.5 py-1 rounded bg-zinc-900 text-white text-[11px] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md"
              >
                {item.label}
              </span>
              <div
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: isActive ? item.accent : 'rgba(107, 104, 128, 0.35)',
                  transform: isActive ? 'scale(1.6)' : 'scale(1)',
                  boxShadow: isActive ? `0 0 10px ${item.accent}88` : 'none',
                }}
              />
            </button>
          );
        })}
      </nav>
    </>
  );
};
