import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BLOG_POSTS } from '../blogs/registry';
import { BLOG_CATEGORIES, getCategoryIcon } from '../blogs/categoryMeta';
import type { BlogCategory, BlogPostEntry } from '../blogs/types';

const generateCardRotations = (): Record<string, number> => {
  const rotations: Record<string, number> = {};
  BLOG_POSTS.forEach((p) => {
    const sign = Math.random() < 0.5 ? -1 : 1;
    const mag = 1.4 + Math.random() * 2.8;
    rotations[p.meta.slug] = Number((sign * mag).toFixed(2));
  });
  return rotations;
};

interface ZoomingCardState {
  post: BlogPostEntry;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  targetX: number;
  targetY: number;
  targetScale: number;
  rotation: number;
  cardNum: number;
  suitColor: string;
}

export const BlogIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'All' | BlogCategory>('All');
  const [cardRotations] = useState<Record<string, number>>(generateCardRotations);
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);
  const [zoomingCard, setZoomingCard] = useState<ZoomingCardState | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsHeaderMinimized((prev) => {
        if (!prev && y > 58) return true;
        if (prev && y < 20) return false;
        return prev;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.meta.category === selectedCategory);
  }, [selectedCategory]);

  const handleCardClick = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement>,
      post: BlogPostEntry,
      rotation: number,
      cardNum: number,
      suitColor: string
    ) => {
      if (
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        zoomingCard
      ) {
        return;
      }
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      const targetX = vw / 2 - cardCenterX;
      const targetY = vh / 2 - cardCenterY;
      // Uniform scale so the 5:7 card shape/aspect ratio never distorts while zooming to fill the screen
      const targetScale = Math.max(vw / rect.width, vh / rect.height) * 1.18;

      setZoomingCard({
        post,
        rect: {
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        },
        targetX,
        targetY,
        targetScale,
        rotation,
        cardNum,
        suitColor,
      });

      window.setTimeout(() => {
        navigate(`/blog/${post.meta.slug}`, {
          state: { fromCardZoom: true },
        });
      }, 460);
    },
    [navigate, zoomingCard]
  );

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
        {/* Header Wrapper reserving height in normal flow so scroll never jumps */}
        <div className="min-h-[168px] sm:min-h-[184px] mb-6 sm:mb-8">
          <motion.header
            layout
            transition={{
              layout: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
            }}
            className={
              isHeaderMinimized
                ? 'fixed top-3 left-3 right-3 sm:right-auto sm:top-4 sm:left-6 z-40 sm:max-w-[calc(100vw-320px)] flex flex-row flex-wrap items-center gap-3 sm:gap-3.5 px-4 py-2 rounded-2xl bg-[#f8f7fc]/90 backdrop-blur-md border border-zinc-900/12 shadow-[0_10px_28px_rgba(24,24,27,0.09)]'
                : 'relative flex flex-col items-start'
            }
          >
            <motion.h1
              layout="position"
              transition={{
                layout: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
              }}
              onClick={
                isHeaderMinimized
                  ? () => window.scrollTo({ top: 0, behavior: 'smooth' })
                  : undefined
              }
              className={`text-zinc-900 font-black tracking-tight leading-[1.06] m-0 select-none transition-[font-size] duration-300 ease-out ${
                isHeaderMinimized ? 'cursor-pointer shrink-0' : ''
              }`}
              style={{
                fontFamily: 'Archivo Black, sans-serif',
                fontSize: isHeaderMinimized
                  ? 'clamp(1.05rem, 1.6vw, 1.25rem)'
                  : 'clamp(2.1rem, 4.6vw, 3.6rem)',
              }}
            >
              Blog
            </motion.h1>

            {/* Unmounted immediately when minimized so it never occupies horizontal width in flex-row */}
            {!isHeaderMinimized && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="text-zinc-600 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mt-3 mb-0"
              >
                Essays, engineering notes, postmortems, and game design studies.
              </motion.p>
            )}

            {/* Parallelogram Category Filter Strip */}
            <motion.div
              layout="position"
              transition={{
                layout: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
              }}
              className={`flex items-center gap-1.5 sm:gap-2 flex-wrap ${
                isHeaderMinimized ? 'mt-0 pl-1' : 'mt-6'
              }`}
            >
              {BLOG_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    style={{ transform: 'skewX(-16deg)' }}
                    className={`inline-flex items-center justify-center rounded-[3px] font-semibold transition-colors duration-200 cursor-pointer border ${
                      isHeaderMinimized
                        ? 'px-2.5 py-1 text-[11px]'
                        : 'px-3.5 py-1.5 text-xs'
                    } ${
                      isActive
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-transparent text-zinc-700 border-zinc-900/25 hover:border-zinc-900/70 hover:bg-zinc-900/[0.06] hover:text-zinc-950'
                    }`}
                  >
                    <span
                      style={{ transform: 'skewX(16deg)' }}
                      className="inline-flex items-center gap-1.5"
                    >
                      {category !== 'All' &&
                        getCategoryIcon(
                          category,
                          isHeaderMinimized ? 'w-3 h-3' : 'w-3.5 h-3.5'
                        )}
                      <span>{category}</span>
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </motion.header>
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
              const isZoomingThisCard = zoomingCard?.post.meta.slug === meta.slug;

              return (
                <motion.div
                  key={meta.slug}
                  initial={{ opacity: 0, x: 160, rotate: rotation + 10 }}
                  animate={{
                    opacity: isZoomingThisCard ? 0 : 1,
                    x: 0,
                    rotate: rotation,
                  }}
                  transition={{
                    duration: isZoomingThisCard ? 0 : 0.55,
                    delay: isZoomingThisCard ? 0 : Math.min(idx * 0.04, 0.45),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={
                    zoomingCard
                      ? undefined
                      : {
                          y: -12,
                          scale: 1.035,
                          rotate: rotation * 0.35,
                          transition: { duration: 0.25, ease: 'easeOut' },
                        }
                  }
                  className="w-full max-w-[310px] aspect-[5/7]"
                >
                  <Link
                    to={`/blog/${meta.slug}`}
                    onClick={(e) =>
                      handleCardClick(e, post, rotation, cardNum, suitColor)
                    }
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

                    {/* Top-Left Corner Header: Overlaid at z-20 so image rect is visible behind it */}
                    <div
                      className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex flex-col items-center leading-none select-none px-1.5 py-1 rounded-lg bg-[#f9f6ee]/70 backdrop-blur-[2px] shadow-[0_0_14px_6px_rgba(249,246,238,0.75)]"
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

                    {/* Upper Artwork Rect extending behind the Top-Left Header */}
                    <div className="relative z-10 flex-1 w-full flex items-center justify-center mb-2 min-h-0">
                      {meta.coverImage ? (
                        <div className="relative w-full h-full max-h-[265px] playing-card-art-dither-fade flex items-center justify-center overflow-hidden rounded-xl">
                          <img
                            src={meta.coverImage}
                            alt={meta.title}
                            loading="lazy"
                            className="w-full h-full object-cover playing-card-art-core transition-transform duration-500 group-hover:scale-105"
                            style={{ objectPosition: meta.coverPosition ?? 'center' }}
                          />
                          <img
                            src={meta.coverImage}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover playing-card-art-dither-img transition-transform duration-500 group-hover:scale-105"
                            style={{ objectPosition: meta.coverPosition ?? 'center' }}
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

      {/* Card Zoom-In Transition Overlay: Preserves exact 5:7 card shape & hides image before zooming */}
      <AnimatePresence>
        {zoomingCard && (
          <div
            key="card-zoom-stage"
            className="fixed inset-0 z-50 pointer-events-auto overflow-hidden"
          >
            <motion.div
              style={{
                top: zoomingCard.rect.top,
                left: zoomingCard.rect.left,
                width: zoomingCard.rect.width,
                height: zoomingCard.rect.height,
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 1,
                rotate: zoomingCard.rotation,
              }}
              animate={{
                x: zoomingCard.targetX,
                y: zoomingCard.targetY,
                scale: zoomingCard.targetScale,
                rotate: 0,
              }}
              transition={{
                delay: 0.09,
                duration: 0.37,
                ease: [0.32, 0, 0.2, 1],
              }}
              className="fixed rounded-[22px] bg-[#f9f6ee] border border-zinc-900/15 shadow-[0_32px_90px_rgba(24,24,27,0.28)] overflow-hidden flex flex-col justify-between p-4 sm:p-5 origin-center will-change-transform"
            >
              {/* Whole-Card Rough Dither Grain */}
              <div
                className="pointer-events-none absolute inset-0 z-10 playing-card-dither-grain opacity-25"
                aria-hidden="true"
              />

              {/* Inner Playing Card Frame Line fades out cleanly as card zooms */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-2.5 rounded-[14px] border border-zinc-900/[0.08] z-10"
                aria-hidden="true"
              />

              {/* Card Details fade out quickly before the zoom scales up */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
                className="relative w-full h-full flex flex-col justify-between"
              >
                <div
                  className="absolute top-0 left-0 z-20 flex flex-col items-center leading-none select-none px-1.5 py-1 rounded-lg bg-[#f9f6ee]/70"
                  style={{ color: zoomingCard.suitColor }}
                >
                  <span
                    className="text-2xl sm:text-[26px] leading-none"
                    style={{ fontFamily: "'Alfa Slab One', serif" }}
                  >
                    {zoomingCard.cardNum}
                  </span>
                  <span className="mt-1">
                    {getCategoryIcon(zoomingCard.post.meta.category, 'w-4 h-4')}
                  </span>
                </div>

                {/* Image is hidden immediately so it never stretches during zoom */}
                <div className="flex-1" />

                <div className="relative z-20 px-2 pb-3 text-center">
                  <h2
                    className="text-zinc-900 text-lg sm:text-xl font-black leading-tight tracking-tight m-0"
                    style={{ fontFamily: 'Archivo Black, sans-serif' }}
                  >
                    {zoomingCard.post.meta.title}
                  </h2>
                </div>

                <div
                  className="relative z-20 self-end text-[11px] font-mono font-bold tracking-wider select-none opacity-85"
                  style={{ color: zoomingCard.suitColor }}
                >
                  {zoomingCard.post.meta.date}
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
