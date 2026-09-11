# HIDDEN SKILL

仕事仲間を1人思い浮かべて10問に答えると、その人の「見えていない強み」を発見できる
スマートフォン向け Web アプリ（React + TypeScript + Vite / PWA）。

```
START → 対象者入力 → QUESTION 01〜10 → ANALYZING... → HIDDEN SKILL FOUND! → RESULT → カード保存 → NEW PLAYER
```

## 開発

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # dist/ に静的ファイルを出力（PWA の sw.js / manifest も生成）
npm run preview    # ビルド結果を確認
```

> **注意（Google ドライブ上のフォルダで作業する場合）**
> ドライブの仮想ファイルシステムでは `npm install` が失敗します（EBADF）。
> `C:\Users\hp\dev\hidden-skill` のようなローカルフォルダにコピーしてから実行してください。
> ソース一式（node_modules と dist 以外）はそのままコピーして動きます。

### フォント・アイコンの再生成

- `node scripts/fetch-fonts.mjs` … Google Fonts から DotGothic16 / Press Start 2P（SIL OFL）を `public/fonts/` にダウンロードして自前ホスト化
- `node scripts/gen-icons.mjs` … PWA 用アイコン PNG（192 / 512 / apple-touch-icon）を生成

## 構成

```
src/
  data/questions.ts     質問10問・入力例・「思いつかない…」ヒント
  data/strengths.ts     強み18カテゴリー / CLASS 10種 / 文章テンプレート / キーワード
  lib/analyze.ts        キーワードベースの簡易分析（フォールバック）
  lib/ai.ts             AI API 連携（VITE_AI_ENDPOINT 設定時のみ）＋ 分析プロンプト
  lib/fontEmbed.ts      画像保存時に必要なフォントだけ埋め込む
  lib/storage.ts        localStorage（途中再開・削除）
  lib/sound.ts          Web Audio API で生成するレトロ SE
  components/
    StartScreen / PlayerInputScreen / QuestionScreen / ProgressBar
    AnalyzingScreen / ResultScreen / ResultCard / SoundButton / PixelButton
server-example/analyze.mjs   AI 分析プロキシのサンプル（Claude API）
```

## 分析ロジック

1. `VITE_AI_ENDPOINT` が設定されていれば、10問の回答と分析プロンプトを POST し、
   仕様書の JSON（mainStrength / topStrengths / className / summary / message / stats）を受け取る
2. 未設定・失敗・タイムアウト（20秒）のときは `lib/analyze.ts` のキーワード分析にフォールバック
   - 18カテゴリーの類義キーワードを部分一致でカウント（全角半角ゆらぎを吸収）
   - 質問ごとに映しやすい強みへ少し加点、複数の回答にまたがる強みを優先
   - ステータス（★）は最大を5、その他を相対評価（最低2。ネガティブ評価はしない）
   - Q10 → Q5 → Q4 の回答から一節を抜き出し、本人へのメッセージに添える

RESULT 画面右下の `ANALYSIS: AI / LOCAL` でどちらが使われたか分かります。

## AI 連携を有効にする

1. `server-example/analyze.mjs` を参考にプロキシを立てる（API キーはサーバー側のみ）
   ```bash
   cd server-example
   npm init -y && npm install @anthropic-ai/sdk
   ANTHROPIC_API_KEY=sk-ant-... node analyze.mjs   # http://localhost:8787
   ```
2. `.env` に `VITE_AI_ENDPOINT=http://localhost:8787` を書いてビルド

サーバーには `{ name, answers: [{id, question, answer}], prompt }` が届きます。
`prompt` は `src/lib/ai.ts` の `buildAnalysisPrompt()` で組み立てた分析指示
（断定しない・ネガティブを出さない・回答が薄いときの言い回し）です。

## デプロイ（GitHub Pages）

公開 URL: **https://kasugai-s-web.github.io/hidden-skill/**
リポジトリ: https://github.com/kasugai-s-web/hidden-skill

`main` に push すると `.github/workflows/deploy.yml`（GitHub Actions）が自動でビルドして公開します。
更新手順（ローカルミラー `C:\Users\hp\dev\hidden-skill` で実行）:

```bash
git add -A
git commit -m "変更内容"
git push origin main
```

1分ほどで反映されます。進行状況は `gh run list` か、リポジトリの Actions タブで確認できます。
Pages の Source は「GitHub Actions」に設定済みです（初回に使った `gh-pages` ブランチは不要になったので削除して構いません）。

`base: './'` なのでサブディレクトリ配置でも動きます。HTTPS で配信されるため
iPhone Safari の「ホーム画面に追加」でフルスクリーンのアプリとして起動できます。

## データの扱い

- 名前・回答は端末の localStorage にのみ保存（AI 連携を有効にした場合だけサーバーへ送信）
- RESULT 画面の「回答データを削除」で消去
- 画像保存は `html-to-image` でブラウザ内生成。iPhone では共有シートから「画像を保存」
