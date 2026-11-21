import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLAYED_GAMES, type GameReview } from '../../data/portfolioData';
import {
  ArticleLead,
  ArticleParagraph,
  ArticleSectionHeading,
} from '../components/ArticlePrimitives';

export const GamesILikePost: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(PLAYED_GAMES[0]?.id ?? '');
  const featured: GameReview =
    PLAYED_GAMES.find((g) => g.id === selectedId) ?? PLAYED_GAMES[0];

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        <ArticleLead>
          Every developer carries a mental library of systems that left a mark the first
          time they clicked into place. Whether it is a chemistry engine interacting
          across an open landscape or enemy AI quietly adapting to habits you formed
          five missions ago, great games teach lessons that carry straight into
          engineering software and building worlds.
        </ArticleLead>
        <ArticleParagraph>
          Below are the titles that shaped how I think about player agency, systemic
          design, pacing, and atmosphere. Pick any title to inspect the specific craft
          lesson I took away from it.
        </ArticleParagraph>
      </div>

      {/* Game Selector Strip */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {PLAYED_GAMES.map((game) => {
            const isActive = game.id === featured.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelectedId(game.id)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all cursor-pointer flex-shrink-0 border"
                style={{
                  backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  borderColor: isActive ? game.color : 'rgba(24,24,27,0.08)',
                  boxShadow: isActive
                    ? `0 6px 20px ${game.accentGlow.replace('0.45', '0.18')}`
                    : 'none',
                }}
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-7 h-7 rounded-lg object-cover flex-shrink-0"
                />
                <span className="text-xs sm:text-sm font-semibold text-zinc-900 whitespace-nowrap">
                  {game.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Title Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl overflow-hidden bg-white border border-zinc-900/10 shadow-[0_12px_32px_rgba(24,24,27,0.06)]"
          >
            <div className="relative h-56 sm:h-72 w-full overflow-hidden bg-zinc-950">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <div
                  className="text-[11px] font-mono uppercase tracking-[0.16em] font-semibold mb-1.5"
                  style={{ color: featured.color }}
                >
                  {featured.subtitle}
                </div>
                <h2
                  className="text-white text-xl sm:text-3xl font-black m-0 leading-tight"
                  style={{ fontFamily: 'Archivo Black, sans-serif' }}
                >
                  {featured.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-zinc-700 text-base sm:text-[17px] leading-[1.8] m-0">
                {featured.opinion}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Compact Index of All Titles */}
      <section className="pt-2">
        <ArticleSectionHeading>All Design Lenses</ArticleSectionHeading>
        <div className="divide-y divide-zinc-200/80 border-t border-b border-zinc-200/80">
          {PLAYED_GAMES.map((game) => {
            const isSelected = game.id === featured.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelectedId(game.id)}
                className={`w-full py-3.5 px-3 -mx-3 rounded-xl flex items-center justify-between gap-4 text-left transition-colors cursor-pointer bg-transparent border-0 ${
                  isSelected ? 'bg-white/90' : 'hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={game.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-zinc-900/10"
                  />
                  <div className="min-w-0">
                    <div className="font-bold text-sm sm:text-base text-zinc-900 truncate">
                      {game.title}
                    </div>
                    <div className="text-xs text-zinc-500 truncate">{game.subtitle}</div>
                  </div>
                </div>
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0 transition-transform"
                  style={{
                    backgroundColor: game.color,
                    transform: isSelected ? 'scale(1.35)' : 'scale(0.85)',
                    opacity: isSelected ? 1 : 0.45,
                  }}
                />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
