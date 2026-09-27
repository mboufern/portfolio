import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLAYED_GAMES, type GameReview } from '../data/portfolioData';
import { HiSparkles, HiXMark, HiArrowUpRight } from 'react-icons/hi2';

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
    <div className="w-full h-full relative flex flex-col justify-center overflow-hidden bg-[#080711] select-none text-white">
      {/* ── Background: Cybernetic Neon Glowing Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Blob 1: Magenta / Pink Neon */}
        <div
          className="absolute -top-32 -right-24 w-[520px] h-[520px] rounded-full filter blur-[100px]"
          style={{
            background: 'radial-gradient(circle, #ff2a85 0%, #ff779c 40%, transparent 70%)',
            animation: 'neon-blob-1 12s infinite ease-in-out',
          }}
        />

        {/* Blob 2: Cyan / Electric Blue Neon */}
        <div
          className="absolute -bottom-36 -left-28 w-[500px] h-[500px] rounded-full filter blur-[110px]"
          style={{
            background: 'radial-gradient(circle, #00f0ff 0%, #2bbece 40%, transparent 70%)',
            animation: 'neon-blob-2 14s infinite ease-in-out',
          }}
        />

        {/* Blob 3: Deep Violet Aurora Center */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full filter blur-[130px]"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.28) 0%, rgba(88, 28, 135, 0.15) 50%, transparent 70%)',
            animation: 'neon-blob-3 16s infinite ease-in-out',
          }}
        />

        {/* Subtle Tech Grid Texture */}
        <div
          className="absolute inset-0 opacity-[0.035]"
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
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3 sm:mb-6 pointer-events-none">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#ff779c] animate-pulse" />
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-[#ff779c] m-0">
                Hall of Fame
              </p>
            </div>
            <h2
              className="text-white text-3xl sm:text-4xl md:text-5xl font-black tracking-tight m-0 drop-shadow-md"
              style={{ fontFamily: 'Archivo Black, sans-serif' }}
            >
              Favorite Games
            </h2>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-xs font-bold text-zinc-300 shadow-lg">
            <HiSparkles className="w-3.5 h-3.5 text-[#ff779c]" />
            <span>Click any title to explore</span>
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
                    className="group relative block text-left outline-none cursor-pointer select-none transition-all duration-300"
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

                        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-bold"
                          style={{ color: game.color }}
                        >
                          <span>Explore Review</span>
                          <HiArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Mobile / Tablet Responsive Floating Grid */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3.5 overflow-y-auto max-h-[62vh] p-1">
            {PLAYED_GAMES.map((game, idx) => (
              <button
                key={`mobile-${game.id}`}
                type="button"
                onClick={() => setSelectedGame(game)}
                className={`relative block text-left outline-none cursor-pointer rounded-2xl overflow-hidden bg-[#11101e]/90 border border-white/15 p-2.5 shadow-xl transition-all duration-200 active:scale-95 ${
                  idx % 2 === 0 ? 'animate-[float-drift-1_4.5s_infinite_ease-in-out]' : 'animate-[float-drift-2_4.8s_infinite_ease-in-out]'
                }`}
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
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-[#0f0e1c] rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[88vh]"
              style={{
                border: `2px solid ${selectedGame.color}77`,
                boxShadow: `0 30px 80px -15px ${selectedGame.accentGlow}, 0 0 60px rgba(0, 0, 0, 0.7)`,
              }}
            >
              {/* Cinematic Header Background Darkened with Atmospheric Filter */}
              <div className="relative w-full h-56 sm:h-64 overflow-hidden flex flex-col justify-end p-6 sm:p-8 flex-shrink-0">
                {/* Full-width Game Wallpaper */}
                <img
                  src={selectedGame.image}
                  alt={selectedGame.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Darkened filter overlay: makes title extremely legible on top */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(15, 14, 28, 0.98) 0%, rgba(15, 14, 28, 0.70) 50%, rgba(5, 4, 10, 0.45) 100%)',
                    backdropFilter: 'brightness(0.75) contrast(1.15)',
                  }}
                />

                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedGame(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/80 hover:text-white bg-black/50 hover:bg-black/80 border border-white/25 backdrop-blur-md transition-all duration-200 cursor-pointer shadow-lg z-20 outline-none"
                  aria-label="Close review"
                >
                  <HiXMark className="w-5 h-5" />
                </button>

                {/* Title & Header Metadata on top of darkened background */}
                <div className="relative z-10">
                  <p className="text-white/80 text-xs font-bold tracking-wider uppercase mb-1.5"
                    style={{ color: selectedGame.color }}
                  >
                    {selectedGame.subtitle}
                  </p>

                  {/* Title in bold high-contrast Archivo Black */}
                  <h3
                    className="text-white font-black leading-tight tracking-tight text-xl sm:text-2xl md:text-3xl drop-shadow-lg m-0"
                    style={{ fontFamily: 'Archivo Black, sans-serif' }}
                  >
                    {selectedGame.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body / Review Quote placed directly inside the card */}
              <div className="p-6 sm:p-8 flex flex-col overflow-y-auto bg-[#0f0e1c] text-white">
                <p className="text-zinc-200 text-sm sm:text-base md:text-[1.05rem] leading-relaxed font-normal m-0 tracking-wide">
                  "{selectedGame.opinion}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


