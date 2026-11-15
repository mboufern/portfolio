import React from 'react';
import { Link } from 'react-router-dom';
import { TbArrowLeft, TbCalendar, TbClock, TbArrowRight } from 'react-icons/tb';
import type { BlogPostEntry } from './types';

interface BlogLayoutProps {
  post: BlogPostEntry;
  prevPost?: BlogPostEntry;
  nextPost?: BlogPostEntry;
  children: React.ReactNode;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  post,
  prevPost,
  nextPost,
  children,
}) => {
  const { meta } = post;

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8f7fc] text-zinc-900 relative overflow-x-hidden">
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

      <article className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-10 pt-8 sm:pt-20 pb-24 sm:pb-16">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors mb-7 no-underline"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>All Articles & Devlogs</span>
        </Link>

        {/* Post Header */}
        <header className="mb-9 pb-7 border-b border-zinc-200/80">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {meta.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide"
                style={{
                  backgroundColor: `${meta.accent}18`,
                  color: meta.accent,
                  border: `1px solid ${meta.accent}40`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1
            className="text-zinc-900 font-black tracking-tight leading-[1.08] m-0"
            style={{
              fontFamily: 'Archivo Black, sans-serif',
              fontSize: 'clamp(1.9rem, 4.4vw, 3.2rem)',
            }}
          >
            {meta.title}
          </h1>

          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed mt-3 mb-4 max-w-2xl">
            {meta.subtitle}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <TbCalendar className="w-3.5 h-3.5" />
              <span>{meta.date}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TbClock className="w-3.5 h-3.5" />
              <span>{meta.readTime}</span>
            </span>
          </div>
        </header>

        {/* Custom TSX Blog Content */}
        <div className="space-y-8">{children}</div>

        {/* Footer Post Switcher */}
        {(prevPost || nextPost) && (
          <footer className="mt-14 pt-8 border-t border-zinc-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                to={`/blog/${prevPost.meta.slug}`}
                className="group p-4 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all no-underline"
              >
                <span className="text-[11px] font-mono tracking-wider text-zinc-400 flex items-center gap-1 mb-1">
                  <TbArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </span>
                <div className="font-bold text-sm text-zinc-900 group-hover:text-black line-clamp-1">
                  {prevPost.meta.title}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextPost && (
              <Link
                to={`/blog/${nextPost.meta.slug}`}
                className="group p-4 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all text-left sm:text-right no-underline"
              >
                <span className="text-[11px] font-mono tracking-wider text-zinc-400 inline-flex items-center gap-1 mb-1">
                  <span>Next</span>
                  <TbArrowRight className="w-3.5 h-3.5" />
                </span>
                <div className="font-bold text-sm text-zinc-900 group-hover:text-black line-clamp-1">
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
