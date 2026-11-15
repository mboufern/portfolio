import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TbDeviceGamepad2, TbSparkles } from 'react-icons/tb';
import { PLAYED_GAMES, type GameReview } from '../../data/portfolioData';

export const GamesILikePost: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>(PLAYED_GAMES[0]?.id ?? '');
  const featured: GameReview =
    PLAYED_GAMES.find((g) => g.id === selectedId) ?? PLAYED_GAMES[0];

  return (
    <div className="space-y-10">
      {/* Intro Prose */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-zinc-200/80 shadow-sm">
        <p className="text-zinc-700 text-base sm:text-lg leading-relaxed m-0">
          Every developer has a mental library of systems that made an unforgettable
          impression the first time they saw them work. Whether it is chemistry
          engines interacting seamlessly across a giant open terrain or enemy AI
          quietly adapting to habits you formed five missions ago, great games teach
          lessons that carry straight into engineering interactive products.
        </p>
      </div>

      {/* Interactive Featured Game Breakdown Stage */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs font-mono tracking-[0.16em] text-zinc-500 flex items-center gap-1.5 font-semibold">
            <TbDeviceGamepad2 className="w-4 h-4 text-[#ff779c]" />
            <span>Interactive Spotlight — Select a Title</span>
          </span>
        </div>

        {/* Game Selector Strip */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {PLAYED_GAMES.map((game) => {
            const isActive = game.id === featured.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setSelectedId(game.id)}
                className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all cursor-pointer flex-shrink-0 border"
                style={{
                  backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
                  borderColor: isActive ? game.color : 'rgba(228,228,231,0.9)',
                  boxShadow: isActive
                    ? `0 6px 20px ${game.accentGlow.replace('0.45', '0.22')}`
                    : 'none',
                }}
              >
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
                <span className="text-xs sm:text-sm font-bold text-zinc-900 whitespace-nowrap">
                  {game.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Spotlight Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
            className="rounded-3xl overflow-hidden bg-white border border-zinc-200/90 shadow-lg"
          >
            <div className="relative h-56 sm:h-80 w-full overflow-hidden bg-zinc-950">
              <img
                src={featured.image}
                alt={featured.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-5 left-6 right-6">
                <span
                  className="inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wider text-white mb-2 backdrop-blur-md"
                  style={{
                    backgroundColor: `${featured.color}cc`,
                  }}
                >
                  {featured.subtitle}
                </span>
                <h2
                  className="text-white text-xl sm:text-3xl font-black m-0"
                  style={{ fontFamily: 'Archivo Black, sans-serif' }}
                >
                  {featured.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <p className="text-zinc-700 text-base sm:text-[17px] leading-relaxed m-0">
                {featured.opinion}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Complete Notes Grid */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono tracking-[0.16em] text-zinc-500 font-semibold">
          <TbSparkles className="w-4 h-4 text-[#15cea9]" />
          <span>Full Design Notebook</span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {PLAYED_GAMES.map((game) => (
            <div
              key={game.id}
              className="group bg-white rounded-2xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row"
            >
              <div className="sm:w-56 h-44 sm:h-auto flex-shrink-0 overflow-hidden bg-zinc-950 relative">
                <img
                  src={game.image}
                  alt={game.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute bottom-0 inset-x-0 h-1"
                  style={{ backgroundColor: game.color }}
                />
              </div>

              <div className="p-5 sm:p-6 flex flex-col justify-center">
                <span
                  className="text-[11px] font-bold tracking-wider mb-1"
                  style={{ color: game.color }}
                >
                  {game.subtitle}
                </span>
                <h3
                  className="text-zinc-900 text-lg sm:text-xl font-black mb-2 mt-0"
                  style={{ fontFamily: 'Archivo Black, sans-serif' }}
                >
                  {game.title}
                </h3>
                <p className="text-zinc-600 text-sm sm:text-[15px] leading-relaxed m-0">
                  {game.opinion}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
