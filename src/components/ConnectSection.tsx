import React, { useState } from 'react';
import { PERSONAL_INFO, SOCIALS } from '../data/portfolioData';

export const ConnectSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
    } catch {
      // Fallback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      className="w-full h-full relative flex flex-col justify-center"
      style={{
        padding: '80px 8vw 48px',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: 580,
          height: 580,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #15cea9 0%, transparent 68%)',
          bottom: -200,
          left: -120,
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
          justifyContent: 'center',
        }}
      >
        <p
          style={{
            fontSize: '0.72rem',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            margin: '0 0 6px',
            color: '#15cea9',
          }}
        >
          Reach Out
        </p>
        <h2
          style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
            color: '#1c1b20',
            margin: '0 0 20px',
            lineHeight: 1.1,
          }}
        >
          Connect
        </h2>

        {/* Email with copy button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36, flexWrap: 'wrap' }}>
          <span
            style={{
              color: '#1c1b20',
              fontSize: 'clamp(0.95rem, 1.8vw, 1.2rem)',
              background: '#ffffff',
              border: '1.5px solid #e2dff0',
              padding: '12px 24px',
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            {PERSONAL_INFO.email}
          </span>
          <button className={`me-copy-btn ${copied ? 'copied' : ''}`} onClick={copyEmail}>
            {copied ? 'Copied to Clipboard!' : 'Copy Email'}
          </button>
        </div>

        {/* Social Links as 3D Rolling Cubes */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 28,
          }}
        >
          {SOCIALS.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="button-icon"
              style={{ '--cube-color': s.color } as React.CSSProperties}
            >
              <div className="icon">
                <span className="material-symbols-rounded" style={{ color: s.color }}>
                  {s.icon}
                </span>
              </div>
              <div className="cube">
                <span className="side front">{s.name}</span>
                <span className="side top">Visit</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
