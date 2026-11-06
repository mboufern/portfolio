# Sidebar Vine Navigation Callouts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build organic curved SVG "vine" connector lines and floating section labels protruding from the sidebar navigation dots in the Hero section, with timed sequential animations and bidirectional hover states.

**Architecture:** A dedicated `SidebarVineNav.tsx` component calculates live coordinates from `Navigation.tsx` dot button elements, renders responsive cubic Bézier curves on a full-viewport SVG canvas, and positions borderless text labels with subtle text-shadows. Framer Motion coordinates the staged entrance (logo $\to$ vines $\to$ labels) and section transitions.

**Tech Stack:** React 19, TypeScript, Tailwind CSS, Framer Motion 13.

## Global Constraints

- Visible **only in the Hero section** (`activeSectionIdx === 0`); must cleanly fade out when navigating downstream.
- Floating labels must be pure text with **no pill containers, no borders, and no card backgrounds**.
- Subtle text shadow (`0 1px 4px rgba(255, 255, 255, 0.9), 0 1px 8px rgba(0, 0, 0, 0.05)`).
- Vine animation must start *after* the hero logo entrance completes ($\sim 0.95\text{s}$).
- Hovering a dot or a label highlights both the corresponding vine and label to a bolder, vibrant accent state.
- Fully responsive: leftward Bézier S-curves on desktop/tablet, upward curves on mobile.
- Zero extra npm dependencies (native SVG + Framer Motion).
- Full `prefers-reduced-motion` compliance.

---

### Task 1: Create `SidebarVineNav.tsx` Component

**Files:**
- Create: `src/components/SidebarVineNav.tsx`

**Interfaces:**
- Consumes:
  ```ts
  interface SidebarVineNavProps {
    activeSectionIdx: number;
    onNavigate: (index: number) => void;
    hoveredIdx: number | null;
    onHoverChange: (index: number | null) => void;
    dotRefs: React.RefObject<(HTMLElement | null)[]>;
  }
  ```
- Produces: `SidebarVineNav: React.FC<SidebarVineNavProps>`

- [ ] **Step 1: Write `src/components/SidebarVineNav.tsx`**

```tsx
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
    setIsMobile(window.innerWidth < 640);
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
    const timer = setTimeout(updatePoints, 120);
    return () => {
      window.removeEventListener('resize', updatePoints);
      window.removeEventListener('scroll', updatePoints, true);
      clearTimeout(timer);
    };
  }, [updatePoints]);

  // Compute organic Bézier curves for each dot
  const geometries = useMemo<VineGeometry[]>(() => {
    if (dotPoints.length !== NAVIGATION_ITEMS.length) return [];

    return dotPoints.map((pt, idx) => {
      if (isMobile) {
        // Mobile Layout: Staggered upward curves from bottom horizontal bar
        // Alternating heights to prevent label collisions across 360-420px viewports
        const verticalStagger = idx % 2 === 0 ? 56 : 84;
        const startX = pt.x;
        const startY = pt.y - pt.height / 2;
        const endX = pt.x;
        const endY = pt.y - verticalStagger;

        // Vertical Bézier with subtle organic sway
        const cpOffsetY = verticalStagger * 0.45;
        const cpSway = (idx - 3) * 3; // slight fan-out

        const path = `M ${startX} ${startY} C ${startX + cpSway} ${startY - cpOffsetY}, ${endX} ${endY + cpOffsetY}, ${endX} ${endY}`;

        return {
          path,
          labelX: endX,
          labelY: endY - 6,
          textAlign: 'center',
        };
      } else {
        // Desktop Layout: S-curves protruding leftward from right vertical bar
        const startX = pt.x - pt.width / 2;
        const startY = pt.y;
        
        // Gentle horizontal reach into negative space
        const reach = 110 + (Math.abs(idx - 3) * 6);
        const endX = startX - reach;
        const endY = startY;

        // Organic cubic Bézier control points for natural horizontal flow
        const cpX1 = startX - reach * 0.42;
        const cpY1 = startY;
        const cpX2 = endX + reach * 0.42;
        const cpY2 = endY;

        const path = `M ${startX} ${startY} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${endX} ${endY}`;

        return {
          path,
          labelX: endX - 8,
          labelY: endY,
          textAlign: 'right',
        };
      }
    });
  }, [dotPoints, isMobile]);

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

              // Animation delays: Start at 0.95s after logo entrance, then ripple by 50ms
              const vineDelay = prefersReducedMotion ? 0 : 0.95 + idx * 0.05;

              return (
                <g key={`vine-group-${item.key}`}>
                  {/* Subtle background glow on hover */}
                  {isHovered && (
                    <motion.path
                      d={geo.path}
                      fill="none"
                      stroke={accentColor}
                      strokeWidth={6}
                      strokeLinecap="round"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.25 }}
                      exit={{ opacity: 0 }}
                      style={{ filter: 'blur(4px)' }}
                    />
                  )}

                  {/* Main Vine Path */}
                  <motion.path
                    d={geo.path}
                    fill="none"
                    stroke={isHovered ? accentColor : 'rgba(140, 136, 158, 0.42)'}
                    strokeWidth={isHovered ? 2.25 : 1.25}
                    strokeLinecap="round"
                    initial={{ pathLength: prefersReducedMotion ? 1 : 0, opacity: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: isHovered ? 1 : 0.85,
                    }}
                    transition={{
                      pathLength: {
                        duration: prefersReducedMotion ? 0 : 0.65,
                        delay: vineDelay,
                        ease: [0.25, 1, 0.5, 1],
                      },
                      opacity: { duration: 0.3, delay: vineDelay },
                      stroke: { duration: 0.2 },
                      strokeWidth: { duration: 0.2 },
                    }}
                  />

                  {/* Tiny organic bud / dot at the tip of the vine */}
                  <motion.circle
                    cx={isMobile ? geo.labelX : geo.labelX + 8}
                    cy={isMobile ? geo.labelY + 6 : geo.labelY}
                    r={isHovered ? 2.5 : 1.75}
                    fill={isHovered ? accentColor : 'rgba(140, 136, 158, 0.6)'}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      delay: prefersReducedMotion ? 0 : vineDelay + 0.45,
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
            const labelDelay = prefersReducedMotion ? 0 : 1.35 + idx * 0.05;

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
                  x: isMobile ? 0 : 10,
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
                    letterSpacing: '0.03em',
                    color: isHovered ? '#1c1b20' : 'rgba(90, 86, 108, 0.85)',
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
```

- [ ] **Step 2: Typecheck with `tsc --noEmit`**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/SidebarVineNav.tsx
git commit -m "feat(navigation): create SidebarVineNav component with organic bezier vines"
```

---

### Task 2: Integrate `SidebarVineNav` into `Navigation.tsx` and Wire Bidirectional Hover State

**Files:**
- Modify: `src/components/Navigation.tsx`

**Interfaces:**
- Connects `dotRefs` to each navigation dot button.
- Adds shared `hoveredIdx` state and passes it to `SidebarVineNav`.
- Scales dot and activates glow when `hoveredIdx === idx`.

- [ ] **Step 1: Update `src/components/Navigation.tsx`**

Integrate dot refs, shared `hoveredIdx` state, and render `<SidebarVineNav />`.

- [ ] **Step 2: Verify with `npx tsc --noEmit`**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 3: Verify with `npm run build`**

Run: `npm run build`
Expected: Build passes with 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/Navigation.tsx
git commit -m "feat(navigation): integrate SidebarVineNav and bidirectional hover synchrony"
```

---

### Task 3: Quality Verification & Impeccable Detector Scan

**Files:**
- Test & Audit: `src/components/SidebarVineNav.tsx`, `src/components/Navigation.tsx`, `src/components/HeroSection.tsx`

- [ ] **Step 1: Run mechanical detector**

Run:
`& "C:\Users\fenn_\.gemini\config\skills\impeccable\scripts\impeccable.cmd" detect --json src/components/SidebarVineNav.tsx src/components/Navigation.tsx src/components/HeroSection.tsx`
Expected: `[]` (0 findings).

- [ ] **Step 2: Run production build and preview server check**

Run: `npm run build`
Expected: PASS

- [ ] **Step 3: Final Commit & Clean state**

```bash
git status -s
```
Ensure working tree is clean.
