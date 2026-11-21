import React from 'react';
import { Link } from 'react-router-dom';
import { TbArrowLeft, TbFeather } from 'react-icons/tb';

export const ArticleLead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-zinc-800 text-lg sm:text-[19px] leading-[1.75] font-normal m-0">
    {children}
  </p>
);

export const ArticleParagraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-zinc-700 text-base sm:text-[17px] leading-[1.8] m-0">
    {children}
  </p>
);

export const ArticleSectionHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2
    className="text-zinc-900 text-xl sm:text-2xl font-black tracking-tight leading-snug mt-10 mb-3"
    style={{ fontFamily: 'Archivo Black, sans-serif' }}
  >
    {children}
  </h2>
);

export const ArticleSubheading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-zinc-900 text-base sm:text-lg font-bold tracking-tight mt-6 mb-2">
    {children}
  </h3>
);

export const ArticleQuote: React.FC<{
  children: React.ReactNode;
  accent?: string;
  attribution?: string;
}> = ({ children, accent = '#18181b', attribution }) => (
  <blockquote
    className="my-7 pl-5 sm:pl-6 py-1 border-l-2 m-0"
    style={{ borderColor: accent }}
  >
    <p className="text-zinc-800 text-lg sm:text-xl leading-relaxed font-medium italic m-0">
      {children}
    </p>
    {attribution && (
      <footer className="mt-2 text-xs font-mono text-zinc-500 not-italic">
        - {attribution}
      </footer>
    )}
  </blockquote>
);

export const ArticleFigure: React.FC<{
  src: string;
  alt: string;
  caption?: string;
}> = ({ src, alt, caption }) => (
  <figure className="my-8 m-0">
    <div className="rounded-2xl overflow-hidden border border-zinc-900/10 bg-zinc-950 shadow-[0_12px_32px_rgba(24,24,27,0.08)]">
      <img src={src} alt={alt} loading="lazy" className="w-full h-auto block object-cover" />
    </div>
    {caption && (
      <figcaption className="mt-2.5 text-xs font-mono text-zinc-500 text-center">
        {caption}
      </figcaption>
    )}
  </figure>
);

export const ArticleDivider: React.FC = () => (
  <hr className="my-8 border-0 h-px bg-zinc-200/80" />
);

export const ArticleDraftNotice: React.FC<{
  topic?: string;
}> = ({ topic }) => (
  <div className="rounded-2xl bg-white/80 border border-zinc-900/10 p-7 sm:p-10 shadow-[0_8px_30px_rgba(24,24,27,0.05)]">
    <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.16em] text-zinc-500 font-semibold mb-3">
      <TbFeather className="w-4 h-4 text-zinc-700" />
      <span>Drafting in Progress</span>
    </div>

    <p className="text-zinc-700 text-base sm:text-[17px] leading-relaxed m-0 max-w-2xl">
      {topic
        ? `${topic} The full essay is currently being written and will be published here soon.`
        : 'This article is currently being written and will be published here soon.'}
    </p>

    <div className="mt-6 pt-5 border-t border-zinc-200/70">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-950 transition-colors no-underline"
      >
        <TbArrowLeft className="w-4 h-4" />
        <span>Return to All Articles</span>
      </Link>
    </div>
  </div>
);
