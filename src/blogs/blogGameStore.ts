import { useSyncExternalStore } from 'react';

export interface BlogGameSnapshot {
  score: number;
  completedActions: string[];
}

export type ScoreToastTone = 'emerald' | 'amber' | 'crimson' | 'muted';

export interface ScoreToastItem {
  id: number;
  title: string;
  subtitle?: string;
  points: number | null;
  tone: ScoreToastTone;
}

export interface RecordBlogActionToast {
  title: string;
  subtitle?: string;
  tone?: ScoreToastTone;
  repeatTitle?: string;
}

const STORAGE_KEY = 'portfolio.blogGame.v1';
const TOAST_DURATION_MS = 3400;
const MAX_ACTIVE_TOASTS = 3;

const DEFAULT_SNAPSHOT: BlogGameSnapshot = {
  score: 0,
  completedActions: [],
};

const EMPTY_TOASTS: ScoreToastItem[] = [];

let cachedSnapshot: BlogGameSnapshot = readSnapshotFromStorage();
let cachedToasts: ScoreToastItem[] = EMPTY_TOASTS;
let nextToastId = 1;
let storageListenerAttached = false;

const storeListeners = new Set<() => void>();
const toastListeners = new Set<() => void>();
const toastTimers = new Map<number, number>();

function normalizeSnapshot(raw: unknown): BlogGameSnapshot {
  if (!raw || typeof raw !== 'object') {
    return { score: 0, completedActions: [] };
  }
  const obj = raw as Record<string, unknown>;
  const rawScore = obj.score;
  const score =
    typeof rawScore === 'number' && Number.isFinite(rawScore) && rawScore >= 0
      ? Math.floor(rawScore)
      : 0;
  const rawActions = obj.completedActions;
  const seen = new Set<string>();
  const completedActions: string[] = [];
  if (Array.isArray(rawActions)) {
    for (const item of rawActions) {
      if (typeof item === 'string' && item.length > 0 && !seen.has(item)) {
        seen.add(item);
        completedActions.push(item);
      }
    }
  }
  return { score, completedActions };
}

function readSnapshotFromStorage(): BlogGameSnapshot {
  if (typeof window === 'undefined') {
    return DEFAULT_SNAPSHOT;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { score: 0, completedActions: [] };
    return normalizeSnapshot(JSON.parse(raw));
  } catch {
    return { score: 0, completedActions: [] };
  }
}

function writeSnapshotToStorage(snapshot: BlogGameSnapshot): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore storage quota or private browsing errors
  }
}

function snapshotsEqual(a: BlogGameSnapshot, b: BlogGameSnapshot): boolean {
  if (a.score !== b.score) return false;
  if (a.completedActions.length !== b.completedActions.length) return false;
  for (let i = 0; i < a.completedActions.length; i += 1) {
    if (a.completedActions[i] !== b.completedActions[i]) return false;
  }
  return true;
}

function notifyStoreListeners(): void {
  for (const listener of storeListeners) {
    listener();
  }
}

function notifyToastListeners(): void {
  for (const listener of toastListeners) {
    listener();
  }
}

function ensureStorageListener(): void {
  if (storageListenerAttached || typeof window === 'undefined') return;
  storageListenerAttached = true;
  window.addEventListener('storage', (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    const next = readSnapshotFromStorage();
    if (!snapshotsEqual(cachedSnapshot, next)) {
      cachedSnapshot = next;
      notifyStoreListeners();
    }
  });
}

function subscribeStore(listener: () => void): () => void {
  ensureStorageListener();
  storeListeners.add(listener);
  return () => {
    storeListeners.delete(listener);
  };
}

function subscribeToasts(listener: () => void): () => void {
  toastListeners.add(listener);
  return () => {
    toastListeners.delete(listener);
  };
}

function dismissToast(id: number): void {
  const timer = toastTimers.get(id);
  if (timer !== undefined && typeof window !== 'undefined') {
    window.clearTimeout(timer);
    toastTimers.delete(id);
  }
  const filtered = cachedToasts.filter((t) => t.id !== id);
  if (filtered.length !== cachedToasts.length) {
    cachedToasts = filtered.length === 0 ? EMPTY_TOASTS : filtered;
    notifyToastListeners();
  }
}

function clearAllToasts(): void {
  if (typeof window !== 'undefined') {
    for (const timer of toastTimers.values()) {
      window.clearTimeout(timer);
    }
  }
  toastTimers.clear();
  if (cachedToasts.length > 0) {
    cachedToasts = EMPTY_TOASTS;
    notifyToastListeners();
  }
}

export function getBlogGameSnapshot(): BlogGameSnapshot {
  return cachedSnapshot;
}

function getToastsSnapshot(): ScoreToastItem[] {
  return cachedToasts;
}

export function emitScoreToast(toast: Omit<ScoreToastItem, 'id'>): void {
  const id = nextToastId;
  nextToastId += 1;

  const item: ScoreToastItem = {
    id,
    title: toast.title,
    subtitle: toast.subtitle,
    points: toast.points,
    tone: toast.tone,
  };

  let next = [...cachedToasts, item];
  if (next.length > MAX_ACTIVE_TOASTS) {
    const removed = next.slice(0, next.length - MAX_ACTIVE_TOASTS);
    next = next.slice(next.length - MAX_ACTIVE_TOASTS);
    if (typeof window !== 'undefined') {
      for (const old of removed) {
        const timer = toastTimers.get(old.id);
        if (timer !== undefined) {
          window.clearTimeout(timer);
          toastTimers.delete(old.id);
        }
      }
    }
  }

  cachedToasts = next;
  notifyToastListeners();

  if (typeof window !== 'undefined') {
    const timer = window.setTimeout(() => {
      dismissToast(id);
    }, TOAST_DURATION_MS);
    toastTimers.set(id, timer);
  }
}

export function recordBlogAction(
  actionId: string,
  points: number,
  toast?: RecordBlogActionToast
): { awarded: boolean; score: number } {
  const latest = readSnapshotFromStorage();
  if (!snapshotsEqual(cachedSnapshot, latest)) {
    cachedSnapshot = latest;
  }

  if (cachedSnapshot.completedActions.includes(actionId)) {
    if (toast?.repeatTitle) {
      emitScoreToast({
        title: toast.repeatTitle,
        subtitle: 'Already scored',
        points: null,
        tone: 'muted',
      });
    }
    return { awarded: false, score: cachedSnapshot.score };
  }

  const safePoints = Number.isFinite(points) ? Math.max(0, Math.floor(points)) : 0;
  const nextSnapshot: BlogGameSnapshot = {
    score: cachedSnapshot.score + safePoints,
    completedActions: [...cachedSnapshot.completedActions, actionId],
  };

  cachedSnapshot = nextSnapshot;
  writeSnapshotToStorage(nextSnapshot);
  notifyStoreListeners();

  if (toast) {
    emitScoreToast({
      title: toast.title,
      subtitle: toast.subtitle,
      points: safePoints,
      tone: toast.tone ?? 'emerald',
    });
  }

  return { awarded: true, score: nextSnapshot.score };
}

export function resetBlogGame(): void {
  const emptySnapshot: BlogGameSnapshot = { score: 0, completedActions: [] };
  cachedSnapshot = emptySnapshot;
  writeSnapshotToStorage(emptySnapshot);
  clearAllToasts();
  notifyStoreListeners();
}

export function useBlogGameScore() {
  const snapshot = useSyncExternalStore(
    subscribeStore,
    getBlogGameSnapshot,
    () => DEFAULT_SNAPSHOT
  );

  return {
    score: snapshot.score,
    completedActions: snapshot.completedActions,
    completedCount: snapshot.completedActions.length,
    recordAction: recordBlogAction,
    resetGame: resetBlogGame,
  };
}

export function useScoreToasts(): ScoreToastItem[] {
  return useSyncExternalStore(subscribeToasts, getToastsSnapshot, () => EMPTY_TOASTS);
}
