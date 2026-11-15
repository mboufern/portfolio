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
  tipX: number;
  tipY: number;
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
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );
  const [windowWidth, setWindowWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [windowHeight, setWindowHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const updatePoints = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    setWindowWidth(width);
    setWindowHeight(height);
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
    // Re-measure dot positions on mount/route/resize cleanly via RAF & timers
    const rafId = requestAnimationFrame(updatePoints);
    const timer1 = setTimeout(updatePoints, 80);
    const timer2 = setTimeout(updatePoints, 260);
    window.addEventListener('resize', updatePoints);
    window.addEventListener('scroll', updatePoints, true);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', updatePoints);
      window.removeEventListener('scroll', updatePoints, true);
    };
  }, [updatePoints, activeSectionIdx]);

  const geometries = useMemo<VineGeometry[]>(() => {
    if (dotPoints.length !== NAVIGATION_ITEMS.length) return [];

    if (isMobile) {
      // ── Mobile Layout: Long, Smooth Sweeping Veins Across Fullscreen Height ──
      const hScale = Math.min(1.12, Math.max(0.7, windowHeight / 820));
      const heightTiers = [86, 140, 198, 114, 190, 138, 84];
      const waveSways = [-34, 40, -44, 36, -42, 40, -34];
      const fanXOffsets = [-36, -24, -12, 0, 14, 26, 38];

      return dotPoints.map((pt, idx) => {
        const height = heightTiers[idx] * hScale;
        const sway = waveSways[idx];
        const fanX = fanXOffsets[idx];

        const startX = pt.x;
        const startY = pt.y - 4;
        const endX = Math.min(windowWidth - 46, Math.max(46, startX + fanX));
        const endY = startY - height;

        const cp1x = Math.min(windowWidth - 20, Math.max(20, startX + sway));
        const cp1y = startY - height * 0.52;
        const cp2x = Math.min(windowWidth - 20, Math.max(20, endX - sway * 0.65));
        const cp2y = endY + height * 0.36;

        const path = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        return {
          path,
          tipX: endX,
          tipY: endY,
          labelX: endX,
          labelY: endY - 8,
          textAlign: 'center',
        };
      });
    }

    // ── Desktop Layout: Long, Wild Yet Smooth Organic Tree Veins in Top-Right Corner ──
    const widthScale =
      windowWidth < 860 ? 0.68 : windowWidth < 1100 ? 0.82 : windowWidth < 1360 ? 0.94 : 1.08;
    const heightScale = Math.min(widthScale, windowHeight / 780);

    // Sweeping diagonal cascade across the top-right corner with wide smooth S-curves
    const reachLefts = [285, 245, 205, 165, 125, 82, 36];
    const dropDowns = [64, 122, 182, 244, 306, 368, 430];
    const waveSways = [-64, 72, -78, 68, -74, 62, -50];

    return dotPoints.map((pt, idx) => {
      const reachX = reachLefts[idx] * widthScale;
      const dropY = dropDowns[idx] * heightScale;
      const sway = waveSways[idx] * widthScale;

      const startX = pt.x;
      const startY = pt.y + 5;

      const endX = startX - reachX;
      const endY = startY + dropY;

      // Wide, sweeping cubic Bézier control points for wild yet silky curves
      const cp1x = Math.min(windowWidth - 16, startX - reachX * 0.14 + sway * 1.05);
      const cp1y = startY + dropY * 0.65;

      const cp2x = Math.min(windowWidth - 16, endX + reachX * 0.28 - sway * 0.92);
      const cp2y = endY - dropY * 0.3;

      const path = `M ${startX.toFixed(1)} ${startY.toFixed(1)} C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

      return {
        path,
        tipX: endX,
        tipY: endY,
        labelX: endX - 10,
        labelY: endY,
        textAlign: 'right',
      };
    });
  }, [dotPoints, isMobile, windowWidth, windowHeight]);

  // Visible strictly on the Home page only
  const isVisible = activeSectionIdx === 0;

  return (
    <AnimatePresence>
      {isVisible && geometries.length === NAVIGATION_ITEMS.length && (
        <motion.div
          key="sidebar-vine-nav"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.22, ease: 'easeOut' } }}
          className="fixed inset-0 w-screen h-[100dvh] pointer-events-none z-40 select-none overflow-hidden"
          aria-hidden={!isVisible}
        >
          {/* Full-screen SVG for Organic Single-Stem Tree Veins */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none">
            {geometries.map((geo, idx) => {
              const item = NAVIGATION_ITEMS[idx];
              const isHovered = hoveredIdx === idx;
              const isActive = activeSectionIdx === idx;
              const accentColor = item.accent;
              const vineDelay = prefersReducedMotion ? 0 : 0.45 + idx * 0.045;

              return (
                <g key={`vine-group-${item.key}`}>
                  {/* Ambient hover glow along the main vein */}
                  {isHovered && (
                    <motion.path
                      d={geo.path}
                      fill="none"
                      stroke={accentColor}
                      strokeWidth={7}
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      exit={{ opacity: 0 }}
                      style={{ filter: 'blur(4px)' }}
                    />
                  )}

                  {/* Main Organic Vein Path */}
                  <motion.path
                    d={geo.path}
                    fill="none"
                    stroke={
                      isHovered || isActive
                        ? accentColor
                        : 'rgba(135, 130, 155, 0.48)'
                    }
                    strokeWidth={isHovered ? 2.2 : isActive ? 1.7 : 1.25}
                    strokeLinecap="round"
                    initial={{
                      pathLength: prefersReducedMotion ? 1 : 0,
                      opacity: 0,
                    }}
                    animate={{
                      pathLength: 1,
                      opacity: isHovered ? 1 : 0.9,
                    }}
                    transition={{
                      pathLength: {
                        duration: prefersReducedMotion ? 0 : 0.72,
                        delay: vineDelay,
                        ease: [0.22, 1, 0.36, 1],
                      },
                      opacity: { duration: 0.3, delay: vineDelay },
                      stroke: { duration: 0.2 },
                      strokeWidth: { duration: 0.2 },
                    }}
                  />

                  {/* Tip Node Anchor connecting vein to label */}
                  <motion.circle
                    cx={geo.tipX}
                    cy={geo.tipY}
                    r={isHovered || isActive ? 3 : 2.1}
                    fill={
                      isHovered || isActive
                        ? accentColor
                        : 'rgba(135, 130, 155, 0.72)'
                    }
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: prefersReducedMotion ? 0 : vineDelay + 0.42,
                      duration: 0.25,
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Clickable Borderless Labels at Branch Tips */}
          {geometries.map((geo, idx) => {
            const item = NAVIGATION_ITEMS[idx];
            const isHovered = hoveredIdx === idx;
            const isActive = activeSectionIdx === idx;
            const labelDelay = prefersReducedMotion ? 0 : 0.72 + idx * 0.045;

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
                  padding: '2px 5px',
                }}
                initial={{
                  opacity: 0,
                  x: isMobile ? 0 : 8,
                  y: isMobile ? 6 : 0,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.35,
                  delay: labelDelay,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-label={`Navigate to ${item.label}`}
              >
                <span
                  className="block whitespace-nowrap transition-all duration-200"
                  style={{
                    fontSize: isMobile
                      ? '10.5px'
                      : 'clamp(11px, 1.05vw, 12.5px)',
                    fontWeight: isHovered || isActive ? 700 : 500,
                    letterSpacing: '0.03em',
                    color: isHovered
                      ? '#1c1b20'
                      : isActive
                        ? '#0d9488'
                        : 'rgba(85, 80, 102, 0.9)',
                    textShadow:
                      '0 1px 4px rgba(255, 255, 255, 0.96), 0 0 12px rgba(248, 247, 252, 0.9)',
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
