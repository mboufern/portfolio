import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import type {
  Project,
  ProjectLink,
  ProjectSection as IProjectSection,
} from '../data/portfolioData';
import { TechIcon } from './TechIcon';
import { SiItchdotio } from 'react-icons/si';
import {
  TbWorld,
  TbSchool,
  TbChartBar,
  TbChess,
  TbPalette,
  TbBuildingCastle,
  TbRocket,
  TbRadar,
  TbFlame,
  TbAccessible,
  TbPingPong,
  TbCrosshair,
  TbCompass,
  TbRobot,
  TbUfo,
  TbDeviceGamepad2,
  TbShield,
  TbBurger,
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
  TbMovie,
  TbLayersIntersect,
} from 'react-icons/tb';

const getProjectIcon = (iconName: string, className = 'w-5 h-5 flex-shrink-0') => {
  switch (iconName) {
    case 'school':
      return <TbSchool className={className} />;
    case 'analytics':
      return <TbChartBar className={className} />;
    case 'strategy':
      return <TbChess className={className} />;
    case 'palette':
      return <TbPalette className={className} />;
    case 'castle':
      return <TbBuildingCastle className={className} />;
    case 'rocket':
      return <TbRocket className={className} />;
    case 'radar':
      return <TbRadar className={className} />;
    case 'flame':
      return <TbFlame className={className} />;
    case 'phys_body':
      return <TbAccessible className={className} />;
    case 'pong':
      return <TbPingPong className={className} />;
    case 'film':
      return <TbMovie className={className} />;
    case 'crosshair':
      return <TbCrosshair className={className} />;
    case 'compass':
      return <TbCompass className={className} />;
    case 'robot':
      return <TbRobot className={className} />;
    case 'spaceship':
      return <TbUfo className={className} />;
    case 'gamepad':
    case 'sports_esports':
      return <TbDeviceGamepad2 className={className} />;
    case 'shield':
      return <TbShield className={className} />;
    case 'burger':
      return <TbBurger className={className} />;
    default:
      return <TbWorld className={className} />;
  }
};

const getLinkIcon = (icon?: string, className = 'w-4 h-4 flex-shrink-0') => {
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

const getPlatformCtaStyle = (
  icon?: ProjectLink['icon']
): { background: string; borderColor: string; glowColor: string } => {
  switch (icon) {
    case 'steam':
      return {
        background: 'linear-gradient(135deg, #1b2838 0%, #2a475e 55%, #1d5d8c 100%)',
        borderColor: 'rgba(102, 192, 244, 0.58)',
        glowColor: 'rgba(102, 192, 244, 0.72)',
      };
    case 'itch':
      return {
        background: 'linear-gradient(135deg, #fa5c5c 0%, #e11d48 100%)',
        borderColor: 'rgba(255, 148, 148, 0.6)',
        glowColor: 'rgba(250, 92, 92, 0.75)',
      };
    case 'google-play':
      return {
        background: 'linear-gradient(135deg, #01875f 0%, #10b981 100%)',
        borderColor: 'rgba(52, 211, 153, 0.6)',
        glowColor: 'rgba(16, 185, 129, 0.75)',
      };
    case 'github':
      return {
        background: 'linear-gradient(135deg, #24292e 0%, #4c1d95 100%)',
        borderColor: 'rgba(167, 139, 250, 0.55)',
        glowColor: 'rgba(139, 92, 246, 0.7)',
      };
    case 'web':
    default:
      return {
        background: 'linear-gradient(135deg, #0d9488 0%, #0284c7 100%)',
        borderColor: 'rgba(45, 212, 191, 0.6)',
        glowColor: 'rgba(43, 190, 206, 0.75)',
      };
  }
};

const resolveProjectLinks = (project: Project): ProjectLink[] => {
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

/* ── Media Showcase (Full-Width Hero Stage + Thumbnails + Lightbox) ──── */
interface MediaItem {
  type: 'video' | 'lottie' | 'image';
  src: string;
  label: string;
}

const isVideoUrl = (url: string) => /\.(mp4|webm|mov|mkv)(\?.*)?$/i.test(url);
const isLottieUrl = (url: string) => /\.lottie(\?.*)?$/i.test(url);

const getProjectCoverArt = (project: Project): string | undefined => {
  if (!project.images || project.images.length === 0) return undefined;
  const staticImg = project.images.find(
    (img) => !isVideoUrl(img) && !isLottieUrl(img) && !/\.gif(\?.*)?$/i.test(img)
  );
  if (staticImg) return staticImg;
  return project.images.find((img) => !isVideoUrl(img) && !isLottieUrl(img));
};

const buildMediaItems = (project: Project): MediaItem[] => {
  const items: MediaItem[] = [];
  if (project.video) {
    items.push({ type: 'video', src: project.video, label: 'Showcase Reel' });
  }
  if (project.lottie) {
    items.push({ type: 'lottie', src: project.lottie, label: 'Lottie Animation' });
  }
  if (project.images && project.images.length > 0) {
    project.images.forEach((img, i) => {
      if (isVideoUrl(img)) {
        if (!items.some((m) => m.src === img)) {
          items.push({ type: 'video', src: img, label: `Video Clip ${i + 1}` });
        }
      } else if (isLottieUrl(img)) {
        if (!items.some((m) => m.src === img)) {
          items.push({ type: 'lottie', src: img, label: `Animation ${i + 1}` });
        }
      } else {
        items.push({ type: 'image', src: img, label: `Showcase ${i + 1}` });
      }
    });
  }
  return items;
};

const ImageShowcase: React.FC<{ project: Project; accent: string }> = ({
  project,
  accent,
}) => {
  const mediaItems = buildMediaItems(project);
  const n = mediaItems.length;
  const [idx, setIdx] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchControlsVisible, setTouchControlsVisible] = useState(false);
  const touchTimeoutRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const triggerTouchControls = useCallback(() => {
    setTouchControlsVisible(true);
    if (touchTimeoutRef.current) {
      window.clearTimeout(touchTimeoutRef.current);
    }
    touchTimeoutRef.current = window.setTimeout(() => {
      setTouchControlsVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        window.clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  const controlsVisibilityClass = touchControlsVisible
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto';

  const isMaisonBurger = project.id === 'maison-du-burger';
  const currentAccent = project.vinylColor || accent;

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

  // Architecture fallback banner for code-only projects with no image assets
  if (n === 0) {
    return (
      <div
        className="w-full project-glass-card rounded-lg p-6 sm:p-8 backdrop-blur-xl"
        style={{
          background:
            'linear-gradient(145deg, rgba(16, 15, 28, 0.72) 0%, rgba(10, 10, 20, 0.85) 100%)',
          boxShadow: `0 20px 50px rgba(0, 0, 0, 0.38), inset 0 0 1px ${currentAccent}55`,
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-2 font-bold tracking-wider text-zinc-200">
            <TbCode className="w-4 h-4" style={{ color: currentAccent }} />
            <span>System Architecture Blueprint</span>
          </span>
          <span className="flex items-center gap-1.5 text-zinc-400">
            <TbLayersIntersect className="w-4 h-4" style={{ color: currentAccent }} />
            <span>Web / Cloud Build</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {project.technologies.map((tech, i) => (
            <div
              key={tech}
              className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/10"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <TechIcon
                  name={tech}
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: currentAccent }}
                />
                <span className="text-sm font-mono font-semibold text-zinc-100 truncate">
                  {tech}
                </span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 flex-shrink-0">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentItem = mediaItems[idx];

  return (
    <div className="w-full flex flex-col gap-3">
      {/* Full-Width Showcase Container */}
      <div
        onTouchStart={triggerTouchControls}
        className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[68vh] overflow-hidden select-none group rounded-lg flex items-center justify-center"
        style={{
          background: isMaisonBurger
            ? '#ffffff'
            : 'linear-gradient(160deg, rgba(10, 9, 18, 0.88) 0%, rgba(18, 16, 30, 0.92) 100%)',
          boxShadow: isMaisonBurger
            ? '0 14px 40px rgba(0,0,0,0.28)'
            : `0 20px 56px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.1)`,
        }}
      >
        {/* Ambient blurred glow behind aspect-contained media */}
        {!isMaisonBurger && currentItem.type === 'image' && (
          <img
            src={currentItem.src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-30 scale-125 pointer-events-none"
          />
        )}

        {/* Loading skeleton */}
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
              preload="metadata"
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.01]"
            />

            {!isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <TbPlayerPlay className="w-7 h-7 ml-0.5" />
                </div>
              </div>
            )}

            <div
              className={`absolute bottom-3 left-3 z-20 flex items-center gap-3 transition-opacity duration-200 ${controlsVisibilityClass}`}
            >
              <button
                type="button"
                onClick={togglePlay}
                className="p-1 text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer bg-transparent border-none outline-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <TbPlayerPause className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <TbPlayerPlay className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
              <button
                type="button"
                onClick={toggleMute}
                className="p-1 text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer bg-transparent border-none outline-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <TbVolumeOff className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <TbVolume className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </button>
            </div>
          </div>
        ) : currentItem.type === 'lottie' ? (
          <div
            className={`relative w-full h-full flex items-center justify-center p-6 overflow-hidden cursor-zoom-in ${isMaisonBurger ? 'bg-white' : ''
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
            alt={`${project.label} preview`}
            loading="eager"
            decoding="async"
            onLoad={() => setIsLoaded(true)}
            onClick={() => setIsLightboxOpen(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              cursor: 'zoom-in',
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 0.3s ease, transform 0.4s ease',
            }}
            className="relative z-10 group-hover:scale-[1.015]"
          />
        )}

        {/* Top-Right Expand Lightbox Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className={`absolute top-3 right-3 z-20 p-1.5 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-none outline-none ${controlsVisibilityClass} ${isMaisonBurger
            ? 'text-zinc-900 drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]'
            : 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]'
            }`}
          title="Expand fullscreen"
          aria-label="Expand media"
        >
          <TbMaximize className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Gallery Carousel Controls */}
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLoaded(false);
                setIdx((i) => (i - 1 + n) % n);
              }}
              className={`absolute left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-none outline-none ${controlsVisibilityClass} ${isMaisonBurger
                ? 'text-zinc-900 drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]'
                : 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]'
                }`}
              aria-label="Previous media"
            >
              <TbChevronLeft className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLoaded(false);
                setIdx((i) => (i + 1) % n);
              }}
              className={`absolute right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-none outline-none ${controlsVisibilityClass} ${isMaisonBurger
                ? 'text-zinc-900 drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]'
                : 'text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]'
                }`}
              aria-label="Next media"
            >
              <TbChevronRight className="w-7 h-7 sm:w-8 sm:h-8" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {n > 1 && (
        <div className="w-full flex items-center gap-2 py-1 overflow-x-auto no-scrollbar">
          {mediaItems.map((item, mIdx) => {
            const isSelected = mIdx === idx;
            return (
              <button
                key={mIdx}
                type="button"
                onClick={() => {
                  if (mIdx !== idx) {
                    setIsLoaded(false);
                    setIdx(mIdx);
                  }
                }}
                className={`relative flex-shrink-0 h-11 sm:h-12 w-16 sm:w-20 rounded-lg overflow-hidden transition-all cursor-pointer border ${isSelected
                  ? 'scale-105 shadow-lg mx-2'
                  : 'opacity-60 hover:opacity-100 border-white/15'
                  }`}
                style={{
                  borderColor: isSelected ? currentAccent : 'rgba(255,255,255,0.14)',
                  boxShadow: isSelected ? `0 0 14px ${currentAccent}55` : undefined,
                  background: isMaisonBurger && item.type === 'lottie' ? '#ffffff' : '#151421',
                }}
                title={item.label}
              >
                {item.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-amber-400">
                    <TbMovie className="w-4 h-4" />
                  </div>
                ) : item.type === 'lottie' ? (
                  <div
                    className={`w-full h-full flex items-center justify-center ${isMaisonBurger ? 'bg-white text-amber-500' : 'bg-zinc-900 text-purple-400'
                      }`}
                  >
                    <TbSparkles className="w-4 h-4" />
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
          <div className="ml-auto text-xs font-mono text-zinc-400 pl-2 pr-1 flex-shrink-0">
            {idx + 1} / {n}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox rendered via Portal above Navigation */}
      {isLightboxOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex flex-col items-center justify-between p-4 sm:p-7"
            style={{
              background: 'rgba(6, 5, 12, 0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
            onClick={() => setIsLightboxOpen(false)}
          >
            <div
              className="w-full max-w-6xl flex items-center justify-between text-white relative z-[210] pb-3 border-b border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span
                  className="font-bold text-base sm:text-lg tracking-tight"
                  style={{ fontFamily: 'Archivo Black, sans-serif' }}
                >
                  {project.label}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 font-mono">
                  {idx + 1} / {n}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 flex items-center justify-center text-white shadow-xl transition-all hover:scale-105 cursor-pointer"
                aria-label="Close media preview"
              >
                <TbX className="w-5 h-5" />
              </button>
            </div>

            <div
              className="relative max-w-6xl flex-1 w-full flex items-center justify-center py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {currentItem.type === 'video' ? (
                <video
                  src={currentItem.src}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="max-w-full max-h-[78vh] rounded-xl object-contain shadow-2xl"
                />
              ) : currentItem.type === 'lottie' ? (
                <div
                  className={`w-[85vw] max-w-3xl h-[65vh] flex items-center justify-center rounded-2xl p-6 border ${isMaisonBurger
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
                  alt={`${project.label} expanded preview`}
                  className="max-w-full max-h-[78vh] rounded-xl object-contain shadow-2xl"
                  decoding="async"
                />
              )}

              {n > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoaded(false);
                      setIdx((i) => (i - 1 + n) % n);
                    }}
                    className="absolute left-1 sm:-left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                    aria-label="Previous"
                  >
                    <TbChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsLoaded(false);
                      setIdx((i) => (i + 1) % n);
                    }}
                    className="absolute right-1 sm:-right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer"
                    aria-label="Next"
                  >
                    <TbChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {n > 1 && (
              <div
                className="flex items-center gap-2 max-w-5xl overflow-x-auto no-scrollbar py-1 relative z-[210]"
                onClick={(e) => e.stopPropagation()}
              >
                {mediaItems.map((item, mIdx) => (
                  <button
                    key={mIdx}
                    type="button"
                    onClick={() => {
                      setIsLoaded(false);
                      setIdx(mIdx);
                    }}
                    className={`w-12 h-9 sm:w-14 sm:h-10 rounded-md overflow-hidden border transition-all cursor-pointer ${mIdx === idx
                      ? 'scale-105'
                      : 'opacity-50 hover:opacity-85 border-white/20'
                      }`}
                    style={{
                      borderColor: mIdx === idx ? currentAccent : 'rgba(255,255,255,0.2)',
                      background: isMaisonBurger && item.type === 'lottie' ? '#ffffff' : '#151421',
                    }}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-amber-400">
                        <TbMovie className="w-3.5 h-3.5" />
                      </div>
                    ) : item.type === 'lottie' ? (
                      <div
                        className={`w-full h-full flex items-center justify-center ${isMaisonBurger ? 'bg-white text-amber-500' : 'bg-zinc-900 text-purple-400'
                          }`}
                      >
                        <TbSparkles className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <img
                        src={item.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

/* ── Dedicated Minimal Black Cinema Player for 3D Animations Reel ───── */
const PureBlackVideoStage: React.FC<{ project: Project }> = ({ project }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [touchControlsVisible, setTouchControlsVisible] = useState(false);
  const touchTimeoutRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const videoSrc = project.video || (project.images && project.images[0]) || '';

  const triggerTouchControls = useCallback(() => {
    setTouchControlsVisible(true);
    if (touchTimeoutRef.current) {
      window.clearTimeout(touchTimeoutRef.current);
    }
    touchTimeoutRef.current = window.setTimeout(() => {
      setTouchControlsVisible(false);
    }, 2500);
  }, []);

  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) {
        window.clearTimeout(touchTimeoutRef.current);
      }
    };
  }, []);

  const controlsVisibilityClass = touchControlsVisible
    ? 'opacity-100 pointer-events-auto'
    : 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto';

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
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isLightboxOpen]);

  return (
    <>
      <div
        onTouchStart={triggerTouchControls}
        className="relative w-full aspect-[16/9] max-h-[76vh] bg-black rounded-lg overflow-hidden flex items-center justify-center group cursor-pointer"
        onClick={() => setIsLightboxOpen(true)}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          className="w-full h-full object-contain bg-black"
        />

        {!isPlaying && (
          <div className="absolute inset-0 z-10 bg-black/45 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <TbPlayerPlay className="w-8 h-8 ml-1" />
            </div>
          </div>
        )}

        <div
          className={`absolute bottom-4 left-4 z-20 flex items-center gap-3 transition-opacity duration-200 ${controlsVisibilityClass}`}
        >
          <button
            type="button"
            onClick={togglePlay}
            className="p-1 text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer bg-transparent border-none outline-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <TbPlayerPause className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <TbPlayerPlay className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            className="p-1 text-white hover:scale-110 active:scale-95 transition-transform cursor-pointer bg-transparent border-none outline-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <TbVolumeOff className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <TbVolume className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          className={`absolute top-4 right-4 z-20 p-1.5 flex items-center justify-center text-white transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer bg-transparent border-none outline-none drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] ${controlsVisibilityClass}`}
          aria-label="Fullscreen video"
        >
          <TbMaximize className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {isLightboxOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="fixed top-5 right-6 z-[210] w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 border border-white/25 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 cursor-pointer"
              aria-label="Close fullscreen"
            >
              <TbX className="w-5 h-5" />
            </button>
            <video
              src={videoSrc}
              controls
              autoPlay
              loop
              playsInline
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-[88vh] rounded-xl object-contain"
            />
          </div>,
          document.body
        )}
    </>
  );
};

/* ── Top Sticky 3D Stacked Media Project Selector ─────────────────────── */
interface MediaItemProps {
  project: Project;
  isSelected: boolean;
  isHovered: boolean;
  accent: string;
}

const VinylDiscItem: React.FC<MediaItemProps> = ({
  project,
  isSelected,
  isHovered,
  accent,
}) => {
  const vinylTint = project.vinylColor || accent;

  return (
    <div className="relative flex items-center justify-center">
      {/* Unclipped Outer Radial Project Glow (only on selected item) */}
      <div
        className="absolute -inset-5 sm:-inset-6 rounded-full pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle, ${vinylTint}88 0%, ${vinylTint}38 42%, transparent 72%)`,
          opacity: isSelected ? 0.85 : 0,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />

      {/* Tactile Grooved Vinyl Record Disc */}
      <div
        className="relative w-[48px] h-[48px] sm:w-[66px] sm:h-[66px] rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          boxShadow: isSelected
            ? `0 0 24px ${vinylTint}90, 0 12px 24px rgba(0,0,0,0.75)`
            : isHovered
              ? '0 10px 22px rgba(0,0,0,0.72)'
              : '0 6px 14px rgba(0,0,0,0.6)',
          border: `1.5px solid ${isSelected
            ? vinylTint
            : isHovered
              ? 'rgba(255,255,255,0.42)'
              : 'rgba(255,255,255,0.2)'
            }`,
        }}
      >
        {/* Entire disc surface + medallion rotates infinitely ONLY when selected */}
        <div
          className={`absolute inset-0 rounded-full overflow-hidden flex items-center justify-center ${isSelected ? 'vinyl-spin-slow' : ''
            }`}
          style={{
            background:
              'repeating-radial-gradient(circle at center, #07070b 0px, #07070b 2px, #1c1c26 3px, #0d0d14 4.5px)',
          }}
        >
          {/* Asymmetric conic specular sheen so rotation is clearly visible */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                'conic-gradient(from 25deg, transparent 0deg, rgba(255,255,255,0.26) 28deg, transparent 60deg, transparent 180deg, rgba(255,255,255,0.24) 208deg, transparent 240deg)',
            }}
          />

          {/* Subtle colored track ring */}
          <div
            className="absolute inset-[7px] sm:inset-[10px] rounded-full border border-dashed pointer-events-none"
            style={{ borderColor: isSelected ? `${vinylTint}44` : 'rgba(255,255,255,0.12)' }}
          />

          {/* Center Circle Medallion with Custom Project Icon */}
          <div
            className="relative z-10 w-6 h-6 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: isSelected
                ? `radial-gradient(circle at 30% 30%, ${vinylTint}, ${vinylTint}cc 72%, #0a0a12 100%)`
                : 'radial-gradient(circle at 30% 30%, #3f3f4e, #181822 88%)',
              border: `1.5px solid ${isSelected ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.25)'
                }`,
              boxShadow: isSelected
                ? `0 0 12px ${vinylTint}aa, inset 0 1px 2px rgba(255,255,255,0.4)`
                : 'inset 0 1px 4px rgba(0,0,0,0.7)',
              color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.72)',
            }}
          >
            {/* Tiny off-center label dot so center rotation is unmistakably readable */}
            <span
              className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-white/75 pointer-events-none"
              aria-hidden="true"
            />
            {getProjectIcon(project.icon, 'w-3 h-3 sm:w-4 sm:h-4 drop-shadow')}
          </div>
        </div>
      </div>
    </div>
  );
};

const GameDiscBoxItem: React.FC<MediaItemProps> = ({
  project,
  isSelected,
  isHovered,
  accent,
}) => {
  const [imgError, setImgError] = useState(false);
  const coverArt = getProjectCoverArt(project);
  const vinylTint = project.vinylColor || accent;

  return (
    <div className="relative flex items-center justify-center">
      {/* Unclipped Outer Radial Project Glow (only on selected item) */}
      <div
        className="absolute -inset-5 sm:-inset-6 rounded-full pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle, ${vinylTint}88 0%, ${vinylTint}38 42%, transparent 72%)`,
          opacity: isSelected ? 0.85 : 0,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />

      {/* Rectangular Physical Game Disc Box */}
      <div
        className="relative w-[42px] h-[56px] sm:w-[54px] sm:h-[72px] rounded-[5px] sm:rounded-[6px] overflow-hidden flex transition-all duration-300 bg-[#0d0d16]"
        style={{
          boxShadow: isSelected
            ? `0 0 22px ${vinylTint}88, 0 14px 26px rgba(0,0,0,0.8)`
            : isHovered
              ? '0 10px 22px rgba(0,0,0,0.75)'
              : '0 6px 14px rgba(0,0,0,0.62)',
          border: `1.5px solid ${isSelected
            ? vinylTint
            : isHovered
              ? 'rgba(255,255,255,0.42)'
              : 'rgba(255,255,255,0.2)'
            }`,
        }}
      >
        {/* Left Plastic Spine */}
        <div
          className="w-[4px] sm:w-[5px] h-full flex-shrink-0 flex flex-col justify-between py-1 border-r border-black/70"
          style={{
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.28) 0%, #181824 45%, #090910 100%)',
          }}
        >
          <span
            className="h-3 w-full block opacity-90"
            style={{ backgroundColor: isSelected ? vinylTint : 'rgba(255,255,255,0.25)' }}
          />
        </div>

        {/* Front Cover Sleeve */}
        <div className="relative flex-1 h-full flex flex-col overflow-hidden bg-[#10101a]">
          {/* Top Collector Trim Strip */}
          <div
            className="h-[5px] sm:h-[6px] w-full flex-shrink-0 border-b border-white/20"
            style={{
              background: isSelected
                ? `linear-gradient(90deg, ${vinylTint}, ${vinylTint}cc)`
                : 'linear-gradient(90deg, #3f3f4e, #272733)',
            }}
          />

          {/* Tiny Cover Art or Fallback Icon */}
          {coverArt && !imgError ? (
            <div className="relative flex-1 min-h-0 w-full overflow-hidden">
              <img
                src={coverArt}
                alt=""
                loading="lazy"
                decoding="async"
                onError={() => setImgError(true)}
                className={`w-full h-full object-cover transition-all duration-300 ${isSelected ? '' : 'saturate-50 opacity-85'
                  }`}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.24) 0%, transparent 42%, rgba(0,0,0,0.38) 100%)',
                }}
              />
            </div>
          ) : (
            <div
              className="flex-1 w-full flex items-center justify-center"
              style={{
                background: isSelected
                  ? `radial-gradient(circle at 50% 45%, ${vinylTint}44 0%, #12111d 85%)`
                  : 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.12) 0%, #12111d 85%)',
              }}
            >
              {getProjectIcon(project.icon, 'w-4 h-4 sm:w-5 sm:h-5 text-white drop-shadow')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FloppyDiskItem: React.FC<MediaItemProps> = ({
  project,
  isSelected,
  isHovered,
  accent,
}) => {
  const vinylTint = project.vinylColor || accent;

  return (
    <div className="relative flex items-center justify-center">
      {/* Unclipped Outer Radial Project Glow (only on selected item) */}
      <div
        className="absolute -inset-5 sm:-inset-6 rounded-full pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle, ${vinylTint}88 0%, ${vinylTint}38 42%, transparent 72%)`,
          opacity: isSelected ? 0.85 : 0,
          filter: 'blur(8px)',
        }}
        aria-hidden="true"
      />

      {/* 3.5-Inch Floppy Disk Body */}
      <div
        className="relative w-[46px] h-[48px] sm:w-[62px] sm:h-[64px] rounded-[5px] sm:rounded-[7px] overflow-hidden transition-all duration-300"
        style={{
          background:
            'linear-gradient(145deg, #1e1d2b 0%, #12111c 60%, #0b0a12 100%)',
          boxShadow: isSelected
            ? `0 0 22px ${vinylTint}88, 0 14px 26px rgba(0,0,0,0.8)`
            : isHovered
              ? '0 10px 22px rgba(0,0,0,0.75)'
              : '0 6px 14px rgba(0,0,0,0.62)',
          border: `1.5px solid ${isSelected
            ? vinylTint
            : isHovered
              ? 'rgba(255,255,255,0.42)'
              : 'rgba(255,255,255,0.2)'
            }`,
        }}
      >
        {/* Subtle Top-Right Corner Notch */}
        <div
          className="absolute top-0 right-0 w-2 h-2 bg-black/60 border-l border-b border-white/10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Metallic Sliding Shutter */}
        <div
          className="absolute top-0 left-[20%] w-[54%] h-[28%] rounded-b-[3px] border-x border-b border-black/50"
          style={{
            background:
              'linear-gradient(90deg, #9ca3af 0%, #f3f4f6 38%, #6b7280 72%, #d1d5db 100%)',
          }}
        >
          {/* Shutter Cutout Window */}
          <div className="absolute top-[18%] right-[16%] w-[28%] h-[62%] rounded-[1px] bg-[#14131f] border border-black/40" />
        </div>

        {/* Bottom Corner Write-Protect / Index Notches */}
        <div
          className="absolute bottom-1 left-1 w-1.5 h-1.5 rounded-[1px] bg-black/60 border border-white/10 pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-[1px] bg-black/60 border border-white/10 pointer-events-none"
          aria-hidden="true"
        />

        {/* Bottom Paper Label */}
        <div className="absolute bottom-[7%] left-[12%] right-[12%] h-[54%] rounded-[3px] overflow-hidden flex flex-col border border-black/40 shadow-inner">
          <div
            className="h-[24%] w-full flex-shrink-0"
            style={{ background: isSelected ? vinylTint : '#3f3f4e' }}
          />
          <div
            className="flex-1 flex items-center justify-center"
            style={{
              background: isSelected
                ? 'linear-gradient(180deg, #272638 0%, #191826 100%)'
                : '#181724',
              color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.68)',
            }}
          >
            {getProjectIcon(project.icon, 'w-3.5 h-3.5 sm:w-[18px] sm:h-[18px] drop-shadow')}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StackedVinylBarProps {
  sectionKey: string;
  projects: Project[];
  activeIdx: number;
  accent: string;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

const StackedVinylBar: React.FC<StackedVinylBarProps> = ({
  sectionKey,
  projects,
  activeIdx,
  accent,
  onSelect,
  onPrev,
  onNext,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeProject = projects[activeIdx] ?? projects[0];
  const displayProject =
    hoveredIdx !== null && projects[hoveredIdx] ? projects[hoveredIdx] : activeProject;
  const activeTint = activeProject.vinylColor || accent;

  const checkScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(maxScroll - el.scrollLeft > 6);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    checkScroll();

    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(checkScroll) : null;
    if (observer) {
      observer.observe(el);
    }
    window.addEventListener('resize', checkScroll);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, projects.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const itemEl = itemRefs.current[activeIdx];
    if (container && itemEl && container.scrollWidth > container.clientWidth) {
      const targetLeft =
        itemEl.offsetLeft - container.clientWidth / 2 + itemEl.clientWidth / 2;
      container.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
    const timer = window.setTimeout(checkScroll, 220);
    checkScroll();
    return () => window.clearTimeout(timer);
  }, [activeIdx, checkScroll, projects.length]);

  const edgeMaskImage =
    canScrollLeft && canScrollRight
      ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 7%, black 22%, black 78%, rgba(0,0,0,0.18) 93%, transparent 100%)'
      : canScrollLeft
        ? 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.18) 7%, black 22%, black calc(100% - 12px), transparent 100%)'
        : canScrollRight
          ? 'linear-gradient(to right, transparent 0px, black 12px, black 78%, rgba(0,0,0,0.18) 93%, transparent 100%)'
          : undefined;

  return (
    <div className="sticky top-2 sm:top-3 z-40 mb-6 sm:mb-8 w-full sm:w-fit sm:max-w-[calc(100%-210px)] lg:max-w-fit sm:mr-auto sm:ml-0 xl:mx-auto">
      {/* Fading Shadow Dock (no solid background or border) */}
      <div className="relative flex items-center justify-center gap-0.5 sm:gap-1.5 px-2 sm:px-4 py-1.5">
        {/* Elliptical Ambient Shadow Backdrop */}
        <div
          className="pointer-events-none absolute -inset-x-10 -inset-y-3 rounded-[50%] z-0"
          style={{
            background:
              'radial-gradient(closest-side, rgba(0, 0, 0, 0.92) 0%, rgba(5, 4, 12, 0.72) 52%, rgba(5, 4, 12, 0.25) 78%, transparent 100%)',
            filter: 'blur(12px)',
          }}
          aria-hidden="true"
        />
        {/* Concentrated Elliptical Shelf Shadow */}
        <div
          className="pointer-events-none absolute -inset-x-4 top-2 -bottom-2 rounded-[50%] z-0"
          style={{
            background:
              'radial-gradient(closest-side, rgba(0, 0, 0, 0.95) 0%, rgba(8, 7, 18, 0.65) 58%, transparent 100%)',
            filter: 'blur(8px)',
          }}
          aria-hidden="true"
        />

        {/* Simplified Left Chevron Button */}
        <button
          type="button"
          onClick={onPrev}
          className="relative z-20 flex-shrink-0 p-1 sm:p-1.5 text-zinc-400 hover:text-white transition-all duration-200 hover:scale-125 active:scale-90 cursor-pointer bg-transparent border-none outline-none"
          title="Previous project (Left Arrow)"
          aria-label="Previous project"
        >
          <TbChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Scrollable Viewport with Edge Fade Mask When Overflowing */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onWheel={(e) => {
            const el = scrollContainerRef.current;
            if (el && el.scrollWidth > el.clientWidth && Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
              el.scrollLeft += e.deltaY;
            }
          }}
          className={`relative z-10 flex-1 min-w-0 max-w-[320px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[760px] ${canScrollLeft || canScrollRight ? 'overflow-x-auto' : 'overflow-visible'
            } no-scrollbar pt-14 pb-10 -mt-12 -mb-8 px-9 sm:px-11 -mx-3 sm:-mx-4`}
          style={{
            maskImage: edgeMaskImage,
            WebkitMaskImage: edgeMaskImage,
          }}
        >
          <div
            className="flex items-end w-max mx-auto"
            style={{ perspective: '960px', transformStyle: 'preserve-3d' }}
          >
            {projects.map((p, idx) => {
              const isSelected = idx === activeIdx;
              const isHovered = hoveredIdx === idx;
              const offset = idx - activeIdx;
              const absOffset = Math.abs(offset);

              // Tilt towards the selected item with decreasing magnitude the further away the item is
              let tiltY = 0;
              if (!isSelected) {
                const baseMagnitude = Math.max(6, 32 - (absOffset - 1) * 8);
                const tiltMagnitude = isHovered
                  ? Math.max(4, baseMagnitude * 0.45)
                  : baseMagnitude;
                tiltY = offset > 0 ? -tiltMagnitude : tiltMagnitude;
              }

              const translateY = isSelected ? -15 : isHovered ? -5 : 2;
              const scale = isSelected
                ? 1.08
                : isHovered
                  ? 1.04
                  : Math.max(0.88, 0.96 - absOffset * 0.02);
              const itemOpacity =
                isSelected || isHovered
                  ? 1
                  : absOffset >= 4
                    ? 0.55
                    : absOffset === 3
                      ? 0.78
                      : 0.94;

              // Static margins independent of hover so the button hit-target never shifts under the cursor
              const marginLeft =
                idx === 0 ? 0 : isSelected || idx === activeIdx + 1 ? 2 : -7;

              const zIdx = isHovered
                ? 45
                : isSelected
                  ? 40
                  : Math.max(10, 35 - absOffset);

              return (
                <button
                  key={p.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => onSelect(idx)}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onFocus={() => setHoveredIdx(idx)}
                  onBlur={() => setHoveredIdx(null)}
                  title={p.label}
                  aria-label={`Select project ${p.label}`}
                  aria-pressed={isSelected}
                  className="group relative flex flex-col items-center justify-center outline-none cursor-pointer bg-transparent border-none p-0 transition-[margin] duration-300 ease-out"
                  style={{
                    zIndex: zIdx,
                    marginLeft: idx === 0 ? undefined : marginLeft,
                  }}
                >
                  <div
                    className="pointer-events-none transition-all duration-300 ease-out"
                    style={{
                      transform: `rotateY(${tiltY}deg) translateY(${translateY}px) scale(${scale})`,
                      opacity: itemOpacity,
                      transformOrigin: 'center bottom',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {sectionKey === 'gamedev' ? (
                      <GameDiscBoxItem
                        project={p}
                        isSelected={isSelected}
                        isHovered={isHovered}
                        accent={accent}
                      />
                    ) : sectionKey === 'software' ? (
                      <FloppyDiskItem
                        project={p}
                        isSelected={isSelected}
                        isHovered={isHovered}
                        accent={accent}
                      />
                    ) : (
                      <VinylDiscItem
                        project={p}
                        isSelected={isSelected}
                        isHovered={isHovered}
                        accent={accent}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Simplified Right Chevron Button */}
        <button
          type="button"
          onClick={onNext}
          className="relative z-20 flex-shrink-0 p-1 sm:p-1.5 text-zinc-400 hover:text-white transition-all duration-200 hover:scale-125 active:scale-90 cursor-pointer bg-transparent border-none outline-none"
          title="Next project (Right Arrow)"
          aria-label="Next project"
        >
          <TbChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Subtle Active / Hovered Item Title Indicator Under Sticky Bar */}
      <div className="relative z-10 flex justify-center sm:justify-start xl:justify-center mt-1 pointer-events-none">
        <span
          className="px-2.5 py-0.5 rounded-full text-[11px] font-medium backdrop-blur-md border transition-all duration-300"
          style={{
            backgroundColor: 'rgba(11, 10, 20, 0.72)',
            borderColor:
              hoveredIdx !== null && hoveredIdx !== activeIdx
                ? 'rgba(255,255,255,0.22)'
                : `${activeTint}44`,
            color: '#f4f4f5',
          }}
        >
          {displayProject.label}
        </span>
      </div>
    </div>
  );
};

/* ── Main Scrollable Single-Project Page Component ──────────────────── */
interface ProjectSectionProps {
  section: IProjectSection;
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({ section }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevSectionKey, setPrevSectionKey] = useState(section.key);
  if (prevSectionKey !== section.key) {
    setPrevSectionKey(section.key);
    setActiveIdx(0);
  }
  const topAnchorRef = useRef<HTMLDivElement>(null);

  const projects = section.projects;
  const n = projects.length;
  const safeActiveIdx =
    prevSectionKey !== section.key ? 0 : Math.min(activeIdx, Math.max(0, n - 1));
  const activeProject = projects[safeActiveIdx] ?? projects[0];

  const isAnimReel = activeProject.id === '3d-animations-reel';
  const themeBg = isAnimReel ? '#000000' : activeProject.themeBg || '#0b0a14';
  const blob1 = isAnimReel ? '#000000' : activeProject.themeBlob1 || section.accent;
  const blob2 = isAnimReel ? '#000000' : activeProject.themeBlob2 || section.accent;
  const projectAccent = activeProject.vinylColor || section.accent;

  const goToProject = useCallback(
    (index: number) => {
      const next = ((index % n) + n) % n;
      setActiveIdx(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [n]
  );

  const handlePrev = useCallback(() => {
    goToProject(safeActiveIdx - 1);
  }, [safeActiveIdx, goToProject]);

  const handleNext = useCallback(() => {
    goToProject(safeActiveIdx + 1);
  }, [safeActiveIdx, goToProject]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const actionLinks = resolveProjectLinks(activeProject);

  return (
    <div
      ref={topAnchorRef}
      className="relative min-h-[100dvh] w-full overflow-x-clip transition-colors duration-700 ease-out"
      style={{ backgroundColor: themeBg }}
    >
      {/* Dynamic Per-Project Animated Glowing Blobs Behind Tinted Glass Backdrop */}
      {!isAnimReel && (
        <div
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <div
            className="absolute -top-36 -left-24 w-[620px] h-[620px] rounded-full transition-all duration-1000 ease-out animate-[float-drift-1_14s_ease-in-out_infinite]"
            style={{
              background: `radial-gradient(circle, ${blob1} 0%, transparent 68%)`,
              opacity: 0.34,
              filter: 'blur(110px)',
            }}
          />
          <div
            className="absolute -bottom-40 -right-24 w-[660px] h-[660px] rounded-full transition-all duration-1000 ease-out animate-[float-drift-2_16s_ease-in-out_infinite]"
            style={{
              background: `radial-gradient(circle, ${blob2} 0%, transparent 68%)`,
              opacity: 0.3,
              filter: 'blur(120px)',
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full transition-all duration-1000 ease-out"
            style={{
              background: `radial-gradient(circle, ${projectAccent} 0%, transparent 72%)`,
              opacity: 0.14,
              filter: 'blur(130px)',
            }}
          />

          {/* Tinted Frosted Glass Veil Over Dynamic Gradient Blobs */}
          <div
            className="absolute inset-0 backdrop-blur-[72px]"
            style={{
              background: `linear-gradient(155deg, ${blob1}12 0%, rgba(8, 8, 14, 0.42) 55%, ${blob2}14 100%)`,
            }}
          />
        </div>
      )}

      {/* Main Scrollable Foreground Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 md:px-12 pt-6 sm:pt-16 pb-24 sm:pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={section.key}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -64 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Top Sticky Stacked Media Project Selector + Simplified Prev/Next Chevrons */}
            <StackedVinylBar
              sectionKey={section.key}
              projects={projects}
              activeIdx={safeActiveIdx}
              accent={section.accent}
              onSelect={goToProject}
              onPrev={handlePrev}
              onNext={handleNext}
            />

            {/* Single Visible Project Stage with Page-Switch Transition */}
            <AnimatePresence mode="wait">
              {isAnimReel ? (
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -64 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full"
                >
                  <PureBlackVideoStage project={activeProject} />
                </motion.div>
              ) : (
                <motion.article
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -64 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex flex-col gap-6 sm:gap-8"
                >
                  {/* Full-Width Project Media Showcase */}
                  <div className="w-full relative">
                    <ImageShowcase key={activeProject.id} project={activeProject} accent={projectAccent} />
                  </div>

                  {/* Project Title, Release Year & Status Badge */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 border-b border-white/10">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-zinc-300 bg-white/[0.06] border border-white/10">
                          <TbCalendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{activeProject.year}</span>
                        </span>

                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
                          style={{
                            backgroundColor: `${activeProject.statusColor}22`,
                            color: activeProject.statusColor,
                            border: `1px solid ${activeProject.statusColor}55`,
                          }}
                        >
                          {activeProject.status}
                        </span>
                      </div>

                      <h1
                        className="text-white font-black tracking-tight leading-[1.06] m-0"
                        style={{
                          fontFamily: 'Archivo Black, sans-serif',
                          fontSize: 'clamp(2rem, 4.4vw, 3.4rem)',
                        }}
                      >
                        {activeProject.label}
                      </h1>
                    </div>

                    {/* Lively Animated Platform-Glow CTA Buttons */}
                    {actionLinks.length > 0 && (
                      <div className="flex items-center gap-3 flex-wrap">
                        {actionLinks.map((link, lIdx) => {
                          const ctaStyle = getPlatformCtaStyle(link.icon);
                          return (
                            <a
                              key={link.url + lIdx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="platform-cta-btn inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-base sm:text-lg font-bold text-white no-underline cursor-pointer"
                              style={
                                {
                                  background: ctaStyle.background,
                                  border: `1px solid ${ctaStyle.borderColor}`,
                                  ['--cta-glow' as string]: ctaStyle.glowColor,
                                } as React.CSSProperties
                              }
                            >
                              {getLinkIcon(link.icon, 'w-5 h-5 flex-shrink-0')}
                              <span>{link.label}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Project Narrative, Highlights & Technologies in Tinted Glass Panels */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
                    {/* Left: Description & Key Highlights */}
                    <div className="lg:col-span-7 flex flex-col gap-3.5 sm:gap-4">
                      <div className="project-glass-card rounded-lg p-6 sm:p-7 bg-white/[0.045] backdrop-blur-xl shadow-xl">
                        <h2 className="text-xs font-mono tracking-[0.14em] text-zinc-400 mb-3">
                          About This Project
                        </h2>
                        <p className="text-zinc-200 text-base sm:text-[17px] leading-relaxed m-0">
                          {activeProject.description}
                        </p>
                      </div>

                      {activeProject.highlights && activeProject.highlights.length > 0 && (
                        <div className="project-glass-card rounded-lg p-6 sm:p-7 bg-white/[0.045] backdrop-blur-xl shadow-xl">
                          <h2 className="text-xs font-mono tracking-[0.14em] text-zinc-400 mb-4 flex items-center gap-2">
                            <TbCheck className="w-4 h-4" style={{ color: projectAccent }} />
                            <span>Key Highlights</span>
                          </h2>
                          <ul className="space-y-2 m-0 p-0 list-none">
                            {activeProject.highlights.map((h, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-3 text-sm sm:text-[15px] text-zinc-200 py-1"
                              >
                                <span
                                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                                  style={{
                                    backgroundColor: projectAccent,
                                    boxShadow: `0 0 8px ${projectAccent}`,
                                  }}
                                />
                                <span className="leading-snug">{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right: Technologies Stack & Project Switch Arrows */}
                    <div className="lg:col-span-5 flex flex-col gap-3.5 sm:gap-4">
                      <div className="project-glass-card rounded-lg p-6 sm:p-7 bg-white/[0.045] backdrop-blur-xl shadow-xl">
                        <h2 className="text-xs font-mono tracking-[0.14em] text-zinc-400 mb-4">
                          Technologies Used
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {activeProject.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium bg-white/[0.06] border border-white/10 text-zinc-100 hover:bg-white/[0.12] transition-colors"
                            >
                              <TechIcon
                                name={tech}
                                className="w-4 h-4 flex-shrink-0"
                                style={{ color: projectAccent }}
                              />
                              <span>{tech}</span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Quick Prev/Next Project Switcher Card inside details */}
                      {n > 1 && (
                        <div className="project-glass-card rounded-lg p-5 bg-white/[0.035] backdrop-blur-xl flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={handlePrev}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-transparent hover:bg-white/[0.08] border border-transparent hover:border-white/15 text-xs sm:text-sm font-semibold text-zinc-200 transition-all cursor-pointer"
                          >
                            <TbChevronLeft className="w-4 h-4" />
                            <span>Previous</span>
                          </button>
                          <span className="text-xs font-mono text-zinc-400">
                            {safeActiveIdx + 1} of {n}
                          </span>
                          <button
                            type="button"
                            onClick={handleNext}
                            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-transparent hover:bg-white/[0.08] border border-transparent hover:border-white/15 text-xs sm:text-sm font-semibold text-zinc-200 transition-all cursor-pointer"
                          >
                            <span>Next</span>
                            <TbChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
