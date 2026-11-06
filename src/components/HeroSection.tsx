import React, { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { PERSONAL_INFO } from '../data/portfolioData';
import { CyclingTitle } from './CyclingTitle';
import logoSvg from '../assets/logo.svg';

interface HeroSectionProps {
  onExplore?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  const [activeColor, setActiveColor] = useState(PERSONAL_INFO.titleColors[0]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 3D Perspective Tilt Physics via Framer Motion Springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 180, damping: 24, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(normX);
      mouseY.set(normY);
    },
    [mouseX, mouseY, prefersReducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-[#f8f7fc] select-none"
    >
      {/* Subtle Ambient Radial Canvas Lighting synced with Active Discipline Color */}
      <div
        className="absolute top-1/4 right-1/4 w-[480px] h-[480px] rounded-full pointer-events-none transition-colors duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${activeColor} 0%, transparent 70%)`,
          opacity: 0.08,
          filter: 'blur(72px)',
          transform: 'translate3d(0, 0, 0)',
        }}
        aria-hidden="true"
      />

      {/* Main Content Hero Lockup */}
      <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-center gap-10 md:gap-16 lg:gap-24 px-6 md:px-12 w-full max-w-6xl my-auto">
        {/* Bio / Heading & Cycling Triad */}
        <div className="text-center md:text-left max-w-xl animate-[fade-in-up_0.6s_ease_forwards]">
          <h1
            className="text-zinc-900 leading-[1.04] tracking-tight font-black [text-wrap:balance]"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5.2rem)', marginBottom: 16 }}
          >
            {PERSONAL_INFO.firstName}
            <br />
            {PERSONAL_INFO.lastName}
          </h1>

          <div className="min-h-[2.4em] flex items-center justify-center md:justify-start">
            <CyclingTitle onColorChange={setActiveColor} />
          </div>
        </div>

        {/* 3D Cursor-Reactive Interactive Logo with Chromatic Back-Glow */}
        <div
          className="flex-shrink-0 flex items-center justify-center relative"
          style={{ perspective: 1000 }}
        >
          {/* Luminous Ambient Studio Back-Glow */}
          <div
            className="absolute -inset-10 rounded-full pointer-events-none transition-all duration-700 ease-out"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${activeColor} 0%, transparent 68%)`,
              opacity: 0.18,
              filter: 'blur(42px)',
              transform: 'translateZ(-30px)',
            }}
            aria-hidden="true"
          />

          {/* 3D Spring-Animated Logo Surface */}
          <motion.div
            style={
              prefersReducedMotion
                ? { transformStyle: 'flat' }
                : {
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                  }
            }
            className="relative cursor-default"
          >
            <motion.img
              src={logoSvg}
              alt={`${PERSONAL_INFO.name} Mark`}
              className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 object-contain select-none"
              style={{
                filter: 'drop-shadow(0 12px 28px rgba(28, 27, 32, 0.08))',
                transform: prefersReducedMotion ? 'none' : 'translateZ(20px)',
              }}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              transition={{
                duration: 0.85,
                ease: [0.16, 1, 0.3, 1], // refined exponential ease-out
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Whisper-Quiet Minimalist Scroll Indicator (Affordance without Clutter) */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        <button
          onClick={onExplore}
          type="button"
          className="group flex flex-col items-center gap-2 p-2 rounded-full text-zinc-400 hover:text-zinc-700 transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
          aria-label="Scroll to explore work"
        >
          <span className="text-[10px] font-medium tracking-[0.24em] uppercase text-zinc-400 group-hover:text-zinc-600 transition-colors">
            Explore
          </span>
          <div className="w-[18px] h-[30px] rounded-full border border-zinc-300 group-hover:border-zinc-400 flex justify-center pt-1.5 transition-colors">
            <motion.div
              className="w-1 h-1.5 rounded-full bg-zinc-400 group-hover:bg-zinc-700"
              animate={
                prefersReducedMotion
                  ? { opacity: 0.7 }
                  : {
                      y: [0, 8, 0],
                      opacity: [0.9, 0.3, 0.9],
                    }
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </button>
      </div>
    </div>
  );
};
