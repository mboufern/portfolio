import React, { useState, useEffect } from 'react';
import type { Project, ProjectSection as IProjectSection } from '../data/portfolioData';

interface ImageCarouselProps {
  images: string[];
  accent: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, accent }) => {
  const [idx, setIdx] = useState(0);
  const n = images.length;

  useEffect(() => {
    setIdx(0);
  }, [images]);

  if (n === 0) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-2 p-6"
        style={{
          background: '#f0eff6',
          border: '1.5px dashed #d8d5e8',
          borderRadius: 14,
          color: '#9895aa',
          fontSize: '0.75rem',
          letterSpacing: '0.08em',
          fontFamily: 'Archivo Black, sans-serif',
          textAlign: 'center',
        }}
      >
        <span className="material-symbols-rounded" style={{ fontSize: 36, color: '#b4afc8' }}>
          image
        </span>
        <span>Screenshots Coming Soon</span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 14,
        width: '100%',
        height: '100%',
        background: '#e8e6f0',
      }}
    >
      <img
        src={images[idx]}
        alt="Project visual"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
      {n > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + n) % n)}
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              border: `1px solid ${accent}44`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % n)}
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              border: `1px solid ${accent}44`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              outline: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

const CardBody: React.FC<{ project: Project; accent: string }> = ({ project, accent }) => (
  <>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
      <h3 style={{ margin: 0, color: '#1c1b20', fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)', lineHeight: 1.1 }}>
        {project.label}
      </h3>
      <span
        style={{
          padding: '4px 12px',
          borderRadius: 999,
          fontSize: '0.65rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          background: `${project.statusColor}18`,
          color: project.statusColor,
          border: `1px solid ${project.statusColor}44`,
          flexShrink: 0,
        }}
      >
        {project.status}
      </span>
      <span style={{ color: '#9895aa', fontSize: '0.8rem', flexShrink: 0 }}>{project.year}</span>
    </div>
    <p
      style={{
        color: '#6b6880',
        fontSize: '0.92rem',
        lineHeight: 1.8,
        marginBottom: 20,
        marginTop: 0,
        flex: 1,
      }}
    >
      {project.description}
    </p>
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {project.technologies.map((t) => (
        <span
          key={t}
          style={{
            padding: '5px 14px',
            borderRadius: 999,
            background: `${accent}14`,
            border: `1px solid ${accent}33`,
            color: accent,
            fontSize: '0.7rem',
            letterSpacing: '0.03em',
          }}
        >
          {t}
        </span>
      ))}
    </div>
  </>
);

const ProjectCard: React.FC<{ project: Project; accent: string }> = ({ project, accent }) => {
  const isPortrait = project.imageLayout === 'portrait';
  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        background: '#ffffff',
        borderRadius: 22,
        border: `1px solid ${accent}26`,
        boxShadow: `0 6px 32px rgba(0,0,0,0.06), 0 0 0 1px ${accent}15`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: isPortrait ? 'row' : 'column',
        animation: 'fade-in-up 0.3s ease forwards',
      }}
    >
      {isPortrait ? (
        <>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <CardBody project={project} accent={accent} />
          </div>
          <div style={{ width: 280, flexShrink: 0, padding: '18px 18px 18px 0', background: '#f7f6fb' }}>
            <ImageCarousel images={project.images} accent={accent} />
          </div>
        </>
      ) : (
        <>
          <div style={{ height: 210, flexShrink: 0 }}>
            <ImageCarousel images={project.images} accent={accent} />
          </div>
          <div
            style={{
              flex: 1,
              minHeight: 0,
              padding: '24px 32px',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            <CardBody project={project} accent={accent} />
          </div>
        </>
      )}
    </div>
  );
};

interface ProjectSectionProps {
  section: IProjectSection;
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({ section }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div
      className="w-full h-full relative flex flex-col"
      style={{
        padding: '80px 8vw 32px',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      {/* Decorative ambient background blob */}
      <div
        style={{
          position: 'absolute',
          width: 550,
          height: 550,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${section.accent} 0%, transparent 68%)`,
          top: -200,
          right: -150,
          opacity: 0.08,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            margin: '0 0 6px',
            color: section.accent,
          }}
        >
          {section.sublabel}
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            color: '#1c1b20',
            margin: '0 0 16px',
            lineHeight: 1.1,
          }}
        >
          {section.label}
        </h2>

        {/* Project Icon Selector Row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
          {section.projects.map((p, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={p.id}
                onClick={() => setActiveIdx(i)}
                title={p.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: isActive ? 8 : 0,
                  height: 44,
                  width: isActive ? 'auto' : 44,
                  maxWidth: isActive ? 260 : 44,
                  overflow: 'hidden',
                  padding: isActive ? '0 18px 0 12px' : '0',
                  justifyContent: 'center',
                  borderRadius: 999,
                  border: `1.5px solid ${isActive ? section.accent : 'rgba(180,175,200,0.45)'}`,
                  background: isActive ? `${section.accent}18` : 'rgba(255,255,255,0.85)',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: isActive ? `0 0 18px ${section.accent}35` : '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  className="material-symbols-rounded"
                  style={{
                    fontSize: 22,
                    flexShrink: 0,
                    color: isActive ? section.accent : 'rgba(140,135,165,0.85)',
                    transition: 'color 0.3s ease',
                    lineHeight: 1,
                    userSelect: 'none',
                  }}
                >
                  {p.icon}
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontFamily: 'Archivo Black, sans-serif',
                    color: section.accent,
                    maxWidth: isActive ? 200 : 0,
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

        {/* Selected Project Card */}
        <ProjectCard project={section.projects[activeIdx]} accent={section.accent} />
      </div>
    </div>
  );
};
