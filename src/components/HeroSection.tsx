import React from 'react';
import { motion } from 'framer-motion';
import { PERSONAL_INFO } from '../data/portfolioData';
import { CyclingTitle } from './CyclingTitle';
import logoSvg from '../assets/logo.svg';

export const HeroSection: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-white">
      {/* Main Content */}
      <div
        className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-center gap-10 md:gap-20 px-6 md:px-12 w-full max-w-6xl"
        style={{ paddingTop: 20 }}
      >
        {/* Bio / Heading */}
        <div className="text-center md:text-left max-w-xl animate-[fade-in-up_0.6s_ease_forwards]">
          <h1
            className="text-zinc-900 leading-none tracking-tight font-black"
            style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5.2rem)', marginBottom: 16 }}
          >
            {PERSONAL_INFO.firstName}
            <br />
            {PERSONAL_INFO.lastName}
          </h1>

          <div className="min-h-[2.4em] flex items-center justify-center md:justify-start">
            <CyclingTitle />
          </div>
        </div>

        {/* Animated SVG Logo: starts blurry and smaller, animates to clear & larger with ease-in */}
        <div className="flex-shrink-0 flex items-center justify-center">
          <motion.img
            src={logoSvg}
            alt={`${PERSONAL_INFO.name} Logo`}
            className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 object-contain drop-shadow-sm select-none"
            initial={{ scale: 0.82, filter: 'blur(16px)', opacity: 0.15 }}
            animate={{ scale: 1.0, filter: 'blur(0px)', opacity: 1 }}
            transition={{
              duration: 0.85,
              ease: [0.42, 0, 1, 1], // ease-in
            }}
          />
        </div>
      </div>
    </div>
  );
};
