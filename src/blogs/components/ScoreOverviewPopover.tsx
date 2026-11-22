import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TbCheck, TbLock, TbX } from 'react-icons/tb';
import { BLOG_POSTS } from '../registry';
import {
  ARTICLE_OPEN_POINTS,
  ARTICLE_READ_POINTS,
  summarizeScoreProgress,
} from '../scoreCatalog';

interface ScoreOverviewPopoverProps {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
  score: number;
  completedActions: readonly string[];
  onClose: () => void;
}

interface PopoverGeometry {
  width: number;
  left: number;
  caretLeft: number;
  placement: 'bottom' | 'top';
  top?: number;
  bottom?: number;
  maxHeight: number;
}

function computePopoverGeometry(anchorEl: HTMLElement | null): PopoverGeometry {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
  const width = Math.min(348, Math.max(260, vw - 24));

  if (!anchorEl) {
    return {
      width,
      left: Math.round((vw - width) / 2),
      caretLeft: Math.round(width / 2),
      placement: 'bottom',
      top: 72,
      maxHeight: Math.max(220, Math.min(460, vh - 96)),
    };
  }

  const rect = anchorEl.getBoundingClientRect();
  const rawLeft = rect.left + rect.width / 2 - width / 2;
  const left = Math.max(12, Math.min(vw - width - 12, rawLeft));
  const caretLeft = Math.max(
    18,
    Math.min(width - 18, rect.left + rect.width / 2 - left)
  );

  const spaceBelow = vh - rect.bottom - 18;
  const spaceAbove = rect.top - 18;
  const placement: 'bottom' | 'top' =
    spaceBelow < 240 && spaceAbove > spaceBelow ? 'top' : 'bottom';

  if (placement === 'top') {
    const bottom = vh - rect.top + 10;
    const maxHeight = Math.max(200, Math.min(460, spaceAbove - 8));
    return { width, left, caretLeft, placement, bottom, maxHeight };
  }

  const top = rect.bottom + 10;
  const maxHeight = Math.max(200, Math.min(460, spaceBelow - 8));
  return { width, left, caretLeft, placement, top, maxHeight };
}

export const ScoreOverviewPopover: React.FC<ScoreOverviewPopoverProps> = ({
  isOpen,
  anchorEl,
  score,
  completedActions,
  onClose,
}) => {
  const titleId = useId();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [, setViewportTick] = useState(0);

  const summary = useMemo(
    () => summarizeScoreProgress(completedActions, BLOG_POSTS),
    [completedActions]
  );

  useEffect(() => {
    if (!isOpen) return;

    const focusTimer = window.setTimeout(() => {
      closeBtnRef.current?.focus({ preventScroll: true });
    }, 30);

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (popoverRef.current?.contains(target)) return;
      if (anchorEl?.contains(target)) return;
      onClose();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        anchorEl?.focus?.({ preventScroll: true });
      }
    };

    const handleReposition = () => {
      setViewportTick((t) => t + 1);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleReposition, { passive: true });
    window.addEventListener('scroll', handleReposition, { passive: true });

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition);
    };
  }, [isOpen, anchorEl, onClose]);

  if (typeof document === 'undefined') {
    return null;
  }

  const geometry = isOpen ? computePopoverGeometry(anchorEl) : null;
  const formattedScore = String(score).padStart(4, '0');

  return createPortal(
    <AnimatePresence>
      {isOpen && geometry && (
        <motion.div
          ref={popoverRef}
          key="score-overview-popover"
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          initial={{
            opacity: 0,
            y: geometry.placement === 'bottom' ? -6 : 6,
            scale: 0.97,
          }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{
            opacity: 0,
            y: geometry.placement === 'bottom' ? -4 : 4,
            scale: 0.98,
          }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="fixed z-[90]"
          style={{
            width: `${geometry.width}px`,
            left: `${geometry.left}px`,
            top: geometry.top !== undefined ? `${geometry.top}px` : undefined,
            bottom:
              geometry.bottom !== undefined ? `${geometry.bottom}px` : undefined,
          }}
        >
          {/* Caret pointing toward Score trigger */}
          <span
            aria-hidden="true"
            className={`absolute w-3 h-3 rotate-45 bg-[#f9f6ee] border-zinc-900/15 z-10 ${
              geometry.placement === 'bottom'
                ? '-top-1.5 border-l border-t'
                : '-bottom-1.5 border-r border-b'
            }`}
            style={{ left: `${geometry.caretLeft - 6}px` }}
          />

          <div className="relative rounded-2xl bg-[#f9f6ee] border border-zinc-900/15 shadow-[0_20px_50px_rgba(24,24,27,0.18)] overflow-hidden text-zinc-900">
            <div
              className="pointer-events-none absolute inset-0 playing-card-dither-grain opacity-20"
              aria-hidden="true"
            />

            <div
              className="relative z-10 overflow-y-auto p-4 sm:p-4"
              style={{ maxHeight: `${geometry.maxHeight}px` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-zinc-900/10">
                <div className="flex items-baseline gap-2.5">
                  <h2
                    id={titleId}
                    className="text-sm sm:text-base font-black tracking-tight text-zinc-950 m-0"
                    style={{ fontFamily: 'Archivo Black, sans-serif' }}
                  >
                    Score Overview
                  </h2>
                  <span className="font-mono tabular-nums text-xs font-bold text-zinc-700">
                    {formattedScore} pts
                  </span>
                </div>

                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={() => {
                    onClose();
                    anchorEl?.focus?.({ preventScroll: true });
                  }}
                  aria-label="Close score overview"
                  className="inline-flex items-center justify-center w-6 h-6 rounded-md text-zinc-600 hover:text-zinc-950 hover:bg-zinc-900/[0.07] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/40"
                >
                  <TbX className="w-4 h-4" />
                </button>
              </div>

              {/* Combinations Section */}
              <section className="mt-3.5" aria-label="Card Combinations">
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-700 m-0">
                    Combinations
                  </h3>
                  <span className="text-[11px] font-mono tabular-nums font-semibold text-zinc-600">
                    {summary.unlockedComboCount}/{summary.totalComboTypes} unlocked · +
                    {summary.comboPoints} pts
                  </span>
                </div>

                <div className="space-y-1.5">
                  {summary.combos.map((combo) => {
                    const hasTraitChips =
                      combo.unlockedTraits.length > 0 ||
                      combo.lockedTraits.length > 0;

                    return (
                      <div
                        key={combo.type}
                        className={`rounded-xl px-2.5 py-2 border transition-colors ${
                          combo.isUnlocked
                            ? 'bg-emerald-950/[0.04] border-emerald-800/20'
                            : 'bg-zinc-900/[0.025] border-zinc-900/[0.08]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 min-w-0">
                            <span
                              className={`mt-0.5 shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full ${
                                combo.isUnlocked
                                  ? 'bg-[#15803d]/[0.12] text-[#15803d]'
                                  : 'bg-zinc-900/[0.06] text-zinc-500'
                              }`}
                              aria-hidden="true"
                            >
                              {combo.isUnlocked ? (
                                <TbCheck className="w-3 h-3" />
                              ) : (
                                <TbLock className="w-2.5 h-2.5" />
                              )}
                            </span>

                            <div className="min-w-0">
                              <div
                                className={`text-xs font-bold leading-snug ${
                                  combo.isUnlocked
                                    ? 'text-zinc-950'
                                    : 'text-zinc-700'
                                }`}
                              >
                                {combo.label}
                              </div>
                              <div className="text-[11px] text-zinc-600 leading-tight mt-0.5">
                                {combo.rule}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 text-right font-mono tabular-nums leading-tight">
                            {combo.isUnlocked ? (
                              <>
                                <span className="text-xs font-bold text-[#15803d]">
                                  +{combo.earnedPoints}
                                </span>
                                {combo.earnedPoints > combo.points && (
                                  <div className="text-[10px] text-zinc-600">
                                    +{combo.points} ea
                                  </div>
                                )}
                              </>
                            ) : (
                              <span className="text-[11px] font-semibold text-zinc-600">
                                +{combo.points}
                              </span>
                            )}
                          </div>
                        </div>

                        {hasTraitChips && (
                          <div className="mt-1.5 pl-6 flex flex-wrap gap-1">
                            {combo.unlockedTraits.map((trait) => (
                              <span
                                key={`u-${trait}`}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-[#15803d]/10 text-[#15803d]"
                              >
                                <TbCheck className="w-2.5 h-2.5 shrink-0" />
                                <span>{trait}</span>
                              </span>
                            ))}
                            {combo.lockedTraits.map((trait) => (
                              <span
                                key={`l-${trait}`}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-medium bg-zinc-900/[0.045] text-zinc-600"
                              >
                                <TbLock className="w-2.5 h-2.5 shrink-0 opacity-75" />
                                <span>{trait}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Articles Section */}
              <section
                className="mt-4 pt-3.5 border-t border-zinc-900/10"
                aria-label="Article Reading Progress"
              >
                <div className="flex items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-700 m-0">
                    Articles
                  </h3>
                  <span className="text-[11px] font-mono tabular-nums font-semibold text-zinc-600">
                    +{summary.articlePoints} pts
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                  <div className="rounded-xl px-2.5 py-1.5 bg-zinc-900/[0.03] border border-zinc-900/[0.08]">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                      Opened (+{ARTICLE_OPEN_POINTS})
                    </div>
                    <div className="mt-0.5 flex items-baseline justify-between font-mono tabular-nums">
                      <span className="text-xs font-bold text-zinc-900">
                        {summary.openedCount}/{summary.totalArticles}
                      </span>
                      <span className="text-[11px] font-semibold text-[#15803d]">
                        +{summary.openedPoints}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl px-2.5 py-1.5 bg-zinc-900/[0.03] border border-zinc-900/[0.08]">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                      Read (+{ARTICLE_READ_POINTS})
                    </div>
                    <div className="mt-0.5 flex items-baseline justify-between font-mono tabular-nums">
                      <span className="text-xs font-bold text-zinc-900">
                        {summary.finishedCount}/{summary.publishedCount}
                      </span>
                      <span className="text-[11px] font-semibold text-[#15803d]">
                        +{summary.finishedPoints}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {summary.publishedArticles.map((article) => (
                    <div
                      key={article.slug}
                      className="flex items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 bg-zinc-900/[0.025] border border-zinc-900/[0.07]"
                    >
                      <span className="text-[11px] font-semibold text-zinc-800 truncate min-w-0">
                        {article.title}
                      </span>
                      <div className="flex items-center gap-1 shrink-0 font-mono tabular-nums">
                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            article.opened
                              ? 'bg-[#15803d]/10 text-[#15803d]'
                              : 'bg-zinc-900/[0.05] text-zinc-600'
                          }`}
                          title={`Open article (+${ARTICLE_OPEN_POINTS})`}
                        >
                          {article.opened ? (
                            <TbCheck className="w-2.5 h-2.5" />
                          ) : (
                            <TbLock className="w-2.5 h-2.5 opacity-75" />
                          )}
                          <span>+{ARTICLE_OPEN_POINTS}</span>
                        </span>

                        <span
                          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            article.finished
                              ? 'bg-[#15803d]/10 text-[#15803d]'
                              : 'bg-zinc-900/[0.05] text-zinc-600'
                          }`}
                          title={`Finish reading article (+${ARTICLE_READ_POINTS})`}
                        >
                          {article.finished ? (
                            <TbCheck className="w-2.5 h-2.5" />
                          ) : (
                            <TbLock className="w-2.5 h-2.5 opacity-75" />
                          )}
                          <span>+{ARTICLE_READ_POINTS}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
