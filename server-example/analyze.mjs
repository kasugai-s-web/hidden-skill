// HIDDEN SKILL — AI 分析プロキシのサンプル（Node 20+）
//
// ブラウザから直接 API キーを扱わないための最小サーバー。
// フロント側は VITE_AI_ENDPOINT にこのサーバーの URL を入れると、
// { name, answers, prompt } を POST し、仕様書 21 章の JSON を受け取ります。
//
// 起動:
//   cd server-example
//   npm init -y && npm install @anthropic-ai/sdk
//   ANTHROPIC_API_KEY=sk-ant-... node analyze.mjs
//
// 認証は ANTHROPIC_API_KEY か `ant auth login` のプロファイルから自動解決されます。
import { createServer } from 'node:http';
import Anthropic from '@anthropic-ai/sdk';

const PORT = Number(process.env.PORT ?? 8787);
const MODEL = process.env.CLAUDE_MODEL ?? 'claude-opus-5';
// 本番では自分のアプリの origin に絞ってください
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN ?? '*';

const client = new Anthropic();

// 仕様書 21 章の JSON 形式（構造化出力でこの形を保証する）
const RESULT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'mainStrength',
    'mainStrengthDescription',
    'topStrengths',
    'className',
    'classNameJa',
    'classDescription',
    'summary',
    'message',
    'stats',
  ],
  properties: {
    mainStrength: { type: 'string' },
    mainStrengthDescription: { type: 'string' },
    topStrengths: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 3 },
    className: { type: 'string' },
    classNameJa: { type: 'string' },
    classDescription: { type: 'string' },
    summary: { type: 'string' },
    message: { type: 'string' },
    stats: {
      type: 'object',
      additionalProperties: false,
      // 察知 / 設計 / 仕組み化 / 判断 / 橋渡し
      required: ['sense', 'design', 'system', 'judgment', 'bridge'],
      properties: {
        sense: { type: 'integer', minimum: 1, maximum: 5 },
        design: { type: 'integer', minimum: 1, maximum: 5 },
        system: { type: 'integer', minimum: 1, maximum: 5 },
        judgment: { type: 'integer', minimum: 1, maximum: 5 },
        bridge: { type: 'integer', minimum: 1, maximum: 5 },
      },
    },
  },
};

const SYSTEM = [
  'あなたは職場の仲間の「見えにくい良いところ」を見つけるアシスタントです。',
  '人事評価や能力判定のような断定はせず、回答から見える良いところだけを抽出します。',
  'ネガティブな評価は一切出しません。回答が少ない・薄い場合も勝手な性格判断はせず、',
  '「今回の回答からは○○という強みが特に見えました」という表現にします。',
  '本人に見せたとき「自分のこういうところを見てくれていたんだ」と嬉しくなる文章にしてください。',
].join('\n');

async function analyze({ prompt }) {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM,
    output_config: {
      effort: 'medium',
      format: { type: 'json_schema', schema: RESULT_SCHEMA },
    },
    messages: [{ role: 'user', content: prompt }],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error('refused');
  }
  const text = response.content.find((b) => b.type === 'text')?.text ?? '';
  return JSON.parse(text);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 200_000) reject(new Error('payload too large'));
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOW_ORIGIN);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.writeHead(405).end();
    return;
  }
  try {
    const body = JSON.parse(await readBody(req));
    if (typeof body?.prompt !== 'string') throw new Error('prompt required');
    const json = await analyze(body);
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(json));
  } catch (err) {
    // 失敗時は 500 を返す → フロントはキーワード分析にフォールバックする
    if (err instanceof Anthropic.APIError) {
      console.error(`Claude API error ${err.status}:`, err.message);
    } else {
      console.error(err);
    }
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'analysis failed' }));
  }
}).listen(PORT, () => {
  console.log(`HIDDEN SKILL analyze server: http://localhost:${PORT}  (model: ${MODEL})`);
});
