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
  TbSend,
  TbCopy,
  TbCheck,
  TbArrowUpRight,
} from 'react-icons/tb';
import { PERSONAL_INFO, SOCIALS, type SocialLink } from '../data/portfolioData';

const getSocialIcon = (iconName: string, className = 'w-5 h-5 sm:w-6 sm:h-6') => {
  const norm = iconName.trim().toLowerCase();
  switch (norm) {
    case 'github':
      return <FaGithub className={className} />;
    case 'linkedin':
      return <FaLinkedinIn className={className} />;
    case 'instagram':
      return <FaInstagram className={className} />;
    case 'itch':
    case 'itch.io':
      return <FaItchIo className={className} />;
    case 'leetcode':
      return <SiLeetcode className={className} />;
    case 'x':
    case 'twitter':
      return <FaXTwitter className={className} />;
    default:
      return <FaGithub className={className} />;
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
    <div className="min-h-[100dvh] w-full relative flex flex-col justify-center overflow-x-hidden px-5 sm:px-10 md:px-14 pt-12 sm:pt-20 pb-24 sm:pb-16 bg-[#f8f7fc]">
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

        {/* Direct Contact Email Hub (Compact width, luminous teal glow, animated icon) */}
        <div className="mb-6">
          <div className="group/email relative w-full sm:w-fit sm:min-w-[380px] max-w-md bg-white rounded-2xl p-5 border border-zinc-200/90 shadow-[0_6px_24px_rgba(0,0,0,0.05)] hover:shadow-[0_14px_38px_rgba(21,206,169,0.2)] hover:border-[#15cea9]/70 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            {/* Soft Ambient Teal Corner Glow */}
            <div
              className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 rounded-full opacity-25 group-hover/email:opacity-50 group-hover/email:scale-125 transition-all duration-500"
              style={{
                background: 'radial-gradient(circle, #15cea9 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex items-center gap-3.5 mb-4">
              {/* Animated Icon Container: morphs from Mail to Send plane on hover */}
              <div className="relative w-11 h-11 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#0fa68a] shrink-0 overflow-hidden transition-all duration-300 group-hover/email:bg-[#15cea9] group-hover/email:border-[#15cea9] group-hover/email:text-white group-hover/email:shadow-[0_6px_18px_rgba(21,206,169,0.45)]">
                <TbMail className="w-5 h-5 transition-all duration-300 ease-out group-hover/email:-translate-y-6 group-hover/email:translate-x-6 group-hover/email:opacity-0 group-hover/email:scale-75" />
                <TbSend className="w-5 h-5 absolute transition-all duration-300 ease-out translate-y-6 -translate-x-6 opacity-0 scale-75 group-hover/email:translate-y-0 group-hover/email:translate-x-0 group-hover/email:opacity-100 group-hover/email:scale-100" />
              </div>

              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="text-zinc-900 font-bold text-base sm:text-lg tracking-tight hover:text-[#15cea9] transition-colors truncate no-underline"
              >
                {PERSONAL_INFO.email}
              </a>
            </div>

            <div className="relative z-10 flex items-center gap-2.5 pt-3 border-t border-zinc-100">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="group/btn platform-cta-btn flex-1 py-2.5 px-5 rounded-xl text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2 no-underline"
                style={
                  {
                    background: 'linear-gradient(135deg, #18181b 0%, #0d9488 100%)',
                    ['--cta-glow' as string]: 'rgba(21, 206, 169, 0.5)',
                  } as React.CSSProperties
                }
              >
                <span className="relative w-4 h-4 inline-flex items-center justify-center overflow-hidden">
                  <TbMail className="w-4 h-4 transition-all duration-300 ease-out group-hover/btn:-translate-y-5 group-hover/btn:translate-x-4 group-hover/btn:opacity-0" />
                  <TbSend className="w-4 h-4 absolute transition-all duration-300 ease-out translate-y-5 -translate-x-4 opacity-0 group-hover/btn:translate-y-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
                </span>
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className={`py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                  copiedEmail
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200 hover:border-zinc-300'
                }`}
                aria-label="Copy email address"
              >
                {copiedEmail ? (
                  <TbCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TbCopy className="w-4 h-4 text-zinc-500" />
                )}
                <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bold Channels Grid (6 Verified Links) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3.5">
          {SOCIALS.map((social: SocialLink) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-zinc-200/90 shadow-[0_4px_14px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden no-underline"
            >
              {/* Glowing Brand Outline & Shadow on Hover */}
              <div
                className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  boxShadow: `inset 0 0 0 2px ${social.color}88, 0 12px 30px ${social.color}28`,
                }}
              />

              {/* Subtle Oversized Background Watermark Icon */}
              <div
                className="pointer-events-none absolute -right-3 -bottom-3 opacity-[0.045] group-hover:opacity-[0.1] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300"
                style={{ color: social.color }}
                aria-hidden="true"
              >
                {getSocialIcon(social.icon, 'w-20 h-20 sm:w-24 sm:h-24')}
              </div>

              <div className="relative z-10 flex items-center justify-between gap-2 mb-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: social.color,
                    boxShadow: `0 6px 16px ${social.color}45`,
                  }}
                >
                  {getSocialIcon(social.icon)}
                </div>
                <TbArrowUpRight className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>

              <div className="relative z-10">
                <div
                  className="font-black text-zinc-900 text-sm sm:text-base tracking-tight group-hover:text-black"
                  style={{ fontFamily: 'Archivo Black, sans-serif' }}
                >
                  {social.name}
                </div>
                <div className="text-xs text-zinc-600 font-mono font-bold truncate mt-0.5">
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
