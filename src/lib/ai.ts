// AI API 連携（任意）。VITE_AI_ENDPOINT が設定されているときだけ使う。
// ブラウザから直接 API キーを扱わないよう、サーバー側プロキシ（server-example/ 参照）を想定。
import {
  CLASSES,
  STAT_LABELS_JA,
  STAT_ORDER,
  STRENGTHS,
  STRENGTH_KEYS,
  type ClassKey,
  type StatKey,
} from '../data/strengths';
import { QUESTIONS } from '../data/questions';
import type { AiAnalysisJson, AnalysisResult, TopStrength } from './types';

const ENDPOINT: string | undefined = import.meta.env.VITE_AI_ENDPOINT;
const TIMEOUT_MS = 20000;

export function isAiEnabled(): boolean {
  return Boolean(ENDPOINT);
}

/** サーバー側で AI に渡す想定の分析指示（仕様書 22 章） */
export function buildAnalysisPrompt(name: string, answers: string[]): string {
  const qa = QUESTIONS.map((q, i) => `Q${q.id}. ${q.text}\nA: ${answers[i]?.trim() || '（未回答）'}`).join('\n\n');
  const strengthList = STRENGTH_KEYS.map((k) => STRENGTHS[k].ja).join('、');
  const classList = (Object.keys(CLASSES) as ClassKey[])
    .map((k) => `${CLASSES[k].en}（${CLASSES[k].ja}）`)
    .join('、');

  return [
    'あなたは、職場の仲間の「見えにくい良いところ」を見つけるアシスタントです。',
    `回答者が「${name}」という人物を思い浮かべて、10個の質問に自由記述で答えました。`,
    '',
    '## ルール',
    '- 人事評価や能力判定のような断定は絶対にしないでください。',
    '- 回答から見える「良いところ」だけを抽出してください。ネガティブな評価は一切出さないでください。',
    '- 回答が少ない・内容が薄い場合も勝手な性格判断はせず、「今回の回答からは○○という強みが特に見えました」という表現にしてください。',
    '- 本人に見せても嬉しくなる、具体的で温かい文章にしてください。回答に出てきたエピソードや言葉を活かしてください。',
    '- 「判断力」「信頼力」のような分かりやすい王道の能力ではなく、一緒に働いているからこそ見える「地味だが効いている力」を見つけてください。',
    `- 強みは次のカテゴリーから選んでください（定義は各カテゴリーの説明に従う）：${strengthList}`,
    ...STRENGTH_KEYS.map((k) => `  - ${STRENGTHS[k].ja}：${STRENGTHS[k].tagline.replace('\n', '')}`),
    `- className は次から選んでください：${classList}`,
    `- stats は ${STAT_ORDER.map((s) => `${s}（${STAT_LABELS_JA[s]}）`).join('・')} の5軸を 1〜5 の整数で。この回答から相対的に見える特徴を表すだけにしてください（最低でも 2 以上）。`,
    '- summary は 100〜150 文字、message は 80〜150 文字程度の日本語。',
    '',
    '## 回答',
    qa,
    '',
    '## 出力形式',
    '次の JSON だけを返してください（前後に説明文を付けない）。',
    JSON.stringify(
      {
        mainStrength: '未完了察知力',
        mainStrengthDescription: '一見終わっている仕事から\n確認漏れや残作業を見つける力',
        topStrengths: ['未完了察知力', '善意依存排除力', '違和感検知力'],
        className: 'SENTINEL',
        classNameJa: '見張り番',
        classDescription: '小さな異変や漏れにいち早く気づき、問題になる前に知らせる',
        summary: '',
        message: '',
        stats: { sense: 5, design: 3, system: 4, judgment: 3, bridge: 2 },
      },
      null,
      2,
    ),
  ].join('\n');
}

function findStrengthByName(nameJaOrEn: string): TopStrength {
  const n = nameJaOrEn.trim().toLowerCase();
  for (const key of STRENGTH_KEYS) {
    const def = STRENGTHS[key];
    if (def.ja === nameJaOrEn.trim() || def.en.toLowerCase() === n || key.toLowerCase() === n) {
      return { key, en: def.en, ja: def.ja };
    }
  }
  return { key: null, en: nameJaOrEn.toUpperCase(), ja: nameJaOrEn };
}

function findClass(en: string): ClassKey | null {
  const n = en.trim().toUpperCase().replace(/[\s_-]+/g, '_');
  return (Object.keys(CLASSES) as ClassKey[]).find((k) => k === n) ?? null;
}

function clampStat(v: unknown): number {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return 3;
  return Math.min(5, Math.max(1, Math.round(n)));
}

/** AI の JSON をアプリ内部の結果型へ正規化 */
export function normalizeAiResult(json: AiAnalysisJson): AnalysisResult {
  const main = findStrengthByName(json.mainStrength);
  const top = (Array.isArray(json.topStrengths) ? json.topStrengths : [])
    .filter((s) => typeof s === 'string' && s.trim())
    .slice(0, 3)
    .map(findStrengthByName);
  while (top.length < 3) top.push(main);

  const classKey = findClass(json.className) ?? (main.key ? STRENGTHS[main.key].classKey : 'SENTINEL');
  const cls = CLASSES[classKey];

  const stats = {} as Record<StatKey, number>;
  for (const s of STAT_ORDER) {
    stats[s] = clampStat(json.stats?.[s]);
  }

  return {
    mainStrength: main,
    mainStrengthDescription: json.mainStrengthDescription || (main.key ? STRENGTHS[main.key].tagline : ''),
    topStrengths: top,
    classKey,
    className: cls.en,
    classNameJa: json.classNameJa || cls.ja,
    classDescription: json.classDescription || cls.description,
    summary: json.summary ?? '',
    message: json.message ?? '',
    stats,
    source: 'ai',
  };
}

/**
 * AI で分析する。エンドポイント未設定・失敗時は null を返す（呼び出し側でフォールバック）。
 * サーバーには { name, answers, prompt } を POST し、AiAnalysisJson が返る想定。
 */
export async function analyzeWithAI(name: string, answers: string[]): Promise<AnalysisResult | null> {
  if (!ENDPOINT) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        answers: QUESTIONS.map((q, i) => ({ id: q.id, question: q.text, answer: answers[i] ?? '' })),
        prompt: buildAnalysisPrompt(name, answers),
      }),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as AiAnalysisJson;
    if (!json || typeof json.mainStrength !== 'string' || typeof json.summary !== 'string') return null;
    return normalizeAiResult(json);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
