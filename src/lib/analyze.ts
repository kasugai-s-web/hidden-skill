// キーワードベースの簡易分析（AI が使えないときのフォールバック）
import {
  CLASSES,
  HINT_KEYWORDS,
  QUESTION_AFFINITY,
  STAT_ORDER,
  STRENGTHS,
  STRENGTH_KEYS,
  type StatKey,
  type StrengthKey,
} from '../data/strengths';
import { QUESTIONS } from '../data/questions';
import type { AnalysisResult, TopStrength } from './types';

const AFFINITY_WEIGHT = 0.6;
const KEYWORD_WEIGHT = 1.0;
const HINT_WEIGHT = 0.8;
/** 1つの回答に同じ系統の語が並んでも、それだけで突出しないよう上限を設ける */
const MAX_KEYWORD_HITS_PER_ANSWER = 2;
/** 複数の回答にまたがって現れる強みを優先する（回答ごとの加点） */
const BREADTH_BONUS = 0.5;

/** 全角/半角・空白のゆらぎを吸収する */
function normalize(text: string): string {
  return text
    .normalize('NFKC')
    .replace(/\s+/g, '')
    .toLowerCase();
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let pos = 0;
  while ((pos = haystack.indexOf(needle, pos)) !== -1) {
    count += 1;
    pos += needle.length;
  }
  return count;
}

export function scoreStrengths(answers: string[]): Record<StrengthKey, number> {
  const scores = Object.fromEntries(STRENGTH_KEYS.map((k) => [k, 0])) as Record<StrengthKey, number>;

  answers.forEach((raw, i) => {
    const text = normalize(raw ?? '');
    if (!text) return;
    const qid = QUESTIONS[i]?.id ?? i + 1;

    // 質問そのものが映しやすい強みに少し加点
    for (const key of QUESTION_AFFINITY[qid] ?? []) {
      scores[key] += AFFINITY_WEIGHT;
    }

    // キーワード（意味の近い語も含む）
    for (const key of STRENGTH_KEYS) {
      let hits = 0;
      for (const kw of STRENGTHS[key].keywords) {
        hits += countOccurrences(text, normalize(kw));
      }
      if (hits > 0) {
        scores[key] += Math.min(hits, MAX_KEYWORD_HITS_PER_ANSWER) * KEYWORD_WEIGHT + BREADTH_BONUS;
      }
    }

    // 「思いつかない…」のヒント語がそのまま含まれている場合
    for (const [hint, keys] of Object.entries(HINT_KEYWORDS)) {
      if (text.includes(normalize(hint))) {
        for (const key of keys) scores[key] += HINT_WEIGHT;
      }
    }
  });

  return scores;
}

function rankStrengths(scores: Record<StrengthKey, number>): StrengthKey[] {
  // 同点のときは質問の並び（定義順）で安定ソート
  return [...STRENGTH_KEYS].sort((a, b) => scores[b] - scores[a]);
}

export function computeStats(scores: Record<StrengthKey, number>): Record<StatKey, number> {
  const raw: Record<StatKey, number> = {
    trust: 0,
    support: 0,
    action: 0,
    communication: 0,
    problemSolving: 0,
  };
  for (const key of STRENGTH_KEYS) {
    raw[STRENGTHS[key].stat] += scores[key];
  }
  const max = Math.max(...STAT_ORDER.map((s) => raw[s]), 0.0001);
  const stats = {} as Record<StatKey, number>;
  for (const s of STAT_ORDER) {
    // 相対評価：最大を★5、それ以外は最低★2（ネガティブ評価はしない）
    const v = 2 + Math.round((raw[s] / max) * 3);
    stats[s] = Math.min(5, Math.max(1, v));
  }
  return stats;
}

export function toTopStrength(key: StrengthKey): TopStrength {
  const def = STRENGTHS[key];
  return { key, en: def.en, ja: def.ja };
}

function fill(template: string, name: string): string {
  return template.replaceAll('{name}', name);
}

/** 回答から短い一節を抜き出す（本人への言葉に添える） */
function pickEpisode(answers: string[]): string | null {
  const candidates = [answers[9], answers[4], answers[3]]; // Q10 → Q5 → Q4
  for (const a of candidates) {
    const t = (a ?? '').trim().replace(/\s+/g, ' ');
    if (t.length >= 6) {
      return t.length > 34 ? `${t.slice(0, 33)}…` : t;
    }
  }
  return null;
}

export function analyzeLocally(name: string, answers: string[]): AnalysisResult {
  const scores = scoreStrengths(answers);
  const ranked = rankStrengths(scores);
  const [first, second, third] = ranked;
  const main = STRENGTHS[first];
  const cls = CLASSES[main.classKey];

  const summaryBase = fill(main.summary, name);
  const summary = `${summaryBase}あわせて「${STRENGTHS[second].ja}」「${STRENGTHS[third].ja}」の面も感じられます。`;

  const episode = pickEpisode(answers);
  const message = episode
    ? `${fill(main.message, name)}\n「${episode}」──そんな瞬間を、ちゃんと覚えている仲間がいます。`
    : fill(main.message, name);

  return {
    mainStrength: toTopStrength(first),
    mainStrengthDescription: main.tagline,
    topStrengths: [first, second, third].map(toTopStrength),
    classKey: cls.key,
    className: cls.en,
    classNameJa: cls.ja,
    classDescription: cls.description,
    summary,
    message,
    stats: computeStats(scores),
    source: 'local',
  };
}
