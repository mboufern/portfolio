import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useScoreToasts } from '../blogGameStore';

interface ScoreToastOverlayProps {
  isHeaderMinimized?: boolean;
}

const SCORE_GREEN = '#103820ff';
const SUBTITLE_GREEN = '#15803d';

const SCORE_SHADOW =
  '0 2px 0 rgba(255, 255, 255, 0.82), 0 4px 14px rgba(0, 0, 0, 0.28), 0 8px 24px rgba(21, 154, 74, 0.36)';
const SUBTITLE_SHADOW =
  '0 1px 0 rgba(255, 255, 255, 0.85), 0 2px 10px rgba(0, 0, 0, 0.22)';

export const ScoreToastOverlay: React.FC<ScoreToastOverlayProps> = ({
  isHeaderMinimized = false,
}) => {
  const toasts = useScoreToasts();

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-[60] pointer-events-none flex flex-col items-center gap-2 w-[max-content] max-w-[92vw] transition-[top] duration-300 ease-out ${isHeaderMinimized ? 'top-[128px] sm:top-[78px]' : 'top-5 sm:top-6'
        }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center select-none px-2 py-0.5"
          >
            <div className="flex items-baseline gap-2.5">
              <span
                className="text-2xl sm:text-3xl md:text-[34px] font-black tracking-tight leading-tight"
                style={{
                  fontFamily: 'Archivo Black, sans-serif',
                  color: SCORE_GREEN,
                  textShadow: SCORE_SHADOW,
                }}
              >
                {toast.title}
              </span>
              {toast.points !== null && toast.points > 0 && (
                <span
                  className="font-mono tabular-nums text-2xl sm:text-3xl md:text-[34px] font-black leading-tight"
                  style={{
                    color: SCORE_GREEN,
                    textShadow: SCORE_SHADOW,
                  }}
                >
                  +{toast.points}
                </span>
              )}
            </div>

            {toast.subtitle && (
              <span
                className="mt-0.5 text-xs sm:text-sm font-mono font-bold tracking-wide leading-tight"
                style={{
                  color: SUBTITLE_GREEN,
                  textShadow: SUBTITLE_SHADOW,
                }}
              >
                {toast.subtitle}
              </span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
