import { QUESTION_COUNT } from '../data/questions';
import type { SavedState } from './types';

const KEY = 'hidden-skill:state:v1';
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
      updatedAt: parsed.updatedAt ?? Date.now(),
    };
  } catch {
    return null;
  }
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
