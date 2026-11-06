import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { HiXMark } from 'react-icons/hi2';
import { PLAYED_GAMES, type GameReview } from '../data/portfolioData';

interface CardLayout {
  id: string;
  className: string;
  animationClass: string;
  style: React.CSSProperties;
}

const DESKTOP_LAYOUTS: CardLayout[] = [
  {
    id: 'botw',
    className: 'card-botw',
    animationClass: 'animate-[float-drift-1_5.2s_infinite_ease-in-out]',
    style: { top: '15%', left: '7%' },
  },
  {
    id: 'mgsv',
    className: 'card-mgsv',
    animationClass: 'animate-[float-drift-2_5.8s_infinite_ease-in-out]',
    style: { top: '17%', right: '7%' },
  },
  {
    id: 'totk',
    className: 'card-totk',
    animationClass: 'animate-[float-drift-3_5.4s_infinite_ease-in-out]',
    style: { top: '44%', left: '38%' },
  },
  {
    id: 'rdr2',
    className: 'card-rdr2',
    animationClass: 'animate-[float-drift-4_6.1s_infinite_ease-in-out]',
    style: { bottom: '11%', left: '11%' },
  },
  {
    id: 'silksong',
    className: 'card-silksong',
    animationClass: 'animate-[float-drift-5_5.0s_infinite_ease-in-out]',
    style: { bottom: '13%', right: '9%' },
  },
];

export const GamesSection: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameReview | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedGame(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col justify-center overflow-hidden bg-[#0d0c15] text-white">
      {/* ── Background: Refined Atmospheric Glowing Orbs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Blob 1: Rose / Pink Subtle Atmosphere */}
        <div
          className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full filter blur-[110px]"
          style={{
            background: 'radial-gradient(circle, rgba(255, 119, 156, 0.16) 0%, rgba(255, 119, 156, 0.04) 50%, transparent 70%)',
            animation: 'neon-blob-1 14s infinite ease-in-out',
          }}
        />

        {/* Blob 2: Cyan / Electric Teal */}
        <div
          className="absolute -bottom-36 -left-28 w-[500px] h-[500px] rounded-full filter blur-[120px]"
          style={{
            background: 'radial-gradient(circle, rgba(33, 190, 206, 0.14) 0%, rgba(33, 190, 206, 0.03) 50%, transparent 70%)',
            animation: 'neon-blob-2 16s infinite ease-in-out',
          }}
        />

        {/* Blob 3: Deep Violet Aurora Center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full filter blur-[140px]"
          style={{
            background: 'radial-gradient(circle, rgba(167, 139, 250, 0.18) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
            animation: 'neon-blob-3 18s infinite ease-in-out',
          }}
        />

        {/* Subtle Tech Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
            backgroundSize: '36px 36px',
          }}
        />
      </div>

      {/* ── Section Content Container ── */}
      <div
        className="w-full h-full relative z-10 flex flex-col justify-center"
        style={{
          padding: '36px 6vw 28px',
          maxWidth: 1540,
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3 sm:mb-6">
          <div>
            <h2
              className="text-white text-3xl sm:text-4xl md:text-5xl font-black tracking-tight m-0 drop-shadow-md"
              style={{ fontFamily: 'Archivo Black, sans-serif' }}
            >
              Design Influences & Game Studies
            </h2>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal leading-relaxed m-0">
              Deconstructing world architecture, kinetic physics, and player agency in the titles that shape my game development and systems engineering.
            </p>
          </div>
        </div>

        {/* ── Floating Cards Canvas ── */}
        <div className="relative flex-1 min-h-0 w-full">
          {/* Desktop Floating Constellation */}
          <div className="hidden lg:block absolute inset-0">
            {PLAYED_GAMES.map((game) => {
              const layout = DESKTOP_LAYOUTS.find((l) => l.id === game.id);
              if (!layout) return null;

              return (
                <div
                  key={game.id}
                  style={layout.style}
                  className={`absolute ${layout.animationClass}`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedGame(game)}
                    className="group relative block text-left outline-none cursor-pointer transition-all duration-300"
                    style={{
                      width: 'clamp(240px, 20vw, 290px)',
                    }}
                  >
                    {/* Glowing outer aura on hover */}
                    <div
                      className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-lg"
                      style={{ background: game.color }}
                    />

                    {/* Card container */}
                    <div
                      className="relative rounded-2xl overflow-hidden bg-[#11101e]/90 backdrop-blur-2xl border transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-[1.03]"
                      style={{
                        borderColor: 'rgba(255, 255, 255, 0.12)',
                        boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                      }}
                    >
                      {/* Banner Image */}
                      <div className="relative h-28 w-full overflow-hidden bg-zinc-950">
                        <img
                          src={game.image}
                          alt={game.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#11101e] via-[#11101e]/30 to-transparent" />
                      </div>

                      {/* Card Info */}
                      <div className="p-3.5">
                        <h3
                          className="text-white text-sm font-bold truncate mb-1 group-hover:text-white"
                          style={{ fontFamily: 'Archivo Black, sans-serif' }}
                        >
                          {game.title}
                        </h3>
                        <p className="text-zinc-400 text-xs truncate m-0">
                          {game.subtitle}
                        </p>
                      </div>

                      {/* Accent glow line at bottom */}
                      <div
                        className="h-1 w-full"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${game.color}, transparent)`,
                        }}
                      />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mobile Grid Layout (< 1024px) */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 h-full overflow-y-auto py-2">
            {PLAYED_GAMES.map((game) => (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelectedGame(game)}
                className="text-left p-3 rounded-2xl bg-[#11101e]/90 border transition-all active:scale-95"
                style={{ borderColor: `${game.color}55` }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0 border border-white/10"
                    loading="lazy"
                  />
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-white text-xs font-bold truncate m-0"
                      style={{ fontFamily: 'Archivo Black, sans-serif' }}
                    >
                      {game.title}
                    </h3>
                    <p className="text-zinc-400 text-[11px] truncate m-0 mt-0.5">
                      {game.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cinematic Center Expansion Modal ── */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedGame(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            style={{
              background: 'rgba(5, 4, 10, 0.78)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl overflow-hidden bg-[#11101e] border border-white/15 shadow-2xl p-6"
              style={{
                boxShadow: `0 0 80px ${selectedGame.color}35`,
              }}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <HiXMark className="w-5 h-5" />
              </button>

              {/* Banner with glow */}
              <div className="relative h-44 -mx-6 -mt-6 mb-5 overflow-hidden">
                <img
                  src={selectedGame.image}
                  alt={selectedGame.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#11101e] via-[#11101e]/40 to-transparent" />
                <div
                  className="absolute bottom-3 left-6 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-white/90 backdrop-blur-md"
                  style={{
                    backgroundColor: `${selectedGame.color}40`,
                    border: `1px solid ${selectedGame.color}80`,
                  }}
                >
                  {selectedGame.subtitle}
                </div>
              </div>

              {/* Game Title */}
              <h2
                className="text-white text-2xl font-black mb-3"
                style={{ fontFamily: 'Archivo Black, sans-serif' }}
              >
                {selectedGame.title}
              </h2>

              {/* Opinion */}
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                {selectedGame.opinion}
              </p>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <span className="text-xs text-zinc-400">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white font-mono text-[10px]">ESC</kbd> to close
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedGame(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  Done Reading
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
