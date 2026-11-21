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
  TbMailOpened,
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

        {/* Compact Direct Contact Email Card (No full-width stretch, no "Direct Email" label) */}
        <div className="mb-7">
          <div className="group/email w-full sm:w-fit sm:min-w-[390px] max-w-md bg-white rounded-2xl p-4 sm:p-5 border-2 border-zinc-900/15 shadow-[0_6px_0_rgba(24,24,27,0.08)] hover:border-zinc-900 hover:shadow-[0_8px_0_#15cea9] transition-all duration-300 flex flex-col gap-4">
            <div className="flex items-center gap-3.5">
              {/* Animated Email Icon Badge: transitions from Mail to MailOpened on hover */}
              <div className="relative w-11 h-11 rounded-xl bg-zinc-900 text-[#15cea9] flex items-center justify-center shrink-0 overflow-hidden shadow-sm transition-transform duration-300 group-hover/email:scale-105">
                <TbMail className="w-5 h-5 transition-all duration-300 ease-out group-hover/email:-translate-y-7 group-hover/email:opacity-0 group-hover/email:scale-75" />
                <TbMailOpened className="w-5 h-5 absolute transition-all duration-300 ease-out translate-y-7 opacity-0 scale-75 group-hover/email:translate-y-0 group-hover/email:opacity-100 group-hover/email:scale-100" />
              </div>

              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="text-zinc-900 font-black text-sm sm:text-base md:text-lg tracking-tight hover:text-[#0fa68a] transition-colors truncate no-underline"
                style={{ fontFamily: 'Archivo Black, sans-serif' }}
              >
                {PERSONAL_INFO.email}
              </a>
            </div>

            <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-200/80">
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="group/btn platform-cta-btn px-5 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 no-underline shrink-0"
                style={
                  {
                    background: 'linear-gradient(135deg, #18181b 0%, #0d9488 100%)',
                    ['--cta-glow' as string]: 'rgba(21, 206, 169, 0.5)',
                  } as React.CSSProperties
                }
              >
                {/* Animated Button Icon: transitions from Mail to Paper Plane Send on hover */}
                <span className="relative w-4 h-4 inline-flex items-center justify-center overflow-hidden">
                  <TbMail className="w-4 h-4 transition-all duration-300 ease-out group-hover/btn:-translate-y-5 group-hover/btn:translate-x-3 group-hover/btn:opacity-0" />
                  <TbSend className="w-4 h-4 absolute transition-all duration-300 ease-out translate-y-5 -translate-x-3 opacity-0 group-hover/btn:translate-y-0 group-hover/btn:translate-x-0 group-hover/btn:opacity-100" />
                </span>
                <span>Send Email</span>
              </a>

              <button
                type="button"
                onClick={copyEmail}
                className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border-2 ${
                  copiedEmail
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-400'
                    : 'bg-zinc-50 hover:bg-zinc-900 hover:text-white text-zinc-800 border-zinc-900/15 hover:border-zinc-900'
                }`}
                aria-label="Copy email address"
              >
                {copiedEmail ? (
                  <TbCheck className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TbCopy className="w-4 h-4" />
                )}
                <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bold Channels Grid (6 Verified Links) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {SOCIALS.map((social: SocialLink) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative bg-white rounded-2xl p-4 sm:p-5 border-2 border-zinc-900/15 hover:border-zinc-900 shadow-[0_6px_0_rgba(24,24,27,0.08)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-[132px] sm:min-h-[152px] no-underline"
              style={
                {
                  ['--social-color' as string]: social.color,
                } as React.CSSProperties
              }
            >
              {/* Top Brand Accent Bar */}
              <div
                className="
                  absolute top-0 left-0 right-0 h-1.5 opacity-85 group-hover:h-2 transition-all duration-300
                "
                style={{ backgroundColor: social.color }}
                aria-hidden="true"
              />

              {/* Subtle Oversized Background Watermark Icon */}
              <div
                className="pointer-events-none absolute -right-4 -bottom-4 opacity-[0.05] group-hover:opacity-[0.11] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300"
                style={{ color: social.color }}
                aria-hidden="true"
              >
                {getSocialIcon(social.icon, 'w-24 h-24 sm:w-28 sm:h-28')}
              </div>

              {/* Hover Brand Border & Offset Shadow Accent */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 100% 0%, ${social.color}16 0%, transparent 70%)`,
                }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex items-start justify-between gap-2 mb-3.5 mt-1">
                <div
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white border-2 border-zinc-900/10 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{
                    backgroundColor: social.color,
                    boxShadow: `0 6px 16px ${social.color}40`,
                  }}
                >
                  {getSocialIcon(social.icon)}
                </div>

                <div className="w-8 h-8 rounded-lg border border-zinc-200 bg-zinc-50 group-hover:bg-zinc-900 group-hover:border-zinc-900 flex items-center justify-center transition-colors duration-300 shrink-0">
                  <TbArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>
              </div>

              <div className="relative z-10">
                <div
                  className="font-black text-zinc-900 text-sm sm:text-lg tracking-tight leading-snug group-hover:text-black"
                  style={{ fontFamily: 'Archivo Black, sans-serif' }}
                >
                  {social.name}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span
                    className="inline-block text-[11px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 group-hover:bg-zinc-900 group-hover:text-white transition-colors duration-300 truncate max-w-full"
                  >
                    {social.handle || social.name}
                  </span>
                </div>

                {social.category && (
                  <div className="hidden sm:block text-[11px] font-medium text-zinc-500 mt-1.5 truncate">
                    {social.category}
                  </div>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
