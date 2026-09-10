import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { CyclingTitle } from './CyclingTitle';
import { FlipCard } from './FlipCard';
import { SkillCanvas } from './SkillCanvas';

interface HeroSectionProps {
  waveCount: number;
  onFlipCard: () => void;
  onNavigateSection: (idx: number, route: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  waveCount,
  onFlipCard,
  onNavigateSection,
}) => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center">
      {/* Vignette Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, transparent 40%, rgba(12, 60, 68, 0.18) 100%)',
        }}
      />

      {/* D3 Skills Simulation Canvas */}
      <SkillCanvas triggerWave={waveCount} />

      {/* Main Content */}
      <div
        className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-center gap-8 md:gap-14 px-6 md:px-12 w-full max-w-6xl pointer-events-none"
        style={{ paddingTop: 60 }}
      >
        {/* Bio / Heading */}
        <div className="text-center md:text-left pointer-events-auto max-w-xl animate-[fade-in-up_0.6s_ease_forwards]">
          <h1
            className="text-zinc-900 leading-none tracking-tight font-black"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4.8rem)', marginBottom: 12 }}
          >
            {PERSONAL_INFO.firstName}
            <br />
            {PERSONAL_INFO.lastName}
          </h1>

          <div className="mb-6 min-h-[2em] flex items-center justify-center md:justify-start">
            <CyclingTitle />
          </div>

          <div className="flex flex-wrap gap-2.5 justify-center md:justify-start">
            {[
              { label: 'Software', idx: 1, route: '/software', color: '#2bbece' },
              { label: 'Game Dev', idx: 2, route: '/gamedev', color: '#ff779c' },
              { label: '3D Art', idx: 3, route: '/3d-art', color: '#a78bfa' },
              { label: 'Games', idx: 4, route: '/games', color: '#ff779c' },
              { label: 'Connect', idx: 5, route: '/connect', color: '#15cea9' },
            ].map(({ label, idx, route, color }) => (
              <button
                key={label}
                className="hero-btn"
                onClick={() => onNavigateSection(idx, route)}
                style={
                  {
                    '--btn-color': color,
                    '--btn-bg': `${color}22`,
                    '--btn-shadow': `${color}44`,
                    '--btn-shadow-hover': `${color}88`,
                  } as React.CSSProperties
                }
              >
                {label} →
              </button>
            ))}
          </div>
        </div>

        {/* 3D Interactive Flip Card */}
        <div className="pointer-events-auto flex-shrink-0">
          <FlipCard onFlip={onFlipCard} />
        </div>
      </div>
    </div>
  );
};
