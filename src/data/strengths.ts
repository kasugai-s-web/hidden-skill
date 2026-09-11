// 強みカテゴリー・クラス（JOB）・文章テンプレートの一元管理
//
// 「判断力」「信頼力」のような王道の能力ではなく、
// 一緒に働いているからこそ見える「地味だけど効いている力」を扱う。

export type StrengthKey =
  | 'anomalyDetection' // 違和感検知力
  | 'ambiguityTolerance' // 曖昧耐性
  | 'issueSeparation' // 論点分離力
  | 'anticipatoryDesign' // 先回り設計力
  | 'translation' // 翻訳力
  | 'incompleteDetection' // 未完了察知力
  | 'exceptionHandling' // 例外処理力
  | 'reproducibility' // 再現可能化力
  | 'withdrawalJudgment' // 撤退判断力
  | 'cognitiveLoadReduction' // 認知負荷削減力
  | 'temperatureAdjustment' // 温度差調整力
  | 'bottleneckDiscovery' // ボトルネック発見力
  | 'goodwillIndependence' // 善意依存排除力
  | 'bufferReservation' // 余白確保力
  | 'questionDesign' // 問いの設計力
  | 'failureAssetization' // 失敗資産化力
  | 'pendingManagement' // 保留管理力
  | 'informationFreshness' // 情報鮮度管理力
  | 'boundaryDesign' // 境界線設計力
  | 'signalVerbalization'; // 小さな兆候の言語化力

export type ClassKey =
  | 'SENTINEL'
  | 'ARCHITECT'
  | 'STRATEGIST'
  | 'TRANSLATOR'
  | 'CONNECTOR'
  | 'PATHFINDER'
  | 'SYSTEM_BUILDER'
  | 'CURATOR'
  | 'INQUIRER'
  | 'PROBLEM_SOLVER';

/** ステータス5軸 */
export type StatKey = 'sense' | 'design' | 'system' | 'judgment' | 'bridge';

export interface StrengthDef {
  key: StrengthKey;
  en: string;
  ja: string;
  /** メイン強みの下に出す一言（定義文） */
  tagline: string;
  /** 意味判定用キーワード（部分一致・NFKC 正規化後） */
  keywords: string[];
  /** この強みが最も強いときのクラス */
  classKey: ClassKey;
  /** どのステータスに寄与するか */
  stat: StatKey;
  /** 隠れた強みの説明（{name} を置換） */
  summary: string;
  /** 本人へのメッセージ（{name} を置換） */
  message: string;
}

export interface ClassDef {
  key: ClassKey;
  en: string;
  ja: string;
  description: string;
}

export const CLASSES: Record<ClassKey, ClassDef> = {
  SENTINEL: { key: 'SENTINEL', en: 'SENTINEL', ja: '見張り番', description: '小さな異変や漏れにいち早く気づき、問題になる前に知らせる' },
  ARCHITECT: { key: 'ARCHITECT', en: 'ARCHITECT', ja: '設計者', description: '先を読み、人が迷わず動ける段取りと余白を設計する' },
  STRATEGIST: { key: 'STRATEGIST', en: 'STRATEGIST', ja: '参謀', description: '論点を切り分け、続けるか引くかを見極めて進路を示す' },
  TRANSLATOR: { key: 'TRANSLATOR', en: 'TRANSLATOR', ja: '通訳者', description: '難しい内容を相手の言葉に置き換え、理解の橋を架ける' },
  CONNECTOR: { key: 'CONNECTOR', en: 'CONNECTOR', ja: 'つなぎ役', description: '関係者ごとの温度差を埋め、チームの足並みをそろえる' },
  PATHFINDER: { key: 'PATHFINDER', en: 'PATHFINDER', ja: '開拓者', description: '正解もマニュアルもない場面で、目的を外さず道をつくる' },
  SYSTEM_BUILDER: { key: 'SYSTEM_BUILDER', en: 'SYSTEM BUILDER', ja: '仕組み職人', description: '一度きりの対応や失敗を、誰でも回せる仕組みに変える' },
  CURATOR: { key: 'CURATOR', en: 'CURATOR', ja: '情報の番人', description: '情報の鮮度と保留案件を管理し、判断材料を最新に保つ' },
  INQUIRER: { key: 'INQUIRER', en: 'INQUIRER', ja: '問いの名手', description: '聞き方と順番を設計し、本当に必要な答えを引き出す' },
  PROBLEM_SOLVER: { key: 'PROBLEM_SOLVER', en: 'PROBLEM SOLVER', ja: '真因ハンター', description: '全体を止めている本当の原因を見つけ、流れを取り戻す' },
};

export const STAT_LABELS: Record<StatKey, string> = {
  sense: 'SENSE',
  design: 'DESIGN',
  system: 'SYSTEM',
  judgment: 'JUDGMENT',
  bridge: 'BRIDGE',
};

export const STAT_LABELS_JA: Record<StatKey, string> = {
  sense: '察知',
  design: '設計',
  system: '仕組み化',
  judgment: '判断',
  bridge: '橋渡し',
};

export const STAT_ORDER: StatKey[] = ['sense', 'design', 'system', 'judgment', 'bridge'];

export const STRENGTHS: Record<StrengthKey, StrengthDef> = {
  anomalyDetection: {
    key: 'anomalyDetection', en: 'ANOMALY SENSE', ja: '違和感検知力', classKey: 'SENTINEL', stat: 'sense',
    tagline: '数字・文章・相手の反応から\n「いつもと違う」を察知する力',
    keywords: ['違和感', 'いつもと違', 'おかしい', '変だ', '変だな', '気づく', '気づい', '気付', '察知', 'ズレ', 'ずれ', '矛盾', '異変', '様子が違', '顔色', '反応', '見抜', '引っかか', '怪しい', '数字が合', '数字を見て', '違うと感じ'],
    summary: '{name}は、数字や文章、相手の反応のわずかなズレから「いつもと違う」を感じ取れる人です。その違和感を放置せず確かめることが、大きなトラブルを未然に防いでいることが今回の回答から見えてきました。',
    message: '「なんか変だ」と気づけるのは、普段からよく見ているからです。あなたの違和感のおかげで、表に出なかった問題がいくつもあります。',
  },
  ambiguityTolerance: {
    key: 'ambiguityTolerance', en: 'AMBIGUITY TOLERANCE', ja: '曖昧耐性', classKey: 'PATHFINDER', stat: 'judgment',
    tagline: '正解やルールが決まっていない状況でも\n止まらず進められる力',
    keywords: ['曖昧', 'あいまい', '決まっていな', '決まってな', '正解がな', 'ルールがな', '前例がな', '不確か', '手探り', 'とりあえず進', 'まず動', '止まらず', '走りながら', '仮で', 'ざっくり', '初めての', '未確定', 'ふわっと', 'はっきりしな', '決まっていなくても'],
    summary: '{name}は、正解やルールが決まっていない状況でも、手を止めずに進められる人です。「まだ決まっていない」ことを理由にせず、仮置きで動きながら形にしていく姿勢が、チームの停滞を防いでいることが今回の回答から見えてきました。',
    message: '決まっていないことだらけの中で、あなたが動いてくれるから物事が前に進みます。その「止まらない力」に、周りは何度も救われています。',
  },
  issueSeparation: {
    key: 'issueSeparation', en: 'ISSUE SEPARATION', ja: '論点分離力', classKey: 'STRATEGIST', stat: 'judgment',
    tagline: '感情・事実・責任・今後の対応を\n混ぜずに整理する力',
    keywords: ['論点', '整理', '切り分け', '分けて', '感情', '事実', '責任', '混ぜ', '何が問題', '話を整理', '要点', '区別', '頭が整理', '一つずつ', 'ひとつずつ', '分解', '順番に', '本質', '何を決める'],
    summary: '{name}は、感情・事実・責任・今後の対応が混ざりがちな場面で、それらを分けて整理できる人です。話しているうちに頭が整理される、と感じさせるその力が、チームの判断を落ち着かせていることが今回の回答から見えてきました。',
    message: 'ごちゃごちゃになった話を、あなたが「まず事実から」と分けてくれるだけで、みんなが冷静に戻れます。その整理の力は、思っている以上に頼りにされています。',
  },
  anticipatoryDesign: {
    key: 'anticipatoryDesign', en: 'FORESIGHT DESIGN', ja: '先回り設計力', classKey: 'ARCHITECT', stat: 'design',
    tagline: '次に起こる質問やミスを予測し\n事前に仕組みへ組み込む力',
    keywords: ['先回り', '予測', '事前に', 'あらかじめ', '先に', '想定', '前もって', '聞かれる前', '起こる前', '備え', '準備', '仕込', '先手', '布石', '先読み', '用意して', '予防', '転ばぬ先', '先を読'],
    summary: '{name}は、次に来る質問やミスを予測して、先に手を打っておける人です。聞かれる前に用意されている資料や、起こる前に潰されている問題は、本人が思う以上にチームの時間を守っていることが今回の回答から見えてきました。',
    message: '「もう用意してあります」の一言に、どれだけ助けられているか。あなたの先回りは、目立たないけれど確実にチームの時間を生み出しています。',
  },
  translation: {
    key: 'translation', en: 'TRANSLATION', ja: '翻訳力', classKey: 'TRANSLATOR', stat: 'bridge',
    tagline: '専門的な内容を、相手の立場や知識に\n合わせて伝え直す力',
    keywords: ['翻訳', '分かりやすく', 'わかりやすく', '分かりやすい', 'わかりやすい', '言い換え', '噛み砕', 'かみ砕', '相手に合わせ', '専門用語', '誰にでも分かる', '誰にでもわかる', '説明が上手', '説明がうま', '例え', 'たとえ', '初心者にも', 'レベルに合わせ', '伝え方', '相手の立場', '通訳', '説明してくれ'],
    summary: '{name}は、専門的で難しい内容を、相手の立場や知識に合わせて伝え直せる人です。「あの人の説明なら分かる」と思われていることが、部署や立場をまたぐ仕事を滑らかにしていることが今回の回答から見えてきました。',
    message: 'あなたが噛み砕いて話してくれるから、「分かったふり」をしなくて済んでいる人がたくさんいます。その翻訳の力は、チームの理解を底上げしています。',
  },
  incompleteDetection: {
    key: 'incompleteDetection', en: 'LOOSE-END RADAR', ja: '未完了察知力', classKey: 'SENTINEL', stat: 'sense',
    tagline: '一見終わっている仕事から\n確認漏れや残作業を見つける力',
    keywords: ['漏れ', '抜け', '確認漏れ', '残作業', 'やり残し', '終わったはず', '終わってない', '終わっていな', '忘れ', '未対応', '未完了', 'チェック', '見落と', '詰め', '最後の確認', '取りこぼし', '拾って', '拾う', '残って', '対応漏れ'],
    summary: '{name}は、「終わった」ことになっている仕事の中から、確認漏れや残作業を見つけられる人です。誰も気づかないうちに拾われている抜けが、チームの信用を静かに守っていることが今回の回答から見えてきました。',
    message: '「これ、まだ終わってないですよね」と言ってくれる人がいる安心感は、代えがたいものです。あなたが拾ってくれた抜けの数を、周りはちゃんと知っています。',
  },
  exceptionHandling: {
    key: 'exceptionHandling', en: 'EXCEPTION HANDLING', ja: '例外処理力', classKey: 'PATHFINDER', stat: 'judgment',
    tagline: 'マニュアルにないケースでも\n目的を外さず対応を組み立てる力',
    keywords: ['例外', 'マニュアルにな', 'イレギュラー', '想定外', '初めてのケース', '臨機応変', 'その場で', '目的', '対応を組み立', '応用', 'ケースバイケース', '決まりがな', '特殊', '判断してくれ', '型にはま', '柔軟'],
    summary: '{name}は、マニュアルにないケースに出会っても、「何のためにやるのか」から対応を組み立てられる人です。決まりがない場面で立ち止まらず、目的を外さない判断が、現場の困りごとを解決していることが今回の回答から見えてきました。',
    message: 'マニュアルにないことが起きたとき、あなたに聞けば何とかなる。その安心感は、ルールを増やすよりずっとチームを強くしています。',
  },
  reproducibility: {
    key: 'reproducibility', en: 'REPRODUCIBILITY', ja: '再現可能化力', classKey: 'SYSTEM_BUILDER', stat: 'system',
    tagline: '自分だけができる仕事を\n誰でもできる手順や仕組みに変える力',
    keywords: ['手順', 'マニュアル', '仕組み', '誰でもできる', '誰にでもできる', '属人', 'テンプレ', 'ひな形', '雛形', '標準化', '共有できる形', '引き継', '言語化', 'ドキュメント', '自動化', 'フォーマット', '型に', '残して', '作ってくれ', '手順書'],
    summary: '{name}は、自分がやっている仕事を「自分にしかできない」ままにせず、誰でもできる手順や仕組みに変えられる人です。その積み重ねが、人が入れ替わっても回るチームの土台になっていることが今回の回答から見えてきました。',
    message: '自分の仕事を手放せる形にするのは、簡単なことではありません。あなたが残してくれた手順や仕組みは、これからも誰かを助け続けます。',
  },
  withdrawalJudgment: {
    key: 'withdrawalJudgment', en: 'EXIT JUDGMENT', ja: '撤退判断力', classKey: 'STRATEGIST', stat: 'judgment',
    tagline: '効果の薄い方法に執着せず\n適切なタイミングでやめられる力',
    keywords: ['やめる', 'やめられる', 'やめよう', '撤退', '見切り', '引き際', '固執しな', '執着しな', '切り替え', '損切り', '方向転換', '諦める', 'あきらめる', '中止', '切り上げ', 'こだわらな', '潔', 'やめる判断', '引き返'],
    summary: '{name}は、効果の薄い方法に執着せず、「ここでやめる」と言える人です。頑張り続けることが正解に見える場面で引き際を示せることが、チームの時間と気力を守っていることが今回の回答から見えてきました。',
    message: '「やめよう」と言うのは、続けるより勇気がいります。あなたのその一言で、無駄に消耗せずに済んだことが何度もあります。',
  },
  cognitiveLoadReduction: {
    key: 'cognitiveLoadReduction', en: 'LOAD REDUCTION', ja: '認知負荷削減力', classKey: 'ARCHITECT', stat: 'design',
    tagline: '情報や手順を整理し\n他人が迷わず動ける状態をつくる力',
    keywords: ['迷わない', '迷わず', '分かりやすい資料', 'わかりやすい資料', '見やすい', 'シンプルに', '情報を整理', '一覧に', 'まとめて', '要約', '図に', 'まとめ', '片付', '導線', 'ラベル', '見える化', '可視化', '整えて', '整頓', '一目で', '読みやす'],
    summary: '{name}は、情報や手順を整理して、他の人が迷わず動ける状態をつくれる人です。見やすい資料や一目で分かる一覧の裏にある工夫が、チーム全体の「考える負担」を減らしていることが今回の回答から見えてきました。',
    message: 'あなたが整えてくれた資料や手順のおかげで、迷わずに済んでいる人がたくさんいます。「分かりやすい」の裏にある手間を、ちゃんと見ている人がいます。',
  },
  temperatureAdjustment: {
    key: 'temperatureAdjustment', en: 'ALIGNMENT', ja: '温度差調整力', classKey: 'CONNECTOR', stat: 'bridge',
    tagline: '関係者ごとの危機感や優先度の違いを埋め\n足並みをそろえる力',
    keywords: ['温度差', '足並み', '認識合わせ', '認識を合わせ', 'すり合わせ', '擦り合わせ', '危機感', '優先度', '巻き込', '合意', '納得', '関係者', '間に立', '橋渡し', '調整', 'ギャップを埋め', '同じ方向', '目線を合わせ', '説得', '共有して'],
    summary: '{name}は、関係者ごとに違う危機感や優先度のズレに気づき、それを埋めて足並みをそろえられる人です。表に出にくい調整の積み重ねが、部署や立場をまたぐ仕事を前に進めていることが今回の回答から見えてきました。',
    message: '「あの人と話しておきました」の一言で、どれだけ話が早くなったか。あなたが埋めてくれた温度差は、見えないところでチームを支えています。',
  },
  bottleneckDiscovery: {
    key: 'bottleneckDiscovery', en: 'BOTTLENECK FINDER', ja: 'ボトルネック発見力', classKey: 'PROBLEM_SOLVER', stat: 'sense',
    tagline: '全体の進行を止めている\n本当の原因を特定する力',
    keywords: ['ボトルネック', '原因', '根本', '本当の問題', '止まって', '詰まって', 'なぜ', '真因', '特定', 'ネック', '構造', '見つけ出', '突き止め', '滞', '本当の理由', '何が引っかか', '原因を探', '解決'],
    summary: '{name}は、表面的な問題ではなく、全体の進行を本当に止めている原因を突き止められる人です。「実はここが詰まっていた」を見つけることが、チームの空回りを減らしていることが今回の回答から見えてきました。',
    message: 'みんなが目の前の対応に追われているとき、あなたが「本当の原因はここ」と示してくれる。その一言で流れが変わった場面を、周りは覚えています。',
  },
  goodwillIndependence: {
    key: 'goodwillIndependence', en: 'FAIL-SAFE DESIGN', ja: '善意依存排除力', classKey: 'SYSTEM_BUILDER', stat: 'system',
    tagline: '「誰かが気づくだろう」で回さず\n漏れない仕組みに変える力',
    keywords: ['誰かが気づく', '気づくだろう', '誰かがやる', '漏れない仕組み', 'チェック機能', 'ダブルチェック', '仕組みに', 'リマインド', '自動で', '確認フロー', '抜けない', '頼らない', '属人', '担当を決め', '必ず通る', '網', '仕組み化', '漏れないように', '人に頼らず'],
    summary: '{name}は、「誰かが気づくだろう」という善意頼みで回っている部分に気づき、漏れない仕組みに変えられる人です。人の注意力に頼らない仕組みづくりが、チームのミスを静かに減らしていることが今回の回答から見えてきました。',
    message: '誰かの気配りに頼らなくても回るようにしてくれたのは、あなたです。仕組みになった瞬間、それは当たり前に見えてしまいますが、作った人がいることを忘れていません。',
  },
  bufferReservation: {
    key: 'bufferReservation', en: 'BUFFER KEEPER', ja: '余白確保力', classKey: 'ARCHITECT', stat: 'design',
    tagline: '突発対応が起きても崩れないよう\n時間や人員に余裕を残す力',
    keywords: ['余白', '余裕', 'バッファ', '詰め込まな', '突発', '予備', 'ゆとり', '余力', '前倒し', '締め切りより前', '予定に余裕', '無理のない', 'スケジュール', '早めに', '余裕を持', '余裕をも', '詰めすぎ', '急な対応', '急に'],
    summary: '{name}は、予定や人員に意図的な余白を残し、突発対応が起きても崩れない状態をつくれる人です。「急な依頼にも対応できた」の裏には、その余裕を先に確保していた設計があることが今回の回答から見えてきました。',
    message: '急な対応が入っても崩れなかったのは、あなたが余白を残してくれていたからです。余裕は偶然ではなく、あなたが設計したものだと知っています。',
  },
  questionDesign: {
    key: 'questionDesign', en: 'QUESTION DESIGN', ja: '問いの設計力', classKey: 'INQUIRER', stat: 'design',
    tagline: '欲しい答えを得られるように\n質問の順番や聞き方を組み立てる力',
    keywords: ['質問', '聞き方', '問い', 'ヒアリング', '引き出', '聞き出', '確認の仕方', '順番', '尋ね', '聞いてくれる', '投げかけ', '聞くのが上手', '聞くのがうま', '聞き上手', '本音', '質問して', '聞いてくれ', '整理してくれる質問'],
    summary: '{name}は、欲しい答えにたどり着けるように、質問の順番や聞き方を組み立てられる人です。何気ない問いかけで相手の考えや本音を引き出すことが、話の行き違いを減らしていることが今回の回答から見えてきました。',
    message: 'あなたの質問に答えているうちに、自分の考えが整理されていた。そんな経験をした人が、周りにたくさんいます。その問いの力は、静かに人を助けています。',
  },
  failureAssetization: {
    key: 'failureAssetization', en: 'LESSON BUILDER', ja: '失敗資産化力', classKey: 'SYSTEM_BUILDER', stat: 'system',
    tagline: 'ミスを謝って終わらせず\nルールやチェック機能として残す力',
    keywords: ['失敗', 'ミス', '再発', '振り返り', '反省', 'ルール化', 'チェックリスト', '次に活か', '教訓', 'なぜなぜ', '二度と', '対策', '改善', '学びに', '同じミス', '繰り返さな', '再発防止', '仕組みに変え', '残して'],
    summary: '{name}は、ミスやトラブルを謝って終わらせず、ルールやチェック機能として残せる人です。失敗をチームの資産に変えるその姿勢が、同じ問題の再発を確実に減らしていることが今回の回答から見えてきました。',
    message: '失敗のあとに「次はこうしよう」を形にしてくれるのは、あなたです。おかげで同じ痛い思いをせずに済んだ人が、思っている以上にいます。',
  },
  pendingManagement: {
    key: 'pendingManagement', en: 'PENDING CONTROL', ja: '保留管理力', classKey: 'CURATOR', stat: 'system',
    tagline: '今すぐ決められない案件を放置せず\n条件と期限を管理する力',
    keywords: ['保留', 'ペンディング', '期限', '条件', '放置しな', '忘れずに', 'リスト', '管理', '追いかけ', 'フォロー', 'リマインド', 'いつまでに', '決められない案件', '持ち越し', '宙に浮', '止まっている案件', '進捗', '催促', '覚えて'],
    summary: '{name}は、今すぐ決められない案件を放置せず、「いつ・何が決まれば動くか」を管理できる人です。宙に浮きがちな案件を追いかけ続けるその働きが、チームの取りこぼしを防いでいることが今回の回答から見えてきました。',
    message: '「あの件、どうなりました？」と聞いてくれる人がいるから、忘れられる案件がありません。あなたが追いかけてくれている案件の数を、周りはちゃんと知っています。',
  },
  informationFreshness: {
    key: 'informationFreshness', en: 'INFO FRESHNESS', ja: '情報鮮度管理力', classKey: 'CURATOR', stat: 'sense',
    tagline: '古い情報と最新情報を見分け\n判断材料を更新し続ける力',
    keywords: ['最新', '古い情報', '更新', 'アップデート', '鮮度', '変わった', '最近の', '変更点', 'いつの情報', '正しい情報', '情報源', 'ソース', '今の状況', '変化', '古くな', '確認して', '調べて', '把握して', '追って'],
    summary: '{name}は、古い情報と最新の情報を見分け、判断材料を更新し続けられる人です。「それ、変わりましたよ」と気づける習慣が、古い前提で進んでしまう失敗からチームを守っていることが今回の回答から見えてきました。',
    message: '「その情報、もう変わってますよ」と教えてくれる人がいる。そのおかげで、古い前提のまま進んで痛い目を見ることが減っています。',
  },
  boundaryDesign: {
    key: 'boundaryDesign', en: 'BOUNDARY DESIGN', ja: '境界線設計力', classKey: 'ARCHITECT', stat: 'design',
    tagline: '誰がどこまで担当し、どの時点で\n相談・引継ぎするかを決める力',
    keywords: ['担当', '役割', '線引き', 'どこまで', '引き継', '相談するタイミング', 'エスカレ', '責任範囲', '範囲', '分担', '決めてくれ', '窓口', '誰が', '境界', '任せる範囲', '役割分担', '持ち分', '線を引'],
    summary: '{name}は、「誰がどこまでやるか」「どの時点で相談・引継ぎするか」を決められる人です。曖昧になりがちな境界線を引くことが、抱え込みや押し付け合いを防ぎ、チームを働きやすくしていることが今回の回答から見えてきました。',
    message: '「ここまでは私、ここからはお願いします」と線を引いてくれるから、みんなが安心して自分の仕事に集中できます。その線引きは、思いやりの形だと思っています。',
  },
  signalVerbalization: {
    key: 'signalVerbalization', en: 'EARLY SIGNAL VOICE', ja: '小さな兆候の言語化力', classKey: 'SENTINEL', stat: 'sense',
    tagline: 'まだ問題になっていない変化を\n周囲が理解できる形で説明する力',
    keywords: ['兆候', '言語化', '言葉にして', 'まだ問題にな', '早めに共有', '小さな変化', '芽', '違和感を伝え', '説明してくれ', '報告', 'アラート', '気になることを', '先に言って', '早めに気づ', '予兆', '早めに伝え', '共有してくれ', '教えてくれ', 'サイン'],
    summary: '{name}は、まだ問題になっていない小さな変化を、周囲が理解できる言葉で説明できる人です。「なんとなく気になる」を具体的に伝えることで、チームが早めに手を打てていることが今回の回答から見えてきました。',
    message: 'まだ誰も問題だと思っていないことを、言葉にして伝えるのは勇気がいります。あなたのその一言で、早めに動けたことが何度もあります。',
  },
};

export const STRENGTH_KEYS = Object.keys(STRENGTHS) as StrengthKey[];

/** 各質問が特に映しやすい強み（回答があるだけで少し加点する） */
export const QUESTION_AFFINITY: Record<number, StrengthKey[]> = {
  1: ['ambiguityTolerance', 'exceptionHandling'],
  2: ['goodwillIndependence', 'incompleteDetection'],
  3: ['issueSeparation', 'questionDesign'],
  4: ['cognitiveLoadReduction', 'bufferReservation'],
  5: ['anomalyDetection', 'anticipatoryDesign'],
  6: ['bottleneckDiscovery', 'temperatureAdjustment'],
  7: ['translation', 'withdrawalJudgment'],
  8: ['reproducibility', 'failureAssetization'],
  9: ['pendingManagement', 'informationFreshness'],
  10: ['boundaryDesign', 'signalVerbalization'],
};

/** 「思いつかない…」ヒントの語からも強みを拾えるようにするための対応表 */
export const HINT_KEYWORDS: Record<string, StrengthKey[]> = {
  // Q1
  'ルールが決まっていない仕事でも進めてくれる': ['ambiguityTolerance'],
  'マニュアルにないケースの対応': ['exceptionHandling'],
  '相手に合わせた説明・言い換え': ['translation'],
  '期限や条件が曖昧な案件の管理': ['pendingManagement'],
  '前例のない初めての仕事': ['ambiguityTolerance', 'exceptionHandling'],
  // Q2
  '「誰かがやるだろう」の抜けを拾っている': ['goodwillIndependence', 'incompleteDetection'],
  '終わったはずの仕事の確認漏れに気づく': ['incompleteDetection'],
  '手順を誰でもできる形にしている': ['reproducibility'],
  '古い情報を更新してくれている': ['informationFreshness'],
  '関係者の認識を揃えてくれている': ['temperatureAdjustment'],
  // Q3
  '何が問題なのか整理したいとき': ['issueSeparation'],
  '聞き方・質問の仕方に迷うとき': ['questionDesign'],
  '専門的な内容を伝える必要があるとき': ['translation'],
  '担当や責任の線引きに迷うとき': ['boundaryDesign'],
  'やめるべきか続けるべきか迷うとき': ['withdrawalJudgment'],
  // Q4
  '資料や手順が分かりやすく迷わない': ['cognitiveLoadReduction'],
  '予定に余裕をもたせてくれる': ['bufferReservation'],
  '先に起こりそうな問題を潰してくれる': ['anticipatoryDesign'],
  '関係者の温度差を埋めてくれる': ['temperatureAdjustment'],
  '保留案件を追いかけてくれる': ['pendingManagement'],
  // Q5
  '「いつもと違う」にすぐ気づく': ['anomalyDetection'],
  '先回りして準備している': ['anticipatoryDesign'],
  '難しい話を相手に合わせて言い換える': ['translation'],
  '小さな異変を早めに言葉にする': ['signalVerbalization'],
  '進行を止めている原因を見つける': ['bottleneckDiscovery'],
  // Q6
  '本当の原因を突き止める': ['bottleneckDiscovery'],
  '感情と事実を分けて整理する': ['issueSeparation'],
  'マニュアルにない対応を組み立てる': ['exceptionHandling'],
  '関係者の足並みをそろえる': ['temperatureAdjustment'],
  '効果の薄い方法をやめる判断': ['withdrawalJudgment'],
  // Q7
  '相手に合わせた説明力': ['translation'],
  '曖昧な状況でも進める力': ['ambiguityTolerance'],
  '欲しい答えを引き出す質問力': ['questionDesign'],
  '引き際を見極める力': ['withdrawalJudgment'],
  '先を読んで仕組みに組み込む力': ['anticipatoryDesign'],
  // Q8
  '仕事を手順や仕組みに残す姿勢': ['reproducibility'],
  'ミスをルールやチェックに変える姿勢': ['failureAssetization'],
  '担当と相談のタイミングの決め方': ['boundaryDesign'],
  '情報の鮮度を確かめる習慣': ['informationFreshness'],
  '「誰かが気づくだろう」にしない姿勢': ['goodwillIndependence'],
  // Q9
  '保留案件を放置せず管理している': ['pendingManagement'],
  '情報を最新に保っている': ['informationFreshness'],
  '突発対応に備えて余裕を残している': ['bufferReservation'],
  '誰でもできる仕組みにしている': ['reproducibility', 'goodwillIndependence'],
  '確認漏れを地味に拾っている': ['incompleteDetection'],
  // Q10
  '担当や引継ぎの線を引いてくれた': ['boundaryDesign'],
  '小さな兆候を早めに伝えてくれた': ['signalVerbalization'],
  'トラブルの原因を突き止めてくれた': ['bottleneckDiscovery'],
  '不確かな状況でも進めてくれた': ['ambiguityTolerance'],
  'ミスを仕組みに変えてくれた': ['failureAssetization'],
};
