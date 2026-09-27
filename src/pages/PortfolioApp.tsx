import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  NAVIGATION_ITEMS,
  PROJECT_SECTIONS,
} from '../data/portfolioData';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/HeroSection';
import { ExperienceSection } from '../components/ExperienceSection';
import { ProjectSection } from '../components/ProjectSection';
import { GamesSection } from '../components/GamesSection';
import { ConnectSection } from '../components/ConnectSection';

// Silky smooth cubic easing: accelerates smoothly and gently decelerates
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

// Check if an event target is inside an element that can scroll vertically in the given direction
const canScrollChild = (target: HTMLElement | null, deltaY: number, container: HTMLElement | null): boolean => {
  let el: HTMLElement | null = target;
  while (el && el !== container && el !== document.body) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      if (el.scrollHeight > el.clientHeight) {
        if (deltaY > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 2) {
          return true; // child can still scroll downward
        }
        if (deltaY < 0 && el.scrollTop > 2) {
          return true; // child can still scroll upward
        }
      }
    }
    el = el.parentElement;
  }
  return false;
};

export const PortfolioApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  const isProgrammaticScroll = useRef(false);
  const isCooldown = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const isInitialMount = useRef(true);
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // Map route to section index
  const routeToIndex = useCallback((pathname: string) => {
    const idx = NAVIGATION_ITEMS.findIndex(
      (item) => item.route === pathname || (item.route !== '/' && pathname.startsWith(item.route))
    );
    return idx >= 0 ? idx : 0;
  }, []);

  // Smooth scroll using requestAnimationFrame with dynamic duration & easeInOutCubic
  const animateScrollTo = useCallback(
    (targetIdx: number, onComplete?: () => void) => {
      const container = containerRef.current;
      if (!container) return;

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }

      isProgrammaticScroll.current = true;
      setActiveSection(targetIdx);

      const startY = container.scrollTop;
      const targetY = targetIdx * window.innerHeight;
      const diff = targetY - startY;

      if (Math.abs(diff) < 2) {
        container.scrollTop = targetY;
        isProgrammaticScroll.current = false;
        onComplete?.();
        return;
      }

      // Dynamic duration: ~500ms for 1 section, up to ~850ms for long jumps (e.g. 0 to 6)
      const distanceSections = Math.abs(targetIdx - activeSectionRef.current);
      const duration = Math.min(850, Math.max(500, distanceSections * 70 + 440));
      const startTime = performance.now();

      const step = (now: number) => {
        if (!containerRef.current) {
          isProgrammaticScroll.current = false;
          return;
        }

        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);

        containerRef.current.scrollTop = startY + diff * eased;

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          containerRef.current.scrollTop = targetY;
          animFrameRef.current = null;
          isProgrammaticScroll.current = false;
          onComplete?.();
        }
      };

      animFrameRef.current = requestAnimationFrame(step);
    },
    []
  );

  // Navigate to section index and synchronize URL route
  const navigateToSection = useCallback(
    (targetIdx: number) => {
      if (targetIdx < 0 || targetIdx >= NAVIGATION_ITEMS.length) return;
      if (targetIdx === activeSectionRef.current && !isProgrammaticScroll.current) return;

      animateScrollTo(targetIdx, () => {
        const targetRoute = NAVIGATION_ITEMS[targetIdx].route;
        if (location.pathname !== targetRoute) {
          navigate(targetRoute, { replace: true });
        }
      });
    },
    [animateScrollTo, location.pathname, navigate]
  );

  // Sync scroll position with browser route (initial load and back/forward browser buttons)
  useEffect(() => {
    const targetIdx = routeToIndex(location.pathname);
    const container = containerRef.current;

    if (isInitialMount.current) {
      isInitialMount.current = false;
      setActiveSection(targetIdx);
      if (container) {
        container.scrollTop = targetIdx * window.innerHeight;
      }
      return;
    }

    if (!isProgrammaticScroll.current && targetIdx !== activeSectionRef.current) {
      navigateToSection(targetIdx);
    }
  }, [location.pathname, routeToIndex, navigateToSection]);

  // Window resize handler: keep current section centered
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && !isProgrammaticScroll.current) {
        containerRef.current.scrollTop = activeSectionRef.current * window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Wheel event listener: smooth section snapping without mechanical browser resistance
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Check if scrolling inside a scrollable child element
      if (canScrollChild(e.target as HTMLElement, e.deltaY, container)) {
        return;
      }

      e.preventDefault();

      if (isProgrammaticScroll.current || isCooldown.current) {
        return;
      }

      if (Math.abs(e.deltaY) < 22) {
        return;
      }

      const current = activeSectionRef.current;
      if (e.deltaY > 0 && current < NAVIGATION_ITEMS.length - 1) {
        isCooldown.current = true;
        navigateToSection(current + 1);
        setTimeout(() => {
          isCooldown.current = false;
        }, 700);
      } else if (e.deltaY < 0 && current > 0) {
        isCooldown.current = true;
        navigateToSection(current - 1);
        setTimeout(() => {
          isCooldown.current = false;
        }, 700);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [navigateToSection]);

  // Touch swipe support for mobile and trackpad gestures
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null || touchStartX.current === null) return;
      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const diffY = touchStartY.current - endY;
      const diffX = touchStartX.current - endX;

      touchStartY.current = null;
      touchStartX.current = null;

      // Ensure vertical swipe is predominant
      if (Math.abs(diffY) > 50 && Math.abs(diffY) > Math.abs(diffX) * 1.5) {
        if (canScrollChild(e.target as HTMLElement, diffY, container)) {
          return;
        }

        const current = activeSectionRef.current;
        if (diffY > 0 && current < NAVIGATION_ITEMS.length - 1) {
          navigateToSection(current + 1);
        } else if (diffY < 0 && current > 0) {
          navigateToSection(current - 1);
        }
      }
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigateToSection]);

  // Keyboard navigation support: ArrowUp, ArrowDown, PageUp, PageDown, Home, End
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const current = activeSectionRef.current;
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (current < NAVIGATION_ITEMS.length - 1) {
          e.preventDefault();
          navigateToSection(current + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (current > 0) {
          e.preventDefault();
          navigateToSection(current - 1);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        navigateToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        navigateToSection(NAVIGATION_ITEMS.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateToSection]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f8f7fc] select-none">
      {/* Right Side Navigation Dots */}
      <Navigation activeSectionIdx={activeSection} onNavigate={navigateToSection} />

      {/* Main Fullpage Viewport Container */}
      <main
        ref={containerRef}
        className="w-full h-full overflow-hidden"
        style={{
          scrollBehavior: 'auto', // Managed smoothly by our RAF animation engine
        }}
      >
        {/* Section 0: Hero / Intro */}
        <section className="w-full h-screen relative flex flex-col justify-center bg-white flex-shrink-0">
          <HeroSection />
        </section>

        {/* Section 1: Experience */}
        <section className="w-full h-screen relative flex flex-col justify-center flex-shrink-0">
          <ExperienceSection isActive={activeSection === 1} />
        </section>

        {/* Sections 2–4: Project Sections (Software, GameDev, 3D Art) */}
        {PROJECT_SECTIONS.map((sec) => (
          <section
            key={sec.key}
            className="w-full h-screen relative flex flex-col justify-center flex-shrink-0"
            style={{
              background: sec.bg,
            }}
          >
            <ProjectSection section={sec} />
          </section>
        ))}

        {/* Section 5: Favorite Games */}
        <section className="w-full h-screen relative flex flex-col justify-center bg-[#080711] flex-shrink-0">
          <GamesSection />
        </section>

        {/* Section 6: Connect */}
        <section className="w-full h-screen relative flex flex-col justify-center bg-white flex-shrink-0">
          <ConnectSection />
        </section>
      </main>
    </div>
  );
};

