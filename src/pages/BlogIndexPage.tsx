import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBomb, FaCode, FaPalette, FaScroll } from 'react-icons/fa6';
import { BLOG_POSTS } from '../blogs/registry';
import type { BlogCategory } from '../blogs/types';

const BLOG_CATEGORIES: Array<'All' | BlogCategory> = [
  'All',
  'Game Dev',
  'Software Architecture',
  'Art',
  'Devlogs',
];

const getCategoryIcon = (category: BlogCategory, className = 'w-4 h-4') => {
  switch (category) {
    case 'Game Dev':
      return <FaBomb className={className} />;
    case 'Software Architecture':
      return <FaCode className={className} />;
    case 'Art':
      return <FaPalette className={className} />;
    case 'Devlogs':
    default:
      return <FaScroll className={className} />;
  }
};

const generateCardRotations = (): Record<string, number> => {
  const rotations: Record<string, number> = {};
  BLOG_POSTS.forEach((p) => {
    const sign = Math.random() < 0.5 ? -1 : 1;
    const mag = 1.4 + Math.random() * 2.8;
    rotations[p.meta.slug] = Number((sign * mag).toFixed(2));
  });
  return rotations;
};

export const BlogIndexPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | BlogCategory>('All');
  const [cardRotations] = useState<Record<string, number>>(generateCardRotations);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.meta.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8f7fc] text-zinc-900 relative overflow-x-hidden">
      {/* Subtle Ambient Background Lighting */}
      <div
        className="fixed -top-32 -right-24 w-[520px] h-[520px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, #ff779c 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        aria-hidden="true"
      />
      <div
        className="fixed -bottom-40 -left-24 w-[520px] h-[520px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, #15cea9 0%, transparent 70%)',
          filter: 'blur(95px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-10 sm:pt-20 pb-24 sm:pb-16">
        <header className="mb-8 sm:mb-10">
          <h1
            className="text-zinc-900 font-black tracking-tight leading-[1.06] m-0"
            style={{
              fontFamily: 'Archivo Black, sans-serif',
              fontSize: 'clamp(2.1rem, 4.6vw, 3.6rem)',
            }}
          >
            Blog
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mt-3 mb-0">
            Thoughts, engineering notes, project updates, and game studies written as interactive components.
          </p>
        </header>

        {/* Category Filter Strip */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          {BLOG_CATEGORIES.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900'
                }`}
              >
                {category !== 'All' && getCategoryIcon(category, 'w-3.5 h-3.5')}
                <span>{category}</span>
              </button>
            );
          })}
        </div>

        {/* Playing Cards Grid */}
        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-sm font-mono">
            No articles in this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 items-center justify-items-center overflow-visible">
            {filteredPosts.map((post, idx) => {
              const { meta } = post;
              const deckIndex = BLOG_POSTS.findIndex((p) => p.meta.slug === meta.slug);
              const cardNum = (deckIndex >= 0 ? deckIndex : idx) + 1;
              const isEven = cardNum % 2 === 0;
              const suitColor = isEven ? '#d92638' : '#18181b';
              const rotation = cardRotations[meta.slug] ?? (isEven ? -2.2 : 2.2);

              return (
                <motion.div
                  key={meta.slug}
                  initial={{ opacity: 0, x: 160, rotate: rotation + 10 }}
                  animate={{ opacity: 1, x: 0, rotate: rotation }}
                  transition={{
                    duration: 0.55,
                    delay: idx * 0.09,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -12,
                    scale: 1.035,
                    rotate: rotation * 0.35,
                    transition: { duration: 0.25, ease: 'easeOut' },
                  }}
                  className="w-full max-w-[310px] aspect-[5/7]"
                >
                  <Link
                    to={`/blog/${meta.slug}`}
                    className="group relative w-full h-full rounded-[22px] bg-[#f9f6ee] border border-zinc-900/15 shadow-[0_10px_28px_rgba(24,24,27,0.1)] group-hover:shadow-[0_24px_48px_rgba(24,24,27,0.2)] transition-shadow duration-300 overflow-hidden flex flex-col justify-between p-4 sm:p-5 no-underline"
                  >
                    {/* Subtle Whole-Card Rough Dither Grain */}
                    <div
                      className="pointer-events-none absolute inset-0 z-10 playing-card-dither-grain opacity-25"
                      aria-hidden="true"
                    />

                    {/* Edge-Weighted CSS Dither Texture */}
                    <div
                      className="pointer-events-none absolute inset-0 z-10 playing-card-dither-surface opacity-75"
                      aria-hidden="true"
                    >
                      <div className="w-full h-full playing-card-dither-grain" />
                    </div>

                    {/* Inner Playing Card Frame Line */}
                    <div
                      className="pointer-events-none absolute inset-2.5 rounded-[14px] border border-zinc-900/[0.08] z-10"
                      aria-hidden="true"
                    />

                    {/* Top-Left Corner: Index Number (Alfa Slab One) & Category Fill Icon */}
                    <div
                      className="relative z-20 flex flex-col items-center self-start leading-none select-none"
                      style={{ color: suitColor }}
                    >
                      <span
                        className="text-2xl sm:text-[26px] leading-none"
                        style={{ fontFamily: "'Alfa Slab One', serif" }}
                      >
                        {cardNum}
                      </span>
                      <span className="mt-1" title={meta.category}>
                        {getCategoryIcon(meta.category, 'w-4 h-4')}
                      </span>
                    </div>

                    {/* Upper-Center Artwork with Dithered Blending Edges */}
                    <div className="relative z-10 flex-1 w-full flex items-center justify-center -mt-3 mb-2 min-h-0">
                      {meta.coverImage ? (
                        <div className="relative w-[94%] h-[92%] max-h-[215px] playing-card-art-dither-fade flex items-center justify-center">
                          <img
                            src={meta.coverImage}
                            alt={meta.title}
                            loading="lazy"
                            className="w-full h-full object-cover playing-card-art-core transition-transform duration-500 group-hover:scale-105"
                          />
                          <img
                            src={meta.coverImage}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover playing-card-art-dither-img transition-transform duration-500 group-hover:scale-105"
                          />
                          <div
                            className="pointer-events-none absolute inset-0 playing-card-art-dither-rim"
                            aria-hidden="true"
                          >
                            <div className="w-full h-full playing-card-dither-grain opacity-65" />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="w-28 h-28 rounded-full flex items-center justify-center opacity-20"
                          style={{ color: suitColor }}
                        >
                          {getCategoryIcon(meta.category, 'w-14 h-14')}
                        </div>
                      )}
                    </div>

                    {/* Centered Title Directly Below Artwork */}
                    <div className="relative z-20 px-2 pb-3 text-center">
                      <h2
                        className="text-zinc-900 text-lg sm:text-xl font-black leading-tight tracking-tight m-0 line-clamp-3 group-hover:text-black"
                        style={{ fontFamily: 'Archivo Black, sans-serif' }}
                      >
                        {meta.title}
                      </h2>
                    </div>

                    {/* Bottom-Right Corner: Creation Year & Month */}
                    <div
                      className="relative z-20 self-end text-[11px] font-mono font-bold tracking-wider select-none opacity-85"
                      style={{ color: suitColor }}
                    >
                      {meta.date}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
