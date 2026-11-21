import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { TbArrowLeft, TbCalendar, TbClock } from 'react-icons/tb';
import type { BlogPostEntry } from './types';
import { getCategoryIcon } from './categoryMeta';
import { ArticleDitherImage } from './components/ArticlePrimitives';

interface BlogLayoutProps {
  post: BlogPostEntry;
  postNumber?: number;
  children: React.ReactNode;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  post,
  postNumber,
  children,
}) => {
  const { meta } = post;
  const location = useLocation();
  const fromCardZoom = Boolean(
    (location.state as { fromCardZoom?: boolean } | null)?.fromCardZoom
  );

  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsHeaderMinimized((prev) => {
        if (!prev && y > 68) return true;
        if (prev && y < 22) return false;
        return prev;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  const formattedNumber =
    typeof postNumber === 'number' && postNumber > 0
      ? String(postNumber).padStart(2, '0')
      : null;

  return (
    <div className="min-h-[100dvh] w-full bg-[#f9f6ee] text-zinc-900 relative overflow-x-hidden">
      {/* Subtle Whole-Page Card Dither Texture */}
      <div
        className="pointer-events-none fixed inset-0 z-0 playing-card-dither-grain opacity-20"
        aria-hidden="true"
      />

      {/* Subtle Top Reading Progress Line */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 origin-left pointer-events-none"
        style={{
          scaleX,
          backgroundColor: meta.accent,
        }}
        aria-hidden="true"
      />

      {/* Subtle Ambient Background Halo */}
      <div
        className="fixed -top-36 -right-28 w-[520px] h-[520px] rounded-full pointer-events-none opacity-15"
        style={{
          background: `radial-gradient(circle, ${meta.accent} 0%, transparent 70%)`,
          filter: 'blur(90px)',
        }}
        aria-hidden="true"
      />
      <div
        className="fixed -bottom-40 -left-24 w-[480px] h-[480px] rounded-full pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, #15cea9 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
        aria-hidden="true"
      />

      <motion.article
        initial={
          fromCardZoom
            ? { opacity: 0, scale: 0.92, y: 22 }
            : { opacity: 0, scale: 0.97, y: 12 }
        }
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          duration: 0.48,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-20 pb-28 sm:pb-20"
      >
        {/* Editorial Post Header */}
        <header className="mb-10">
          {/* Reserved Flow Slot for Morphing Header (Back Button + Title + Category) */}
          <div className="min-h-[118px] sm:min-h-[138px]">
            <motion.div
              layout
              transition={{
                layout: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
              }}
              className={
                isHeaderMinimized
                  ? 'fixed top-3 left-3 right-3 sm:right-auto sm:top-4 sm:left-6 z-40 sm:max-w-[calc(100vw-320px)] flex flex-row items-center gap-2.5 sm:gap-3.5 px-3.5 py-2 sm:px-4 sm:py-2 rounded-2xl bg-[#f9f6ee]/92 backdrop-blur-md border border-zinc-900/15 shadow-[0_10px_28px_rgba(24,24,27,0.1)]'
                  : 'relative flex flex-col'
              }
            >
              {/* Top Row in Full View / Left+Right Items in Minimized View */}
              <motion.div
                layout="position"
                className={
                  isHeaderMinimized
                    ? 'contents'
                    : 'flex items-center justify-between gap-4 mb-6 w-full'
                }
              >
                {/* Back Button */}
                <motion.div layout="position" className="shrink-0">
                  <Link
                    to="/blog"
                    className={`inline-flex items-center gap-1.5 font-semibold text-zinc-600 hover:text-zinc-950 transition-colors no-underline ${
                      isHeaderMinimized
                        ? 'text-xs px-2 py-1 rounded-lg bg-zinc-900/[0.06] hover:bg-zinc-900/[0.12]'
                        : 'text-xs sm:text-sm'
                    }`}
                  >
                    <TbArrowLeft className="w-4 h-4 shrink-0" />
                    <span>{isHeaderMinimized ? 'Blog' : 'All Articles'}</span>
                  </Link>
                </motion.div>

                {/* Article Title (rendered inline between Back and Category when minimized) */}
                {isHeaderMinimized && (
                  <motion.h1
                    layoutId="article-main-title"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-zinc-950 font-black tracking-tight leading-tight m-0 truncate cursor-pointer text-xs sm:text-sm md:text-base max-w-[44vw] sm:max-w-[340px] md:max-w-[420px]"
                    style={{
                      fontFamily: 'Archivo Black, sans-serif',
                    }}
                    title={meta.title}
                  >
                    {meta.title}
                  </motion.h1>
                )}

                {/* Category Badge */}
                <motion.div
                  layout="position"
                  className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 shrink-0"
                >
                  {!isHeaderMinimized && formattedNumber && (
                    <>
                      <span className="font-bold text-zinc-800">
                        No. {formattedNumber}
                      </span>
                      <span className="text-zinc-300" aria-hidden="true">
                        /
                      </span>
                    </>
                  )}
                  <span
                    style={{ transform: 'skewX(-14deg)' }}
                    className={`inline-flex items-center rounded-[3px] border border-zinc-900/20 bg-zinc-900 text-[#f9f6ee] font-sans font-semibold ${
                      isHeaderMinimized
                        ? 'px-2.5 py-0.5 text-[11px]'
                        : 'px-3 py-1 text-xs'
                    }`}
                  >
                    <span
                      style={{ transform: 'skewX(14deg)' }}
                      className="inline-flex items-center gap-1.5"
                    >
                      {getCategoryIcon(
                        meta.category,
                        isHeaderMinimized ? 'w-3 h-3' : 'w-3.5 h-3.5'
                      )}
                      <span>{meta.category}</span>
                    </span>
                  </span>
                </motion.div>
              </motion.div>

              {/* Full-size Article Title when not minimized */}
              {!isHeaderMinimized && (
                <motion.h1
                  layoutId="article-main-title"
                  className="text-zinc-950 font-black tracking-tight leading-[1.06] m-0 [text-wrap:balance]"
                  style={{
                    fontFamily: 'Archivo Black, sans-serif',
                    fontSize: 'clamp(1.9rem, 4.4vw, 3.1rem)',
                  }}
                >
                  {meta.title}
                </motion.h1>
              )}
            </motion.div>
          </div>

          <p className="text-zinc-600 text-base sm:text-xl leading-relaxed mt-4 mb-6 [text-wrap:pretty]">
            {meta.subtitle}
          </p>

          {/* Understated Metadata Hairline */}
          <div className="pt-4 pb-5 border-t border-b border-zinc-900/12 flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-zinc-700">
                <TbCalendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{meta.date}</span>
              </span>
              {!meta.isDraft && (
                <span className="inline-flex items-center gap-1.5 text-zinc-700">
                  <TbClock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{meta.readTime}</span>
                </span>
              )}
            </div>

            {meta.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-500">
                {meta.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span>{tag}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Cover Visual Frame with Left & Right Edge Slight Dither */}
          {meta.coverImage && (
            <div className="mt-8">
              <ArticleDitherImage
                src={meta.coverImage}
                alt={meta.title}
                objectPosition={meta.coverPosition}
                imgClassName="w-full max-h-[380px] object-cover block"
                loading="eager"
              />
            </div>
          )}
        </header>

        {/* Editorial Body */}
        <div className="space-y-6 article-editorial-body">{children}</div>
      </motion.article>
    </div>
  );
};
