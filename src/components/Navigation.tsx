import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineUser, HiCommandLine } from 'react-icons/hi2';
import { MdWorkOutline } from 'react-icons/md';
import { IoGameControllerOutline, IoDiceOutline, IoSendOutline } from 'react-icons/io5';
import { TbCube } from 'react-icons/tb';
import { NAVIGATION_ITEMS } from '../data/portfolioData';

interface NavigationProps {
  activeSectionIdx: number;
  onNavigate: (index: number) => void;
}

const getNavIcon = (key: string, className = 'text-sm sm:text-base') => {
  switch (key) {
    case 'intro':
      return <HiOutlineUser className={className} />;
    case 'experience':
      return <MdWorkOutline className={className} />;
    case 'software':
      return <HiCommandLine className={className} />;
    case 'gamedev':
      return <IoGameControllerOutline className={className} />;
    case '3d':
      return <TbCube className={className} />;
    case 'games':
      return <IoDiceOutline className={className} />;
    case 'connect':
      return <IoSendOutline className={className} />;
    default:
      return <HiOutlineUser className={className} />;
  }
};

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
      {/* ── Top Floating Navigation Bar (Compact & No-Wrap) ── */}
      <header
        className="fixed top-3 sm:top-4 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
        style={{ maxWidth: '96vw' }}
      >
        <nav
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full pointer-events-auto shadow-xl backdrop-blur-xl border border-white/50 whitespace-nowrap flex-nowrap"
          style={{
            background: 'rgba(255, 255, 255, 0.90)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04)',
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
                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 outline-none cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'text-white shadow-md'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/70'
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: item.accent,
                        boxShadow: `0 3px 12px ${item.accent}55`,
                      }
                    : {}
                }
                title={item.label}
              >
                <span
                  className={`flex items-center justify-center transition-transform duration-300 ${
                    isJumping ? 'animate-[icon-jump_0.5s_ease-in-out]' : ''
                  }`}
                  style={{ lineHeight: 1 }}
                >
                  {getNavIcon(item.key)}
                </span>
                <span className="hidden sm:inline tracking-wide whitespace-nowrap text-xs">
                  {item.label}
                </span>
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
              <span className="absolute right-7 px-2.5 py-1 rounded bg-zinc-900 text-white text-[11px] font-bold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md">
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
