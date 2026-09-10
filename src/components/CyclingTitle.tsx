import React, { useState, useEffect } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

export const CyclingTitle: React.FC = () => {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % PERSONAL_INFO.titles.length);
        setVisible(true);
      }, 350);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  const color = PERSONAL_INFO.titleColors[idx % PERSONAL_INFO.titleColors.length];

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        color,
        textShadow: '0 0 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {PERSONAL_INFO.titles[idx]}
    </span>
  );
};
