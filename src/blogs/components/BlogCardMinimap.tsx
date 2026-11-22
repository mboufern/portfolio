import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCategoryIcon } from '../categoryMeta';
import type { DealtCard } from '../cardDeck';

interface BlogCardMinimapProps {
  cards: readonly DealtCard[];
  scrollProgress: number;
  visibleRange: readonly [number, number];
  draggedSlug: string | null;
  onSelectCard?: (index: number) => void;
}

const CARD_HEIGHT = 31;
const CARD_GAP = 3;
const PITCH = CARD_HEIGHT + CARD_GAP;
const TRACK_PAD_Y = 4;

export const BlogCardMinimap: React.FC<BlogCardMinimapProps> = ({
  cards,
  scrollProgress,
  visibleRange,
  draggedSlug,
  onSelectCard,
}) => {
  const [viewportHeight, setViewportHeight] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerHeight : 844
  );

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  if (cards.length === 0) {
    return null;
  }

  const visibleSlots = Math.min(
    cards.length,
    Math.min(12, Math.max(9, Math.floor((viewportHeight - 220) / PITCH)))
  );
  const viewportPx =
    visibleSlots * CARD_HEIGHT +
    Math.max(0, visibleSlots - 1) * CARD_GAP +
    TRACK_PAD_Y * 2;
  const trackHeight =
    cards.length * CARD_HEIGHT +
    Math.max(0, cards.length - 1) * CARD_GAP +
    TRACK_PAD_Y * 2;
  const maxOffset = Math.max(0, trackHeight - viewportPx);

  const draggedIndex = draggedSlug
    ? cards.findIndex((c) => c.slug === draggedSlug)
    : -1;

  let trackOffset = 0;
  if (draggedIndex >= 0) {
    const draggedCenter = TRACK_PAD_Y + draggedIndex * PITCH + CARD_HEIGHT / 2;
    trackOffset = Math.max(
      0,
      Math.min(maxOffset, draggedCenter - viewportPx / 2)
    );
  } else {
    const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
    trackOffset = clampedProgress * maxOffset;
  }

  const startFloat = Math.max(0, Math.min(cards.length - 0.5, visibleRange[0]));
  const endFloat = Math.max(startFloat + 0.5, Math.min(cards.length, visibleRange[1]));
  const bracketTop = TRACK_PAD_Y + startFloat * PITCH;
  const bracketHeight = Math.max(
    CARD_HEIGHT,
    (endFloat - startFloat) * PITCH - CARD_GAP
  );

  const hasTopOverflow = trackOffset > 2;
  const hasBottomOverflow = trackOffset < maxOffset - 2;

  const maskImage =
    hasTopOverflow && hasBottomOverflow
      ? 'linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%)'
      : hasTopOverflow
        ? 'linear-gradient(to bottom, transparent 0%, #000 8%, #000 100%)'
        : hasBottomOverflow
          ? 'linear-gradient(to bottom, #000 0%, #000 92%, transparent 100%)'
          : undefined;

  return (
    <aside
      aria-label="Card deck minimap"
      className="sm:hidden fixed right-1.5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-auto select-none"
    >
      <div
        className="relative w-10 overflow-hidden"
        style={{
          height: `${Math.min(viewportPx, trackHeight)}px`,
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      >
        <div
          className="relative flex flex-col items-center will-change-transform"
          style={{
            gap: `${CARD_GAP}px`,
            paddingTop: `${TRACK_PAD_Y}px`,
            paddingBottom: `${TRACK_PAD_Y}px`,
            transform: `translate3d(0, ${-trackOffset.toFixed(1)}px, 0)`,
            transition: draggedIndex >= 0 ? 'transform 160ms ease-out' : undefined,
          }}
        >
          {/* Real-time continuous viewport bracket */}
          {draggedIndex < 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0.5 right-0.5 rounded-[7px] bg-zinc-900/[0.06] z-0"
              style={{
                top: `${bracketTop.toFixed(1)}px`,
                height: `${bracketHeight.toFixed(1)}px`,
              }}
            >
              <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-zinc-900/75" />
            </div>
          )}

          {cards.map((card, idx) => {
            const isDragged = card.slug === draggedSlug;
            const isInViewport =
              draggedIndex < 0 &&
              idx + 0.7 >= startFloat &&
              idx + 0.3 <= endFloat;

            return (
              <motion.button
                key={card.slug}
                type="button"
                layout="position"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                onClick={() => {
                  if (!draggedSlug && onSelectCard) {
                    onSelectCard(idx);
                  }
                }}
                aria-label={`Jump to card ${idx + 1}: ${card.rankLabel} of ${card.category}`}
                className={`relative z-10 w-8 shrink-0 rounded-[5px] flex flex-col items-center justify-center leading-none border cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/60 ${
                  isDragged
                    ? 'bg-white border-zinc-900/75 ring-2 ring-zinc-900/35 scale-105 shadow-md z-20'
                    : isInViewport
                      ? 'bg-[#f9f6ee]/95 border-zinc-900/40 shadow-xs'
                      : 'bg-[#f9f6ee]/82 border-zinc-900/16 opacity-80'
                }`}
                style={{
                  height: `${CARD_HEIGHT}px`,
                  color: card.suitColor,
                }}
              >
                <span
                  className="text-[9.5px] leading-none font-bold"
                  style={{ fontFamily: "'Alfa Slab One', serif" }}
                >
                  {card.rankLabel}
                </span>
                <span className="mt-0.5 leading-none">
                  {getCategoryIcon(card.category, 'w-2.5 h-2.5')}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
