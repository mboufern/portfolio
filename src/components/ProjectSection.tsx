import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type { Project, ProjectLink, ProjectSection as IProjectSection } from '../data/portfolioData';
import { TechIcon } from './TechIcon';
import { SiItchdotio } from 'react-icons/si';
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
  TbBrandSteam,
  TbBrandGooglePlay,
  TbMaximize,
  TbX,
  TbChevronLeft,
  TbChevronRight,
  TbVolume,
  TbVolumeOff,
  TbPlayerPlay,
  TbPlayerPause,
  TbSparkles,
  TbCode,
  TbCheck,
  TbPhoto,
  TbMovie,
  TbLayersIntersect,
} from 'react-icons/tb';

const useScreenSize = () => {
  const [screen, setScreen] = useState({ isMobile: false, isTablet: false });
  useEffect(() => {
    const check = () => {
      setScreen({
        isMobile: window.innerWidth < 768,
        isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
      });
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return screen;
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
const ProjectVisualFallback: React.FC<{ project: Project; accent: string; isDark: boolean }> = ({ project, accent, isDark }) => {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-between p-4 sm:p-5 select-none"
      style={{
        background: isDark ? 'linear-gradient(145deg, #0b0a12 0%, #12101e 100%)' : 'linear-gradient(145deg, #12111d 0%, #1a1829 100%)',
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
        <span className="truncate">
          Status: <span style={{ color: project.statusColor }}>{project.status}</span>
        </span>
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
  isMobile: boolean;
  isDark: boolean;
}

interface MediaItem {
  type: 'video' | 'lottie' | 'image';
  src: string;
  label: string;
}

const isVideoUrl = (url: string) => /\.(mp4|webm|mov|mkv)(\?.*)?$/i.test(url);
const isLottieUrl = (url: string) => /\.lottie(\?.*)?$/i.test(url);

const ImageShowcase: React.FC<ImageShowcaseProps> = ({ project, accent, isMobile, isDark }) => {
  const mediaItems: MediaItem[] = [];

  if (project.video) {
    mediaItems.push({ type: 'video', src: project.video, label: 'Showcase Reel' });
  }
  if (project.lottie) {
    mediaItems.push({ type: 'lottie', src: project.lottie, label: 'Lottie Animation' });
  }
  if (project.images && project.images.length > 0) {
    project.images.forEach((img, i) => {
      if (isVideoUrl(img)) {
        if (!mediaItems.some((m) => m.src === img)) {
          mediaItems.push({ type: 'video', src: img, label: `Video Clip ${i + 1}` });
        }
      } else if (isLottieUrl(img)) {
        if (!mediaItems.some((m) => m.src === img)) {
          mediaItems.push({ type: 'lottie', src: img, label: `Animation ${i + 1}` });
        }
      } else {
        mediaItems.push({ type: 'image', src: img, label: `Render ${i + 1}` });
      }
    });
  }

  const n = mediaItems.length;
  const [idx, setIdx] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isMaisonBurger = project.id === 'maison-du-burger';

  // Toggle video playback on click
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Toggle video audio
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

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
    return <ProjectVisualFallback project={project} accent={accent} isDark={isDark} />;
  }

  const currentItem = mediaItems[idx];
  const isPortrait = project.imageLayout === 'portrait';

  return (
    <div className="flex flex-col h-full w-full justify-between gap-2.5">
      {/* Main Active Viewport Box */}
      <div
        className="relative overflow-hidden w-full flex-1 min-h-0 select-none group rounded-xl sm:rounded-2xl flex items-center justify-center"
        style={{
          background: isMaisonBurger
            ? '#ffffff'
            : isDark
              ? 'linear-gradient(160deg, #090812 0%, #121020 100%)'
              : 'linear-gradient(160deg, #0e0d16 0%, #151421 100%)',
          boxShadow: isMaisonBurger
            ? '0 4px 20px rgba(0,0,0,0.06), inset 0 0 1px rgba(0,0,0,0.08)'
            : '0 8px 28px rgba(0,0,0,0.22), inset 0 0 1px rgba(255,255,255,0.1)',
          border: isMaisonBurger ? '1px solid rgba(0, 0, 0, 0.08)' : '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Ambient blurred glow backdrop behind letterboxed media (excluded for white burger) */}
        {!isMaisonBurger && currentItem.type === 'image' && (
          <img
            src={currentItem.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-25 scale-125 pointer-events-none"
          />
        )}

        {/* Shimmer skeleton before image loads */}
        {currentItem.type === 'image' && !isLoaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: isMaisonBurger
                ? 'linear-gradient(90deg, #f1f0f5 0%, #e8e6ee 50%, #f1f0f5 100%)'
                : 'linear-gradient(90deg, #1b1928 0%, #29263c 50%, #1b1928 100%)',
            }}
          />
        )}

        {/* Media rendering based on active item type */}
        {currentItem.type === 'video' ? (
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={() => setIsLightboxOpen(true)}
          >
            <video
              ref={videoRef}
              key={currentItem.src}
              src={currentItem.src}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className={`w-full h-full ${isPortrait ? 'object-contain' : 'object-contain sm:object-cover'} transition-transform duration-500 group-hover:scale-[1.01]`}
            />

            {/* Video center pause indicator if paused */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <TbPlayerPlay className="w-6 h-6 ml-0.5" />
                </div>
              </div>
            )}

            {/* Bottom-left audio mute & play/pause toggles for inline video */}
            <div className="absolute bottom-2.5 left-2.5 z-20 flex items-center gap-1.5">
              <button
                onClick={togglePlay}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white/90 bg-black/60 hover:bg-black/90 backdrop-blur-md transition-all border border-white/10 hover:scale-105 shadow-md cursor-pointer"
                title={isPlaying ? 'Pause Video' : 'Play Video'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <TbPlayerPause className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <TbPlayerPlay className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5" />}
              </button>
              <button
                onClick={toggleMute}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white/90 bg-black/60 hover:bg-black/90 backdrop-blur-md transition-all border border-white/10 hover:scale-105 shadow-md cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <TbVolumeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <TbVolume className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>
            </div>
          </div>
        ) : currentItem.type === 'lottie' ? (
          <div
            className={`relative w-full h-full flex items-center justify-center p-4 overflow-hidden cursor-zoom-in ${
              isMaisonBurger ? 'bg-white' : ''
            }`}
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
            alt={`${project.label} high fidelity showcase`}
            loading={idx === 0 ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onClick={() => setIsLightboxOpen(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: isPortrait ? 'contain' : 'contain',
              display: 'block',
              cursor: 'zoom-in',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease, transform 0.4s ease',
            }}
            className="relative z-10 group-hover:scale-[1.02]"
          />
        )}

        {/* Top-Left Media Type Badge */}
        <div
          className={`absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10.5px] font-mono tracking-wider uppercase border shadow-sm pointer-events-none ${
            isMaisonBurger
              ? 'bg-black/75 text-white backdrop-blur-md border-black/10'
              : 'bg-black/60 backdrop-blur-md text-zinc-300 border-white/10'
          }`}
        >
          {currentItem.type === 'video' ? (
            <>
              <TbMovie className="w-3.5 h-3.5 text-amber-400" />
              <span>Video Reel</span>
            </>
          ) : currentItem.type === 'lottie' ? (
            <>
              <TbSparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Live Vector</span>
            </>
          ) : (
            <>
              <TbPhoto className="w-3.5 h-3.5" style={{ color: accent }} />
              <span>{currentItem.label}</span>
            </>
          )}
        </div>

        {/* Top-Right Lightbox Zoom Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className={`absolute top-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-all opacity-90 hover:opacity-100 hover:scale-105 border shadow-md cursor-pointer ${
            isMaisonBurger
              ? 'text-zinc-800 bg-white/90 hover:bg-white border-zinc-200'
              : 'text-white/90 bg-black/60 hover:bg-black/90 backdrop-blur-md border-white/10'
          }`}
          title="Click to expand (Lightbox)"
          aria-label="Expand media"
        >
          <TbMaximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>

        {/* Multi-media carousel arrow buttons */}
        {n > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLoaded(false);
                setIdx((i) => (i - 1 + n) % n);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center text-white bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
              aria-label="Previous media"
            >
              <TbChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLoaded(false);
                setIdx((i) => (i + 1) % n);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center text-white bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/15 shadow-lg transition-all hover:scale-110 active:scale-95 cursor-pointer opacity-80 group-hover:opacity-100"
              aria-label="Next media"
            >
              <TbChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Multi-Media Gallery Thumbnail Selector Strip */}
      {n > 1 && (
        <div
          className="w-full flex items-center gap-1.5 sm:gap-2 px-1 py-1 overflow-x-auto no-scrollbar flex-shrink-0"
          style={{ maxHeight: 54 }}
        >
          {mediaItems.map((item, mIdx) => {
            const isSelected = mIdx === idx;
            return (
              <button
                key={mIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  if (mIdx !== idx) {
                    setIsLoaded(false);
                    setIdx(mIdx);
                  }
                }}
                className={`relative flex-shrink-0 ${isMobile ? 'h-8 w-12' : 'h-9 sm:h-11 w-14 sm:w-16'} rounded-md overflow-hidden transition-all cursor-pointer border ${
                  isSelected
                    ? 'ring-2 ring-offset-1 ring-offset-zinc-950 scale-105'
                    : 'opacity-65 hover:opacity-100 hover:scale-[1.02] border-white/10'
                }`}
                style={{
                  borderColor: isSelected ? accent : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.12)',
                  ['--tw-ring-color' as any]: accent,
                  background: isMaisonBurger && item.type === 'lottie' ? '#ffffff' : '#151421',
                }}
                title={item.label}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-amber-400">
                    <TbMovie className="w-4 h-4" />
                  </div>
                ) : item.type === 'lottie' ? (
                  <div className={`w-full h-full flex items-center justify-center ${isMaisonBurger ? 'bg-white text-amber-500' : 'bg-zinc-900 text-purple-400'}`}>
                    <TbSparkles className="w-4 h-4" />
                  </div>
                ) : (
                  <img src={item.src} alt="" className="w-full h-full object-cover" />
                )}

                {/* Selected active pip */}
                {isSelected && (
                  <span
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                )}
              </button>
            );
          })}
          <div className="ml-auto text-[10.5px] font-mono text-zinc-400 pl-2 pr-1 flex-shrink-0">
            {idx + 1} / {n}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-4 sm:p-7"
          style={{
            background: 'rgba(8, 7, 14, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            animation: 'fade-in 0.22s ease forwards',
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Header Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white z-10 pb-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-base sm:text-lg tracking-tight" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
                {project.label}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono">
                {idx + 1} of {n}
              </span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shadow-md"
              aria-label="Close image preview"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>

          {/* Centered Media Stage with smooth scale */}
          <div
            className="relative max-w-5xl flex-1 w-full flex items-center justify-center py-3"
            onClick={(e) => e.stopPropagation()}
          >
            {currentItem.type === 'video' ? (
              <video
                src={currentItem.src}
                controls
                autoPlay
                loop
                playsInline
                className="max-w-full max-h-[76vh] rounded-xl object-contain shadow-2xl"
              />
            ) : currentItem.type === 'lottie' ? (
              <div
                className={`w-[85vw] max-w-3xl h-[65vh] flex items-center justify-center rounded-2xl p-6 border ${
                  isMaisonBurger
                    ? 'bg-white border-zinc-200 shadow-2xl'
                    : 'bg-zinc-950/80 border-white/10'
                }`}
              >
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
                className="max-w-full max-h-[76vh] rounded-xl object-contain shadow-2xl"
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

          {/* Lightbox Footer Thumbnail Bar */}
          {n > 1 && (
            <div
              className="flex items-center gap-2 max-w-5xl overflow-x-auto no-scrollbar py-1 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {mediaItems.map((item, mIdx) => (
                <button
                  key={mIdx}
                  onClick={() => {
                    setIsLoaded(false);
                    setIdx(mIdx);
                  }}
                  className={`w-12 h-9 sm:w-14 sm:h-10 rounded-md overflow-hidden border transition-all cursor-pointer ${
                    mIdx === idx ? 'ring-2 ring-white scale-105' : 'opacity-50 hover:opacity-85 border-white/20'
                  }`}
                  style={{
                    ['--tw-ring-color' as any]: accent,
                    borderColor: mIdx === idx ? accent : 'rgba(255,255,255,0.2)',
                    background: isMaisonBurger && item.type === 'lottie' ? '#ffffff' : '#151421',
                  }}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-amber-400">
                      <TbMovie className="w-3.5 h-3.5" />
                    </div>
                  ) : item.type === 'lottie' ? (
                    <div className={`w-full h-full flex items-center justify-center ${isMaisonBurger ? 'bg-white text-amber-500' : 'bg-zinc-900 text-purple-400'}`}>
                      <TbSparkles className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <img src={item.src} alt="" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const getLinkIcon = (icon?: string, className = 'w-3.5 h-3.5 flex-shrink-0') => {
  switch (icon) {
    case 'steam':
      return <TbBrandSteam className={className} />;
    case 'google-play':
      return <TbBrandGooglePlay className={className} />;
    case 'itch':
      return <SiItchdotio className={className} />;
    case 'github':
      return <TbBrandGithub className={className} />;
    case 'web':
      return <TbWorld className={className} />;
    default:
      return <TbExternalLink className={className} />;
  }
};

export const resolveProjectLinks = (project: Project): ProjectLink[] => {
  if (project.links && project.links.length > 0) {
    return project.links;
  }
  const resolved: ProjectLink[] = [];
  if (project.demoUrl) {
    const url = project.demoUrl;
    let label = 'Open Project';
    let icon: ProjectLink['icon'] = 'external';

    if (url.includes('store.steampowered.com')) {
      label = 'Steam Store';
      icon = 'steam';
    } else if (url.includes('play.google.com')) {
      label = 'Google Play';
      icon = 'google-play';
    } else if (url.includes('itch.io')) {
      label = 'Play on Itch.io';
      icon = 'itch';
    } else if (url.includes('moraja3ati.ma')) {
      label = 'Visit Website';
      icon = 'web';
    } else if (url.includes('run.app') || url.includes('github.io')) {
      label = 'Play Online';
      icon = 'web';
    }
    resolved.push({ label, url, icon, primary: true });
  }
  if (project.githubUrl) {
    resolved.push({
      label: 'Source Code',
      url: project.githubUrl,
      icon: 'github',
      primary: resolved.length === 0,
    });
  }
  return resolved;
};

/* ── Rich Card Body Content (Polished Typography, Rhythm & Spacing) ──── */
const CardBody: React.FC<{ project: Project; accent: string; isMobile: boolean; isDark: boolean }> = ({
  project,
  accent,
  isMobile,
  isDark,
}) => {
  const actionLinks = resolveProjectLinks(project);

  return (
  <div className="flex flex-col h-full justify-between">
    <div>
      {/* Title & Glowing Status Header */}
      <div className={`flex items-center ${isMobile ? 'gap-2' : 'gap-2.5 sm:gap-3'} flex-wrap mb-2 sm:mb-2.5`}>
        <h3
          className={`m-0 tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}
          style={{
            fontFamily: 'Archivo Black, sans-serif',
            fontSize: isMobile ? 'clamp(1.1rem, 4vw, 1.35rem)' : 'clamp(1.15rem, 2.5vw, 1.55rem)',
          }}
        >
          {project.label}
        </h3>

        {/* Live Glowing Status Micro-Badge */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border flex-shrink-0"
          style={{
            background: `${project.statusColor}18`,
            borderColor: `${project.statusColor}35`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: project.statusColor,
              boxShadow: `0 0 8px ${project.statusColor}`,
            }}
          />
          <span
            className="text-[10px] font-semibold tracking-wider uppercase font-mono"
            style={{ color: project.statusColor }}
          >
            {project.status}
          </span>
        </div>

        {/* Category Badge */}
        {project.category && (
          <span
            className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 border ${
              isDark
                ? 'bg-white/10 text-zinc-300 border-white/10'
                : 'bg-slate-100/90 text-slate-500 border-slate-200/60'
            }`}
          >
            {project.category}
          </span>
        )}
      </div>

      {/* Project Metadata row (Period, Role, Year) */}
      <div
        className={`flex items-center gap-3 sm:gap-4 flex-wrap text-[11.5px] sm:text-xs mb-3 sm:mb-4 pb-2.5 border-b ${
          isDark ? 'text-zinc-400 border-white/10' : 'text-slate-500 border-slate-100'
        }`}
      >
        {project.period && (
          <div className={`flex items-center gap-1.5 font-medium ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
            <TbClock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
            <span>{project.period}</span>
          </div>
        )}

        {project.teamRole && (
          <div className={`flex items-center gap-1.5 font-medium ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
            {project.teamRole.toLowerCase().includes('solo') ? (
              <TbUser className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
            ) : (
              <TbUsers className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
            )}
            <span>{project.teamRole}</span>
          </div>
        )}

        <div className={`flex items-center gap-1 font-mono text-[11px] ml-auto ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
          <TbCalendar className="w-3 h-3" />
          <span>{project.year}</span>
        </div>
      </div>

      {/* Narrative Description */}
      <p
        className={`text-[13px] sm:text-[13.5px] leading-relaxed mb-3.5 sm:mb-4.5 m-0 ${
          isDark ? 'text-zinc-300' : 'text-slate-600'
        }`}
        style={{ maxWidth: '65ch' }}
      >
        {project.description}
      </p>

      {/* Technical Highlights with Card Rhythm */}
      {project.highlights && project.highlights.length > 0 && (
        <div className="mb-3.5 sm:mb-4">
          <div className={`text-[10.5px] font-bold tracking-wider uppercase flex items-center gap-1.5 mb-2 ${
            isDark ? 'text-zinc-400' : 'text-slate-400'
          }`}>
            <TbCheck className="w-3.5 h-3.5" style={{ color: accent }} />
            <span>Key Engineering Highlights</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {project.highlights.map((h, i) => (
              <div
                key={i}
                className={`flex items-start gap-2.5 text-[12px] sm:text-[12.5px] rounded-lg px-2.5 py-1.5 transition-colors border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10 hover:border-white/15'
                    : 'bg-slate-50/70 border-slate-100 text-slate-700 hover:bg-white hover:border-slate-200'
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{
                    backgroundColor: accent,
                    boxShadow: `0 0 6px ${accent}88`,
                  }}
                />
                <span className="leading-snug">{h}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technologies Badges */}
      <div className="flex gap-1.5 sm:gap-2 flex-wrap mb-4">
        {project.technologies.map((t) => (
          <span
            key={t}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11.5px] font-medium shadow-sm transition-all border ${
              isDark
                ? 'bg-white/5 border-white/10 text-zinc-200 hover:border-white/20 hover:bg-white/10 hover:-translate-y-0.5'
                : 'bg-white border-slate-200/80 text-slate-800 hover:border-slate-300 hover:shadow hover:-translate-y-0.5'
            }`}
          >
            <TechIcon name={t} className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
            <span>{t}</span>
          </span>
        ))}
      </div>
    </div>

    {/* Action CTA Links */}
    {actionLinks.length > 0 && (
      <div
        className={`flex items-center gap-2 sm:gap-2.5 pt-2.5 border-t flex-wrap mt-auto ${
          isDark ? 'border-white/10' : 'border-slate-100'
        }`}
      >
        {actionLinks.map((link, lIdx) => {
          const isPrimary = link.primary ?? lIdx === 0;
          return (
            <a
              key={link.url + lIdx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={
                isPrimary
                  ? {
                      backgroundColor: accent,
                      boxShadow: `0 4px 14px ${accent}40`,
                    }
                  : undefined
              }
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-[12.5px] font-semibold no-underline transition-all cursor-pointer ${
                isPrimary
                  ? 'text-white hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0'
                  : isDark
                    ? 'bg-white/10 text-white border border-white/15 hover:bg-white/15 hover:border-white/25 hover:-translate-y-0.5'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 hover:shadow'
              }`}
            >
              {getLinkIcon(link.icon)}
              <span>{link.label}</span>
            </a>
          );
        })}
      </div>
    )}
  </div>
  );
};

/* ── Rich Architecture Blueprint (For projects without media) ────────── */
const ArchitectureBlueprint: React.FC<{ project: Project; accent: string; isMobile: boolean; isDark: boolean }> = ({
  project,
  accent,
  isMobile,
  isDark,
}) => {
  return (
    <div className={`w-full h-full flex ${isMobile ? 'flex-col gap-4' : 'flex-row gap-8'} p-5 sm:p-8`}>
      {/* Left Column: Narrative Details & CTAs */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto pr-1">
        <CardBody project={project} accent={accent} isMobile={isMobile} isDark={isDark} />
      </div>

      {/* Right Column: Architectural Schematic Card */}
      <div
        className={`${isMobile ? 'w-full' : 'w-[42%] max-w-[420px]'} flex-shrink-0 flex flex-col justify-between p-5 rounded-2xl border text-zinc-300 select-none shadow-xl`}
        style={{
          background: isDark ? 'linear-gradient(150deg, #090812 0%, #121020 100%)' : 'linear-gradient(150deg, #100f1c 0%, #171526 100%)',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.08)',
        }}
      >
        <div>
          {/* Blueprint Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
            <span className="flex items-center gap-2 font-bold tracking-wider uppercase text-zinc-200">
              <TbCode className="w-4 h-4" style={{ color: accent }} />
              System Anatomy
            </span>
            <span className="text-[11px] text-zinc-500">{project.year}</span>
          </div>

          {/* Module Stack Breakdown */}
          <div className="mt-4 space-y-2.5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Core Architecture</div>
            <div className="grid grid-cols-1 gap-2">
              {project.technologies.map((tech, i) => (
                <div
                  key={tech}
                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono"
                >
                  <span className="flex items-center gap-2 text-zinc-200">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                    {tech}
                  </span>
                  <span className="text-[10px] text-zinc-400">Module {i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Blueprint Footer Specs */}
        <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <TbLayersIntersect className="w-3.5 h-3.5" style={{ color: accent }} />
            <span>Target: Web / Cloud</span>
          </span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Verified
          </span>
        </div>
      </div>
    </div>
  );
};

/* ── Fullscreen Video Project Showcase (Special Exception for 3D Reel) ─ */
const FullVideoProjectCard: React.FC<{
  project: Project;
  accent: string;
  isMobile: boolean;
  isDark: boolean;
}> = ({ project, accent, isMobile, isDark }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const videoSrc = project.video || (project.images && project.images[0]) || '';

  return (
    <>
      <div
        className="relative w-full h-full overflow-hidden select-none group flex items-center justify-center cursor-pointer"
        style={{
          background: '#08070e',
          borderRadius: isMobile ? 18 : 22,
          border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.04)',
          boxShadow: isDark
            ? `0 24px 60px rgba(0,0,0,0.7), 0 0 1px ${accent}40`
            : `0 16px 48px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04), 0 0 1px ${accent}33`,
        }}
        onClick={() => setIsLightboxOpen(true)}
      >
        {/* Ambient blurred glow from the video */}
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none"
        />

        {/* Main Full-Size Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="relative z-10 w-full h-full object-contain"
        />

        {/* Center Pause Indicator if paused */}
        {!isPlaying && (
          <div className="absolute inset-0 z-20 bg-black/40 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <TbPlayerPlay className="w-7 h-7 ml-0.5" />
            </div>
          </div>
        )}

        {/* Bottom-left micro controls: Play/Pause & Mute/Unmute */}
        <div className="absolute bottom-3 left-3 z-30 flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white/90 bg-black/65 hover:bg-black/90 backdrop-blur-md transition-all border border-white/10 hover:scale-105 shadow-md cursor-pointer"
            title={isPlaying ? 'Pause Video' : 'Play Video'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <TbPlayerPause className="w-4 h-4" /> : <TbPlayerPlay className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={toggleMute}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white/90 bg-black/65 hover:bg-black/90 backdrop-blur-md transition-all border border-white/10 hover:scale-105 shadow-md cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <TbVolumeOff className="w-4 h-4" /> : <TbVolume className="w-4 h-4" />}
          </button>
        </div>

        {/* Top-Right Expand Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className="absolute top-3 right-3 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-white/90 bg-black/65 hover:bg-black/90 backdrop-blur-md transition-all opacity-85 hover:opacity-100 hover:scale-105 border border-white/10 shadow-md cursor-pointer"
          title="Fullscreen Expand (Lightbox)"
          aria-label="Expand video"
        >
          <TbMaximize className="w-4 h-4" />
        </button>
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between p-4 sm:p-7"
          style={{
            background: 'rgba(8, 7, 14, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            animation: 'fade-in 0.22s ease forwards',
          }}
          onClick={() => setIsLightboxOpen(false)}
        >
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white z-10 pb-3 border-b border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="font-bold text-base sm:text-lg tracking-tight" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
              {project.label}
            </span>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer shadow-md"
              aria-label="Close video preview"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>

          <div
            className="relative max-w-5xl flex-1 w-full flex items-center justify-center py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={videoSrc}
              controls
              autoPlay
              loop
              playsInline
              className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

/* ── Active Foreground Project Card (Polished 2-Column Desktop Grid) ─── */
const ProjectCard: React.FC<{ project: Project; accent: string; isMobile: boolean; isDark: boolean }> = ({
  project,
  accent,
  isMobile,
  isDark,
}) => {
  // Special exception: 3D Mechanical Animation Reel displays full-sized video container only
  if (project.id === '3d-animations-reel') {
    return <FullVideoProjectCard project={project} accent={accent} isMobile={isMobile} isDark={isDark} />;
  }

  const isMedia = (url?: string) => Boolean(url && url.trim().length > 0);
  const hasMedia = Boolean(
    (project.images && project.images.length > 0) || isMedia(project.video) || isMedia(project.lottie)
  );

  return (
    <div
      className="w-full h-full overflow-hidden flex"
      style={{
        background: isDark ? '#0d0c15' : '#ffffff',
        borderRadius: isMobile ? 18 : 22,
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.04)',
        boxShadow: isDark
          ? `0 24px 60px rgba(0,0,0,0.7), 0 0 1px ${accent}40`
          : `0 16px 48px rgba(0,0,0,0.07), 0 2px 8px rgba(0,0,0,0.04), 0 0 1px ${accent}33`,
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      {!hasMedia ? (
        <ArchitectureBlueprint project={project} accent={accent} isMobile={isMobile} isDark={isDark} />
      ) : isMobile ? (
        /* Mobile Vertical Layout: Media on top, content below */
        <>
          <div className={`h-[190px] flex-shrink-0 p-2.5 ${isDark ? 'bg-[#090812]' : 'bg-[#12111d]'}`}>
            <ImageShowcase key={project.id} project={project} accent={accent} isMobile={isMobile} isDark={isDark} />
          </div>
          <div className="flex-1 min-h-0 p-4 sm:p-5 overflow-y-auto">
            <CardBody project={project} accent={accent} isMobile={isMobile} isDark={isDark} />
          </div>
        </>
      ) : (
        /* Desktop Two-Column Split Layout */
        <>
          {/* Left Column: Narrative Content & Technical Highlights */}
          <div
            className="flex-1 min-w-0 p-7 sm:p-8 flex flex-col justify-between overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: isDark ? '#334155 transparent' : '#cbd5e1 transparent',
            }}
          >
            <CardBody project={project} accent={accent} isMobile={isMobile} isDark={isDark} />
          </div>

          {/* Right Column: Visual Media Showcase with Gallery Strip */}
          <div
            className={`w-[45%] max-w-[490px] min-w-[340px] flex-shrink-0 p-4 sm:p-5 flex flex-col justify-between border-l ${
              isDark ? 'border-white/10' : 'border-slate-100'
            }`}
            style={{
              background: isDark
                ? 'linear-gradient(175deg, #090812 0%, #110f1e 100%)'
                : 'linear-gradient(175deg, #fbfaff 0%, #f3f1fb 100%)',
            }}
          >
            <ImageShowcase key={project.id} project={project} accent={accent} isMobile={isMobile} isDark={isDark} />
          </div>
        </>
      )}
    </div>
  );
};

/* ── Background Card Shell (Distinct Silhouette with Peeking Spine & Icon) ── */
const BackgroundCard: React.FC<{
  project: Project;
  accent: string;
  isHovered: boolean;
  isMobile: boolean;
  isDark: boolean;
}> = ({ project, accent, isHovered, isMobile, isDark }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: isDark ? '#0d0c15' : '#ffffff',
        borderRadius: isMobile ? 18 : 22,
        border: `2px solid ${accent}${isHovered ? '99' : isDark ? '40' : '60'}`,
        boxShadow: isHovered
          ? `0 20px 48px rgba(0,0,0,${isDark ? '0.7' : '0.18'}), 0 0 32px ${accent}45`
          : `0 12px 34px rgba(0,0,0,${isDark ? '0.5' : '0.11'}), ${isMobile ? '0 8px 20px' : '4px 0 16px'} rgba(0,0,0,${isDark ? '0.3' : '0.06'})`,
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
                background: `linear-gradient(to top, ${accent}22, transparent)`,
              }
            : {
                right: 0,
                top: 0,
                bottom: 0,
                width: 64,
                background: `linear-gradient(to left, ${accent}22, transparent)`,
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
                right: 14,
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
            width: isMobile ? 22 : 32,
            height: isMobile ? 22 : 32,
            borderRadius: 999,
            background: isDark ? '#151424' : '#ffffff',
            boxShadow: `0 2px 10px rgba(0,0,0,${isDark ? '0.5' : '0.12'}), 0 0 8px ${accent}40`,
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
              color: isDark ? '#cbd5e1' : '#334155',
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
  isDark: boolean;
}

const ProjectDeck: React.FC<ProjectDeckProps> = ({ projects, activeIdx, accent, onSelect, isMobile, isDark }) => {
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

  // Only show up to the upcoming 3 cards; cap the space so the active card has maximum width
  const MAX_PEEK = isMobile ? 2 : 3;
  const visiblePeekCount = Math.min(n - 1, MAX_PEEK);

  const stepX = isMobile ? 0 : 28;
  const maxRightReserve = 96;
  const rightReserve = isMobile ? 0 : Math.min(visiblePeekCount * stepX + 12, maxRightReserve);

  const stepY = 14;
  const bottomReserve = isMobile ? visiblePeekCount * stepY + 6 : 0;

  return (
    <div
      className="relative w-full flex-1 min-h-0"
      style={{
        marginTop: isMobile ? 8 : 12,
        perspective: 1200,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {projects.map((p, i) => {
        // Circular depth order: depth 0 is active; depth 1, 2, ... are stacked
        const depth = (i - activeIdx + n) % n;
        const isActive = depth === 0;
        const isVisiblePeek = depth <= MAX_PEEK;
        const isHovered = hoveredIdx === i;

        // If card is beyond MAX_PEEK, it takes 0 width, doesn't show up, and cannot be clicked
        if (!isActive && !isVisiblePeek) {
          return (
            <div
              key={p.id}
              style={{
                display: 'none',
                pointerEvents: 'none',
              }}
              aria-hidden="true"
            />
          );
        }

        // Positioning:
        // Desktop: horizontally staggered to the right within the capped rightReserve
        // Mobile: vertically staggered to the bottom
        const left = isMobile
          ? 0
          : isActive
            ? 0
            : depth * stepX + (isHovered ? 4 : 0);

        const right = isMobile
          ? 0
          : isActive
            ? rightReserve
            : Math.max(0, rightReserve - depth * stepX - (isHovered ? 4 : 0));

        const top = isMobile
          ? isActive
            ? 0
            : depth * stepY + (isHovered ? 3 : 0)
          : 0;

        const bottom = isMobile
          ? isActive
            ? bottomReserve
            : Math.max(0, bottomReserve - depth * stepY - (isHovered ? 3 : 0))
          : 0;

        // Optical depth blur and scale
        const scale = isMobile
          ? (isActive ? 1 : Math.max(0.93, 1 - depth * 0.035))
          : (isActive ? 1 : Math.max(0.91, 1 - depth * 0.03));
        const transformOrigin = isMobile ? 'center bottom' : 'right center';
        const blurPx = isActive ? 0 : isHovered ? 0 : depth === 1 ? 0.6 : depth === 2 ? 1.6 : 3;
        const zIndex = isActive ? 20 : 20 - depth;
        const opacity = isActive ? 1 : Math.max(0.65, 1 - depth * 0.12);

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
              opacity,
              transform: `scale(${scale})`,
              transformOrigin,
              filter: `blur(${blurPx}px)`,
              transition:
                'left 0.38s cubic-bezier(0.25, 1, 0.5, 1), right 0.38s cubic-bezier(0.25, 1, 0.5, 1), top 0.38s cubic-bezier(0.25, 1, 0.5, 1), bottom 0.38s cubic-bezier(0.25, 1, 0.5, 1), transform 0.38s cubic-bezier(0.25, 1, 0.5, 1), filter 0.3s ease, opacity 0.3s ease',
              cursor: isActive ? 'default' : 'pointer',
              pointerEvents: 'auto',
            }}
            title={!isActive ? `Click to view ${p.label}` : undefined}
          >
            {isActive ? (
              <ProjectCard project={p} accent={accent} isMobile={isMobile} isDark={isDark} />
            ) : (
              <BackgroundCard project={p} accent={accent} isHovered={isHovered} isMobile={isMobile} isDark={isDark} />
            )}
          </div>
        );
      })}

      {/* Floating Deck Pagination Controls (Previous / Next & Counter) */}
      {n > 1 && (
        <div
          className={`absolute ${
            isMobile ? 'right-2 top-2' : 'right-3 bottom-3'
          } z-30 flex items-center gap-2 pointer-events-auto border`}
          style={{
            background: isDark ? '#141322' : '#ffffff',
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
            boxShadow: isDark
              ? '0 4px 20px rgba(0, 0, 0, 0.5)'
              : '0 4px 18px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
            borderRadius: 999,
            padding: isMobile ? '3px 8px' : '4px 10px',
          }}
        >
          <button
            onClick={() => onSelect((activeIdx - 1 + n) % n)}
            className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
              isDark ? 'text-zinc-300 hover:bg-white/10' : 'text-zinc-700 hover:bg-black/5'
            }`}
            title="Previous project (Arrow Left)"
            aria-label="Previous project"
          >
            <TbChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <span
            style={{
              fontSize: isMobile ? '0.68rem' : '0.72rem',
              fontFamily: 'Archivo Black, sans-serif',
              color: isDark ? '#e2e8f0' : '#343147',
              letterSpacing: '0.04em',
            }}
          >
            {activeIdx + 1} / {n}
          </span>
          <button
            onClick={() => onSelect((activeIdx + 1) % n)}
            className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors cursor-pointer ${
              isDark ? 'text-zinc-300 hover:bg-white/10' : 'text-zinc-700 hover:bg-black/5'
            }`}
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
  const { isMobile } = useScreenSize();
  const isDark = section.key === '3d';

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
        padding: isMobile ? '16px 14px 60px' : '36px 6vw 24px',
        maxWidth: 1480,
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
          opacity: isDark ? 0.14 : 0.08,
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
            fontSize: 'clamp(1.5rem, 4.5vw, 2.6rem)',
            color: isDark ? '#f8fafc' : '#1c1b20',
            margin: isMobile ? '0 0 10px' : '0 0 14px',
            lineHeight: 1.1,
          }}
        >
          {section.label}
        </h2>

        {/* Project Selector Row */}
        <div
          style={{
            display: 'flex',
            gap: isMobile ? 7 : 9,
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
                  height: isMobile ? 36 : 42,
                  width: isActive ? 'auto' : isMobile ? 36 : 42,
                  maxWidth: isActive ? 240 : isMobile ? 36 : 42,
                  overflow: 'hidden',
                  padding: isActive ? (isMobile ? '0 14px 0 10px' : '0 18px 0 12px') : '0',
                  justifyContent: 'center',
                  borderRadius: 999,
                  border: isDark
                    ? isActive
                      ? `1px solid ${section.accent}`
                      : '1px solid rgba(255, 255, 255, 0.08)'
                    : 'none',
                  background: isDark
                    ? isActive
                      ? '#1c1930'
                      : '#13121f'
                    : '#ffffff',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: isActive
                    ? `0 4px 18px ${section.accent}35, 0 1px 3px rgba(0,0,0,0.06)`
                    : isDark
                      ? '0 2px 8px rgba(0,0,0,0.4)'
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
                  {getProjectIcon(p.icon, isMobile ? 'w-4 h-4 flex-shrink-0' : 'w-4.5 h-4.5 flex-shrink-0')}
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
          isDark={isDark}
        />
      </div>
    </div>
  );
};
