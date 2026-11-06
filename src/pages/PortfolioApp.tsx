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

export const PortfolioApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState(0);
  const activeSectionRef = useRef(0);
  const isNavigating = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  // Map route to section index
  const routeToIndex = useCallback((pathname: string) => {
    const idx = NAVIGATION_ITEMS.findIndex(
      (item) => item.route === pathname || (item.route !== '/' && pathname.startsWith(item.route))
    );
    return idx >= 0 ? idx : 0;
  }, []);

  // Navigate to section and sync URL route
  const navigateToSection = useCallback(
    (targetIdx: number) => {
      if (targetIdx < 0 || targetIdx >= NAVIGATION_ITEMS.length) return;
      isNavigating.current = true;
      setActiveSection(targetIdx);

      const targetEl = sectionRefs.current[targetIdx];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      } else if (containerRef.current) {
        containerRef.current.scrollTo({
          top: targetIdx * window.innerHeight,
          behavior: 'smooth',
        });
      }

      const targetRoute = NAVIGATION_ITEMS[targetIdx].route;
      if (location.pathname !== targetRoute) {
        navigate(targetRoute, { replace: true });
      }

      // Reset navigating flag after smooth scroll completes
      setTimeout(() => {
        isNavigating.current = false;
      }, 650);
    },
    [location.pathname, navigate]
  );

  // Sync section with route on initial mount or back/forward browser navigation
  useEffect(() => {
    const targetIdx = routeToIndex(location.pathname);
    if (isInitialMount.current) {
      isInitialMount.current = false;
      setActiveSection(targetIdx);
      if (targetIdx > 0 && containerRef.current) {
        // Immediate positioning on cold page load
        containerRef.current.scrollTop = targetIdx * window.innerHeight;
      }
      return;
    }

    if (targetIdx !== activeSectionRef.current && !isNavigating.current) {
      setActiveSection(targetIdx);
      sectionRefs.current[targetIdx]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, routeToIndex]);

  // Native IntersectionObserver to track active section from organic scrolling & update URL
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigating.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = sectionRefs.current.findIndex((el) => el === entry.target);
            if (index !== -1 && index !== activeSectionRef.current) {
              setActiveSection(index);
              const targetRoute = NAVIGATION_ITEMS[index].route;
              if (location.pathname !== targetRoute) {
                navigate(targetRoute, { replace: true });
              }
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.55,
      }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname, navigate]);

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
    <div className="relative w-screen h-screen overflow-hidden bg-[#f8f7fc]">
      {/* Right Side Navigation Dots */}
      <Navigation activeSectionIdx={activeSection} onNavigate={navigateToSection} />

      {/* Main Fullpage Viewport Container with Native CSS Scroll Snapping */}
      <main
        ref={containerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory focus:outline-none"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {/* Section 0: Hero / Intro */}
        <section
          ref={(el) => {
            sectionRefs.current[0] = el;
          }}
          className="w-full h-screen relative flex flex-col justify-center bg-[#f8f7fc] flex-shrink-0 snap-start snap-always"
        >
          <HeroSection onExplore={() => navigateToSection(1)} />
        </section>

        {/* Section 1: Experience */}
        <section
          ref={(el) => {
            sectionRefs.current[1] = el;
          }}
          className="w-full h-screen relative flex flex-col justify-center flex-shrink-0 snap-start snap-always"
        >
          <ExperienceSection isActive={activeSection === 1} />
        </section>

        {/* Sections 2–4: Project Sections (Software, GameDev, 3D Art) */}
        {PROJECT_SECTIONS.map((sec, idx) => (
          <section
            key={sec.key}
            ref={(el) => {
              sectionRefs.current[idx + 2] = el;
            }}
            className="w-full h-screen relative flex flex-col justify-center flex-shrink-0 snap-start snap-always"
            style={{
              background: sec.bg,
            }}
          >
            <ProjectSection section={sec} isSectionActive={activeSection === idx + 2} />
          </section>
        ))}

        {/* Section 5: Favorite Games */}
        <section
          ref={(el) => {
            sectionRefs.current[5] = el;
          }}
          className="w-full h-screen relative flex flex-col justify-center bg-[#0d0c15] flex-shrink-0 snap-start snap-always"
        >
          <GamesSection />
        </section>

        {/* Section 6: Connect */}
        <section
          ref={(el) => {
            sectionRefs.current[6] = el;
          }}
          className="w-full h-screen relative flex flex-col justify-center bg-white flex-shrink-0 snap-start snap-always"
        >
          <ConnectSection />
        </section>
      </main>
    </div>
  );
};
