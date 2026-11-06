import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAVIGATION_ITEMS } from '../data/portfolioData';

interface SidebarVineNavProps {
  activeSectionIdx: number;
  onNavigate: (index: number) => void;
  hoveredIdx: number | null;
  onHoverChange: (index: number | null) => void;
  dotRefs: React.RefObject<(HTMLElement | null)[]>;
}

interface DotPoint {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface VineGeometry {
  path: string;
  labelX: number;
  labelY: number;
  textAlign: 'right' | 'center';
}

export const SidebarVineNav: React.FC<SidebarVineNavProps> = ({
  activeSectionIdx,
  onNavigate,
  hoveredIdx,
  onHoverChange,
  dotRefs,
}) => {
  const [dotPoints, setDotPoints] = useState<DotPoint[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Update layout & dot coordinates on mount, resize, and scroll
  const updatePoints = useCallback(() => {
    const width = window.innerWidth;
    setWindowWidth(width);
    setIsMobile(width < 640);

    if (!dotRefs.current) return;

    const points: DotPoint[] = [];
    for (let i = 0; i < NAVIGATION_ITEMS.length; i++) {
      const el = dotRefs.current[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        points.push({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
          width: rect.width,
          height: rect.height,
        });
      }
    }
    if (points.length === NAVIGATION_ITEMS.length) {
      setDotPoints(points);
    }
  }, [dotRefs]);

  useEffect(() => {
    updatePoints();
    window.addEventListener('resize', updatePoints);
    window.addEventListener('scroll', updatePoints, true);
    const timer1 = setTimeout(updatePoints, 60);
    const timer2 = setTimeout(updatePoints, 200);
    return () => {
      window.removeEventListener('resize', updatePoints);
      window.removeEventListener('scroll', updatePoints, true);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [updatePoints]);

  // Algorithmic Liquid Vine Curves (Cubic Bézier, Intertwining Mid-Flight, No Noisy Sub-Branches)
  const geometries = useMemo<VineGeometry[]>(() => {
    if (dotPoints.length !== NAVIGATION_ITEMS.length) return [];

    if (isMobile) {
      // ── Mobile Layout: Smooth Liquid S-Curves Rising from Bottom Bar ──
      // Moderated heights and gentle lateral sways to avoid crowding
      const heightTiers = [52, 82, 114, 64, 110, 82, 52];
      const waveSways = [-10, 12, -14, 10, -12, 12, -10];
      const fanXOffsets = [-22, -12, -4, 0, 6, 14, 24];

      return dotPoints.map((pt, idx) => {
        const height = heightTiers[idx];
        const sway = waveSways[idx];
        const fanX = fanXOffsets[idx];

        const startX = pt.x;
        const startY = pt.y - pt.height / 2;

        const endX = startX + fanX;
        const endY = startY - height;

        // Smooth cubic control points
        const cp1x = startX + sway;
        const cp1y = startY - height * 0.45;

        const cp2x = endX - sway * 0.3;
        const cp2y = endY + height * 0.4;

        const path = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        return {
          path,
          labelX: endX,
          labelY: endY - 6,
          textAlign: 'center',
        };
      });
    } else {
      // ── Desktop Layout: Smooth Liquid S-Curves Protruding Leftward ──
      // Moderated reach (130px to 190px) to prevent over-extension into hero content
      const scaleFactor = windowWidth < 1024 ? 0.8 : windowWidth < 1280 ? 0.92 : 1.0;
      const baseReaches = [135, 170, 192, 155, 188, 168, 132];

      // Soft wave amplitudes for organic intertwining without harsh kinks
      const waveAmps = [11, -13, 15, -11, 13, -11, 9];

      // Vertical fan-out (expands vertical span so labels have ~45px-52px vertical clearance)
      const fanYOffsets = [-36, -20, -6, 0, 8, 22, 38];

      return dotPoints.map((pt, idx) => {
        const reach = baseReaches[idx] * scaleFactor;
        const startX = pt.x - pt.width / 2;
        const startY = pt.y;

        const fanY = fanYOffsets[idx];
        const endX = startX - reach;
        const endY = startY + fanY;

        const wave = waveAmps[idx];

        // Cubic Bézier control points:
        // cp1 provides the initial gentle wave swell (alternating up/down for intertwining)
        const cp1x = startX - reach * 0.44;
        const cp1y = startY + wave;

        // cp2 levels out smoothly into the label position
        const cp2x = endX + reach * 0.4;
        const cp2y = endY - wave * 0.28;

        const path = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        return {
          path,
          labelX: endX - 8,
          labelY: endY,
          textAlign: 'right',
        };
      });
    }
  }, [dotPoints, isMobile, windowWidth]);

  // Only render when in Hero section
  const isVisible = activeSectionIdx === 0;

  return (
    <AnimatePresence>
      {isVisible && geometries.length === NAVIGATION_ITEMS.length && (
        <motion.div
          key="sidebar-vine-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
          className="fixed inset-0 pointer-events-none z-40 select-none overflow-hidden"
          aria-hidden={!isVisible}
        >
          {/* Full-screen SVG for organic vines */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none">
            {geometries.map((geo, idx) => {
              const item = NAVIGATION_ITEMS[idx];
              const isHovered = hoveredIdx === idx;
              const accentColor = item.accent;

              // Animation delays: Start at 0.95s after logo entrance, then ripple by 45ms
              const vineDelay = prefersReducedMotion ? 0 : 0.95 + idx * 0.045;

              return (
                <g key={`vine-group-${item.key}`}>
                  {/* Soft ambient glow along the vine on hover */}
                  {isHovered && (
                    <motion.path
                      d={geo.path}
                      fill="none"
                      stroke={accentColor}
                      strokeWidth={7}
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.24 }}
                      exit={{ opacity: 0 }}
                      style={{ filter: 'blur(4px)' }}
                    />
                  )}

                  {/* Main Silky Vine Path */}
                  <motion.path
                    d={geo.path}
                    fill="none"
                    stroke={isHovered ? accentColor : 'rgba(135, 130, 155, 0.42)'}
                    strokeWidth={isHovered ? 2.35 : 1.3}
                    strokeLinecap="round"
                    initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: isHovered ? 1 : 0.85,
                    }}
                    transition={{
                      pathLength: {
                        duration: prefersReducedMotion ? 0 : 0.7,
                        delay: vineDelay,
                        ease: [0.22, 1, 0.36, 1], // natural liquid ease-out
                      },
                      opacity: { duration: 0.3, delay: vineDelay },
                      stroke: { duration: 0.2 },
                      strokeWidth: { duration: 0.2 },
                    }}
                  />

                  {/* Delicate Leaf Bud / Tip Anchor connecting to label */}
                  <motion.circle
                    cx={isMobile ? geo.labelX : geo.labelX + 8}
                    cy={isMobile ? geo.labelY + 6 : geo.labelY}
                    r={isHovered ? 2.75 : 1.8}
                    fill={isHovered ? accentColor : 'rgba(135, 130, 155, 0.65)'}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: prefersReducedMotion ? 0 : vineDelay + 0.45,
                      duration: 0.25,
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating Borderless Text Labels */}
          {geometries.map((geo, idx) => {
            const item = NAVIGATION_ITEMS[idx];
            const isHovered = hoveredIdx === idx;
            const labelDelay = prefersReducedMotion ? 0 : 1.35 + idx * 0.045;

            return (
              <motion.button
                key={`label-${item.key}`}
                type="button"
                onClick={() => onNavigate(idx)}
                onMouseEnter={() => onHoverChange(idx)}
                onMouseLeave={() => onHoverChange(null)}
                onFocus={() => onHoverChange(idx)}
                onBlur={() => onHoverChange(null)}
                className="group absolute pointer-events-auto cursor-pointer outline-none transition-transform duration-200"
                style={{
                  left: geo.labelX,
                  top: geo.labelY,
                  transform: isMobile
                    ? 'translate(-50%, -100%)'
                    : 'translate(-100%, -50%)',
                  background: 'transparent',
                  border: 'none',
                  padding: '2px 4px',
                }}
                initial={{
                  opacity: 0,
                  x: isMobile ? 0 : 10,
                  y: isMobile ? 6 : 0,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.38,
                  delay: labelDelay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-label={`Navigate to ${item.label}`}
              >
                <span
                  className="block whitespace-nowrap transition-all duration-200"
                  style={{
                    fontSize: isMobile ? '10.5px' : 'clamp(11px, 1.05vw, 12.5px)',
                    fontWeight: isHovered ? 700 : 500,
                    letterSpacing: '0.03em',
                    color: isHovered ? '#1c1b20' : 'rgba(85, 80, 102, 0.88)',
                    textShadow: isHovered
                      ? '0 1px 4px rgba(255, 255, 255, 0.95), 0 0 12px rgba(255, 255, 255, 0.8)'
                      : '0 1px 3px rgba(255, 255, 255, 0.9), 0 1px 6px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
