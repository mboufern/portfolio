import React, { useState } from 'react';
import {
  FaGithub,
  FaLinkedinIn,
  FaInstagram,
  FaXTwitter,
  FaItchIo,
} from 'react-icons/fa6';
import { SiLeetcode } from 'react-icons/si';
import {
  TbMail,
  TbCopy,
  TbCheck,
  TbArrowUpRight,
} from 'react-icons/tb';
import { PERSONAL_INFO, SOCIALS, type SocialLink } from '../data/portfolioData';

const getSocialIcon = (iconName: string) => {
  const norm = iconName.trim().toLowerCase();
  switch (norm) {
    case 'github':
      return <FaGithub className="w-5 h-5" />;
    case 'linkedin':
      return <FaLinkedinIn className="w-5 h-5" />;
    case 'instagram':
      return <FaInstagram className="w-5 h-5" />;
    case 'itch':
    case 'itch.io':
      return <FaItchIo className="w-5 h-5" />;
    case 'leetcode':
      return <SiLeetcode className="w-5 h-5" />;
    case 'x':
    case 'twitter':
      return <FaXTwitter className="w-5 h-5" />;
    default:
      return <FaGithub className="w-5 h-5" />;
  }
};

export const ConnectSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PERSONAL_INFO.email);
    } catch {
      // Fallback
    }
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  return (
    <div className="min-h-[100dvh] w-full relative flex flex-col justify-center overflow-x-hidden px-6 sm:px-10 md:px-14 pt-12 sm:pt-20 pb-24 sm:pb-16 bg-[#f8f7fc]">
      {/* Background ambient lighting */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none -bottom-40 -left-24 opacity-25"
        style={{
          background: 'radial-gradient(circle, #15cea9 0%, transparent 68%)',
          filter: 'blur(90px)',
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none -top-28 -right-24 opacity-20"
        style={{
          background: 'radial-gradient(circle, #a78bfa 0%, transparent 68%)',
          filter: 'blur(95px)',
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col justify-center my-auto">
        {/* Section Headline */}
        <div className="mb-6 md:mb-8 text-left">
          <h2
            className="text-zinc-900 font-black tracking-tight leading-[1.08] m-0"
            style={{
              fontFamily: 'Archivo Black, sans-serif',
              fontSize: 'clamp(2.1rem, 4.2vw, 3.8rem)',
            }}
          >
            Let's connect.
          </h2>

          <p className="text-zinc-600 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mt-2.5 mb-0">
            Always open to discussing software architecture, real-time game systems, and creative technology. Have a technical question or an intriguing project? Reach out anytime.
          </p>
        </div>

        {/* Direct Contact Email Hub */}
        <div className="mb-6">
          {/* Email Hub Card */}
          <div className="bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(21,206,169,0.12)] hover:border-[#15cea9]/60 transition-all duration-300 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#15cea9]">
                  <TbMail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono tracking-wider text-zinc-400 block font-semibold">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="text-zinc-900 font-bold text-sm sm:text-base hover:text-[#15cea9] transition-colors"
                  >
                    {PERSONAL_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="platform-cta-btn flex-1 py-2.5 px-3 rounded-xl text-white text-xs font-semibold flex items-center justify-center gap-1.5 no-underline"
                style={
                  {
                    background: 'linear-gradient(135deg, #18181b 0%, #0d9488 100%)',
                    ['--cta-glow' as string]: 'rgba(21, 206, 169, 0.5)',
                  } as React.CSSProperties
                }
              >
                <TbMail className="w-4 h-4" />
                <span>Send Email</span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border ${copiedEmail
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}
                aria-label="Copy email address"
              >
                {copiedEmail ? <TbCheck className="w-4 h-4 text-emerald-600" /> : <TbCopy className="w-4 h-4 text-zinc-500" />}
                <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Channels Grid (6 Verified Links) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5">
          {SOCIALS.map((social: SocialLink) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              style={{
                textDecoration: 'none',
              }}
            >
              <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 0 1.5px ${social.color}66, 0 12px 30px ${social.color}28`,
                }}
              />
              <div className="relative z-10 flex items-center justify-between gap-2 mb-2.5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: social.color,
                    boxShadow: `0 4px 14px ${social.color}45`,
                  }}
                >
                  {getSocialIcon(social.icon)}
                </div>
                <TbArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="relative z-10">
                <div className="font-bold text-zinc-900 text-xs sm:text-sm group-hover:text-black">
                  {social.name}
                </div>
                <div className="text-[11px] text-zinc-500 font-mono truncate">
                  {social.handle || social.name}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
