import React, { useState, useEffect, useCallback } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { NAVIGATION_ITEMS, PROJECT_SECTIONS } from './data/portfolioData';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ProjectSection } from './components/ProjectSection';
import { ConnectSection } from './components/ConnectSection';
import { BlogIndexPage } from './pages/BlogIndexPage';
import { BlogPostPage } from './pages/BlogPostPage';

const getSectionIndexFromPath = (pathname: string): number => {
  if (pathname === '/' || pathname === '') return 0;
  if (pathname.startsWith('/experience')) return 1;
  if (pathname.startsWith('/software')) return 2;
  if (pathname.startsWith('/gamedev')) return 3;
  if (pathname.startsWith('/3d-art')) return 4;
  if (pathname.startsWith('/blog') || pathname.startsWith('/games')) return 5;
  if (pathname.startsWith('/connect')) return 6;
  return 0;
};

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    className="w-full min-h-[100dvh]"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [experienceDark, setExperienceDark] = useState(false);

  const activeSectionIdx = getSectionIndexFromPath(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigate = useCallback(
    (index: number) => {
      const target = NAVIGATION_ITEMS[index];
      if (!target) return;
      if (location.pathname !== target.route) {
        navigate(target.route);
      }
    },
    [location.pathname, navigate]
  );

  const isDarkSurface =
    activeSectionIdx === 2 ||
    activeSectionIdx === 3 ||
    activeSectionIdx === 4 ||
    (activeSectionIdx === 1 && experienceDark);

  const isProjectRoute =
    activeSectionIdx === 2 || activeSectionIdx === 3 || activeSectionIdx === 4;
  const isBlogRoute = activeSectionIdx === 5;
  const routeGroupKey = isProjectRoute
    ? '/projects-group'
    : isBlogRoute
      ? '/blog-group'
      : location.pathname;

  return (
    <>
      <Navigation
        activeSectionIdx={activeSectionIdx}
        onNavigate={handleNavigate}
        isDarkSurface={isDarkSurface}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={routeGroupKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full min-h-[100dvh]"
        >
          <Routes location={location}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <HeroSection onExplore={() => handleNavigate(1)} />
                </PageTransition>
              }
            />
            <Route
              path="/experience"
              element={
                <PageTransition>
                  <ExperienceSection
                    isActive={activeSectionIdx === 1}
                    onDarkChange={setExperienceDark}
                  />
                </PageTransition>
              }
            />
            <Route
              path="/software"
              element={<ProjectSection section={PROJECT_SECTIONS[0]} />}
            />
            <Route
              path="/gamedev"
              element={<ProjectSection section={PROJECT_SECTIONS[1]} />}
            />
            <Route
              path="/3d-art"
              element={<ProjectSection section={PROJECT_SECTIONS[2]} />}
            />
            <Route
              path="/blog"
              element={<BlogIndexPage />}
            />
            <Route
              path="/blog/:slug"
              element={<BlogPostPage />}
            />
            <Route
              path="/games"
              element={<Navigate to="/blog" replace />}
            />
            <Route
              path="/connect"
              element={
                <PageTransition>
                  <ConnectSection />
                </PageTransition>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
