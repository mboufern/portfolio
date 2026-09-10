import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EXPERIENCE_ITEMS, type ExperienceItem } from '../data/portfolioData';

/* ─── Blob Card Component ────────────────────────────────────────── */
interface BlobCardProps {
  item: ExperienceItem;
  isActive: boolean;
}

const BlobCard: React.FC<BlobCardProps> = ({ item, isActive }) => {
  const color = item.accent ?? '#15cea9';
  const R = 20;

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: 360 }}>
      {/* White card base with neumorphic/elevation shadow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: R,
          background: '#ffffff',
          boxShadow: isActive
            ? '16px 16px 50px rgba(180, 175, 200, 0.4), -16px -16px 50px #ffffff'
            : '4px 4px 18px rgba(0,0,0,0.06)',
          transition: 'box-shadow 0.5s ease',
          zIndex: 0,
        }}
      />

      {/* Animated fluid blob layer */}
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
          <div className="news-blob news-blob--1" style={{ backgroundColor: color }} />
          <div className="news-blob news-blob--2" style={{ backgroundColor: color }} />
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
          background: isActive ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.96)',
          backdropFilter: isActive ? 'blur(160px)' : 'none',
          WebkitBackdropFilter: isActive ? 'blur(160px)' : 'none',
          padding: 'clamp(24px, 3.5vw, 40px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 14,
          boxSizing: 'border-box',
          transition: 'background 0.4s ease',
          overflow: 'hidden',
        }}
      >
        {isActive ? (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {/* Header: Company & Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/70 pb-3">
              <div>
                <span
                  style={{
                    color,
                    fontFamily: '"Archivo Black", sans-serif',
                    fontSize: '0.78rem',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.period}
                </span>
                <h3
                  style={{
                    margin: '4px 0 0',
                    fontSize: 'clamp(1.3rem, 2.4vw, 1.85rem)',
                    color: '#1c1b20',
                    fontFamily: '"Archivo Black", sans-serif',
                    lineHeight: 1.15,
                  }}
                >
                  {item.company}
                </h3>
              </div>

              <span
                className="px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                style={{
                  backgroundColor: `${color}18`,
                  color: color,
                  border: `1.5px solid ${color}44`,
                  fontFamily: '"Archivo Black", sans-serif',
                }}
              >
                {item.role}
              </span>
            </div>

            {/* Bullet Highlights */}
            <ul className="space-y-2.5 my-2">
              {item.highlights.map((highlight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-zinc-700 text-xs sm:text-sm leading-relaxed font-sans">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                    style={{ backgroundColor: color }}
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
const ITEM_H = 76; // px per timeline entry

/* ─── Experience Timeline Main Component ─────────────────────────── */
export const ExperienceTimeline: React.FC = () => {
  const [active, setActive] = useState(0);
  const cardAreaRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const cooldown = useRef(false);
  const touchStartY = useRef<number | null>(null);

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
            fontSize: '0.78rem',
            textTransform: 'uppercase',
            color: '#15cea9',
            fontFamily: '"Archivo Black", sans-serif',
            letterSpacing: '0.1em',
            marginBottom: 4,
          }}
        >
          Track Record & Engineering
        </p>
        <h2
          className="text-zinc-900 font-black tracking-tight relative z-30"
          style={{ fontSize: 'clamp(1.8rem, 3.8vw, 3rem)' }}
        >
          Work Experience
        </h2>
      </div>

      <div className="w-full flex flex-row items-center justify-center gap-8 md:gap-14 relative z-20">
        {/* ── Left: Connected Timeline Navigation ── */}
        <div
          className="experience-timeline-nav flex-shrink-0 relative"
          style={{ width: 'clamp(220px, 25vw, 290px)' }}
        >
          {/* Soft White Glow Backdrop */}
          <div
            aria-hidden="true"
            className="absolute -inset-8 -z-10 rounded-[36px] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0) 80%)',
              filter: 'blur(20px)',
            }}
          />
          <div style={{ position: 'relative', height: ITEM_H * 4.5 }}>
            {/* Scrollable list */}
            <div
              ref={timelineRef}
              className="experience-timeline-scroll"
              style={{
                height: '100%',
                overflowY: 'scroll',
                paddingTop: Math.round(ITEM_H * 0.4),
                paddingBottom: Math.round(ITEM_H * 0.4),
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
                      <span
                        style={{
                          margin: 0,
                          fontSize: '0.88rem',
                          lineHeight: 1.25,
                          color: isCurrent ? '#1c1b20' : '#6b6880',
                          fontFamily: '"Archivo Black", sans-serif',
                          transition: 'color 0.3s ease',
                        }}
                      >
                        {item.company}
                      </span>
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

            {/* Gradient fade edge overlays */}
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                zIndex: 10,
                background:
                  'linear-gradient(to bottom, rgba(248,247,252,1) 0%, transparent 20%, transparent 80%, rgba(248,247,252,1) 100%)',
              }}
            />
          </div>
        </div>

        {/* ── Right: 3D Layered Card Stack ── */}
        <div
          ref={cardAreaRef}
          style={{
            flex: '1 1 380px',
            maxWidth: 620,
            position: 'relative',
            height: 'clamp(460px, 58vh, 560px)',
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
