import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SkillCanvas } from './SkillCanvas';
import { ExperienceTimeline } from './ExperienceTimeline';
import { EXPERIENCE_ITEMS, type ExperienceItem } from '../data/portfolioData';

interface ExperienceSectionProps {
  isActive?: boolean;
  onDarkChange?: (isDark: boolean) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  isActive = true,
  onDarkChange,
}) => {
  const [selectedItem, setSelectedItem] = useState<ExperienceItem>(EXPERIENCE_ITEMS[0]);

  const handleActiveChange = useCallback(
    (_index: number, item: ExperienceItem) => {
      setSelectedItem(item);
      if (onDarkChange) {
        onDarkChange(Boolean(item.isDarkPage));
      }
    },
    [onDarkChange]
  );

  const pageBg = selectedItem.pageBg ?? '#f8f7fc';
  const pageGlow = selectedItem.pageGlow ?? selectedItem.accent ?? '#15cea9';
  const isDarkPage = Boolean(selectedItem.isDarkPage);

  return (
    <div
      className="w-screen h-[100dvh] relative overflow-hidden flex flex-col items-center justify-center transition-colors duration-700 ease-out select-none"
      style={{ backgroundColor: pageBg }}
    >
      {/* Dynamic Company Atmosphere Radial Blobs */}
      <div
        className="absolute -top-32 -left-24 w-[620px] h-[620px] rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle, ${pageGlow} 0%, transparent 68%)`,
          opacity: isDarkPage ? 0.22 : 0.16,
          filter: 'blur(90px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-36 -right-24 w-[540px] h-[540px] rounded-full pointer-events-none transition-all duration-700 ease-out"
        style={{
          background: `radial-gradient(circle, ${selectedItem.accent} 0%, transparent 70%)`,
          opacity: isDarkPage ? 0.18 : 0.12,
          filter: 'blur(100px)',
        }}
        aria-hidden="true"
      />

      {/* Parallax Animated Background Canvas Layer */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-auto transition-opacity duration-700"
        initial={{ y: 50, scale: 0.96, opacity: 0.25 }}
        animate={
          isActive
            ? { y: 0, scale: 1.0, opacity: isDarkPage ? 0.22 : 0.85 }
            : { y: 50, scale: 0.96, opacity: 0.2 }
        }
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: isDarkPage
              ? 'radial-gradient(circle at center, transparent 35%, rgba(6, 20, 22, 0.55) 100%)'
              : 'radial-gradient(circle at center, transparent 40%, rgba(12, 60, 68, 0.06) 100%)',
          }}
        />
        <SkillCanvas triggerWave={0} />
      </motion.div>

      {/* Foreground: Interactive Scrolling Experience Timeline Component */}
      <div className="relative z-20 w-full flex items-center justify-center pointer-events-none pb-14 sm:pb-0">
        <ExperienceTimeline onActiveChange={handleActiveChange} />
      </div>
    </div>
  );
};
