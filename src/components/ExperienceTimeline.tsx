import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  EXPERIENCE_ITEMS,
  calculateTotalExperience,
  type ExperienceItem,
} from '../data/portfolioData';
import {
  TbSchool,
  TbBriefcase,
  TbCrown,
  TbCode,
  TbDeviceMobile,
} from 'react-icons/tb';

/* ─── Role Icon Selector ─────────────────────────────────────────── */
const getRoleIcon = (role: string) => {
  const lower = role.toLowerCase();
  if (lower.includes('lead') || lower.includes('architect')) {
    return TbCrown;
  }
  if (lower.includes('mobile')) {
    return TbDeviceMobile;
  }
  return TbCode;
};

/* ─── Blob Card Component ────────────────────────────────────────── */
interface BlobCardProps {
  item: ExperienceItem;
  isActive: boolean;
}

const hexToRgba = (hex: string, alpha: number) => {
  const clean = hex.replace('#', '');
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return hex;
};

const BlobCard: React.FC<BlobCardProps> = ({ item, isActive }) => {
  const color = item.accent ?? '#15cea9';
  const glowColor = item.glowColor ?? item.accent ?? '#15cea9';
  const bgColor = item.bgColor ?? '#ffffff';
  const isDark = bgColor !== '#ffffff';
  const textColor = item.textColor ?? (isDark ? '#ffffff' : '#1c1b20');
  const subtextColor = isDark ? 'rgba(255, 255, 255, 0.90)' : '#4a4860';
  const isValinnov = item.company.toLowerCase().includes('valinnov');
  const R = 20;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 360 }}>
      {/* Card base with custom background and glow elevation */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: R,
          background: bgColor,
          boxShadow: isActive
            ? (isDark
                ? `16px 16px 50px rgba(0,0,0,0.45), 0 0 45px ${glowColor}44`
                : `16px 16px 50px rgba(180, 175, 200, 0.35), 0 0 35px ${glowColor}33, -16px -16px 50px #ffffff`)
            : '4px 4px 18px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.5s ease, background 0.4s ease',
          zIndex: 0,
        }}
      />

      {/* Animated fluid blob layer with custom glow color */}
      {isActive && (
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            right: -60,
            bottom: -60,
            zIndex: 1,
            clipPath: `inset(60px round ${R}px)`,
            pointerEvents: 'none',
          }}
        >
          <div className="news-blob news-blob--1" style={{ backgroundColor: glowColor }} />
          <div className="news-blob news-blob--2" style={{ backgroundColor: glowColor }} />
        </div>
      )}

      {/* Frosted Glass Panel */}
      <div
        style={{
          position: 'absolute',
          top: 6,
          left: 6,
          right: 6,
          bottom: 6,
          zIndex: 2,
          borderRadius: R - 4,
          background: isActive
            ? hexToRgba(bgColor, isDark ? 0.78 : 0.76)
            : hexToRgba(bgColor, isDark ? 0.95 : 0.96),
          backdropFilter: isActive ? 'blur(160px)' : 'none',
          WebkitBackdropFilter: isActive ? 'blur(160px)' : 'none',
          padding: 'clamp(14px, 3.5vw, 36px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 12,
          boxSizing: 'border-box',
          transition: 'background 0.4s ease',
          overflowY: 'auto',
        }}
      >
        {isActive ? (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            {/* Header: Company, Logo & Badges */}
            <div
              className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5"
              style={{
                borderBottom: isDark
                  ? '1px solid rgba(255, 255, 255, 0.16)'
                  : '1px solid rgba(0, 0, 0, 0.08)',
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {item.logo && (
                  <div
                    className={`w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-all duration-300 ${
                      isValinnov ? 'p-0 overflow-hidden' : 'p-2 sm:p-2.5'
                    }`}
                    style={{
                      background: isDark
                        ? (isValinnov ? 'transparent' : 'rgba(255, 255, 255, 0.14)')
                        : '#ffffff',
                      border: isDark
                        ? (isValinnov ? '1.5px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.22)')
                        : '1px solid rgba(0, 0, 0, 0.08)',
                      boxShadow: isDark
                        ? '0 4px 16px rgba(0, 0, 0, 0.35)'
                        : '0 4px 16px rgba(0, 0, 0, 0.06)',
                    }}
                  >
                    <img
                      src={item.logo}
                      alt={`${item.company} logo`}
                      className={`w-full h-full ${isValinnov ? 'object-cover' : 'object-contain'}`}
                    />
                  </div>
                )}
                <div>
                  <span
                    style={{
                      color: isDark ? glowColor : color,
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      fontSize: 'clamp(0.68rem, 2.6vw, 0.74rem)',
                      fontWeight: 600,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      display: 'block',
                    }}
                  >
                    {item.period}
                  </span>
                  <h3
                    style={{
                      margin: '2px 0 0',
                      fontSize: 'clamp(1.15rem, 3.6vw, 1.75rem)',
                      color: textColor,
                      fontFamily: '"Archivo Black", sans-serif',
                      lineHeight: 1.15,
                    }}
                  >
                    {item.company}
                  </h3>
                </div>
              </div>

              {/* Badges: Employment Type & Role */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {item.isInternship ? (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide uppercase backdrop-blur-md transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: isDark
                        ? 'rgba(255, 255, 255, 0.12)'
                        : 'rgba(100, 116, 139, 0.08)',
                      color: isDark ? '#ffffff' : '#475569',
                      border: isDark
                        ? '1px solid rgba(255, 255, 255, 0.22)'
                        : '1px solid rgba(148, 163, 184, 0.25)',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <TbSchool className="w-3.5 h-3.5 opacity-85 flex-shrink-0" />
                    <span>Internship</span>
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wide uppercase backdrop-blur-md transition-all duration-300 shadow-sm"
                    style={{
                      backgroundColor: isDark ? 'rgba(153, 255, 102, 0.16)' : 'rgba(21, 206, 169, 0.14)',
                      color: isDark ? '#99ff66' : '#0d9488',
                      border: isDark
                        ? '1px solid rgba(153, 255, 102, 0.35)'
                        : '1px solid rgba(21, 206, 169, 0.35)',
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      boxShadow: isDark ? '0 0 12px rgba(153, 255, 102, 0.25)' : '0 0 12px rgba(21, 206, 169, 0.2)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse flex-shrink-0" />
                    <TbBriefcase className="w-3.5 h-3.5 opacity-85 flex-shrink-0" />
                    <span>Full-Time</span>
                  </span>
                )}

                {(() => {
                  const RoleIcon = getRoleIcon(item.role);
                  return (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-semibold transition-all duration-300 shadow-sm"
                      style={{
                        background: isDark
                          ? `linear-gradient(135deg, ${glowColor}25, ${glowColor}0d)`
                          : `linear-gradient(135deg, ${color}1c, ${color}08)`,
                        color: isDark ? glowColor : color,
                        border: isDark ? `1px solid ${glowColor}66` : `1px solid ${color}45`,
                        boxShadow: isDark ? `0 0 12px ${glowColor}20` : `0 0 10px ${color}14`,
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                      }}
                    >
                      <RoleIcon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{item.role}</span>
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Bullet Highlights */}
            <ul className="space-y-1.5 sm:space-y-2.5 my-1 sm:my-2">
              {item.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-[11.5px] sm:text-sm leading-relaxed font-sans"
                  style={{ color: subtextColor }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"
                    style={{ backgroundColor: isDark ? glowColor : color }}
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <div style={{ minHeight: 200 }} />
        )}
      </div>
    </div>
  );
};

/* ─── Timeline Metric Heights ────────────────────────────────────── */
const ITEM_H = 92; // px per timeline entry (more spacious gap)

/* ─── Experience Timeline Main Component ─────────────────────────── */
export const ExperienceTimeline: React.FC = () => {
  const [active, setActive] = useState(0);
  const cardAreaRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cooldown = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const totalExperience = useMemo(() => calculateTotalExperience(EXPERIENCE_ITEMS), []);

  /* Auto-scroll timeline to keep active item in center */
  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    const targetScroll = active * ITEM_H - tl.clientHeight / 2 + ITEM_H / 2;
    tl.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
  }, [active]);

  /* Wheel + touch gestures on the card deck */
  useEffect(() => {
    const el = cardAreaRef.current;
    if (!el) return;

    const step = (dir: 1 | -1) => {
      if (cooldown.current) return;
      cooldown.current = true;
      setTimeout(() => {
        cooldown.current = false;
      }, 450);
      setActive((a) => Math.min(Math.max(a + dir, 0), EXPERIENCE_ITEMS.length - 1));
    };

    const onWheel = (e: WheelEvent) => {
      // Prevent propagating vertical snap scroll when interacting with card stack
      e.stopPropagation();
      e.preventDefault();
      step(e.deltaY > 0 ? 1 : -1);
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null) return;
      const dy = touchStartY.current - e.touches[0].clientY;
      if (Math.abs(dy) < 26) return;
      e.preventDefault();
      e.stopPropagation();
      touchStartY.current = null;
      step(dy > 0 ? 1 : -1);
    };

    const onTouchEnd = () => {
      touchStartY.current = null;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center pointer-events-auto">
      {/* Responsive timeline hiding style */}
      <style>{`
        @media (max-width: 768px) {
          .experience-timeline-nav { display: none !important; }
        }
        .experience-timeline-scroll::-webkit-scrollbar { display: none; }
        .experience-timeline-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Section Header */}
      <div className="text-center mb-6 animate-[fade-in-up_0.6s_ease_forwards] relative z-30">
        <p
          style={{
            fontSize: '0.82rem',
            textTransform: 'uppercase',
            color: '#15cea9',
            fontFamily: '"Archivo Black", sans-serif',
            letterSpacing: '0.12em',
            marginBottom: 4,
          }}
        >
          {totalExperience.text} of Experience
        </p>
        <h2
          className="text-zinc-900 font-black tracking-tight relative z-30"
          style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3rem)' }}
        >
          Work Experience
        </h2>
      </div>

      {/* Mobile Company Switcher Tabs */}
      <div className="flex md:hidden items-center justify-center gap-1.5 mb-3 flex-wrap relative z-30 w-full px-2">
        {EXPERIENCE_ITEMS.map((item, idx) => {
          const isCur = active === idx;
          const accentColor = item.accent ?? '#15cea9';
          return (
            <button
              key={item.id}
              onClick={() => setActive(idx)}
              className="px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold transition-all duration-300 border-none cursor-pointer"
              style={{
                backgroundColor: isCur ? accentColor : 'rgba(255, 255, 255, 0.85)',
                color: isCur ? '#ffffff' : '#475569',
                boxShadow: isCur
                  ? `0 2px 10px ${accentColor}55`
                  : '0 1px 4px rgba(0,0,0,0.06)',
              }}
            >
              {item.company}
            </button>
          );
        })}
      </div>

      <div className="w-full flex flex-row items-center justify-center gap-8 md:gap-14 relative z-20">
        {/* ── Left: Connected Timeline Navigation ── */}
        <div
          className="experience-timeline-nav flex-shrink-0 relative"
          style={{ width: 'clamp(230px, 26vw, 300px)' }}
        >
          {/* Soft White Cloud Glow Backdrop */}
          <div
            aria-hidden="true"
            className="absolute -inset-16 -z-10 rounded-[60px] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.88) 35%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0.15) 80%, rgba(255, 255, 255, 0) 100%)',
              filter: 'blur(32px)',
            }}
          />
          <div
            style={{
              position: 'relative',
              height: Math.round(ITEM_H * 4.6),
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)',
            }}
          >
            {/* Scrollable list */}
            <div
              ref={timelineRef}
              className="experience-timeline-scroll"
              style={{
                height: '100%',
                overflowY: 'scroll',
                paddingTop: Math.round(ITEM_H * 0.6),
                paddingBottom: Math.round(ITEM_H * 0.6),
                paddingLeft: 18,
                paddingRight: 8,
                boxSizing: 'border-box',
              }}
            >
              {/* Vertical connecting line */}
              <div
                style={{
                  position: 'absolute',
                  left: 27,
                  top: 0,
                  bottom: 0,
                  width: 2,
                  background:
                    'linear-gradient(to bottom, transparent, rgba(21,206,169,0.3) 15%, rgba(21,206,169,0.3) 85%, transparent)',
                  pointerEvents: 'none',
                }}
              />

              {EXPERIENCE_ITEMS.map((item, i) => {
                const isCurrent = active === i;
                const nodeColor = item.accent ?? '#15cea9';
                return (
                  <button
                    key={item.id}
                    onClick={() => setActive(i)}
                    className="w-full text-left bg-transparent border-none p-0 flex items-start gap-4 outline-none cursor-pointer"
                    style={{
                      height: ITEM_H,
                      opacity: isCurrent ? 1 : 0.4,
                      transition: 'opacity 0.3s ease',
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: isCurrent ? 1.35 : 1,
                        backgroundColor: isCurrent ? nodeColor : 'rgba(180, 175, 200, 0.4)',
                        boxShadow: isCurrent ? `0 0 16px ${nodeColor}cc` : 'none',
                      }}
                      transition={{ duration: 0.3 }}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        flexShrink: 0,
                        marginTop: 4,
                      }}
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          style={{
                            margin: 0,
                            fontSize: '0.9rem',
                            lineHeight: 1.25,
                            color: isCurrent ? '#1c1b20' : '#6b6880',
                            fontFamily: '"Archivo Black", sans-serif',
                            transition: 'color 0.3s ease',
                          }}
                        >
                          {item.company}
                        </span>
                        {item.isInternship ? (
                          <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-zinc-200/90 text-zinc-600 uppercase tracking-wider">
                            Intern
                          </span>
                        ) : (
                          <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 uppercase tracking-wider border border-emerald-300/50">
                            Lead
                          </span>
                        )}
                      </div>
                      <span
                        className="text-[11px] font-sans font-semibold tracking-wide"
                        style={{ color: isCurrent ? nodeColor : '#8e8b9f' }}
                      >
                        {item.role}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-sans">
                        {item.period}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right: 3D Layered Card Stack ── */}
        <div
          ref={cardAreaRef}
          style={{
            flex: '1 1 380px',
            maxWidth: 620,
            position: 'relative',
            height: 'clamp(400px, 54vh, 560px)',
            overflow: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            touchAction: 'none',
            padding: '0 10px',
            boxSizing: 'border-box',
          }}
        >
          {EXPERIENCE_ITEMS.map((item, i) => {
            const offset = i - active;
            const isActive = offset === 0;
            const scale = isActive ? 1 : Math.max(0.82, 1 - Math.abs(offset) * 0.08);
            const translateY = offset * 165;
            const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(offset) * 0.55);

            return (
              <motion.div
                key={item.id}
                onClick={() => !isActive && setActive(i)}
                animate={{ y: translateY, scale, opacity }}
                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                style={{
                  position: 'absolute',
                  width: '100%',
                  zIndex: EXPERIENCE_ITEMS.length - Math.abs(offset),
                  cursor: isActive ? 'default' : 'pointer',
                  pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
                }}
              >
                <BlobCard item={item} isActive={isActive} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
