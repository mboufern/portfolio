import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface FlipCardProps {
  onFlip: () => void;
}

export const FlipCard: React.FC<FlipCardProps> = ({ onFlip }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped((f) => !f);
    onFlip();
  };

  return (
    <div
      onMouseEnter={handleFlip}
      onMouseLeave={handleFlip}
      onClick={handleFlip}
      style={{
        width: 'clamp(140px, 35vw, 280px)',
        aspectRatio: '1',
        perspective: 900,
        cursor: 'pointer',
        flexShrink: 0,
      }}
      title="Hover or click to flip!"
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front — Photo / Monogram */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, #e8f7f5, #f5e8f0)',
            border: '2px solid rgba(200,195,220,0.6)',
            boxShadow: '0 0 60px rgba(21,206,169,0.18), 0 4px 30px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/assets/me/photo.jpg"
            alt={PERSONAL_INFO.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <span
            style={{
              position: 'absolute',
              color: 'rgba(28,27,32,0.3)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontFamily: 'Archivo Black, sans-serif',
              userSelect: 'none',
            }}
          >
            {PERSONAL_INFO.initials}
          </span>
        </div>

        {/* Back — Brand Logo / Symbol */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(145deg, #1c1b20, #2d2a3a)',
            border: '2px solid rgba(21,206,169,0.4)',
            boxShadow: '0 0 60px rgba(21,206,169,0.25)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src="/assets/me/logo.png"
            alt="Brand Logo"
            style={{ width: '65%', height: '65%', objectFit: 'contain' }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
          <span
            style={{
              position: 'absolute',
              color: 'rgba(21,206,169,0.6)',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontFamily: 'Archivo Black, sans-serif',
              userSelect: 'none',
            }}
          >
            {PERSONAL_INFO.initials}
          </span>
        </div>
      </div>
    </div>
  );
};
