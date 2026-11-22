import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TbRotate } from 'react-icons/tb';

interface ResetScoreModalProps {
  isOpen: boolean;
  score: number;
  completedCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ResetScoreModal: React.FC<ResetScoreModalProps> = ({
  isOpen,
  score,
  completedCount,
  onCancel,
  onConfirm,
}) => {
  const titleId = useId();
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const prevFocused = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => {
      cancelBtnRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      prevFocused?.focus?.();
    };
  }, [isOpen, onCancel]);

  if (typeof document === 'undefined') {
    return null;
  }

  const formattedScore = String(score).padStart(4, '0');

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="reset-score-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={onCancel}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/45 backdrop-blur-[3px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
        >
          <motion.div
            key="reset-score-dialog"
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl bg-[#f9f6ee] border border-zinc-900/15 shadow-[0_24px_64px_rgba(24,24,27,0.22)] overflow-hidden p-6 text-zinc-900"
          >
            <div
              className="pointer-events-none absolute inset-0 playing-card-dither-grain opacity-25"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#d92638]/10 text-[#d92638]">
                  <TbRotate className="w-4 h-4" />
                </span>
                <h2
                  id={titleId}
                  className="text-lg font-black tracking-tight text-zinc-950 m-0"
                  style={{ fontFamily: 'Archivo Black, sans-serif' }}
                >
                  Reset Score?
                </h2>
              </div>

              <p className="text-sm text-zinc-700 leading-relaxed m-0">
                This will reset your current score of{' '}
                <span className="font-mono tabular-nums font-bold text-zinc-950">
                  {formattedScore}
                </span>{' '}
              </p>

              <div className="mt-6 flex items-center justify-end gap-2.5">
                <button
                  ref={cancelBtnRef}
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-900/[0.06] border border-zinc-900/15 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-[#d92638] hover:bg-[#b91c2c] shadow-sm transition-colors cursor-pointer"
                >
                  Reset Score
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
