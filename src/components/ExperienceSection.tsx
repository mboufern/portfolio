import React from 'react';
import { motion } from 'framer-motion';
import { SkillCanvas } from './SkillCanvas';
import { ExperienceTimeline } from './ExperienceTimeline';

interface ExperienceSectionProps {
  isActive: boolean;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ isActive }) => {
  return (
    <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center bg-[#f8f7fc]">
      {/* ── Parallax Animated Background Canvas Layer (Approach 2) ── */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-auto"
        initial={{ y: 90, scale: 0.94, opacity: 0.25, filter: 'blur(8px)' }}
        animate={
          isActive
            ? { y: 0, scale: 1.0, opacity: 1, filter: 'blur(0px)' }
            : { y: 90, scale: 0.94, opacity: 0.25, filter: 'blur(8px)' }
        }
        transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        {/* Subtle radial vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(circle at center, transparent 40%, rgba(12, 60, 68, 0.10) 100%)',
          }}
        />

        {/* Interactive D3 Skills Simulation Canvas */}
        <SkillCanvas triggerWave={0} />
      </motion.div>

      {/* ── Foreground: Experience Timeline Component ── */}
      <div className="relative z-10 w-full flex items-center justify-center pointer-events-none">
        <ExperienceTimeline />
      </div>
    </div>
  );
};
