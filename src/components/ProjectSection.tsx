import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Project, ProjectSection as IProjectSection } from '../data/portfolioData';
import { TechIcon } from './TechIcon';
import {
  TbWorld,
  TbApi,
  TbBrowser,
  TbDice,
  TbDeviceGamepad2,
  TbTrees,
  TbUser,
  TbUsers,
  TbClock,
  TbCalendar,
  TbExternalLink,
  TbBrandGithub,
  TbMaximize,
  TbX,
  TbChevronLeft,
  TbChevronRight,
} from 'react-icons/tb';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

const getProjectIcon = (iconName: string, className = 'w-5 h-5 flex-shrink-0') => {
  switch (iconName) {
    case 'language':
      return <TbWorld className={className} />;
    case 'api':
      return <TbApi className={className} />;
    case 'web':
      return <TbBrowser className={className} />;
    case 'casino':
      return <TbDice className={className} />;
    case 'sports_esports':
      return <TbDeviceGamepad2 className={className} />;
    case 'landscape':
      return <TbTrees className={className} />;
    case 'accessibility_new':
      return <TbUser className={className} />;
    default:
      return <TbWorld className={className} />;
  }
};

/* ── High-Fidelity Clean Project Visual Fallback ───────────────────── */
const ProjectVisualFallback: React.FC<{ project: Project; accent: string }> = ({ project, accent }) => {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none"
      style={{
        background: 'linear-gradient(145deg, #12111d 0%, #1a1829 100%)',
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.22), inset 0 0 30px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] font-mono text-zinc-400">
        <span className="flex items-center gap-1.5 font-bold tracking-wider uppercase text-zinc-300">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
          {project.category || 'Architecture'}
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">{project.year}</span>
      </div>

      <div className="flex flex-col items-center justify-center py-4 text-center">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-2.5"
          style={{
            background: `${accent}15`,
            border: `1px solid ${accent}40`,
          }}
        >
          {getProjectIcon(project.icon, 'w-6 h-6')}
        </div>
        <div className="text-sm font-bold text-white font-mono tracking-wide">{project.label}</div>
        <div className="text-xs text-zinc-400 mt-1 max-w-[220px] line-clamp-2">
          {project.technologies.slice(0, 3).join(' · ')}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono pt-2 border-t border-white/10">
        <span className="truncate">Status: <span style={{ color: project.statusColor }}>{project.status}</span></span>
        <span className="text-emerald-400 flex items-center gap-1 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ready
        </span>
      </div>
    </div>
  );
};

/* ── Performant Image, Video & Lottie Showcase with Lightbox ────────── */
interface ImageShowcaseProps {
  project: Project;
  accent: string;
}

interface MediaItem {
  type: 'video' | 'lottie' | 'image';
  src: string;
}

const isVideoUrl = (url: string) => /\.(mp4|webm|mov|mkv)(\?.*)?$/i.test(url);
const isLottieUrl = (url: string) => /\.lottie(\?.*)?$/i.test(url);

const ImageShowcase: React.FC<ImageShowcaseProps> = ({ project, accent }) => {
  const mediaItems: MediaItem[] = [];

  if (project.video) {
    mediaItems.push({ type: 'video', src: project.video });
  }
  if (project.lottie) {
    mediaItems.push({ type: 'lottie', src: project.lottie });
  }
  if (project.images && project.images.length > 0) {
    for (const img of project.images) {
      if (isVideoUrl(img)) {
        if (!mediaItems.some((m) => m.src === img)) {
          mediaItems.push({ type: 'video', src: img });
        }
      } else if (isLottieUrl(img)) {
        if (!mediaItems.some((m) => m.src === img)) {
          mediaItems.push({ type: 'lottie', src: img });
        }
      } else {
        mediaItems.push({ type: 'image', src: img });
      }
    }
  }

  const n = mediaItems.length;
  const [idx, setIdx] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowRight' && n > 1) {
        setIdx((i) => (i + 1) % n);
      } else if (e.key === 'ArrowLeft' && n > 1) {
        setIdx((i) => (i - 1 + n) % n);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, n]);

  if (n === 0) {
    return <ProjectVisualFallback project={project} accent={accent} />;
  }

  const currentItem = mediaItems[idx];

  return (
    <>
      <div
        className="relative overflow-hidden w-full h-full select-none group"
        style={{
          borderRadius: 14,
          background: '#1a1924',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08), inset 0 0 15px rgba(0,0,0,0.1)',
        }}
      >
        {/* Shimmer skeleton before image loads (only for images) */}
        {currentItem.type === 'image' && !isLoaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'linear-gradient(90deg, #242232 0%, #2f2c42 50%, #242232 100%)',
            }}
          />
        )}

        {/* Media rendering based on type */}
        {currentItem.type === 'video' ? (
          <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-[14px]">
            <video
              key={currentItem.src}
              src={currentItem.src}
              autoPlay
              loop
              muted
              playsInline
              controls
              className="w-full h-full object-cover"
              style={{ borderRadius: 14 }}
            />
          </div>
        ) : currentItem.type === 'lottie' ? (
          <div
            className="relative w-full h-full bg-zinc-950 flex items-center justify-center p-3 overflow-hidden rounded-[14px] cursor-zoom-in"
            onClick={() => setIsLightboxOpen(true)}
          >
            <DotLottieReact
              key={currentItem.src}
              src={currentItem.src}
              loop
              autoplay
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <img
            key={currentItem.src}
            src={currentItem.src}
            alt={`${project.label} visual preview`}
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onClick={() => setIsLightboxOpen(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: project.imageLayout === 'portrait' ? 'contain' : 'cover',
              display: 'block',
              cursor: 'zoom-in',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease, transform 0.4s ease',
            }}
            className="group-hover:scale-[1.02]"
          />
        )}

        {/* Expand / Lightbox Zoom Button */}
        {currentItem.type !== 'video' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white/90 bg-black/55 hover:bg-black/80 backdrop-blur-md transition-all opacity-85 hover:opacity-100 hover:scale-105 shadow-md"
            title="Click to expand (Lightbox)"
            aria-label="Expand image"
          >
            <TbMaximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        {/* Multi-media carousel controls */}
        {n > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLoaded(false);
                setIdx((i) => (i - 1 + n) % n);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-zinc-900 bg-white/90 hover:bg-white backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Previous media"
            >
              <TbChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLoaded(false);
                setIdx((i) => (i + 1) % n);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-zinc-900 bg-white/90 hover:bg-white backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Next media"
            >
              <TbChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Slide Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md shadow-md">
              {mediaItems.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (dotIdx !== idx) {
                      setIsLoaded(false);
                      setIdx(dotIdx);
                    }
                  }}
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all"
                  style={{
                    background: dotIdx === idx ? accent : 'rgba(255,255,255,0.4)',
                    boxShadow: dotIdx === idx ? `0 0 6px ${accent}` : 'none',
                    transform: dotIdx === idx ? 'scale(1.25)' : 'scale(1)',
                  }}
                  aria-label={`Jump to media ${dotIdx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 sm:p-8"
          style={{
            background: 'rgba(10, 9, 18, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            animation: 'fade-in 0.22s ease forwards',
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between mb-3 text-white z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-base sm:text-lg" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
                {project.label}
              </span>
              {n > 1 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/15 text-zinc-200 font-mono shadow-sm">
                  {idx + 1} of {n}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shadow-md"
              aria-label="Close image preview"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>

          {/* Centered Media with smooth scale */}
          <div
            className="relative max-w-5xl max-h-[82vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === 'video' ? (
              <video
                src={currentItem.src}
                controls
                autoPlay
                loop
                playsInline
                className="max-w-full max-h-[82vh] rounded-xl object-contain shadow-2xl"
              />
            ) : currentItem.type === 'lottie' ? (
              <div className="w-[85vw] max-w-3xl h-[65vh] flex items-center justify-center bg-zinc-950/80 rounded-2xl p-6">
                <DotLottieReact
                  src={currentItem.src}
                  loop
                  autoplay
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            ) : (
              <img
                src={currentItem.src}
                alt={`${project.label} high resolution preview`}
                className="max-w-full max-h-[82vh] rounded-xl object-contain shadow-2xl"
                decoding="async"
              />
            )}

            {n > 1 && (
              <>
                <button
                  onClick={() => {
                    setIsLoaded(false);
                    setIdx((i) => (i - 1 + n) % n);
                  }}
                  className="absolute left-1 sm:-left-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  aria-label="Previous"
                >
                  <TbChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => {
                    setIsLoaded(false);
                    setIdx((i) => (i + 1) % n);
                  }}
                  className="absolute right-1 sm:-right-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  aria-label="Next"
                >
                  <TbChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

/* ── Rich Card Body Content (Responsive Spacing, Shadows & Highlights) ─ */
const CardBody: React.FC<{ project: Project; accent: string; isMobile: boolean }> = ({
  project,
  accent,
  isMobile,
}) => (
  <div className="flex flex-col h-full">
    {/* Title & Glowing Status Header */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 8 : 12,
        marginBottom: isMobile ? 12 : 16,
        flexWrap: 'wrap',
      }}
    >
      <h3
        style={{
          margin: 0,
          color: '#1c1b20',
          fontSize: 'clamp(1.15rem, 4vw, 1.65rem)',
          lineHeight: 1.15,
        }}
      >
        {project.label}
      </h3>

      {/* Glowing Status Dot & Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: project.statusColor,
            boxShadow: `0 0 10px ${project.statusColor}ee, 0 0 4px ${project.statusColor}`,
          }}
        />
        <span
          style={{
            fontSize: '0.68rem',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: project.statusColor,
            fontFamily: 'Archivo Black, sans-serif',
          }}
        >
          {project.status}
        </span>
      </div>

      {/* Category Text Separator */}
      {project.category && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>·</span>
          <span
            style={{
              fontSize: '0.72rem',
              color: '#64748b',
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            {project.category}
          </span>
        </div>
      )}
    </div>

    {/* Project Metadata row (Creation Period, Team Size/Solo, Year) */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? 10 : 16,
        marginBottom: isMobile ? 20 : 32,
        flexWrap: 'wrap',
        color: '#475569',
        fontSize: isMobile ? '0.74rem' : '0.78rem',
      }}
    >
      {project.period && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <TbClock className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: accent }} />
          <span style={{ fontWeight: 600, color: '#334155' }}>{project.period}</span>
        </div>
      )}

      {project.teamRole && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {project.teamRole.toLowerCase().includes('solo') ? (
            <TbUser className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: accent }} />
          ) : (
            <TbUsers className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: accent }} />
          )}
          <span style={{ fontWeight: 600, color: '#334155' }}>{project.teamRole}</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#94a3b8' }}>
        <TbCalendar className="w-3.5 h-3.5" />
        <span>{project.year}</span>
      </div>
    </div>

    {/* Description */}
    <p
      style={{
        color: '#525066',
        fontSize: isMobile ? '0.84rem' : '0.92rem',
        lineHeight: isMobile ? 1.6 : 1.75,
        marginBottom: isMobile ? 22 : 36,
        marginTop: 0,
      }}
    >
      {project.description}
    </p>

    {/* Technical Highlights */}
    {project.highlights && project.highlights.length > 0 && (
      <div style={{ marginBottom: isMobile ? 22 : 36 }}>
        <div
          style={{
            fontSize: '0.66rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#94a3b8',
            marginBottom: isMobile ? 8 : 12,
            fontFamily: 'Archivo Black, sans-serif',
          }}
        >
          Technical Highlights
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: isMobile ? 8 : 12,
          }}
        >
          {project.highlights.map((h, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: isMobile ? '0.74rem' : '0.78rem',
                color: '#334155',
                padding: '1px 0',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: accent,
                  boxShadow: `0 0 6px ${accent}aa`,
                  flexShrink: 0,
                }}
              />
              <span style={{ lineHeight: 1.45 }}>{h}</span>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* Technologies Badges */}
    <div style={{ display: 'flex', gap: isMobile ? 6 : 8, flexWrap: 'wrap', marginBottom: isMobile ? 22 : 32 }}>
      {project.technologies.map((t) => (
        <span
          key={t}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: isMobile ? '5px 10px' : '6px 13px',
            borderRadius: 8,
            background: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
            color: '#1e293b',
            fontSize: isMobile ? '0.68rem' : '0.72rem',
            letterSpacing: '0.02em',
            fontFamily: 'Archivo Black, sans-serif',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          className="hover:-translate-y-0.5 hover:shadow-md"
        >
          <TechIcon name={t} className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
          <span>{t}</span>
        </span>
      ))}
    </div>

    {/* Action CTA Links */}
    {(project.demoUrl || project.githubUrl) && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 'auto',
          paddingTop: isMobile ? 16 : 24,
          flexWrap: 'wrap',
        }}
      >
        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: isMobile ? '7px 14px' : '9px 18px',
              borderRadius: 10,
              background: accent,
              color: '#ffffff',
              fontSize: isMobile ? '0.70rem' : '0.74rem',
              fontFamily: 'Archivo Black, sans-serif',
              textDecoration: 'none',
              boxShadow: `0 4px 18px ${accent}45`,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            className="hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
          >
            <span>Live Demo / Play</span>
            <TbExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: isMobile ? '7px 13px' : '9px 17px',
              borderRadius: 10,
              background: '#ffffff',
              color: '#1e293b',
              boxShadow: '0 2px 10px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.03)',
              fontSize: isMobile ? '0.70rem' : '0.74rem',
              fontFamily: 'Archivo Black, sans-serif',
              textDecoration: 'none',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            className="hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            <TbBrandGithub className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </a>
        )}
      </div>
    )}
  </div>
);

/* ── Active Foreground Card ─────────────────────────────────────────── */
const ProjectCard: React.FC<{ project: Project; accent: string; isMobile: boolean }> = ({
  project,
  accent,
  isMobile,
}) => {
  const isPortrait = project.imageLayout === 'portrait';
  const isMedia = (url?: string) => Boolean(url && url.trim().length > 0);
  const hasMedia = Boolean(
    (project.images && project.images.length > 0) || isMedia(project.video) || isMedia(project.lottie)
  );
  // On mobile screens, always use vertical column to prevent squishing the layout
  const useRowLayout = isPortrait && !isMobile && hasMedia;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#ffffff',
        borderRadius: isMobile ? 18 : 22,
        boxShadow: `0 16px 48px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04), 0 0 1px ${accent}33`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: useRowLayout ? 'row' : 'column',
      }}
    >
      {!hasMedia ? (
        <div
          style={{
            flex: 1,
            minHeight: 0,
            padding: isMobile ? '20px 20px' : '32px 42px',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          <CardBody project={project} accent={accent} isMobile={isMobile} />
        </div>
      ) : useRowLayout ? (
        <>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              padding: '28px 34px',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <CardBody project={project} accent={accent} isMobile={isMobile} />
          </div>
          <div
            style={{
              width: 'clamp(260px, 25vw, 340px)',
              flexShrink: 0,
              padding: '16px 16px 16px 0',
              background: '#f8f7fc',
            }}
          >
            <ImageShowcase key={project.id} project={project} accent={accent} />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              height: isMobile ? 'clamp(140px, 22vh, 185px)' : 'clamp(185px, 25vh, 250px)',
              flexShrink: 0,
              padding: isMobile ? 8 : 12,
              background: '#f8f7fc',
            }}
          >
            <ImageShowcase key={project.id} project={project} accent={accent} />
          </div>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              padding: isMobile ? '16px 18px' : '24px 34px',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <CardBody project={project} accent={accent} isMobile={isMobile} />
          </div>
        </>
      )}
    </div>
  );
};

/* ── Background Card Shell (Pure Card Silhouette, No Content/Icons) ── */
/* ── Background Card Shell (Distinct Silhouette with Peeking Spine & Icon) ── */
const BackgroundCard: React.FC<{
  project: Project;
  accent: string;
  isHovered: boolean;
  isMobile: boolean;
}> = ({ project, accent, isHovered, isMobile }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#ffffff',
        borderRadius: isMobile ? 18 : 22,
        border: `2px solid ${accent}${isHovered ? '99' : '60'}`,
        boxShadow: isHovered
          ? `0 20px 48px rgba(0,0,0,0.18), 0 0 32px ${accent}45`
          : `0 12px 34px rgba(0,0,0,0.11), ${isMobile ? '0 8px 20px' : '4px 0 16px'} rgba(0,0,0,0.06)`,
        overflow: 'hidden',
        position: 'relative',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Subtle card spine tint in peeking area */}
      <div
        style={{
          position: 'absolute',
          ...(isMobile
            ? {
                left: 0,
                right: 0,
                bottom: 0,
                height: 42,
                background: `linear-gradient(to top, ${accent}18, transparent)`,
              }
            : {
                right: 0,
                top: 0,
                bottom: 0,
                width: 64,
                background: `linear-gradient(to left, ${accent}18, transparent)`,
              }),
          pointerEvents: 'none',
        }}
      />

      {/* Prominent Accent Spine Bar */}
      <div
        style={{
          position: 'absolute',
          ...(isMobile
            ? {
                left: 0,
                right: 0,
                bottom: 0,
                height: 6,
                background: accent,
                borderRadius: '0 0 18px 18px',
                boxShadow: `0 0 16px ${accent}bb`,
              }
            : {
                right: 0,
                top: 0,
                bottom: 0,
                width: 8,
                background: accent,
                borderRadius: '0 22px 22px 0',
                boxShadow: `0 0 16px ${accent}bb`,
              }),
        }}
      />

      {/* Visible Project Icon Badge in Peeking Margin */}
      <div
        style={{
          position: 'absolute',
          ...(isMobile
            ? {
                bottom: 9,
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }
            : {
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }),
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: isMobile ? 22 : 34,
            height: isMobile ? 22 : 34,
            borderRadius: 999,
            background: '#ffffff',
            boxShadow: `0 2px 10px rgba(0,0,0,0.12), 0 0 8px ${accent}40`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            border: `1.5px solid ${accent}66`,
          }}
        >
          {getProjectIcon(project.icon, isMobile ? 'w-3 h-3' : 'w-4 h-4')}
        </div>
        {isMobile && (
          <span
            style={{
              fontSize: '0.64rem',
              fontFamily: 'Archivo Black, sans-serif',
              color: '#334155',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            {project.label}
          </span>
        )}
      </div>
    </div>
  );
};

/* ── 3D Layered Project Deck (Right on Desktop, Bottom on Mobile) ──── */
interface ProjectDeckProps {
  projects: Project[];
  activeIdx: number;
  accent: string;
  onSelect: (index: number) => void;
  isMobile: boolean;
}

const ProjectDeck: React.FC<ProjectDeckProps> = ({ projects, activeIdx, accent, onSelect, isMobile }) => {
  const n = projects.length;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Touch gesture support
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    touchStartX.current = null;
    touchStartY.current = null;

    if (isMobile) {
      if (Math.abs(diffY) > 30 || Math.abs(diffX) > 30) {
        if (Math.abs(diffY) >= Math.abs(diffX)) {
          if (diffY > 0) {
            onSelect((activeIdx + 1) % n);
          } else {
            onSelect((activeIdx - 1 + n) % n);
          }
        } else {
          if (diffX > 0) {
            onSelect((activeIdx + 1) % n);
          } else {
            onSelect((activeIdx - 1 + n) % n);
          }
        }
      }
    } else {
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
        if (diffX > 0) {
          onSelect((activeIdx + 1) % n);
        } else {
          onSelect((activeIdx - 1 + n) % n);
        }
      }
    }
  };

  // Step spacing:
  // Desktop: peeking to the right
  // Mobile: peeking to the bottom
  const stepX = 54;
  const rightReserve = (n - 1) * stepX + 20;

  const stepY = 24;
  const bottomReserve = (n - 1) * stepY + 12;

  return (
    <div
      className="relative w-full flex-1 min-h-0"
      style={{
        marginTop: isMobile ? 8 : 14,
        perspective: 1200,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {projects.map((p, i) => {
        // Circular depth order: depth 0 is active; depth 1, 2, ... are stacked
        const depth = (i - activeIdx + n) % n;
        const isActive = depth === 0;
        const isHovered = hoveredIdx === i;

        // Positioning:
        // Desktop: horizontally staggered to the right
        // Mobile: vertically staggered to the bottom
        const left = isMobile
          ? 0
          : isActive
            ? 0
            : depth * stepX + (isHovered ? 8 : 0);

        const right = isMobile
          ? 0
          : isActive
            ? rightReserve
            : Math.max(0, rightReserve - depth * stepX - (isHovered ? 8 : 0));

        const top = isMobile
          ? isActive
            ? 0
            : depth * stepY + (isHovered ? 4 : 0)
          : 0;

        const bottom = isMobile
          ? isActive
            ? bottomReserve
            : Math.max(0, bottomReserve - depth * stepY - (isHovered ? 4 : 0))
          : 0;

        // Refined optical depth blur and scale
        const scale = isMobile
          ? (isActive ? 1 : Math.max(0.92, 1 - depth * 0.035))
          : (isActive ? 1 : Math.max(0.89, 1 - depth * 0.045));
        const transformOrigin = isMobile ? 'center bottom' : 'right center';
        const blurPx = isActive ? 0 : isHovered ? 0 : depth === 1 ? 1 : 2.5;
        const zIndex = isActive ? 20 : 20 - depth;

        return (
          <div
            key={p.id}
            onClick={() => {
              if (!isActive) {
                onSelect(i);
              }
            }}
            onMouseEnter={() => !isActive && setHoveredIdx(i)}
            onMouseLeave={() => !isActive && setHoveredIdx(null)}
            style={{
              position: 'absolute',
              left,
              right,
              top,
              bottom,
              zIndex,
              transform: `scale(${scale})`,
              transformOrigin,
              filter: `blur(${blurPx}px)`,
              transition:
                'left 0.42s cubic-bezier(0.25, 1, 0.5, 1), right 0.42s cubic-bezier(0.25, 1, 0.5, 1), top 0.42s cubic-bezier(0.25, 1, 0.5, 1), bottom 0.42s cubic-bezier(0.25, 1, 0.5, 1), transform 0.42s cubic-bezier(0.25, 1, 0.5, 1), filter 0.3s ease',
              cursor: isActive ? 'default' : 'pointer',
              pointerEvents: 'auto',
            }}
            title={!isActive ? `Click to view ${p.label}` : undefined}
          >
            {isActive ? (
              <ProjectCard project={p} accent={accent} isMobile={isMobile} />
            ) : (
              <BackgroundCard project={p} accent={accent} isHovered={isHovered} isMobile={isMobile} />
            )}
          </div>
        );
      })}

      {/* Floating Deck Pagination Controls (Previous / Next & Counter) */}
      {n > 1 && (
        <div
          className={`absolute ${
            isMobile ? 'right-2 top-2' : 'right-4 bottom-3'
          } z-30 flex items-center gap-2 pointer-events-auto`}
          style={{
            background: '#ffffff',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            borderRadius: 999,
            padding: isMobile ? '3px 8px' : '4px 10px',
          }}
        >
          <button
            onClick={() => onSelect((activeIdx - 1 + n) % n)}
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full hover:bg-black/5 text-zinc-700 transition-colors cursor-pointer"
            title="Previous project (Arrow Left)"
            aria-label="Previous project"
          >
            <TbChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <span
            style={{
              fontSize: isMobile ? '0.68rem' : '0.72rem',
              fontFamily: 'Archivo Black, sans-serif',
              color: '#343147',
              letterSpacing: '0.04em',
            }}
          >
            {activeIdx + 1} / {n}
          </span>
          <button
            onClick={() => onSelect((activeIdx + 1) % n)}
            className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full hover:bg-black/5 text-zinc-700 transition-colors cursor-pointer"
            title="Next project (Arrow Right)"
            aria-label="Next project"
          >
            <TbChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Section Component ──────────────────────────────────────────────── */
interface ProjectSectionProps {
  section: IProjectSection;
  isSectionActive?: boolean;
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({ section, isSectionActive = false }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const isMobile = useIsMobile();

  // Keyboard navigation for switching projects horizontally when this section is active
  useEffect(() => {
    if (!isSectionActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const n = section.projects.length;
      if (e.key === 'ArrowRight') {
        setActiveIdx((i) => (i + 1) % n);
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((i) => (i - 1 + n) % n);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSectionActive, section.projects.length]);

  const handleSelect = useCallback(
    (index: number) => {
      setActiveIdx(index);
    },
    []
  );

  return (
    <div
      className="w-full h-full relative flex flex-col justify-center"
      style={{
        padding: isMobile ? '18px 14px 62px' : '40px 8vw 28px',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      {/* Decorative ambient background blob */}
      <div
        style={{
          position: 'absolute',
          width: isMobile ? 320 : 550,
          height: isMobile ? 320 : 550,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${section.accent} 0%, transparent 68%)`,
          top: -150,
          right: -100,
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
        }}
      >
        <h2
          style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.8rem)',
            color: '#1c1b20',
            margin: isMobile ? '0 0 10px' : '0 0 16px',
            lineHeight: 1.1,
          }}
        >
          {section.label}
        </h2>

        {/* Project Selector Row */}
        <div
          style={{
            display: 'flex',
            gap: isMobile ? 8 : 10,
            marginBottom: isMobile ? 4 : 6,
            flexWrap: isMobile ? 'nowrap' : 'wrap',
            overflowX: isMobile ? 'auto' : 'visible',
            paddingBottom: isMobile ? 4 : 0,
            zIndex: 25,
            position: 'relative',
          }}
          className="no-scrollbar"
        >
          {section.projects.map((p, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={p.id}
                onClick={() => handleSelect(i)}
                title={p.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isActive ? (isMobile ? 6 : 8) : 0,
                  height: isMobile ? 38 : 44,
                  width: isActive ? 'auto' : isMobile ? 38 : 44,
                  maxWidth: isActive ? 240 : isMobile ? 38 : 44,
                  overflow: 'hidden',
                  padding: isActive ? (isMobile ? '0 14px 0 10px' : '0 18px 0 12px') : '0',
                  justifyContent: 'center',
                  borderRadius: 999,
                  border: 'none',
                  background: '#ffffff',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: isActive
                    ? `0 4px 18px ${section.accent}35, 0 1px 3px rgba(0,0,0,0.06)`
                    : '0 2px 8px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: isActive ? section.accent : '#94a3b8',
                    transition: 'color 0.3s ease',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {getProjectIcon(p.icon, isMobile ? 'w-4 h-4 flex-shrink-0' : 'w-5 h-5 flex-shrink-0')}
                </span>
                <span
                  style={{
                    fontSize: isMobile ? '0.72rem' : '0.78rem',
                    fontFamily: 'Archivo Black, sans-serif',
                    color: section.accent,
                    maxWidth: isActive ? 180 : 0,
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'max-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                    letterSpacing: '0.02em',
                  }}
                >
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 3D Layered Card Deck (Stacked to the Right) */}
        <ProjectDeck
          projects={section.projects}
          activeIdx={activeIdx}
          accent={section.accent}
          onSelect={handleSelect}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};
