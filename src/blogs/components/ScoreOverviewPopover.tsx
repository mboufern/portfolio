import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BLOG_POSTS } from '../registry';
import { getCategoryIcon } from '../categoryMeta';
import { getCategorySuitColor } from '../cardDeck';
import type { BlogCategory } from '../types';
import { summarizeScoreProgress } from '../scoreCatalog';

interface ScoreOverviewPopoverProps {
  isOpen: boolean;
  anchorEl: HTMLElement | null;
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

interface OverviewRow {
  key: string;
  label: string;
  categories: BlogCategory[];
  accentColor: '#d92638' | '#18181b';
  unlocked: boolean;
  points: number;
}

const RED_CATEGORIES: BlogCategory[] = ['Game Dev', 'Art'];
const BLACK_CATEGORIES: BlogCategory[] = ['Software Architecture', 'Devlogs'];

function computePopoverGeometry(anchorEl: HTMLElement | null): PopoverGeometry {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 768;
  const width = Math.min(256, Math.max(224, vw - 24));

  if (!anchorEl) {
    return {
      width,
      left: Math.round((vw - width) / 2),
      caretLeft: Math.round(width / 2),
      placement: 'bottom',
      top: 72,
      maxHeight: Math.max(240, Math.min(440, vh - 96)),
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
    spaceBelow < 260 && spaceAbove > spaceBelow ? 'top' : 'bottom';

  if (placement === 'top') {
    return {
      width,
      left,
      caretLeft,
      placement,
      bottom: vh - rect.top + 10,
      maxHeight: Math.max(220, Math.min(440, spaceAbove - 8)),
    };
  }

  return {
    width,
    left,
    caretLeft,
    placement,
    top: rect.bottom + 10,
    maxHeight: Math.max(220, Math.min(440, spaceBelow - 8)),
  };
}

export const ScoreOverviewPopover: React.FC<ScoreOverviewPopoverProps> = ({
  isOpen,
  anchorEl,
  completedActions,
  onClose,
}) => {
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [, setViewportTick] = useState(0);

  const { rows, articlePoints } = useMemo(() => {
    const summary = summarizeScoreProgress(completedActions, BLOG_POSTS);
    const actionSet = new Set(completedActions);

    const catCounts = new Map<BlogCategory, number>();
    for (const post of BLOG_POSTS) {
      catCounts.set(
        post.meta.category,
        (catCounts.get(post.meta.category) ?? 0) + 1
      );
    }
    const playableCategories = Array.from(catCounts.entries())
      .filter(([, count]) => count >= 3)
      .map(([cat]) => cat);

    const builtRows: OverviewRow[] = [];

    // 1. Suit (Red & Black)
    builtRows.push({
      key: 'suit-red',
      label: 'Suit',
      categories: RED_CATEGORIES,
      accentColor: '#d92638',
      unlocked: actionSet.has('combo:suit:red'),
      points: 3,
    });
    builtRows.push({
      key: 'suit-black',
      label: 'Suit',
      categories: BLACK_CATEGORIES,
      accentColor: '#18181b',
      unlocked: actionSet.has('combo:suit:black'),
      points: 3,
    });

    // 2. Flush (per playable category)
    for (const category of playableCategories) {
      builtRows.push({
        key: `flush-${category}`,
        label: 'Flush',
        categories: [category],
        accentColor: getCategorySuitColor(category),
        unlocked: actionSet.has(`combo:flush:${category}`),
        points: 5,
      });
    }

    // 3. Straight
    const straightCount = completedActions.filter((a) =>
      a.startsWith('combo:straight:')
    ).length;
    builtRows.push({
      key: 'straight',
      label: 'Straight',
      categories: [],
      accentColor: '#18181b',
      unlocked: straightCount > 0,
      points: straightCount > 0 ? straightCount * 6 : 6,
    });

    // 4. Three of a Kind
    const threeCount = completedActions.filter((a) =>
      a.startsWith('combo:three-of-a-kind:')
    ).length;
    builtRows.push({
      key: 'three-of-a-kind',
      label: 'Three of a Kind',
      categories: [],
      accentColor: '#18181b',
      unlocked: threeCount > 0,
      points: threeCount > 0 ? threeCount * 7 : 7,
    });

    // 5. Straight Flush (per playable category)
    for (const category of playableCategories) {
      const prefix = `combo:straight-flush:${category}:`;
      const sfCount = completedActions.filter((a) => a.startsWith(prefix)).length;
      builtRows.push({
        key: `straight-flush-${category}`,
        label: 'Straight Flush',
        categories: [category],
        accentColor: getCategorySuitColor(category),
        unlocked: sfCount > 0,
        points: sfCount > 0 ? sfCount * 9 : 9,
      });
    }

    // 6. Royal Flush (per playable category)
    for (const category of playableCategories) {
      builtRows.push({
        key: `royal-flush-${category}`,
        label: 'Royal Flush',
        categories: [category],
        accentColor: getCategorySuitColor(category),
        unlocked: actionSet.has(`combo:royal-flush:${category}`),
        points: 10,
      });
    }

    return {
      rows: builtRows,
      articlePoints: summary.articlePoints,
    };
  }, [completedActions]);

  useEffect(() => {
    if (!isOpen) return;

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
  const hasArticlePoints = articlePoints > 0;

  return createPortal(
    <AnimatePresence>
      {isOpen && geometry && (
        <motion.div
          ref={popoverRef}
          key="score-overview-popover"
          role="dialog"
          aria-modal="false"
          aria-label="Score overview"
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
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
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
            className={`absolute w-2.5 h-2.5 rotate-45 bg-[#f9f6ee] border-zinc-900/15 z-10 ${
              geometry.placement === 'bottom'
                ? '-top-[5px] border-l border-t'
                : '-bottom-[5px] border-r border-b'
            }`}
            style={{ left: `${geometry.caretLeft - 5}px` }}
          />

          <div className="relative rounded-xl bg-[#f9f6ee] border border-zinc-900/15 shadow-[0_16px_40px_rgba(24,24,27,0.16)] overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 playing-card-dither-grain opacity-20"
              aria-hidden="true"
            />

            <div
              className="relative z-10 overflow-y-auto py-2.5 px-3.5 select-none"
              style={{ maxHeight: `${geometry.maxHeight}px` }}
            >
              <ul className="m-0 p-0 list-none space-y-1">
                {rows.map((row) => (
                  <li
                    key={row.key}
                    className={`flex items-center justify-between gap-3 py-0.5 text-xs leading-snug ${
                      row.unlocked ? 'text-zinc-950' : 'text-zinc-900/30'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 min-w-0">
                      <span className="font-semibold truncate">{row.label}</span>
                      {row.categories.length > 0 && (
                        <span
                          className="inline-flex items-center gap-1 shrink-0"
                          style={{
                            color: row.unlocked
                              ? row.accentColor
                              : row.accentColor === '#d92638'
                                ? 'rgba(217, 38, 56, 0.38)'
                                : 'rgba(24, 24, 27, 0.32)',
                          }}
                          title={row.categories.join(' / ')}
                        >
                          {row.categories.map((cat) => (
                            <span
                              key={cat}
                              className="inline-flex items-center"
                            >
                              {getCategoryIcon(cat, 'w-3 h-3')}
                            </span>
                          ))}
                        </span>
                      )}
                    </span>

                    <span
                      className="shrink-0 font-mono tabular-nums font-bold"
                      style={
                        row.unlocked ? { color: row.accentColor } : undefined
                      }
                    >
                      +{row.points}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className={`mt-2.5 pt-2.5 border-t border-zinc-900/10 flex items-center justify-between gap-3 text-xs leading-snug ${
                  hasArticlePoints ? 'text-zinc-950' : 'text-zinc-900/30'
                }`}
              >
                <span className="font-semibold truncate">Articles</span>
                <span
                  className="shrink-0 font-mono tabular-nums font-bold"
                  style={hasArticlePoints ? { color: '#d92638' } : undefined}
                >
                  +{articlePoints}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
