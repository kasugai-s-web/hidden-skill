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

## 強みのカテゴリー（20種）

「判断力」「信頼力」のような王道の能力ではなく、一緒に働いているからこそ見える力を扱います。
定義・キーワード・文章テンプレートは `src/data/strengths.ts` に一元管理。

| 強み | 定義 | ステータス軸 |
|---|---|---|
| 違和感検知力 | 数字・文章・相手の反応から「いつもと違う」を察知する | SENSE 察知 |
| 未完了察知力 | 一見終わっている仕事から確認漏れや残作業を見つける | SENSE |
| 小さな兆候の言語化力 | まだ問題になっていない変化を周囲が理解できる形で説明する | SENSE |
| 情報鮮度管理力 | 古い情報と最新情報を見分け、判断材料を更新し続ける | SENSE |
| ボトルネック発見力 | 全体の進行を止めている本当の原因を特定する | SENSE |
| 先回り設計力 | 次に起こる質問やミスを予測し、事前に仕組みへ組み込む | DESIGN 設計 |
| 認知負荷削減力 | 情報や手順を整理し、他人が迷わず動ける状態をつくる | DESIGN |
| 余白確保力 | 突発対応が起きても崩れないよう時間や人員に余裕を残す | DESIGN |
| 境界線設計力 | 誰がどこまで担当し、どの時点で相談・引継ぎするかを決める | DESIGN |
| 問いの設計力 | 欲しい答えを得られるように質問の順番や聞き方を組み立てる | DESIGN |
| 再現可能化力 | 自分だけができる仕事を誰でもできる手順や仕組みに変える | SYSTEM 仕組み化 |
| 善意依存排除力 | 「誰かが気づくだろう」で回さず、漏れない仕組みに変える | SYSTEM |
| 失敗資産化力 | ミスを謝って終わらせず、ルールやチェック機能として残す | SYSTEM |
| 保留管理力 | 今すぐ決められない案件を放置せず、条件と期限を管理する | SYSTEM |
| 曖昧耐性 | 正解やルールが決まっていない状況でも止まらず進められる | JUDGMENT 判断 |
| 例外処理力 | マニュアルにないケースでも目的を外さず対応を組み立てる | JUDGMENT |
| 撤退判断力 | 効果の薄い方法に執着せず、適切なタイミングでやめられる | JUDGMENT |
| 論点分離力 | 感情・事実・責任・今後の対応を混ぜずに整理する | JUDGMENT |
| 翻訳力 | 専門的な内容を相手の立場や知識に合わせて伝え直す | BRIDGE 橋渡し |
| 温度差調整力 | 関係者ごとの危機感や優先度の違いを埋め、足並みをそろえる | BRIDGE |

CLASS は最も強い強みから決まります：SENTINEL 見張り番 / ARCHITECT 設計者 / STRATEGIST 参謀 /
TRANSLATOR 通訳者 / CONNECTOR つなぎ役 / PATHFINDER 開拓者 / SYSTEM BUILDER 仕組み職人 /
CURATOR 情報の番人 / INQUIRER 問いの名手 / PROBLEM SOLVER 真因ハンター

## 分析ロジック

1. `VITE_AI_ENDPOINT` が設定されていれば、10問の回答と分析プロンプト（20カテゴリーの定義入り）を POST し、
   JSON（mainStrength / topStrengths / className / summary / message / stats）を受け取る
2. 未設定・失敗・タイムアウト（20秒）のときは `lib/analyze.ts` のキーワード分析にフォールバック
   - 20カテゴリーの類義キーワードを部分一致でカウント（全角半角ゆらぎを吸収）
   - 質問ごとに映しやすい強みへ少し加点、複数の回答にまたがる強みを優先
   - 「思いつかない…」のヒント文が回答に含まれていれば、対応する強みに加点
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

## RECORDS（保存した結果の見返し）

- 診断が完了するたびに、名前・10問の回答・結果を端末内の履歴（localStorage、最大50件）へ自動保存
- TOP 画面の `RECORDS (n)` から一覧 → タップで結果を再表示（記録日時・回答の折りたたみ表示・画像保存）
- 一覧の `✕` または結果画面の「この記録を削除」で個別に削除

## データの扱い

- 名前・回答・履歴は端末の localStorage にのみ保存（AI 連携を有効にした場合だけサーバーへ送信）
- RESULT 画面の「回答データを削除」で今回の回答と記録を消去（履歴の個別削除は RECORDS から）
- 画像保存は `html-to-image` でブラウザ内生成。iPhone では共有シートから「画像を保存」
