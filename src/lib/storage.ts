import { QUESTION_COUNT } from '../data/questions';
import type { HistoryEntry, SavedState } from './types';

// v2: 強みカテゴリーとステータス軸を刷新（v1 のデータは互換性がないため読まない）
const KEY = 'hidden-skill:state:v2';
const SOUND_KEY = 'hidden-skill:sound';

export function emptyAnswers(): string[] {
  return Array.from({ length: QUESTION_COUNT }, () => '');
}

export function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    if (parsed.version !== 1 || !Array.isArray(parsed.answers)) return null;
    const answers = emptyAnswers().map((_, i) => (typeof parsed.answers?.[i] === 'string' ? parsed.answers[i] : ''));
    return {
      version: 1,
      screen: parsed.screen ?? 'start',
      name: parsed.name ?? '',
      answers,
      index: Math.min(Math.max(parsed.index ?? 0, 0), QUESTION_COUNT - 1),
      result: parsed.result ?? null,
      historyId: parsed.historyId ?? null,
      updatedAt: parsed.updatedAt ?? Date.now(),
    };
  } catch {
    return null;
  }
}

// ---- 履歴（RECORDS） ----
const HISTORY_KEY = 'hidden-skill:history:v2';
const HISTORY_MAX = 50;

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e): e is HistoryEntry =>
          typeof e === 'object' && e !== null && typeof (e as HistoryEntry).id === 'string' && Boolean((e as HistoryEntry).result),
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

function writeHistory(entries: HistoryEntry[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, HISTORY_MAX)));
  } catch {
    /* noop */
  }
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'createdAt'>): HistoryEntry {
  const created: HistoryEntry = {
    ...entry,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
  };
  writeHistory([created, ...loadHistory()]);
  return created;
}

export function deleteHistoryEntry(id: string): HistoryEntry[] {
  const next = loadHistory().filter((e) => e.id !== id);
  writeHistory(next);
  return next;
}

export function saveState(state: Omit<SavedState, 'version' | 'updatedAt'>): void {
  try {
    const payload: SavedState = { ...state, version: 1, updatedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch {
    /* localStorage が使えない環境では何もしない */
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}

export function hasProgress(state: SavedState | null): boolean {
  if (!state) return false;
  if (state.screen === 'start') return false;
  return Boolean(state.name) || state.answers.some((a) => a.trim());
}

export function loadSoundPref(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) === 'on';
  } catch {
    return false;
  }
}

export function saveSoundPref(on: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
  } catch {
    /* noop */
  }
}
