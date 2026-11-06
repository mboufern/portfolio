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
  tendrilPath?: string;
  tendrilTip?: [number, number];
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

  // Algorithmic Organic Vine & Intertwining Geometry Generator
  const geometries = useMemo<VineGeometry[]>(() => {
    if (dotPoints.length !== NAVIGATION_ITEMS.length) return [];

    if (isMobile) {
      // ── Mobile Algorithm: 3-Tier Staggered Vertical S-Curves with Lateral Sways ──
      // Alternating vertical tiers prevent horizontal label collisions
      const heightTiers = [64, 106, 148, 82, 142, 106, 64];
      // Alternating lateral sways create intertwining organic flow
      const waveSways = [-16, 20, -22, 18, -20, 22, -16];
      // Horizontal fan-out offsets from center
      const fanXOffsets = [-28, -16, -6, 0, 8, 18, 30];

      return dotPoints.map((pt, idx) => {
        const height = heightTiers[idx];
        const sway = waveSways[idx];
        const fanX = fanXOffsets[idx];

        const startX = pt.x;
        const startY = pt.y - pt.height / 2;

        const endX = startX + fanX;
        const endY = startY - height;

        const midX = startX + sway + fanX * 0.4;
        const midY = startY - height * 0.52;

        const cp1x = startX + sway * 0.85;
        const cp1y = startY - height * 0.22;

        const cp2x = midX - sway * 0.15;
        const cp2y = midY + height * 0.16;

        const cp3x = endX;
        const cp3y = endY + 28;

        const path = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)} S ${cp3x.toFixed(1)} ${cp3y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        return {
          path,
          labelX: endX,
          labelY: endY - 6,
          textAlign: 'center',
        };
      });
    } else {
      // ── Desktop Algorithm: Intertwining Cubic Bézier Vines with Dynamic Fan-Out ──
      // Scale reach responsive to available space in the right margin
      const scaleFactor = windowWidth < 1024 ? 0.78 : windowWidth < 1280 ? 0.9 : 1.0;

      // Deep staggered reaches: between 190px and 310px (protruding significantly more)
      const baseReaches = [205, 270, 315, 245, 300, 260, 195];
      // Alternating vertical wave amplitudes: even indices wave downward/upward, odds wave opposite
      // This produces the intertwining/braided vine appearance in the mid-flight
      const waveAmps = [24, -28, 30, -26, 28, -24, 22];
      // Vertical fan-out offsets from center (dots expand from ~210px span to ~320px span)
      // This guarantees 45px-60px vertical separation between adjacent labels
      const fanYOffsets = [-50, -28, -8, 0, 10, 32, 56];

      return dotPoints.map((pt, idx) => {
        const reach = baseReaches[idx] * scaleFactor;
        const startX = pt.x - pt.width / 2;
        const startY = pt.y;

        const fanY = fanYOffsets[idx];
        const endX = startX - reach;
        const endY = startY + fanY;

        const wave = waveAmps[idx];

        // Midpoint where the organic intertwining occurs
        const midX = startX - reach * 0.52;
        const midY = startY + wave + fanY * 0.35;

        // First cubic segment control points
        const cp1x = startX - reach * 0.22;
        const cp1y = startY + wave * 0.85;

        const cp2x = midX + reach * 0.16;
        const cp2y = midY - wave * 0.15;

        // Second smooth segment approaches endX horizontally (smooth landing at label)
        const cp3x = endX + 46;
        const cp3y = endY;

        const path = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${midX.toFixed(1)} ${midY.toFixed(1)} S ${cp3x.toFixed(1)} ${cp3y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        // Secondary organic branchlet / curling leaf sprout off the midpoint
        const tendrilDir = wave > 0 ? 1 : -1;
        const tendrilEnd: [number, number] = [midX - 16, midY + tendrilDir * 14];
        const tendrilPath = `M ${midX.toFixed(1)} ${midY.toFixed(1)} Q ${(midX - 10).toFixed(1)} ${(midY + tendrilDir * 18).toFixed(1)}, ${tendrilEnd[0].toFixed(1)} ${tendrilEnd[1].toFixed(1)}`;

        return {
          path,
          tendrilPath,
          tendrilTip: tendrilEnd,
          labelX: endX - 10,
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
                  {/* Subtle background glow on hover */}
                  {isHovered && (
                    <motion.path
                      d={geo.path}
                      fill="none"
                      stroke={accentColor}
                      strokeWidth={8}
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.28 }}
                      exit={{ opacity: 0 }}
                      style={{ filter: 'blur(5px)' }}
                    />
                  )}

                  {/* Main Organic Vine Path */}
                  <motion.path
                    d={geo.path}
                    fill="none"
                    stroke={isHovered ? accentColor : 'rgba(135, 130, 155, 0.45)'}
                    strokeWidth={isHovered ? 2.5 : 1.35}
                    strokeLinecap="round"
                    initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: isHovered ? 1 : 0.85,
                    }}
                    transition={{
                      pathLength: {
                        duration: prefersReducedMotion ? 0 : 0.72,
                        delay: vineDelay,
                        ease: [0.22, 1, 0.36, 1], // natural botanical ease-out
                      },
                      opacity: { duration: 0.3, delay: vineDelay },
                      stroke: { duration: 0.2 },
                      strokeWidth: { duration: 0.2 },
                    }}
                  />

                  {/* Secondary Botanical Tendril Sprout (Desktop only) */}
                  {geo.tendrilPath && (
                    <motion.path
                      d={geo.tendrilPath}
                      fill="none"
                      stroke={isHovered ? accentColor : 'rgba(135, 130, 155, 0.35)'}
                      strokeWidth={isHovered ? 1.75 : 1.0}
                      strokeLinecap="round"
                      initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: isHovered ? 0.9 : 0.65 }}
                      transition={{
                        pathLength: {
                          duration: prefersReducedMotion ? 0 : 0.45,
                          delay: prefersReducedMotion ? 0 : vineDelay + 0.32,
                          ease: 'easeOut',
                        },
                        opacity: { duration: 0.25, delay: vineDelay + 0.32 },
                      }}
                    />
                  )}

                  {/* Delicate leaf bud at tendril tip */}
                  {geo.tendrilTip && (
                    <motion.circle
                      cx={geo.tendrilTip[0]}
                      cy={geo.tendrilTip[1]}
                      r={isHovered ? 2.0 : 1.4}
                      fill={isHovered ? accentColor : 'rgba(135, 130, 155, 0.65)'}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: prefersReducedMotion ? 0 : vineDelay + 0.48,
                        duration: 0.25,
                      }}
                    />
                  )}

                  {/* Leaf Bud / Blossom at the tip connecting directly to the label */}
                  <motion.circle
                    cx={isMobile ? geo.labelX : geo.labelX + 10}
                    cy={isMobile ? geo.labelY + 6 : geo.labelY}
                    r={isHovered ? 3.0 : 2.0}
                    fill={isHovered ? accentColor : 'rgba(135, 130, 155, 0.7)'}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: prefersReducedMotion ? 0 : vineDelay + 0.5,
                      duration: 0.3,
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
                className="absolute pointer-events-auto cursor-pointer outline-none transition-transform duration-200"
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
                  x: isMobile ? 0 : 12,
                  y: isMobile ? 8 : 0,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.4,
                  delay: labelDelay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-label={`Navigate to ${item.label}`}
              >
                <span
                  className="block whitespace-nowrap transition-all duration-200"
                  style={{
                    fontSize: isMobile ? '10.5px' : 'clamp(11.5px, 1.1vw, 13px)',
                    fontWeight: isHovered ? 700 : 500,
                    letterSpacing: '0.035em',
                    color: isHovered ? '#1c1b20' : 'rgba(90, 86, 108, 0.88)',
                    textShadow: isHovered
                      ? '0 1px 4px rgba(255, 255, 255, 0.95), 0 0 14px rgba(255, 255, 255, 0.85)'
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
