import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TbRotate } from 'react-icons/tb';
import { useBlogGameScore } from '../blogGameStore';
import { ResetScoreModal } from './ResetScoreModal';

interface BlogScoreHudProps {
  compact?: boolean;
  className?: string;
}

export const BlogScoreHud: React.FC<BlogScoreHudProps> = ({
  compact = false,
  className = '',
}) => {
  const { score, resetGame } = useBlogGameScore();
  const [displayScore, setDisplayScore] = useState(score);
  const [popNonce, setPopNonce] = useState(0);
  const [isResetOpen, setIsResetOpen] = useState(false);

  const prevScoreRef = useRef(score);
  const currentDisplayRef = useRef(score);

  useEffect(() => {
    currentDisplayRef.current = displayScore;
  }, [displayScore]);

  useEffect(() => {
    const prev = prevScoreRef.current;
    prevScoreRef.current = score;

    if (score === prev) return;

    if (score <= 0 || score < currentDisplayRef.current) {
      setDisplayScore(score);
      return;
    }

    setPopNonce((n) => n + 1);

    const from = currentDisplayRef.current;
    const delta = score - from;
    const duration = 320;
    const startTime = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const nextValue = Math.round(from + delta * eased);
      setDisplayScore(nextValue);
      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [score]);

  const formattedScore = String(displayScore).padStart(4, '0');

  return (
    <>
      <div
        className={`group/score inline-flex items-baseline gap-1.5 select-none shrink-0 ${className}`}
      >
        <span
          className={`uppercase tracking-[0.14em] font-semibold text-zinc-600 ${
            compact ? 'text-[10px]' : 'text-[11px] sm:text-xs'
          }`}
        >
          Score
        </span>

        <motion.span
          key={popNonce}
          initial={popNonce > 0 ? { y: -3, scale: 1.08 } : false}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={`font-mono tabular-nums font-bold tracking-tight text-zinc-900 ${
            compact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
          }`}
          aria-live="polite"
          aria-label={`Score ${formattedScore}`}
        >
          {formattedScore}
        </motion.span>

        <button
          type="button"
          onClick={() => setIsResetOpen(true)}
          aria-label="Reset score and progress"
          title="Reset score"
          className={`score-reset-btn inline-flex items-center justify-center self-center rounded-md text-zinc-500 hover:text-[#d92638] active:text-[#b91c2c] transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d92638]/50 ${
            compact ? 'w-5 h-5' : 'w-6 h-6'
          } opacity-100 pointer-events-auto sm:opacity-0 sm:pointer-events-none sm:group-hover/score:opacity-100 sm:group-hover/score:pointer-events-auto sm:group-focus-within/score:opacity-100 sm:group-focus-within/score:pointer-events-auto`}
        >
          <TbRotate className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </button>
      </div>

      <ResetScoreModal
        isOpen={isResetOpen}
        score={score}
        onCancel={() => setIsResetOpen(false)}
        onConfirm={() => {
          resetGame();
          setIsResetOpen(false);
        }}
      />
    </>
  );
};
