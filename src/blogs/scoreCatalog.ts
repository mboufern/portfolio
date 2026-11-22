import type { BlogCategory, BlogPostEntry } from './types';
import type { ComboType } from './cardDeck';

export const ARTICLE_OPEN_POINTS = 2;
export const ARTICLE_READ_POINTS = 5;

export interface ComboCatalogEntry {
  type: ComboType;
  label: string;
  points: number;
  rule: string;
}

export interface ComboProgressItem extends ComboCatalogEntry {
  isUnlocked: boolean;
  unlockedTraits: string[];
  lockedTraits: string[];
  earnedPoints: number;
}

export interface PublishedArticleProgress {
  slug: string;
  title: string;
  category: BlogCategory;
  opened: boolean;
  finished: boolean;
}

export interface ScoreProgressSummary {
  combos: ComboProgressItem[];
  unlockedComboCount: number;
  totalComboTypes: number;
  comboPoints: number;
  openedCount: number;
  totalArticles: number;
  openedPoints: number;
  finishedCount: number;
  publishedCount: number;
  finishedPoints: number;
  articlePoints: number;
  publishedArticles: PublishedArticleProgress[];
}

export const COMBO_CATALOG: readonly ComboCatalogEntry[] = [
  {
    type: 'suit',
    label: 'Suit',
    points: 3,
    rule: '3 cards of the same color',
  },
  {
    type: 'flush',
    label: 'Flush',
    points: 5,
    rule: '3 cards of the same category',
  },
  {
    type: 'straight',
    label: 'Straight',
    points: 6,
    rule: '3 consecutive ranks (A–2–3 to Q–K–A)',
  },
  {
    type: 'three-of-a-kind',
    label: 'Three of a Kind',
    points: 7,
    rule: '3 cards with the same rank',
  },
  {
    type: 'straight-flush',
    label: 'Straight Flush',
    points: 9,
    rule: '3 consecutive ranks in same category',
  },
  {
    type: 'royal-flush',
    label: 'Royal Flush',
    points: 10,
    rule: 'Q · K · A in the same category',
  },
];

function formatComboTrait(type: ComboType, rawTrait: string): string {
  switch (type) {
    case 'suit':
      return rawTrait === 'red' ? 'Red' : rawTrait === 'black' ? 'Black' : rawTrait;
    case 'three-of-a-kind':
      return `${rawTrait}s`;
    case 'straight-flush': {
      const colonIdx = rawTrait.indexOf(':');
      if (colonIdx === -1) return rawTrait;
      const cat = rawTrait.slice(0, colonIdx);
      const seq = rawTrait.slice(colonIdx + 1);
      return `${cat} · ${seq}`;
    }
    default:
      return rawTrait;
  }
}

export function summarizeScoreProgress(
  completedActions: readonly string[],
  posts: readonly BlogPostEntry[]
): ScoreProgressSummary {
  const categoryCounts = new Map<BlogCategory, number>();
  for (const post of posts) {
    categoryCounts.set(
      post.meta.category,
      (categoryCounts.get(post.meta.category) ?? 0) + 1
    );
  }

  const flushCategories: string[] = [];
  for (const [cat, count] of categoryCounts.entries()) {
    if (count >= 3) {
      flushCategories.push(cat);
    }
  }

  const unlockedByType = new Map<ComboType, string[]>();
  const openedSlugs = new Set<string>();
  const finishedSlugs = new Set<string>();

  for (const actionId of completedActions) {
    if (actionId.startsWith('combo:')) {
      const parts = actionId.split(':');
      const comboType = parts[1] as ComboType | undefined;
      const rawTrait = parts.slice(2).join(':');
      if (comboType && rawTrait) {
        const list = unlockedByType.get(comboType);
        if (list) {
          if (!list.includes(rawTrait)) list.push(rawTrait);
        } else {
          unlockedByType.set(comboType, [rawTrait]);
        }
      }
    } else if (actionId.startsWith('article:open:')) {
      const slug = actionId.slice('article:open:'.length);
      if (slug) openedSlugs.add(slug);
    } else if (actionId.startsWith('article:read:')) {
      const slug = actionId.slice('article:read:'.length);
      if (slug) finishedSlugs.add(slug);
    }
  }

  const combos: ComboProgressItem[] = COMBO_CATALOG.map((entry) => {
    const rawUnlocked = unlockedByType.get(entry.type) ?? [];
    const unlockedSet = new Set(rawUnlocked);

    let finiteRawTraits: readonly string[] | null = null;
    if (entry.type === 'suit') {
      finiteRawTraits = ['red', 'black'];
    } else if (entry.type === 'flush' || entry.type === 'royal-flush') {
      finiteRawTraits = flushCategories;
    }

    const unlockedTraits = rawUnlocked.map((t) => formatComboTrait(entry.type, t));
    const lockedTraits = finiteRawTraits
      ? finiteRawTraits
          .filter((t) => !unlockedSet.has(t))
          .map((t) => formatComboTrait(entry.type, t))
      : [];

    const earnedPoints = rawUnlocked.length * entry.points;

    return {
      ...entry,
      isUnlocked: rawUnlocked.length > 0,
      unlockedTraits,
      lockedTraits,
      earnedPoints,
    };
  });

  const unlockedComboCount = combos.filter((c) => c.isUnlocked).length;
  const comboPoints = combos.reduce((sum, c) => sum + c.earnedPoints, 0);

  const openedCount = posts.filter((p) => openedSlugs.has(p.meta.slug)).length;
  const totalArticles = posts.length;
  const openedPoints = openedCount * ARTICLE_OPEN_POINTS;

  const publishedPosts = posts.filter((p) => !p.meta.isDraft);
  const publishedCount = publishedPosts.length;
  const finishedCount = publishedPosts.filter((p) =>
    finishedSlugs.has(p.meta.slug)
  ).length;
  const finishedPoints = finishedCount * ARTICLE_READ_POINTS;
  const articlePoints = openedPoints + finishedPoints;

  const publishedArticles: PublishedArticleProgress[] = publishedPosts.map((p) => ({
    slug: p.meta.slug,
    title: p.meta.title,
    category: p.meta.category,
    opened: openedSlugs.has(p.meta.slug),
    finished: finishedSlugs.has(p.meta.slug),
  }));

  return {
    combos,
    unlockedComboCount,
    totalComboTypes: COMBO_CATALOG.length,
    comboPoints,
    openedCount,
    totalArticles,
    openedPoints,
    finishedCount,
    publishedCount,
    finishedPoints,
    articlePoints,
    publishedArticles,
  };
}
