import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { TbArrowsShuffle, TbGripVertical } from 'react-icons/tb';
import { BLOG_POSTS } from '../blogs/registry';
import { BLOG_CATEGORIES, getCategoryIcon } from '../blogs/categoryMeta';
import type { BlogCategory } from '../blogs/types';
import { recordBlogAction, type ScoreToastTone } from '../blogs/blogGameStore';
import {
  arrayMove,
  dealComboFreeDeck,
  findNewlyFormedCombos,
  type DealtCard,
  type GridColumns,
} from '../blogs/cardDeck';
import { BlogScoreHud } from '../blogs/components/BlogScoreHud';
import { ScoreToastOverlay } from '../blogs/components/ScoreToastOverlay';
import { BlogCardMinimap } from '../blogs/components/BlogCardMinimap';

interface ZoomingCardState {
  card: DealtCard;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  targetX: number;
  targetY: number;
  targetScale: number;
}

interface ActiveDragVisual {
  card: DealtCard;
  originIndex: number;
  currentIndex: number;
  rect: {
    width: number;
    height: number;
  };
  grabOffsetX: number;
  grabOffsetY: number;
  initialX: number;
  initialY: number;
}

interface SettlingCardState {
  card: DealtCard;
  fromX: number;
  fromY: number;
  fromAngle: number;
  toX: number;
  toY: number;
  width: number;
  height: number;
}

interface StaticDocRect {
  left: number;
  top: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

interface DragRuntime {
  pointerId: number;
  card: DealtCard;
  originIndex: number;
  currentIndex: number;
  isActive: boolean;
  startX: number;
  startY: number;
  pointerX: number;
  pointerY: number;
  prevPointerX: number;
  grabOffsetX: number;
  grabOffsetY: number;
  width: number;
  height: number;
  smoothedVx: number;
  angle: number;
  angularVel: number;
  lastSwapTime: number;
  lastFrameTime: number;
  rafId: number;
  thresholdPx: number;
  docRects: StaticDocRect[];
}

interface LitCardState {
  tone: ScoreToastTone;
  nonce: number;
}

interface MinimapScrollState {
  progress: number;
  visibleRange: [number, number];
}

const LIT_TONE_VARS: Record<
  ScoreToastTone,
  { core: string; mid: string }
> = {
  emerald: {
    core: 'rgba(16, 185, 129, 0.62)',
    mid: 'rgba(16, 185, 129, 0.32)',
  },
  amber: {
    core: 'rgba(245, 158, 11, 0.62)',
    mid: 'rgba(245, 158, 11, 0.32)',
  },
  crimson: {
    core: 'rgba(217, 38, 56, 0.58)',
    mid: 'rgba(217, 38, 56, 0.3)',
  },
  muted: {
    core: 'rgba(82, 82, 91, 0.25)',
    mid: 'rgba(82, 82, 91, 0.1)',
  },
};

function getGridColsForWidth(width: number): GridColumns {
  if (width >= 1280) return 5;
  if (width >= 1024) return 4;
  if (width >= 768) return 3;
  if (width >= 640) return 2;
  return 1;
}

function getInitialGridCols(): GridColumns {
  if (typeof window === 'undefined') return 5;
  return getGridColsForWidth(window.innerWidth);
}

function detectMobileOrTouch(): boolean {
  if (typeof window === 'undefined') return false;
  const narrow = window.innerWidth < 640;
  const coarse =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;
  return narrow || coarse;
}

function findHitSlotIndex(
  docCenterX: number,
  docCenterY: number,
  docRects: readonly StaticDocRect[],
  currentIndex: number
): number {
  for (let i = 0; i < docRects.length; i += 1) {
    const r = docRects[i];
    if (
      docCenterX >= r.left &&
      docCenterX <= r.left + r.width &&
      docCenterY >= r.top &&
      docCenterY <= r.top + r.height
    ) {
      return i;
    }
  }

  let bestIdx = currentIndex;
  let bestDistSq = Number.POSITIVE_INFINITY;
  for (let i = 0; i < docRects.length; i += 1) {
    const r = docRects[i];
    const dx = docCenterX - r.centerX;
    const dy = docCenterY - r.centerY;
    if (Math.abs(dx) > r.width * 0.95 || Math.abs(dy) > r.height * 0.72) {
      continue;
    }
    const distSq = dx * dx + dy * dy;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export const BlogIndexPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'All' | BlogCategory>('All');
  const [gridCols, setGridCols] = useState<GridColumns>(getInitialGridCols);
  const [isMobileOrTouch, setIsMobileOrTouch] = useState<boolean>(detectMobileOrTouch);
  const [deck, setDeck] = useState<DealtCard[]>(() =>
    dealComboFreeDeck(BLOG_POSTS, getInitialGridCols())
  );
  const [shuffleNonce, setShuffleNonce] = useState(0);
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);
  const [zoomingCard, setZoomingCard] = useState<ZoomingCardState | null>(null);
  const [activeDrag, setActiveDrag] = useState<ActiveDragVisual | null>(null);
  const [settlingCard, setSettlingCard] = useState<SettlingCardState | null>(null);
  const [litSlugs, setLitSlugs] = useState<Record<string, LitCardState>>({});
  const [minimapScroll, setMinimapScroll] = useState<MinimapScrollState>({
    progress: 0,
    visibleRange: [0, 1.5],
  });

  const gridRef = useRef<HTMLDivElement | null>(null);
  const slotRefs = useRef<Array<HTMLDivElement | null>>([]);
  const floatingCardRef = useRef<HTMLDivElement | null>(null);
  const dragRuntimeRef = useRef<DragRuntime | null>(null);
  const suppressClickRef = useRef(false);
  const litTimerRef = useRef<number | null>(null);
  const litNonceRef = useRef(0);
  const scrollRafRef = useRef<number>(0);
  const deckRef = useRef(deck);
  const gridColsRef = useRef(gridCols);
  const displayedCountRef = useRef(deck.length);

  useEffect(() => {
    deckRef.current = deck;
  }, [deck]);

  useEffect(() => {
    gridColsRef.current = gridCols;
  }, [gridCols]);

  // Responsive grid columns & touch detection
  useEffect(() => {
    const updateLayoutEnv = () => {
      setGridCols(getGridColsForWidth(window.innerWidth));
      setIsMobileOrTouch(detectMobileOrTouch());
    };
    updateLayoutEnv();
    window.addEventListener('resize', updateLayoutEnv);
    return () => window.removeEventListener('resize', updateLayoutEnv);
  }, []);

  const displayedCards = useMemo(() => {
    if (selectedCategory === 'All') {
      if (activeDrag) {
        return arrayMove(deck, activeDrag.originIndex, activeDrag.currentIndex);
      }
      return deck;
    }
    return deck.filter((card) => card.category === selectedCategory);
  }, [deck, selectedCategory, activeDrag]);

  useEffect(() => {
    displayedCountRef.current = displayedCards.length;
    slotRefs.current.length = displayedCards.length;
  }, [displayedCards.length]);

  const updateScrollAndMinimap = useCallback(() => {
    const scrollEl = document.scrollingElement || document.documentElement;
    const scrollTop = Math.max(window.scrollY, scrollEl.scrollTop);
    const vh = window.innerHeight;
    const maxScroll = Math.max(1, scrollEl.scrollHeight - vh);
    const progress = Math.max(0, Math.min(1, scrollTop / maxScroll));

    setIsHeaderMinimized((prev) => {
      if (!prev && scrollTop > 58) return true;
      if (prev && scrollTop < 20) return false;
      return prev;
    });

    const len = displayedCountRef.current;
    let startFloat = 0;
    let endFloat = Math.min(len, 1);

    if (len >= 2) {
      const firstEl = slotRefs.current[0];
      const lastEl = slotRefs.current[len - 1];
      if (firstEl && lastEl) {
        const firstRect = firstEl.getBoundingClientRect();
        const lastRect = lastEl.getBoundingClientRect();
        const span = Math.max(1, lastRect.bottom - firstRect.top);
        startFloat = Math.max(
          0,
          Math.min(len - 0.5, ((0 - firstRect.top) / span) * len)
        );
        endFloat = Math.max(
          startFloat + 0.5,
          Math.min(len, ((vh - firstRect.top) / span) * len)
        );
      } else if (gridRef.current) {
        const gRect = gridRef.current.getBoundingClientRect();
        const span = Math.max(1, gRect.height);
        startFloat = Math.max(
          0,
          Math.min(len - 0.5, ((0 - gRect.top) / span) * len)
        );
        endFloat = Math.max(
          startFloat + 0.5,
          Math.min(len, ((vh - gRect.top) / span) * len)
        );
      }
    }

    setMinimapScroll((prev) => {
      if (
        Math.abs(prev.progress - progress) < 0.0004 &&
        Math.abs(prev.visibleRange[0] - startFloat) < 0.002 &&
        Math.abs(prev.visibleRange[1] - endFloat) < 0.002
      ) {
        return prev;
      }
      return {
        progress,
        visibleRange: [startFloat, endFloat],
      };
    });
  }, []);

  // Scroll listener for morphing header + real-time continuous minimap sync
  useEffect(() => {
    const scheduleUpdate = () => {
      if (scrollRafRef.current) return;
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = 0;
        updateScrollAndMinimap();
      });
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
        scrollRafRef.current = 0;
      }
    };
  }, [selectedCategory, deck.length, updateScrollAndMinimap]);

  useEffect(() => {
    return () => {
      if (litTimerRef.current !== null) {
        window.clearTimeout(litTimerRef.current);
      }
    };
  }, []);

  const canDragCards = selectedCategory === 'All' && !zoomingCard;

  const cleanupDragSession = useCallback(() => {
    const runtime = dragRuntimeRef.current;
    if (runtime && runtime.rafId) {
      window.cancelAnimationFrame(runtime.rafId);
    }
    dragRuntimeRef.current = null;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  const triggerLitCells = useCallback(
    (combos: ReturnType<typeof findNewlyFormedCombos>) => {
      if (combos.length === 0) return;

      litNonceRef.current += 1;
      const nonce = litNonceRef.current;
      const nextLit: Record<string, LitCardState> = {};

      // Combos are sorted descending by points; apply lowest-to-highest so rarest tone wins on shared cells
      for (let i = combos.length - 1; i >= 0; i -= 1) {
        const combo = combos[i];
        for (const slug of combo.slugs) {
          nextLit[slug] = { tone: combo.tone, nonce };
        }
      }

      setLitSlugs(nextLit);
      if (litTimerRef.current !== null) {
        window.clearTimeout(litTimerRef.current);
      }
      litTimerRef.current = window.setTimeout(() => {
        setLitSlugs({});
        litTimerRef.current = null;
      }, 1750);
    },
    []
  );

  // Global pointer listeners during pending or active drag
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const runtime = dragRuntimeRef.current;
      if (!runtime || e.pointerId !== runtime.pointerId) return;

      runtime.pointerX = e.clientX;
      runtime.pointerY = e.clientY;

      if (!runtime.isActive) {
        const dist = Math.hypot(
          e.clientX - runtime.startX,
          e.clientY - runtime.startY
        );
        if (dist < runtime.thresholdPx) {
          return;
        }

        runtime.isActive = true;
        runtime.lastFrameTime = performance.now();
        runtime.prevPointerX = e.clientX;
        suppressClickRef.current = true;
        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
        setSettlingCard(null);
        setActiveDrag({
          card: runtime.card,
          originIndex: runtime.originIndex,
          currentIndex: runtime.currentIndex,
          rect: {
            width: runtime.width,
            height: runtime.height,
          },
          grabOffsetX: runtime.grabOffsetX,
          grabOffsetY: runtime.grabOffsetY,
          initialX: e.clientX - runtime.grabOffsetX,
          initialY: e.clientY - runtime.grabOffsetY,
        });

        const stepFrame = (now: number) => {
          const r = dragRuntimeRef.current;
          if (!r || !r.isActive) return;

          const dt = Math.max(0.001, Math.min((now - r.lastFrameTime) / 1000, 0.05));
          r.lastFrameTime = now;

          // 1. Dangling pendulum physics from horizontal drag velocity
          const instVx = (r.pointerX - r.prevPointerX) / dt;
          r.prevPointerX = r.pointerX;
          r.smoothedVx = r.smoothedVx * 0.72 + instVx * 0.28;

          const pivotSign = r.grabOffsetY > r.height * 0.65 ? -1 : 1;
          const rawPivot = (r.height * 0.5 - r.grabOffsetY) / (r.height * 0.5);
          const leverage = 0.7 + 0.3 * Math.abs(rawPivot);
          const targetAngle = Math.max(
            -22,
            Math.min(22, r.smoothedVx * 0.016 * pivotSign * leverage)
          );

          const stiffness = 190;
          const damping = 16;
          const accel = (targetAngle - r.angle) * stiffness - r.angularVel * damping;
          r.angularVel += accel * dt;
          r.angle += r.angularVel * dt;

          // 2. Edge auto-scrolling near viewport top or bottom
          const vh = window.innerHeight;
          const edgeZone = Math.min(115, vh * 0.16);
          if (r.pointerY < edgeZone && window.scrollY > 0) {
            const ratio = (edgeZone - r.pointerY) / edgeZone;
            const deltaY = -(ratio * ratio) * 950 * dt;
            window.scrollBy(0, deltaY);
          } else if (r.pointerY > vh - edgeZone) {
            const ratio = (r.pointerY - (vh - edgeZone)) / edgeZone;
            const deltaY = ratio * ratio * 950 * dt;
            window.scrollBy(0, deltaY);
          }

          // 3. Apply 60fps transform directly to floating overlay card
          const overlayEl = floatingCardRef.current;
          if (overlayEl) {
            const tx = r.pointerX - r.grabOffsetX;
            const ty = r.pointerY - r.grabOffsetY;
            overlayEl.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(
              1
            )}px, 0) rotate(${r.angle.toFixed(2)}deg) scale(1.035)`;
          }

          // 4. Live insertion slot hit-test using invariant document rects
          const docCenterX = r.pointerX - r.grabOffsetX + r.width * 0.5 + window.scrollX;
          const docCenterY = r.pointerY - r.grabOffsetY + r.height * 0.5 + window.scrollY;
          if (now - r.lastSwapTime >= 95) {
            const hitIdx = findHitSlotIndex(
              docCenterX,
              docCenterY,
              r.docRects,
              r.currentIndex
            );
            if (hitIdx !== r.currentIndex) {
              r.currentIndex = hitIdx;
              r.lastSwapTime = now;
              setActiveDrag((prev) =>
                prev && prev.card.slug === r.card.slug
                  ? { ...prev, currentIndex: hitIdx }
                  : prev
              );
            }
          }

          r.rafId = window.requestAnimationFrame(stepFrame);
        };

        runtime.rafId = window.requestAnimationFrame(stepFrame);
      }
    };

    const finishDrag = (commit: boolean, pointerId?: number) => {
      const runtime = dragRuntimeRef.current;
      if (!runtime) return;
      if (pointerId !== undefined && pointerId !== runtime.pointerId) return;

      const wasActive = runtime.isActive;
      const fromIdx = runtime.originIndex;
      const toIdx = runtime.currentIndex;
      const card = runtime.card;
      const fromX = runtime.pointerX - runtime.grabOffsetX;
      const fromY = runtime.pointerY - runtime.grabOffsetY;
      const fromAngle = runtime.angle;
      const width = runtime.width;
      const height = runtime.height;
      const docRects = runtime.docRects;

      cleanupDragSession();

      if (!wasActive) {
        return;
      }

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 120);

      setActiveDrag(null);

      if (!commit) {
        return;
      }

      const targetDocRect = docRects[toIdx];
      if (targetDocRect) {
        setSettlingCard({
          card,
          fromX,
          fromY,
          fromAngle,
          toX: targetDocRect.left - window.scrollX,
          toY: targetDocRect.top - window.scrollY,
          width,
          height,
        });
      }

      if (fromIdx !== toIdx) {
        const prevDeck = deckRef.current;
        const nextDeck = arrayMove(prevDeck, fromIdx, toIdx);
        setDeck(nextDeck);

        const combos = findNewlyFormedCombos(
          prevDeck,
          nextDeck,
          fromIdx,
          toIdx,
          gridColsRef.current
        );

        if (combos.length > 0) {
          const awardedCombos: typeof combos = [];
          for (const combo of combos) {
            const res = recordBlogAction(combo.actionId, combo.points, {
              title: combo.label,
              subtitle: combo.subtitle,
              tone: combo.tone,
            });
            if (res.awarded) {
              awardedCombos.push(combo);
            }
          }
          if (awardedCombos.length > 0) {
            triggerLitCells(awardedCombos);
          }
        }
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      finishDrag(true, e.pointerId);
    };

    const handlePointerCancel = (e: PointerEvent) => {
      finishDrag(false, e.pointerId);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dragRuntimeRef.current) {
        finishDrag(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('keydown', handleKeyDown);
      cleanupDragSession();
    };
  }, [cleanupDragSession, triggerLitCells]);

  const initiateDrag = useCallback(
    (
      e: React.PointerEvent,
      card: DealtCard,
      index: number,
      thresholdPx: number
    ) => {
      if (!canDragCards || e.button !== 0 || dragRuntimeRef.current) return;

      const slotEl = slotRefs.current[index];
      if (!slotEl) return;

      const cardRect = slotEl.getBoundingClientRect();
      const docRects: StaticDocRect[] = [];
      const currentDeckLen = deckRef.current.length;
      for (let i = 0; i < currentDeckLen; i += 1) {
        const el = slotRefs.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const docLeft = r.left + window.scrollX;
        const docTop = r.top + window.scrollY;
        docRects.push({
          left: docLeft,
          top: docTop,
          width: r.width,
          height: r.height,
          centerX: docLeft + r.width * 0.5,
          centerY: docTop + r.height * 0.5,
        });
      }

      if (docRects.length !== currentDeckLen) return;

      suppressClickRef.current = false;
      dragRuntimeRef.current = {
        pointerId: e.pointerId,
        card,
        originIndex: index,
        currentIndex: index,
        isActive: false,
        startX: e.clientX,
        startY: e.clientY,
        pointerX: e.clientX,
        pointerY: e.clientY,
        prevPointerX: e.clientX,
        grabOffsetX: e.clientX - cardRect.left,
        grabOffsetY: e.clientY - cardRect.top,
        width: cardRect.width,
        height: cardRect.height,
        smoothedVx: 0,
        angle: card.rotation,
        angularVel: 0,
        lastSwapTime: 0,
        lastFrameTime: performance.now(),
        rafId: 0,
        thresholdPx,
        docRects,
      };
    },
    [canDragCards]
  );

  const handleCardBodyPointerDown = useCallback(
    (e: React.PointerEvent, card: DealtCard, index: number) => {
      if (isMobileOrTouch || e.pointerType === 'touch' || e.pointerType === 'pen') {
        return;
      }
      initiateDrag(e, card, index, 7);
    },
    [initiateDrag, isMobileOrTouch]
  );

  const handleCornerHandlePointerDown = useCallback(
    (e: React.PointerEvent, card: DealtCard, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      initiateDrag(e, card, index, 3);
    },
    [initiateDrag]
  );

  const handleReshuffle = useCallback(() => {
    cleanupDragSession();
    setActiveDrag(null);
    setSettlingCard(null);
    setLitSlugs({});
    setSelectedCategory('All');
    setDeck(dealComboFreeDeck(BLOG_POSTS, gridColsRef.current));
    setShuffleNonce((n) => n + 1);
  }, [cleanupDragSession]);

  const handleCardClick = useCallback(
    (
      e: React.MouseEvent<HTMLAnchorElement>,
      card: DealtCard,
      cardEl: HTMLElement | null
    ) => {
      if (suppressClickRef.current || activeDrag) {
        e.preventDefault();
        return;
      }
      if (
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        zoomingCard
      ) {
        return;
      }
      e.preventDefault();
      const targetRect = (cardEl ?? e.currentTarget).getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const cardCenterX = targetRect.left + targetRect.width / 2;
      const cardCenterY = targetRect.top + targetRect.height / 2;
      const targetX = vw / 2 - cardCenterX;
      const targetY = vh / 2 - cardCenterY;
      // Uniform scale so the 5:7 card shape/aspect ratio never distorts while zooming to fill the screen
      const targetScale = Math.max(vw / targetRect.width, vh / targetRect.height) * 1.18;

      setZoomingCard({
        card,
        rect: {
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
        },
        targetX,
        targetY,
        targetScale,
      });

      window.setTimeout(() => {
        navigate(`/blog/${card.slug}`, {
          state: { fromCardZoom: true },
        });
      }, 460);
    },
    [activeDrag, navigate, zoomingCard]
  );

  const handleSelectMinimapCard = useCallback((idx: number) => {
    const el = slotRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  const renderCardFace = (card: DealtCard, isOverlay = false) => {
    const { post, rankLabel, suitColor } = card;
    const { meta } = post;

    return (
      <>
        {/* Subtle Whole-Card Rough Dither Grain */}
        <div
          className="pointer-events-none absolute inset-0 z-10 playing-card-dither-grain opacity-25"
          aria-hidden="true"
        />

        {/* Edge-Weighted CSS Dither Texture */}
        <div
          className="pointer-events-none absolute inset-0 z-10 playing-card-dither-surface opacity-75"
          aria-hidden="true"
        >
          <div className="w-full h-full playing-card-dither-grain" />
        </div>

        {/* Inner Playing Card Frame Line */}
        <div
          className="pointer-events-none absolute inset-2 rounded-[12px] border border-zinc-900/[0.08] z-10"
          aria-hidden="true"
        />

        {/* Top-Left Corner Header: Overlaid at z-20 so image rect is visible behind it */}
        <div
          className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-20 flex flex-col items-center leading-none select-none px-1.5 py-0.5 rounded-lg bg-[#f9f6ee]/70 backdrop-blur-[2px] shadow-[0_0_12px_5px_rgba(249,246,238,0.75)]"
          style={{ color: suitColor }}
        >
          <span
            className="text-xl sm:text-[22px] leading-none"
            style={{ fontFamily: "'Alfa Slab One', serif" }}
          >
            {rankLabel}
          </span>
          <span className="mt-0.5" title={meta.category}>
            {getCategoryIcon(meta.category, 'w-3.5 h-3.5')}
          </span>
        </div>

        {/* Upper Artwork Rect extending behind the Top-Left Header */}
        <div className="relative z-10 flex-1 w-full flex items-center justify-center mb-1.5 min-h-0">
          {meta.coverImage ? (
            <div className="relative w-full h-full max-h-[195px] playing-card-art-dither-fade flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={meta.coverImage}
                alt={meta.title}
                loading={isOverlay ? 'eager' : 'lazy'}
                draggable={false}
                className="w-full h-full object-cover playing-card-art-core transition-transform duration-500 group-hover:scale-105"
                style={{ objectPosition: meta.coverPosition ?? 'center' }}
              />
              <img
                src={meta.coverImage}
                alt=""
                aria-hidden="true"
                loading={isOverlay ? 'eager' : 'lazy'}
                draggable={false}
                className="absolute inset-0 w-full h-full object-cover playing-card-art-dither-img transition-transform duration-500 group-hover:scale-105"
                style={{ objectPosition: meta.coverPosition ?? 'center' }}
              />
              <div
                className="pointer-events-none absolute inset-0 playing-card-art-dither-rim"
                aria-hidden="true"
              >
                <div className="w-full h-full playing-card-dither-grain opacity-65" />
              </div>
            </div>
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center opacity-20"
              style={{ color: suitColor }}
            >
              {getCategoryIcon(meta.category, 'w-10 h-10')}
            </div>
          )}
        </div>

        {/* Centered Title Directly Below Artwork */}
        <div className="relative z-20 px-1.5 pb-2 text-center">
          <h2
            className="text-zinc-900 text-sm sm:text-[15px] font-black leading-snug tracking-tight m-0 line-clamp-3 group-hover:text-black"
            style={{ fontFamily: 'Archivo Black, sans-serif' }}
          >
            {meta.title}
          </h2>
        </div>

        {/* Bottom-Right Corner: Creation Year & Month */}
        <div
          className="relative z-20 self-end text-[10px] font-mono font-bold tracking-wider select-none opacity-85"
          style={{ color: suitColor }}
        >
          {meta.date}
        </div>
      </>
    );
  };

  return (
    <div className="min-h-[100dvh] w-full bg-[#f8f7fc] text-zinc-900 relative overflow-x-clip">
      {/* Subtle Ambient Background Lighting */}
      <div
        className="fixed -top-32 -right-24 w-[520px] h-[520px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, #ff779c 0%, transparent 70%)',
          filter: 'blur(90px)',
        }}
        aria-hidden="true"
      />
      <div
        className="fixed -bottom-40 -left-24 w-[520px] h-[520px] rounded-full pointer-events-none opacity-15"
        style={{
          background: 'radial-gradient(circle, #15cea9 0%, transparent 70%)',
          filter: 'blur(95px)',
        }}
        aria-hidden="true"
      />

      {/* Top-Center Floating Combo & Score Notifications */}
      <ScoreToastOverlay isHeaderMinimized={isHeaderMinimized} />

      {/* Mobile Side Minimap (between cards and right edge) */}
      {displayedCards.length > 0 && (
        <BlogCardMinimap
          cards={displayedCards}
          scrollProgress={minimapScroll.progress}
          visibleRange={minimapScroll.visibleRange}
          draggedSlug={activeDrag?.card.slug ?? null}
          onSelectCard={handleSelectMinimapCard}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-10 sm:pt-16 pb-24 sm:pb-16">
        {/* Header Wrapper reserving height in normal flow so scroll never jumps */}
        <div className="min-h-[168px] sm:min-h-[184px] mb-6 sm:mb-8">
          <motion.header
            layout
            transition={{
              layout: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
            }}
            className={
              isHeaderMinimized
                ? 'fixed top-3 left-3 right-3 sm:right-auto sm:top-4 sm:left-6 z-40 sm:max-w-[calc(100vw-320px)] flex flex-row flex-wrap items-center gap-x-3 gap-y-2 sm:gap-x-3.5 px-4 py-2 rounded-2xl bg-[#f8f7fc]/90 backdrop-blur-md border border-zinc-900/12 shadow-[0_10px_28px_rgba(24,24,27,0.09)]'
                : 'relative flex flex-col items-start'
            }
          >
            {/* Title + Borderless Score HUD */}
            <motion.div
              layout="position"
              transition={{
                layout: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
              }}
              className="flex items-baseline gap-3 sm:gap-4 shrink-0"
            >
              <h1
                onClick={
                  isHeaderMinimized
                    ? () => window.scrollTo({ top: 0, behavior: 'smooth' })
                    : undefined
                }
                className={`text-zinc-900 font-black tracking-tight leading-[1.06] m-0 select-none transition-[font-size] duration-300 ease-out ${isHeaderMinimized ? 'cursor-pointer shrink-0' : ''
                  }`}
                style={{
                  fontFamily: 'Archivo Black, sans-serif',
                  fontSize: isHeaderMinimized
                    ? 'clamp(1.05rem, 1.6vw, 1.25rem)'
                    : 'clamp(2.1rem, 4.6vw, 3.6rem)',
                }}
              >
                Blog
              </h1>

              <BlogScoreHud compact={isHeaderMinimized} />
            </motion.div>

            {/* Unmounted immediately when minimized so it never occupies horizontal width in flex-row */}
            {!isHeaderMinimized && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
                className="text-zinc-600 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mt-3 mb-0"
              >
                Essays, engineering notes, postmortems, and game design studies.
              </motion.p>
            )}

            {/* Parallelogram Category Filter Strip + Reshuffle */}
            <motion.div
              layout="position"
              transition={{
                layout: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
              }}
              className={`flex items-center gap-1.5 sm:gap-2 flex-wrap ${isHeaderMinimized ? 'mt-0 sm:pl-1' : 'mt-6'
                }`}
            >
              {BLOG_CATEGORIES.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    style={{ transform: 'skewX(-16deg)' }}
                    className={`inline-flex items-center justify-center rounded-[3px] font-semibold transition-colors duration-200 cursor-pointer border ${isHeaderMinimized
                        ? 'px-2.5 py-1 text-[11px]'
                        : 'px-3.5 py-1.5 text-xs'
                      } ${isActive
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-transparent text-zinc-700 border-zinc-900/25 hover:border-zinc-900/70 hover:bg-zinc-900/[0.06] hover:text-zinc-950'
                      }`}
                  >
                    <span
                      style={{ transform: 'skewX(16deg)' }}
                      className="inline-flex items-center gap-1.5"
                    >
                      {category !== 'All' &&
                        getCategoryIcon(
                          category,
                          isHeaderMinimized ? 'w-3 h-3' : 'w-3.5 h-3.5'
                        )}
                      <span>{category}</span>
                    </span>
                  </button>
                );
              })}

              {/* Skewed Reshuffle Button */}
              <button
                type="button"
                onClick={handleReshuffle}
                style={{ transform: 'skewX(-16deg)' }}
                aria-label="Reshuffle cards and deal new numbers"
                title="Reshuffle deck"
                className={`inline-flex items-center justify-center rounded-[3px] font-semibold transition-colors duration-200 cursor-pointer ${isHeaderMinimized
                    ? 'px-2.5 py-1 text-[11px]'
                    : 'px-3.5 py-1.5 text-xs'
                  } bg-transparent text-zinc-700 border-zinc-900/25 hover:border-[#d92638]/70 hover:bg-[#d92638]/[0.06] hover:text-[#d92638] active:scale-95`}
              >
                <span
                  style={{ transform: 'skewX(16deg)' }}
                  className="inline-flex items-center gap-1.5"
                >
                  <motion.span
                    key={shuffleNonce}
                    initial={shuffleNonce > 0 ? { rotate: -180 } : false}
                    animate={{ rotate: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-flex items-center"
                  >
                    <TbArrowsShuffle
                      className={isHeaderMinimized ? 'w-3 h-3' : 'w-3.5 h-3.5'}
                    />
                  </motion.span>
                  <span>Reshuffle</span>
                </span>
              </button>
            </motion.div>
          </motion.header>
        </div>

        {/* Playing Cards Grid */}
        {displayedCards.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-sm font-mono">
            No articles in this category yet.
          </div>
        ) : (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 items-center justify-items-center overflow-visible pr-11 sm:pr-0"
          >
            {displayedCards.map((card, idx) => {
              const { post, slug, rotation } = card;
              const { meta } = post;
              const isZoomingThisCard = zoomingCard?.card.slug === slug;
              const isDraggedSlot = activeDrag?.card.slug === slug;
              const isSettlingSlot = settlingCard?.card.slug === slug;
              const litState = litSlugs[slug];
              const litVars = litState ? LIT_TONE_VARS[litState.tone] : null;

              return (
                <motion.div
                  key={slug}
                  layout="position"
                  transition={{
                    layout: { type: 'spring', stiffness: 420, damping: 34 },
                  }}
                  ref={(el) => {
                    slotRefs.current[idx] = el;
                  }}
                  className="relative w-full max-w-[260px] sm:max-w-[235px] aspect-[5/7]"
                >
                  {/* Soft Ambient Cell-Background Glow on Newly Scored Combo */}
                  {litState && litVars && (
                    <div
                      key={`lit-${litState.nonce}`}
                      className="pointer-events-none absolute -inset-3.5 sm:-inset-4 rounded-[26px] z-0 combo-cell-bg-glow"
                      style={
                        {
                          '--combo-bg-core': litVars.core,
                          '--combo-bg-mid': litVars.mid,
                        } as React.CSSProperties
                      }
                      aria-hidden="true"
                    />
                  )}

                  {/* Dashed Drop Slot Placeholder while card is lifted */}
                  {isDraggedSlot && (
                    <div
                      className="w-full h-full rounded-[18px] border-2 border-dashed border-zinc-900/20 bg-zinc-900/[0.035]"
                      aria-hidden="true"
                    />
                  )}

                  {/* Real Card Face (kept mounted and hidden via instant CSS opacity during lift/settle/zoom to avoid image flicker or entrance replay) */}
                  <motion.div
                    key={`${slug}-${shuffleNonce}`}
                    initial={{ opacity: 0, x: 160, rotate: rotation + 10 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotate: rotation,
                    }}
                    transition={{
                      duration: 0.55,
                      delay:
                        shuffleNonce > 0
                          ? Math.min(idx * 0.025, 0.25)
                          : Math.min(idx * 0.04, 0.45),
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileHover={
                      zoomingCard || activeDrag || isMobileOrTouch
                        ? undefined
                        : {
                          y: -12,
                          scale: 1.035,
                          rotate: rotation * 0.35,
                          transition: { duration: 0.25, ease: 'easeOut' },
                        }
                    }
                    onPointerDown={(e) => handleCardBodyPointerDown(e, card, idx)}
                    className={`w-full h-full ${isDraggedSlot || isSettlingSlot ? 'pointer-events-none' : ''
                      } ${canDragCards && !isMobileOrTouch
                        ? 'cursor-grab active:cursor-grabbing'
                        : ''
                      }`}
                    style={
                      isDraggedSlot
                        ? { position: 'absolute', inset: 0, pointerEvents: 'none' }
                        : undefined
                    }
                  >
                    <div
                      className={`group relative w-full h-full rounded-[18px] bg-[#f9f6ee] border border-zinc-900/15 shadow-[0_8px_22px_rgba(24,24,27,0.1)] group-hover:shadow-[0_18px_38px_rgba(24,24,27,0.18)] transition-shadow duration-300 overflow-hidden ${isZoomingThisCard || isDraggedSlot || isSettlingSlot
                          ? 'opacity-0 pointer-events-none'
                          : 'opacity-100'
                        }`}
                    >
                      {/* Momentary Sheen Sweep inside Card on Combo */}
                      {litState && (
                        <div
                          key={`sheen-${litState.nonce}`}
                          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 z-30 bg-gradient-to-r from-transparent via-white/60 to-transparent combo-cell-sheen"
                          aria-hidden="true"
                        />
                      )}

                      <Link
                        to={`/blog/${meta.slug}`}
                        draggable={false}
                        onClick={(e) =>
                          handleCardClick(e, card, slotRefs.current[idx])
                        }
                        className="relative w-full h-full flex flex-col justify-between p-3.5 sm:p-4 no-underline text-inherit select-none"
                      >
                        {renderCardFace(card)}
                      </Link>

                      {/* Mobile/Touch Muted Top-Right Corner Drag Handle */}
                      {canDragCards && isMobileOrTouch && (
                        <button
                          type="button"
                          onPointerDown={(e) =>
                            handleCornerHandlePointerDown(e, card, idx)
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          aria-label={`Drag ${meta.title} card to reorder`}
                          title="Drag corner to reorder"
                          className="absolute top-2 right-2 z-30 w-8 h-8 flex items-center justify-center rounded-lg text-zinc-900/35 hover:text-zinc-900/65 active:text-zinc-900/85 active:bg-zinc-900/[0.06] touch-none select-none cursor-grab active:cursor-grabbing transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/50"
                        >
                          <TbGripVertical className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Active Drag Card Overlay (60fps DOM transform + dangling pivot) */}
      {activeDrag && (
        <div
          ref={floatingCardRef}
          aria-hidden="true"
          className="fixed top-0 left-0 z-50 pointer-events-none will-change-transform"
          style={{
            width: activeDrag.rect.width,
            height: activeDrag.rect.height,
            transformOrigin: `${activeDrag.grabOffsetX}px ${activeDrag.grabOffsetY}px`,
            transform: `translate3d(${activeDrag.initialX}px, ${activeDrag.initialY}px, 0) rotate(${activeDrag.card.rotation}deg) scale(1.035)`,
          }}
        >
          <div className="relative w-full h-full rounded-[18px] bg-[#f9f6ee] border border-zinc-900/20 shadow-[0_24px_54px_rgba(24,24,27,0.28)] overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 select-none">
            {renderCardFace(activeDrag.card, true)}
          </div>
        </div>
      )}

      {/* Smooth Drop Settle Overlay */}
      {settlingCard && (
        <motion.div
          aria-hidden="true"
          className="fixed top-0 left-0 z-50 pointer-events-none will-change-transform"
          style={{
            width: settlingCard.width,
            height: settlingCard.height,
          }}
          initial={{
            x: settlingCard.fromX,
            y: settlingCard.fromY,
            rotate: settlingCard.fromAngle,
            scale: 1.035,
          }}
          animate={{
            x: settlingCard.toX,
            y: settlingCard.toY,
            rotate: settlingCard.card.rotation,
            scale: 1,
          }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setSettlingCard(null)}
        >
          <div className="relative w-full h-full rounded-[18px] bg-[#f9f6ee] border border-zinc-900/15 shadow-[0_12px_30px_rgba(24,24,27,0.16)] overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 select-none">
            {renderCardFace(settlingCard.card, true)}
          </div>
        </motion.div>
      )}

      {/* Card Zoom-In Transition Overlay: Preserves exact 5:7 card shape & hides image before zooming */}
      <AnimatePresence>
        {zoomingCard && (
          <div
            key="card-zoom-stage"
            className="fixed inset-0 z-50 pointer-events-auto overflow-hidden"
          >
            <motion.div
              style={{
                top: zoomingCard.rect.top,
                left: zoomingCard.rect.left,
                width: zoomingCard.rect.width,
                height: zoomingCard.rect.height,
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 1,
                rotate: zoomingCard.card.rotation,
              }}
              animate={{
                x: zoomingCard.targetX,
                y: zoomingCard.targetY,
                scale: zoomingCard.targetScale,
                rotate: 0,
              }}
              transition={{
                delay: 0.09,
                duration: 0.37,
                ease: [0.32, 0, 0.2, 1],
              }}
              className="fixed rounded-[18px] bg-[#f9f6ee] border border-zinc-900/15 shadow-[0_32px_90px_rgba(24,24,27,0.28)] overflow-hidden flex flex-col justify-between p-3.5 sm:p-4 origin-center will-change-transform"
            >
              {/* Whole-Card Rough Dither Grain */}
              <div
                className="pointer-events-none absolute inset-0 z-10 playing-card-dither-grain opacity-25"
                aria-hidden="true"
              />

              {/* Inner Playing Card Frame Line fades out cleanly as card zooms */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.16, ease: 'easeOut' }}
                className="pointer-events-none absolute inset-2 rounded-[12px] border border-zinc-900/[0.08] z-10"
                aria-hidden="true"
              />

              {/* Card Details fade out quickly before the zoom scales up */}
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
                className="relative w-full h-full flex flex-col justify-between"
              >
                <div
                  className="absolute top-0 left-0 z-20 flex flex-col items-center leading-none select-none px-1.5 py-0.5 rounded-lg bg-[#f9f6ee]/70"
                  style={{ color: zoomingCard.card.suitColor }}
                >
                  <span
                    className="text-xl sm:text-[22px] leading-none"
                    style={{ fontFamily: "'Alfa Slab One', serif" }}
                  >
                    {zoomingCard.card.rankLabel}
                  </span>
                  <span className="mt-0.5">
                    {getCategoryIcon(zoomingCard.card.category, 'w-3.5 h-3.5')}
                  </span>
                </div>

                {/* Image is hidden immediately so it never stretches during zoom */}
                <div className="flex-1" />

                <div className="relative z-20 px-1.5 pb-2 text-center">
                  <h2
                    className="text-zinc-900 text-sm sm:text-[15px] font-black leading-snug tracking-tight m-0"
                    style={{ fontFamily: 'Archivo Black, sans-serif' }}
                  >
                    {zoomingCard.card.post.meta.title}
                  </h2>
                </div>

                <div
                  className="relative z-20 self-end text-[10px] font-mono font-bold tracking-wider select-none opacity-85"
                  style={{ color: zoomingCard.card.suitColor }}
                >
                  {zoomingCard.card.post.meta.date}
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
