import React, { useState, useEffect, useRef, useCallback } from 'react';
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

/* ── High-Fidelity Interactive Project Viewport ───────────────────── */
const ProjectVisualFallback: React.FC<{ project: Project; accent: string }> = ({ project, accent }) => {
  const [viewMode, setViewMode] = useState<'wireframe' | 'shaded' | 'inspect'>('shaded');
  const is3D = project.id.includes('3d');
  const isGame = project.id.includes('game') || project.id.includes('party');
  const isEnv = project.id.includes('env');
  const isChar = project.id.includes('char');
  const isSpring = project.id.includes('spring') || project.id.includes('api');

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col justify-between p-3.5 sm:p-5"
      style={{
        background: 'linear-gradient(145deg, #12111d 0%, #1a1829 100%)',
        borderRadius: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.22), inset 0 0 30px rgba(0,0,0,0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-20%',
          right: '-20%',
          width: '75%',
          height: '75%',
          background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }}
      />

      {/* Top Viewport Header */}
      <div className="flex items-center justify-between relative z-10 pb-2 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            {is3D ? 'Blender Viewport 4.2' : isGame ? 'Unity 6 Engine Preview' : 'Systems Architecture View'}
          </span>
        </div>

        {/* Interactive Mode Pills */}
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/10">
          <button
            type="button"
            onClick={() => setViewMode('shaded')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              viewMode === 'shaded' ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {is3D ? 'Shaded' : 'Overview'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('wireframe')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              viewMode === 'wireframe' ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {is3D ? 'Wireframe' : 'Topology'}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('inspect')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
              viewMode === 'inspect' ? 'bg-white/20 text-white font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Telemetry
          </button>
        </div>
      </div>

      {/* Interactive Center Stage */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-2 min-h-0">
        {is3D && isEnv && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {viewMode === 'wireframe' ? (
              <svg viewBox="0 0 320 160" className="w-full h-32 text-indigo-400 stroke-current fill-none">
                <path d="M 40 120 L 160 40 L 280 120 Z" strokeWidth="1.2" strokeOpacity="0.8" />
                <path d="M 40 120 L 160 140 L 280 120" strokeWidth="1.2" strokeOpacity="0.8" />
                <path d="M 160 40 L 160 140" strokeWidth="1.2" strokeOpacity="0.8" />
                <path d="M 100 80 L 220 80" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.6" />
                <path d="M 70 100 L 160 70 L 250 100" strokeWidth="0.8" strokeOpacity="0.7" />
                <circle cx="160" cy="40" r="3" fill="#a78bfa" />
                <circle cx="40" cy="120" r="3" fill="#a78bfa" />
                <circle cx="280" cy="120" r="3" fill="#a78bfa" />
                <circle cx="160" cy="140" r="3" fill="#a78bfa" />
              </svg>
            ) : viewMode === 'inspect' ? (
              <div className="w-full bg-black/50 rounded-lg p-2.5 font-mono text-[11px] text-zinc-300 space-y-1">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Mesh Triangles:</span>
                  <span className="text-purple-300 font-bold">14,820 tris</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Material Passes:</span>
                  <span className="text-emerald-400 font-bold">Albedo · Normal · Roughness · AO</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Target Pipeline:</span>
                  <span className="text-cyan-300 font-bold">Universal RP (Unity 6 / Mobile Ready)</span>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-32 flex items-center justify-center">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-500 hover:rotate-6"
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa30, #6366f120)',
                    border: '1.5px solid #a78bfa80',
                    boxShadow: '0 0 30px rgba(167, 139, 250, 0.25)',
                  }}
                >
                  <TbTrees className="w-12 h-12 text-[#a78bfa]" />
                </div>
                <div className="absolute bottom-1 px-2.5 py-0.5 rounded-full bg-black/60 text-[10px] font-mono text-zinc-300 border border-white/10">
                  Modular PBR Environment Assets
                </div>
              </div>
            )}
          </div>
        )}

        {is3D && isChar && (
          <div className="w-full h-full flex flex-col items-center justify-center">
            {viewMode === 'wireframe' ? (
              <svg viewBox="0 0 240 160" className="w-full h-32 text-indigo-300 stroke-current fill-none">
                <circle cx="120" cy="35" r="18" strokeWidth="1.2" strokeOpacity="0.85" />
                <path d="M 120 53 L 120 105" strokeWidth="1.5" strokeOpacity="0.9" />
                <path d="M 85 70 L 120 60 L 155 70" strokeWidth="1.2" strokeOpacity="0.85" />
                <path d="M 70 100 L 85 70" strokeWidth="1.2" strokeOpacity="0.8" />
                <path d="M 170 100 L 155 70" strokeWidth="1.2" strokeOpacity="0.8" />
                <path d="M 120 105 L 95 150" strokeWidth="1.2" strokeOpacity="0.85" />
                <path d="M 120 105 L 145 150" strokeWidth="1.2" strokeOpacity="0.85" />
                <circle cx="120" cy="60" r="2.5" fill="#a78bfa" />
                <circle cx="85" cy="70" r="2.5" fill="#a78bfa" />
                <circle cx="155" cy="70" r="2.5" fill="#a78bfa" />
                <circle cx="120" cy="105" r="2.5" fill="#a78bfa" />
              </svg>
            ) : viewMode === 'inspect' ? (
              <div className="w-full bg-black/50 rounded-lg p-2.5 font-mono text-[11px] text-zinc-300 space-y-1">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Skeletal Rig:</span>
                  <span className="text-purple-300 font-bold">68 Humanoid Mecanim Bones</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Topology Integrity:</span>
                  <span className="text-emerald-400 font-bold">100% Quad Loops (Zero Poles)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subsurface Scattering:</span>
                  <span className="text-cyan-300 font-bold">4K Skin PBR Textures</span>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-32 flex items-center justify-center">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl transition-transform duration-500 hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #a78bfa30, #ec489920)',
                    border: '1.5px solid #a78bfa80',
                    boxShadow: '0 0 30px rgba(167, 139, 250, 0.25)',
                  }}
                >
                  <TbUser className="w-12 h-12 text-[#a78bfa]" />
                </div>
                <div className="absolute bottom-1 px-2.5 py-0.5 rounded-full bg-black/60 text-[10px] font-mono text-zinc-300 border border-white/10">
                  Game-Ready FK/IK Rigged Mesh
                </div>
              </div>
            )}
          </div>
        )}

        {isSpring && (
          <div className="w-full h-full flex flex-col justify-center">
            {viewMode === 'wireframe' ? (
              <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                <div className="p-2 rounded bg-black/40 border border-white/10 text-cyan-300">
                  <div className="font-bold">API GATEWAY</div>
                  <div className="text-[9px] text-zinc-400 mt-1">Rate Limiting · SSL</div>
                </div>
                <div className="p-2 rounded bg-purple-950/40 border border-purple-500/40 text-purple-300">
                  <div className="font-bold">SPRING BOOT 3</div>
                  <div className="text-[9px] text-zinc-400 mt-1">JWT Security · RBAC</div>
                </div>
                <div className="p-2 rounded bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                  <div className="font-bold">POSTGRESQL</div>
                  <div className="text-[9px] text-zinc-400 mt-1">HikariCP Pool</div>
                </div>
              </div>
            ) : viewMode === 'inspect' ? (
              <div className="bg-black/50 rounded-lg p-2.5 font-mono text-[11px] text-zinc-300 space-y-1">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">p99 Latency:</span>
                  <span className="text-emerald-400 font-bold">14ms across endpoints</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Auth Mechanism:</span>
                  <span className="text-cyan-300 font-bold">Stateless JWT + Refresh Rotation</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">CI/CD Automation:</span>
                  <span className="text-purple-300 font-bold">GitHub Actions Multi-Stage Docker</span>
                </div>
              </div>
            ) : (
              <div className="w-full text-left font-mono text-[11px] sm:text-xs leading-relaxed text-zinc-300 bg-black/45 rounded-lg p-3 shadow-inner">
                <div className="text-zinc-500">// Spring Boot Microservice Controller</div>
                <div className="text-purple-300">
                  <span className="text-cyan-400">@RestController</span>
                  <br />
                  <span className="text-cyan-400">@PreAuthorize</span>("hasRole('ARCHITECT')")
                </div>
                <div className="text-zinc-400 mt-1">
                  ResponseEntity&lt;ClusterHealth&gt; <span className="text-sky-300">verifyStatus</span>() {'{'}
                  <br />
                  &nbsp;&nbsp;return ok(service.<span className="text-amber-300">getTelemetry</span>());
                  <br />
                  {'}'}
                </div>
              </div>
            )}
          </div>
        )}

        {isGame && !isEnv && !isChar && (
          <div className="w-full h-full flex flex-col justify-center">
            {viewMode === 'inspect' ? (
              <div className="bg-black/50 rounded-lg p-2.5 font-mono text-[11px] text-zinc-300 space-y-1">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Tick Rate:</span>
                  <span className="text-emerald-400 font-bold">60Hz FixedUpdate</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-zinc-400">Input Buffer:</span>
                  <span className="text-cyan-300 font-bold">4-Frame Lenient Queue</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">FSM Combat Architecture:</span>
                  <span className="text-pink-300 font-bold">Hierarchical State Machine</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center p-3"
                  style={{
                    background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                    border: `1px solid ${accent}80`,
                    boxShadow: `0 0 24px ${accent}35`,
                  }}
                >
                  <TbDeviceGamepad2 className="w-8 h-8" style={{ color: accent }} />
                </div>
                <span className="text-xs text-zinc-200 font-mono tracking-wider font-semibold">
                  CHRONO RIFT COMBAT CONTROLLER
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  Unity 6 · Custom HLSL Shaders · Procedural Arenas
                </span>
              </div>
            )}
          </div>
        )}

        {!is3D && !isSpring && !isGame && (
          <div className="w-full bg-black/45 rounded-lg p-3 font-mono text-[11px] text-zinc-300">
            <div className="text-zinc-500">// {project.label} Telemetry & Architecture</div>
            <div className="text-cyan-300 mt-1">Platform: {project.technologies.slice(0, 4).join(' · ')}</div>
            <div className="text-emerald-300 mt-1">Status: {project.status} ({project.year})</div>
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="flex items-center justify-between text-[10px] text-zinc-400 relative z-10 font-mono pt-2 border-t border-white/10">
        <span className="truncate">Active Stack: {project.technologies.slice(0, 3).join(' · ')}</span>
        <span className="text-emerald-400 flex items-center gap-1.5 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          Hardware Accelerated
        </span>
      </div>
    </div>
  );
};

/* ── Performant Image Showcase & Lightbox ───────────────────────────── */
interface ImageShowcaseProps {
  project: Project;
  accent: string;
}

const ImageShowcase: React.FC<ImageShowcaseProps> = ({ project, accent }) => {
  const images = project.images;
  const n = images.length;
  const [idx, setIdx] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Handle keyboard events when lightbox is open
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

  const currentSrc = images[idx];

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
        {/* Shimmer skeleton before image loads */}
        {!isLoaded && (
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'linear-gradient(90deg, #242232 0%, #2f2c42 50%, #242232 100%)',
            }}
          />
        )}

        {/* High performance image with async decoding and layout containment */}
        <img
          key={currentSrc}
          src={currentSrc}
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

        {/* Expand / Lightbox Zoom Button */}
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

        {/* Multi-image carousel controls */}
        {n > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsLoaded(false);
                setIdx((i) => (i - 1 + n) % n);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-zinc-900 bg-white/90 hover:bg-white backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label="Previous image"
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
              aria-label="Next image"
            >
              <TbChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Slide Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-md shadow-md">
              {images.map((_, dotIdx) => (
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
                  aria-label={`Jump to image ${dotIdx + 1}`}
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

          {/* Centered Image with smooth scale */}
          <div
            className="relative max-w-5xl max-h-[82vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentSrc}
              alt={`${project.label} high resolution preview`}
              className="max-w-full max-h-[82vh] rounded-xl object-contain shadow-2xl"
              decoding="async"
            />

            {n > 1 && (
              <>
                <button
                  onClick={() => setIdx((i) => (i - 1 + n) % n)}
                  className="absolute left-1 sm:-left-12 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center backdrop-blur-md transition-all cursor-pointer shadow-lg"
                  aria-label="Previous"
                >
                  <TbChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button
                  onClick={() => setIdx((i) => (i + 1) % n)}
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
  // On mobile screens, always use vertical column to prevent squishing the layout
  const useRowLayout = isPortrait && !isMobile;

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
      {useRowLayout ? (
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
