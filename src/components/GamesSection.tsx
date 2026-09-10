import React from 'react';
import { PLAYED_GAMES } from '../data/portfolioData';

const Stars: React.FC<{ n: number; color: string }> = ({ n, color }) => (
  <span style={{ color, letterSpacing: 3, fontSize: '0.9rem' }}>
    {Array.from({ length: 5 }, (_, i) => (i < n ? '★' : '☆')).join('')}
  </span>
);

export const GamesSection: React.FC = () => {
  return (
    <div
      className="w-full h-full relative flex flex-col"
      style={{
        padding: '80px 8vw 32px',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #ff779c 0%, transparent 68%)',
          top: -160,
          right: -100,
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            margin: '0 0 6px',
            color: '#ff779c',
          }}
        >
          Gaming
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            color: '#1c1b20',
            margin: '0 0 16px',
            lineHeight: 1.1,
          }}
        >
          Games I've Played
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto"
          style={{ flex: 1, minHeight: 0, alignContent: 'start', paddingBottom: 16 }}
        >
          {PLAYED_GAMES.map((g) => (
            <div
              key={g.title}
              className="me-game-card"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${g.color}55`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = '#e2dff0';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 26, flexShrink: 0 }}>{g.emoji}</span>
                <div>
                  <p style={{ margin: 0, color: '#1c1b20', fontSize: '0.95rem', marginBottom: 2 }}>
                    {g.title}
                  </p>
                  <Stars n={g.rating} color={g.color} />
                </div>
              </div>
              <p style={{ margin: 0, color: '#6b6880', fontSize: '0.82rem', lineHeight: 1.7 }}>
                {g.opinion}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
