import type { BlogCategory, BlogPostEntry } from './types';
import type { ScoreToastTone } from './blogGameStore';

export type CardColorGroup = 'red' | 'black';

export type ComboType =
  | 'suit'
  | 'flush'
  | 'straight'
  | 'three-of-a-kind'
  | 'straight-flush'
  | 'royal-flush';

export interface DealtCard {
  post: BlogPostEntry;
  slug: string;
  category: BlogCategory;
  rank: number;
  rankLabel: string;
  colorGroup: CardColorGroup;
  suitColor: '#d92638' | '#18181b';
  rotation: number;
}

export interface DetectedCombo {
  type: ComboType;
  label: string;
  subtitle: string;
  points: number;
  actionId: string;
  tone: ScoreToastTone;
  indices: [number, number, number];
  slugs: [string, string, string];
}

export function getCategoryColorGroup(category: BlogCategory): CardColorGroup {
  if (category === 'Game Dev' || category === 'Art') {
    return 'red';
  }
  return 'black';
}

export function getCategorySuitColor(category: BlogCategory): '#d92638' | '#18181b' {
  return getCategoryColorGroup(category) === 'red' ? '#d92638' : '#18181b';
}

export function formatCardRank(rank: number): string {
  switch (rank) {
    case 1:
      return 'A';
    case 11:
      return 'J';
    case 12:
      return 'Q';
    case 13:
      return 'K';
    default:
      return String(rank);
  }
}

export function generateCardRotation(): number {
  const sign = Math.random() < 0.5 ? -1 : 1;
  const mag = 1.4 + Math.random() * 2.8;
  return Number((sign * mag).toFixed(2));
}

function shuffleArray<T>(items: readonly T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export function dealRandomCategoryRanks(posts: readonly BlogPostEntry[]): DealtCard[] {
  const byCategory = new Map<BlogCategory, BlogPostEntry[]>();
  for (const post of posts) {
    const list = byCategory.get(post.meta.category);
    if (list) {
      list.push(post);
    } else {
      byCategory.set(post.meta.category, [post]);
    }
  }

  const dealtBySlug = new Map<string, DealtCard>();
  const baseRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

  for (const [category, catPosts] of byCategory.entries()) {
    const shuffledPosts = shuffleArray(catPosts);
    const shuffledBase = shuffleArray(baseRanks);
    const overflowCount = Math.max(0, shuffledPosts.length - 13);
    const overflowRanks =
      overflowCount > 0
        ? shuffleArray(Array.from({ length: overflowCount }, (_, idx) => 14 + idx))
        : [];
    const assignedRanks = [...shuffledBase.slice(0, shuffledPosts.length), ...overflowRanks];

    const colorGroup = getCategoryColorGroup(category);
    const suitColor = getCategorySuitColor(category);

    shuffledPosts.forEach((post, idx) => {
      const rank = assignedRanks[idx];
      dealtBySlug.set(post.meta.slug, {
        post,
        slug: post.meta.slug,
        category,
        rank,
        rankLabel: formatCardRank(rank),
        colorGroup,
        suitColor,
        rotation: generateCardRotation(),
      });
    });
  }

  return posts.map((post) => dealtBySlug.get(post.meta.slug)!);
}

export function getGridTriples(
  count: number,
  cols: 1 | 2 | 3
): [number, number, number][] {
  if (count < 3) return [];

  if (cols !== 3) {
    const triples: [number, number, number][] = [];
    for (let i = 0; i <= count - 3; i += 1) {
      triples.push([i, i + 1, i + 2]);
    }
    return triples;
  }

  const triples: [number, number, number][] = [];
  const totalRows = Math.ceil(count / 3);

  // Horizontal rows
  for (let r = 0; r < totalRows; r += 1) {
    const i0 = r * 3;
    const i2 = i0 + 2;
    if (i2 < count) {
      triples.push([i0, i0 + 1, i2]);
    }
  }

  // Vertical columns
  for (let c = 0; c < 3; c += 1) {
    for (let r = 0; r + 2 < totalRows; r += 1) {
      const i0 = r * 3 + c;
      const i1 = (r + 1) * 3 + c;
      const i2 = (r + 2) * 3 + c;
      if (i2 < count) {
        triples.push([i0, i1, i2]);
      }
    }
  }

  // Diagonals (\ and /)
  for (let r = 0; r + 2 < totalRows; r += 1) {
    const downDiagEnd = (r + 2) * 3 + 2;
    if (downDiagEnd < count) {
      triples.push([r * 3, (r + 1) * 3 + 1, downDiagEnd]);
    }
    const upDiagStart = r * 3 + 2;
    const upDiagEnd = (r + 2) * 3;
    if (upDiagStart < count && upDiagEnd < count) {
      triples.push([upDiagStart, (r + 1) * 3 + 1, upDiagEnd]);
    }
  }

  return triples;
}

export function evaluateTriple(
  cards: readonly [DealtCard, DealtCard, DealtCard],
  indices: [number, number, number]
): DetectedCombo | null {
  const [c0, c1, c2] = cards;
  const sameCategory = c0.category === c1.category && c1.category === c2.category;
  const sameColor = c0.colorGroup === c1.colorGroup && c1.colorGroup === c2.colorGroup;

  const sorted = [c0.rank, c1.rank, c2.rank].sort((a, b) => a - b);
  const isRoyalRanks = sorted[0] === 1 && sorted[1] === 12 && sorted[2] === 13;
  const isSequential = sorted[1] === sorted[0] + 1 && sorted[2] === sorted[1] + 1;
  const isStraight = isRoyalRanks || isSequential;
  const seqKey = isRoyalRanks ? 'Q-K-A' : sorted.map(formatCardRank).join('-');
  const isThreeOfAKind = c0.rank === c1.rank && c1.rank === c2.rank;
  const slugs: [string, string, string] = [c0.slug, c1.slug, c2.slug];

  if (sameCategory && isRoyalRanks) {
    return {
      type: 'royal-flush',
      label: 'Royal Flush',
      subtitle: c0.category,
      points: 10,
      actionId: `combo:royal-flush:${c0.category}`,
      tone: 'crimson',
      indices,
      slugs,
    };
  }

  if (sameCategory && isStraight) {
    return {
      type: 'straight-flush',
      label: 'Straight Flush',
      subtitle: `${c0.category} · ${seqKey}`,
      points: 9,
      actionId: `combo:straight-flush:${c0.category}:${seqKey}`,
      tone: 'crimson',
      indices,
      slugs,
    };
  }

  if (isThreeOfAKind) {
    const rankLabel = formatCardRank(c0.rank);
    return {
      type: 'three-of-a-kind',
      label: 'Three of a Kind',
      subtitle: `${rankLabel}s`,
      points: 7,
      actionId: `combo:three-of-a-kind:${rankLabel}`,
      tone: 'amber',
      indices,
      slugs,
    };
  }

  if (isStraight) {
    return {
      type: 'straight',
      label: 'Straight',
      subtitle: seqKey,
      points: 6,
      actionId: `combo:straight:${seqKey}`,
      tone: 'amber',
      indices,
      slugs,
    };
  }

  if (sameCategory) {
    return {
      type: 'flush',
      label: 'Flush',
      subtitle: c0.category,
      points: 5,
      actionId: `combo:flush:${c0.category}`,
      tone: 'emerald',
      indices,
      slugs,
    };
  }

  if (sameColor) {
    const colorName = c0.colorGroup === 'red' ? 'Red' : 'Black';
    return {
      type: 'suit',
      label: 'Suit',
      subtitle: colorName,
      points: 3,
      actionId: `combo:suit:${c0.colorGroup}`,
      tone: 'emerald',
      indices,
      slugs,
    };
  }

  return null;
}

function buildClosingTriplesMap(
  count: number,
  triples: readonly [number, number, number][]
): [number, number, number][][] {
  const byMaxIndex: [number, number, number][][] = Array.from(
    { length: count },
    () => []
  );
  for (const triple of triples) {
    const maxIdx = Math.max(triple[0], triple[1], triple[2]);
    if (maxIdx < count) {
      byMaxIndex[maxIdx].push(triple);
    }
  }
  return byMaxIndex;
}

function solveComboFreeOrder(
  cards: readonly DealtCard[],
  triples: readonly [number, number, number][],
  maxSteps: number
): DealtCard[] | null {
  const n = cards.length;
  const closingTriples = buildClosingTriplesMap(n, triples);
  const placed: Array<DealtCard | undefined> = new Array(n);
  const used = new Array<boolean>(n).fill(false);
  const pool = shuffleArray(cards);
  let steps = 0;

  const backtrack = (pos: number): boolean => {
    if (pos === n) return true;
    if (steps >= maxSteps) return false;

    const checks = closingTriples[pos];
    // Try candidates in randomized order per depth to avoid deterministic dead ends
    const indices = shuffleArray(
      Array.from({ length: n }, (_, idx) => idx).filter((idx) => !used[idx])
    );

    for (const candidateIdx of indices) {
      steps += 1;
      if (steps > maxSteps) return false;

      const candidate = pool[candidateIdx];
      placed[pos] = candidate;

      let conflicts = false;
      for (let t = 0; t < checks.length; t += 1) {
        const triple = checks[t];
        const c0 = placed[triple[0]];
        const c1 = placed[triple[1]];
        const c2 = placed[triple[2]];
        if (c0 && c1 && c2 && evaluateTriple([c0, c1, c2], triple) !== null) {
          conflicts = true;
          break;
        }
      }

      if (!conflicts) {
        used[candidateIdx] = true;
        if (backtrack(pos + 1)) {
          return true;
        }
        used[candidateIdx] = false;
      }

      placed[pos] = undefined;
    }

    return false;
  };

  if (backtrack(0)) {
    return placed as DealtCard[];
  }
  return null;
}

function mergeUniqueTriples(
  a: readonly [number, number, number][],
  b: readonly [number, number, number][]
): [number, number, number][] {
  const seen = new Set<string>();
  const merged: [number, number, number][] = [];
  for (const t of [...a, ...b]) {
    const key = `${t[0]},${t[1]},${t[2]}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(t);
    }
  }
  return merged;
}

function countAllCombos(
  cards: readonly DealtCard[],
  triples: readonly [number, number, number][]
): number {
  let hits = 0;
  for (const triple of triples) {
    const [a, b, c] = triple;
    if (a < cards.length && b < cards.length && c < cards.length) {
      if (evaluateTriple([cards[a], cards[b], cards[c]], triple) !== null) {
        hits += 1;
      }
    }
  }
  return hits;
}

export function dealComboFreeDeck(
  posts: readonly BlogPostEntry[],
  cols: 1 | 2 | 3
): DealtCard[] {
  const activeTriples = getGridTriples(posts.length, cols);
  const altCols: 1 | 3 = cols === 3 ? 1 : 3;
  const combinedTriples = mergeUniqueTriples(
    activeTriples,
    getGridTriples(posts.length, altCols)
  );

  let bestFallback: DealtCard[] | null = null;
  let bestFallbackCombos = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const cards = dealRandomCategoryRanks(posts);

    const dualSolved = solveComboFreeOrder(cards, combinedTriples, 450);
    if (dualSolved) {
      return dualSolved;
    }

    const activeSolved = solveComboFreeOrder(cards, activeTriples, 1400);
    if (activeSolved) {
      return activeSolved;
    }

    const candidate = shuffleArray(cards);
    const comboCount = countAllCombos(candidate, activeTriples);
    if (comboCount < bestFallbackCombos) {
      bestFallbackCombos = comboCount;
      bestFallback = candidate;
    }
  }

  return bestFallback ?? dealRandomCategoryRanks(posts);
}

export function arrayMove<T>(arr: readonly T[], from: number, to: number): T[] {
  if (from === to) return [...arr];
  const copy = [...arr];
  const [moved] = copy.splice(from, 1);
  if (moved === undefined) return copy;
  copy.splice(to, 0, moved);
  return copy;
}

export function findNewlyFormedCombos(
  prevDeck: readonly DealtCard[],
  nextDeck: readonly DealtCard[],
  fromIdx: number,
  toIdx: number,
  cols: 1 | 2 | 3
): DetectedCombo[] {
  if (fromIdx === toIdx) return [];

  const minChanged = Math.min(fromIdx, toIdx);
  const maxChanged = Math.max(fromIdx, toIdx);
  const triples = getGridTriples(nextDeck.length, cols);
  const detected: DetectedCombo[] = [];

  for (const triple of triples) {
    const [a, b, c] = triple;
    const touchesChangedRange =
      (a >= minChanged && a <= maxChanged) ||
      (b >= minChanged && b <= maxChanged) ||
      (c >= minChanged && c <= maxChanged);

    if (!touchesChangedRange) continue;

    const prevA = prevDeck[a];
    const prevB = prevDeck[b];
    const prevC = prevDeck[c];
    const nextA = nextDeck[a];
    const nextB = nextDeck[b];
    const nextC = nextDeck[c];

    if (!nextA || !nextB || !nextC) continue;

    if (
      prevA?.slug === nextA.slug &&
      prevB?.slug === nextB.slug &&
      prevC?.slug === nextC.slug
    ) {
      continue;
    }

    const combo = evaluateTriple([nextA, nextB, nextC], triple);
    if (combo) {
      detected.push(combo);
    }
  }

  return detected.sort((x, y) => y.points - x.points);
}
