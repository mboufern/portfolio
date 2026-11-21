import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { TbArrowLeft, TbArrowRight, TbCalendar, TbClock } from 'react-icons/tb';
import type { BlogPostEntry } from './types';
import { getCategoryIcon } from './categoryMeta';

interface BlogLayoutProps {
  post: BlogPostEntry;
  postNumber?: number;
  prevPost?: BlogPostEntry;
  nextPost?: BlogPostEntry;
  children: React.ReactNode;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  post,
  postNumber,
  prevPost,
  nextPost,
  children,
}) => {
  const { meta } = post;
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
    <div className="min-h-[100dvh] w-full bg-[#f8f7fc] text-zinc-900 relative overflow-x-hidden">
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

      <article className="relative z-10 max-w-3xl mx-auto px-5 sm:px-8 pt-10 sm:pt-20 pb-28 sm:pb-20">
        {/* Editorial Top Navigation Strip */}
        <div className="flex items-center justify-between gap-4 mb-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-950 transition-colors no-underline"
          >
            <TbArrowLeft className="w-4 h-4" />
            <span>All Articles</span>
          </Link>

          <div className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500">
            {formattedNumber && (
              <>
                <span className="font-bold text-zinc-800">No. {formattedNumber}</span>
                <span className="text-zinc-300" aria-hidden="true">
                  /
                </span>
              </>
            )}
            <span className="inline-flex items-center gap-1.5 text-zinc-700 font-medium">
              {getCategoryIcon(meta.category, 'w-3.5 h-3.5')}
              <span>{meta.category}</span>
            </span>
          </div>
        </div>

        {/* Editorial Post Header */}
        <header className="mb-10">
          <h1
            className="text-zinc-950 font-black tracking-tight leading-[1.06] m-0 [text-wrap:balance]"
            style={{
              fontFamily: 'Archivo Black, sans-serif',
              fontSize: 'clamp(1.9rem, 4.4vw, 3.1rem)',
            }}
          >
            {meta.title}
          </h1>

          <p className="text-zinc-600 text-base sm:text-xl leading-relaxed mt-4 mb-6 [text-wrap:pretty]">
            {meta.subtitle}
          </p>

          {/* Understated Metadata Hairline */}
          <div className="pt-4 pb-5 border-t border-b border-zinc-200/80 flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-xs font-mono text-zinc-500">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-zinc-700">
                <TbCalendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>{meta.date}</span>
              </span>
              {!meta.isDraft && (
                <span className="inline-flex items-center gap-1.5 text-zinc-700">
                  <TbClock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{meta.readTime}</span>
                </span>
              )}
            </div>

            {meta.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-zinc-400">
                {meta.tags.map((tag, idx) => (
                  <React.Fragment key={tag}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span>{tag}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Cover Visual Frame */}
          {meta.coverImage && (
            <div className="mt-8 rounded-2xl overflow-hidden border border-zinc-900/10 bg-zinc-950 shadow-[0_18px_45px_rgba(24,24,27,0.09)]">
              <img
                src={meta.coverImage}
                alt={meta.title}
                className="w-full max-h-[380px] object-cover block"
              />
            </div>
          )}
        </header>

        {/* Editorial Body */}
        <div className="space-y-6">{children}</div>

        {/* Footer Article Navigation */}
        {(prevPost || nextPost) && (
          <footer className="mt-16 pt-8 border-t border-zinc-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.meta.slug}`}
                className="group p-5 rounded-2xl bg-white/80 hover:bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all no-underline"
              >
                <span className="text-[11px] font-mono tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1.5">
                  <TbArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                  <span>Previous</span>
                </span>
                <div className="font-bold text-sm sm:text-base text-zinc-900 group-hover:text-black line-clamp-1">
                  {prevPost.meta.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPost && (
              <Link
                to={`/blog/${nextPost.meta.slug}`}
                className="group p-5 rounded-2xl bg-white/80 hover:bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all text-left sm:text-right no-underline"
              >
                <span className="text-[11px] font-mono tracking-wider text-zinc-400 inline-flex items-center gap-1.5 mb-1.5">
                  <span>Next</span>
                  <TbArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
                <div className="font-bold text-sm sm:text-base text-zinc-900 group-hover:text-black line-clamp-1">
                  {nextPost.meta.title}
                </div>
              </Link>
            )}
          </footer>
        )}
      </article>
    </div>
  );
};
