import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  NAVIGATION_ITEMS,
  PROJECT_SECTIONS,
} from '../data/portfolioData';
import { Navigation } from '../components/Navigation';
import { HeroSection } from '../components/HeroSection';
import { ProjectSection } from '../components/ProjectSection';
import { GamesSection } from '../components/GamesSection';
import { ConnectSection } from '../components/ConnectSection';

export const PortfolioApp: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [waveCount, setWaveCount] = useState(0);
  const isProgrammaticScroll = useRef(false);

  // Map route to section index
  const routeToIndex = useCallback((pathname: string) => {
    const idx = NAVIGATION_ITEMS.findIndex(
      (item) => item.route === pathname || (item.route !== '/' && pathname.startsWith(item.route))
    );
    return idx >= 0 ? idx : 0;
  }, []);

  // Sync scroll position when route changes (e.g. initial load or back/forward buttons)
  useEffect(() => {
    const targetIdx = routeToIndex(location.pathname);
    setActiveSection(targetIdx);

    const container = containerRef.current;
    if (container) {
      const targetScrollTop = targetIdx * window.innerHeight;
      if (Math.abs(container.scrollTop - targetScrollTop) > 10) {
        isProgrammaticScroll.current = true;
        container.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        });
        const timer = setTimeout(() => {
          isProgrammaticScroll.current = false;
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, routeToIndex]);

  // Handle scroll events and update route if scrolled manually
  const onScroll = () => {
    if (!containerRef.current || isProgrammaticScroll.current) return;
    const currentIdx = Math.round(containerRef.current.scrollTop / window.innerHeight);
    if (currentIdx !== activeSection && currentIdx >= 0 && currentIdx < NAVIGATION_ITEMS.length) {
      setActiveSection(currentIdx);
      const targetRoute = NAVIGATION_ITEMS[currentIdx].route;
      if (location.pathname !== targetRoute) {
        navigate(targetRoute, { replace: true });
      }
    }
  };

  const handleNavigate = (index: number) => {
    setActiveSection(index);
    if (containerRef.current) {
      isProgrammaticScroll.current = true;
      containerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth',
      });
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 650);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#f8f7fc] select-none">
      {/* Navigation Bars */}
      <Navigation activeSectionIdx={activeSection} onNavigate={handleNavigate} />

      {/* Snap Scrollable Container */}
      <main
        ref={containerRef}
        onScroll={onScroll}
        className="w-full h-full overflow-y-auto overflow-x-hidden"
        style={{
          scrollSnapType: 'y mandatory',
        }}
      >
        {/* Section 0: Hero / Intro */}
        <section
          className="w-full h-screen relative flex flex-col justify-center"
          style={{ scrollSnapAlign: 'start' }}
        >
          <HeroSection
            waveCount={waveCount}
            onFlipCard={() => setWaveCount((c) => c + 1)}
            onNavigateSection={(idx, route) => {
              handleNavigate(idx);
              navigate(route);
            }}
          />
        </section>

        {/* Sections 1–3: Project Sections (Software, GameDev, 3D Art) */}
        {PROJECT_SECTIONS.map((sec) => (
          <section
            key={sec.key}
            className="w-full h-screen relative flex flex-col justify-center"
            style={{
              background: sec.bg,
              scrollSnapAlign: 'start',
            }}
          >
            <ProjectSection section={sec} />
          </section>
        ))}

        {/* Section 4: Games Played */}
        <section
          className="w-full h-screen relative flex flex-col justify-center bg-[#f8f7fc]"
          style={{ scrollSnapAlign: 'start' }}
        >
          <GamesSection />
        </section>

        {/* Section 5: Connect */}
        <section
          className="w-full h-screen relative flex flex-col justify-center bg-white"
          style={{ scrollSnapAlign: 'start' }}
        >
          <ConnectSection />
        </section>
      </main>
    </div>
  );
};
