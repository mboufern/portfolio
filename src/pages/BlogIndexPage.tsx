import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TbArrowUpRight, TbCalendar, TbClock } from 'react-icons/tb';
import { BLOG_POSTS } from '../blogs/registry';

export const BlogIndexPage: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = useMemo(() => {
    const tags = new Set<string>(['All']);
    BLOG_POSTS.forEach((p) => p.meta.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedTag === 'All') return BLOG_POSTS;
    return BLOG_POSTS.filter((p) => p.meta.tags.includes(selectedTag));
  }, [selectedTag]);

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

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 md:px-12 pt-10 sm:pt-20 pb-24 sm:pb-16">
        <header className="mb-8 sm:mb-10">
          <span className="text-xs font-mono tracking-[0.2em] text-[#ff779c] font-bold block mb-2">
            Writing & Devlogs
          </span>
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

        {/* Tag Filter Strip */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {allTags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:text-zinc-900'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => {
            const { meta } = post;
            return (
              <Link
                key={meta.slug}
                to={`/blog/${meta.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-zinc-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between no-underline"
              >
                <div>
                  {meta.coverImage && (
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={meta.coverImage}
                        alt={meta.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div
                        className="absolute bottom-0 inset-x-0 h-1"
                        style={{ backgroundColor: meta.accent }}
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {meta.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold"
                          style={{
                            backgroundColor: `${meta.accent}18`,
                            color: meta.accent,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2
                      className="text-zinc-900 text-xl sm:text-2xl font-black leading-tight mb-2 mt-0 group-hover:text-black"
                      style={{ fontFamily: 'Archivo Black, sans-serif' }}
                    >
                      {meta.title}
                    </h2>

                    <p className="text-zinc-600 text-sm leading-relaxed m-0 line-clamp-3">
                      {meta.subtitle}
                    </p>
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <TbCalendar className="w-3.5 h-3.5" />
                      <span>{meta.date}</span>
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <TbClock className="w-3.5 h-3.5" />
                      <span>{meta.readTime}</span>
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-sans font-bold text-zinc-900 group-hover:translate-x-0.5 transition-transform">
                    <span>Read</span>
                    <TbArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
