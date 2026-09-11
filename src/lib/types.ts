import type { ClassKey, StatKey, StrengthKey } from '../data/strengths';

export interface TopStrength {
  key: StrengthKey | null;
  en: string;
  ja: string;
}

/** アプリ内で使う分析結果（AI/フォールバック共通） */
export interface AnalysisResult {
  mainStrength: TopStrength;
  mainStrengthDescription: string;
  topStrengths: TopStrength[];
  classKey: ClassKey;
  className: string;
  classNameJa: string;
  classDescription: string;
  summary: string;
  message: string;
  stats: Record<StatKey, number>;
  source: 'ai' | 'local';
}

/** AI API から返ってくる想定の JSON（仕様書 21 章） */
export interface AiAnalysisJson {
  mainStrength: string;
  mainStrengthDescription: string;
  topStrengths: string[];
  className: string;
  classNameJa: string;
  classDescription: string;
  summary: string;
  message: string;
  /** sense / design / system / judgment / bridge を 1〜5 で */
  stats: Record<StatKey, number>;
}

export type Screen = 'start' | 'player' | 'question' | 'analyzing' | 'result' | 'records';

export interface SavedState {
  version: 1;
  screen: Screen;
  name: string;
  answers: string[];
  index: number;
  result: AnalysisResult | null;
  /** 履歴に保存済みの結果なら、その ID */
  historyId: string | null;
  updatedAt: number;
}

/** あとから見返すための保存済み診断 */
export interface HistoryEntry {
  id: string;
  name: string;
  answers: string[];
  result: AnalysisResult;
  createdAt: number;
}
