// 強みカテゴリー・クラス（JOB）・文章テンプレートの一元管理

export type StrengthKey =
  | 'trust'
  | 'action'
  | 'adjust'
  | 'support'
  | 'care'
  | 'responsibility'
  | 'calm'
  | 'accuracy'
  | 'speed'
  | 'expertise'
  | 'communication'
  | 'teaching'
  | 'persistence'
  | 'problemSolving'
  | 'teamwork'
  | 'initiative'
  | 'judgment'
  | 'reassurance';

export type ClassKey =
  | 'TEAM_GUARDIAN'
  | 'STRATEGIST'
  | 'MOOD_MAKER'
  | 'PROBLEM_SOLVER'
  | 'SUPPORTER'
  | 'LEADER'
  | 'SPECIALIST'
  | 'CONNECTOR'
  | 'CHALLENGER'
  | 'NAVIGATOR';

export type StatKey = 'trust' | 'support' | 'action' | 'communication' | 'problemSolving';

export interface StrengthDef {
  key: StrengthKey;
  en: string;
  ja: string;
  /** メイン強みの下に出す一言 */
  tagline: string;
  /** 意味判定用キーワード（部分一致） */
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
  TEAM_GUARDIAN: { key: 'TEAM_GUARDIAN', en: 'TEAM GUARDIAN', ja: 'チームの守護者', description: '安心して任せられる存在として、チームの土台を守る' },
  STRATEGIST: { key: 'STRATEGIST', en: 'STRATEGIST', ja: '参謀', description: '状況を冷静に見極め、進むべき道を示す' },
  MOOD_MAKER: { key: 'MOOD_MAKER', en: 'MOOD MAKER', ja: 'ムードメーカー', description: 'その場の空気を明るくし、チームの力を引き出す' },
  PROBLEM_SOLVER: { key: 'PROBLEM_SOLVER', en: 'PROBLEM SOLVER', ja: '問題解決の達人', description: '困難な場面で原因を見つけ、前に進める' },
  SUPPORTER: { key: 'SUPPORTER', en: 'SUPPORTER', ja: '縁の下の支え手', description: 'さりげない気遣いとフォローで、みんなを支える' },
  LEADER: { key: 'LEADER', en: 'LEADER', ja: '牽引者', description: '先頭に立って動き、周囲を巻き込んで進める' },
  SPECIALIST: { key: 'SPECIALIST', en: 'SPECIALIST', ja: '専門職人', description: '確かな知識と正確さで、質の高い仕事を積み上げる' },
  CONNECTOR: { key: 'CONNECTOR', en: 'CONNECTOR', ja: 'つなぎ役', description: '人と人、部署と部署のあいだをつなぎ、物事を動かす' },
  CHALLENGER: { key: 'CHALLENGER', en: 'CHALLENGER', ja: '挑戦者', description: '自ら新しいことに踏み出し、チームに刺激を与える' },
  NAVIGATOR: { key: 'NAVIGATOR', en: 'NAVIGATOR', ja: '道しるべ', description: 'お手本となる姿勢で、仲間の成長を導く' },
};

export const STAT_LABELS: Record<StatKey, string> = {
  trust: 'TRUST',
  support: 'SUPPORT',
  action: 'ACTION',
  communication: 'COMMUNICATION',
  problemSolving: 'PROBLEM SOLVING',
};

export const STAT_ORDER: StatKey[] = ['trust', 'support', 'action', 'communication', 'problemSolving'];

export const STRENGTHS: Record<StrengthKey, StrengthDef> = {
  trust: {
    key: 'trust', en: 'TRUST', ja: '信頼力', classKey: 'TEAM_GUARDIAN', stat: 'trust',
    tagline: '「この人なら大丈夫」と思わせる\nチームの安心の土台',
    keywords: ['任せ', '信頼', '頼れ', '頼める', '確実', '裏切', '約束', '期待', '間違いな', '安定', 'きちんと', 'ちゃんと'],
    summary: '{name}は、周囲から「この人なら任せられる」と自然に思われている人です。派手さよりも確実さで信頼を積み重ねてきたことが、今回の回答からはっきりと見えてきました。',
    message: '「任せて大丈夫」と思ってもらえるのは、これまでの一つひとつの仕事の積み重ねがあるからです。その信頼は、周りが思っている以上に大きな支えになっています。',
  },
  action: {
    key: 'action', en: 'ACTION', ja: '行動力', classKey: 'LEADER', stat: 'action',
    tagline: '迷う前にまず動く\nチームを前に進めるエンジン',
    keywords: ['すぐ動', '行動', '動く', '動いて', 'フットワーク', '率先', '実行', '飛び込', '手を動か', '真っ先', 'すぐに', '先頭'],
    summary: '{name}は、誰かが迷っている間に、まず自分から動ける人です。その一歩が周囲の背中を押し、チーム全体の動きを速めていることが今回の回答から見えてきました。',
    message: 'あなたが最初に動いてくれるおかげで、周りも「やってみよう」と思えています。その行動力に、みんなが何度も助けられています。',
  },
  adjust: {
    key: 'adjust', en: 'ADJUST', ja: '調整力', classKey: 'CONNECTOR', stat: 'communication',
    tagline: '人と人のあいだをつなぎ\n物事を静かに前へ進める',
    keywords: ['調整', '間に入', '橋渡し', '折衝', 'まとめ', '根回し', 'バランス', '仲介', '取り持', '合わせ', '段取り', '交渉'],
    summary: '{name}は、立場の違う人たちのあいだに立って、うまく物事を進められる人です。目立ちにくい調整の積み重ねが、チームの摩擦を減らしていることが今回の回答から見えてきました。',
    message: 'あなたが間に入ってくれるから、話がスムーズに進んでいます。表に出にくい調整の手間を、ちゃんと見ている人がいます。',
  },
  support: {
    key: 'support', en: 'SUPPORT', ja: 'サポート力', classKey: 'SUPPORTER', stat: 'support',
    tagline: '困っている人に気づき\n自然に手を差し伸べる',
    keywords: ['サポート', '支え', '手伝', '助け', 'フォロー', '補助', '支援', '拾って', 'カバー', '引き受け', '助かる', '助かっ'],
    summary: '{name}は、誰かが困っているときに、自然と手を差し伸べられる人です。頼まれる前に動くさりげないサポートが、チームの動きを楽にしていることが今回の回答から見えてきました。',
    message: 'いつも当たり前のように助けてもらっていますが、その存在に救われている人は、思っている以上に多いと思います。',
  },
  care: {
    key: 'care', en: 'CARE', ja: '気配り', classKey: 'SUPPORTER', stat: 'support',
    tagline: '小さな変化に気づき\n言葉より先に動ける',
    keywords: ['気配り', '気遣', '声をかけ', '声かけ', '察し', '気づい', '気付い', '配慮', '思いやり', '優し', '見てい', '心配', '寄り添'],
    summary: '{name}は、周囲の小さな変化に気づき、さりげなく行動に移せる人です。その気配りが職場の空気を穏やかにし、みんなが働きやすくなっていることが今回の回答から見えてきました。',
    message: 'あなたのさりげない一言や気遣いに、救われている人がたくさんいます。気づいてくれる人がいる、というだけで安心できるものです。',
  },
  responsibility: {
    key: 'responsibility', en: 'RESPONSIBILITY', ja: '責任感', classKey: 'TEAM_GUARDIAN', stat: 'trust',
    tagline: '引き受けたことは最後まで\nやり遂げる芯の強さ',
    keywords: ['責任', '最後まで', 'やり遂げ', '投げ出さ', '手を抜か', '真面目', '誠実', '妥協', '納期', '締め切り', '守る', '守って'],
    summary: '{name}は、引き受けた仕事を最後までやり遂げる芯の強さを持った人です。その姿勢が周囲の安心につながり、チームの信頼を支えていることが今回の回答から見えてきました。',
    message: '最後までやり切る姿を、周りはちゃんと見ています。あなたの責任感があるから、チームは安心して前に進めています。',
  },
  calm: {
    key: 'calm', en: 'CALM', ja: '冷静さ', classKey: 'STRATEGIST', stat: 'problemSolving',
    tagline: '慌てる場面でも落ち着き\n周りに冷静さを取り戻させる',
    keywords: ['冷静', '落ち着', '慌てな', '慌てず', '動じ', '淡々', '平常心', 'パニック', '焦らな', '焦らず', '穏やか', '静か'],
    summary: '{name}は、慌ただしい場面でも落ち着いて状況を見られる人です。その冷静さが周囲の焦りをほぐし、チームが正しい判断に戻れる支えになっていることが今回の回答から見えてきました。',
    message: 'みんなが焦っているときに、あなたが落ち着いているだけで、場の空気が変わります。その冷静さに、何度も助けられています。',
  },
  accuracy: {
    key: 'accuracy', en: 'ACCURACY', ja: '正確性', classKey: 'SPECIALIST', stat: 'problemSolving',
    tagline: '細部まで丁寧に\nミスのない仕事を積み上げる',
    keywords: ['正確', 'ミス', '丁寧', '細か', 'チェック', '確認', '抜け漏れ', '几帳面', '精度', '漏れ', '見落と', '緻密'],
    summary: '{name}は、細かいところまで丁寧に確認し、正確な仕事を積み上げられる人です。目立たないその積み重ねが、チームのミスを未然に防いでいることが今回の回答から見えてきました。',
    message: 'ミスがないのは「当たり前」ではなく、あなたが毎回ちゃんと確認しているからです。その丁寧さに、チームは守られています。',
  },
  speed: {
    key: 'speed', en: 'SPEED', ja: 'スピード', classKey: 'CHALLENGER', stat: 'action',
    tagline: '止まらないテンポで\nチームの流れをつくる',
    keywords: ['速', '早', 'スピード', 'レスポンス', '即', 'テンポ', '素早', 'すぐ返'],
    summary: '{name}は、レスポンスや仕事の速さで、チーム全体のテンポを上げている人です。「早く返ってくる」安心感が周囲の仕事を進めやすくしていることが今回の回答から見えてきました。',
    message: 'あなたの速さのおかげで、周りの仕事が止まらずに進んでいます。そのスピードは、チームにとって大きな武器です。',
  },
  expertise: {
    key: 'expertise', en: 'EXPERTISE', ja: '専門性', classKey: 'SPECIALIST', stat: 'problemSolving',
    tagline: '確かな知識と経験で\n困ったときの頼れる相談先',
    keywords: ['知識', '専門', '詳し', 'ノウハウ', 'スキル', '技術', '経験', 'プロ', '博識', '知って', '精通', '得意'],
    summary: '{name}は、確かな知識と経験を持ち、困ったときに頼れる相談先になっている人です。その専門性がチームの判断を支え、質を高めていることが今回の回答から見えてきました。',
    message: '「あの人に聞けば分かる」と思ってもらえる存在です。積み重ねてきた知識と経験が、チーム全体の力になっています。',
  },
  communication: {
    key: 'communication', en: 'COMMUNICATION', ja: 'コミュニケーション力', classKey: 'MOOD_MAKER', stat: 'communication',
    tagline: '話しやすさが\n人と情報をつなぐ',
    keywords: ['コミュニケーション', '話しやす', '伝え', '聞いて', '相談しやす', '明る', '会話', '話を', '聞き上手', '聞いてくれ', '相談', '話せ'],
    summary: '{name}は、話しやすい雰囲気で、人と情報をつないでいる人です。相談しやすい存在であることがチームの風通しを良くしていることが今回の回答から見えてきました。',
    message: 'あなたが話を聞いてくれるから、みんな安心して相談できています。その話しやすさは、チームにとってかけがえのないものです。',
  },
  teaching: {
    key: 'teaching', en: 'TEACHING', ja: '教える力', classKey: 'NAVIGATOR', stat: 'communication',
    tagline: '分かりやすく伝え\n仲間の成長を後押しする',
    keywords: ['教え', '分かりやす', 'わかりやす', '指導', '育て', '学', '説明', '手本', 'お手本', '見習'],
    summary: '{name}は、難しいことも分かりやすく伝え、周囲の成長を後押しできる人です。その教え方や姿勢がお手本となり、チームの底上げにつながっていることが今回の回答から見えてきました。',
    message: 'あなたの説明で「分かった」と思えた人がたくさんいます。教えてもらったことは、ちゃんと次の人へ受け継がれています。',
  },
  persistence: {
    key: 'persistence', en: 'PERSISTENCE', ja: '継続力', classKey: 'NAVIGATOR', stat: 'problemSolving',
    tagline: '地道な積み重ねで\n確かな成果をつくる',
    keywords: ['続け', '継続', 'コツコツ', '毎日', '地道', '粘り', '積み重ね', '諦めな', 'あきらめ', '地味', '根気', 'ずっと'],
    summary: '{name}は、目立たないことも地道に続けられる人です。そのコツコツとした積み重ねが、気づかないうちにチームの基盤を強くしていることが今回の回答から見えてきました。',
    message: '続けているのは「当たり前」ではありません。あなたが毎日積み重ねてくれていることを、ちゃんと見ている人がいます。',
  },
  problemSolving: {
    key: 'problemSolving', en: 'PROBLEM SOLVING', ja: '問題解決力', classKey: 'PROBLEM_SOLVER', stat: 'problemSolving',
    tagline: '原因を見つけ\n止まった状況を動かす',
    keywords: ['解決', '原因', '対処', '改善', '工夫', '突破', '対応策', '分析', '整理', '打開', '対応', '直して', '仕組み'],
    summary: '{name}は、行き詰まった状況で原因を見つけ、前に進める人です。困ったときに「どうすればいいか」を示してくれることがチームの推進力になっていることが今回の回答から見えてきました。',
    message: '止まっていた状況を動かしてくれたことが、何度もあります。あなたの「なんとかする力」に、チームは助けられています。',
  },
  teamwork: {
    key: 'teamwork', en: 'TEAMWORK', ja: 'チーム貢献', classKey: 'MOOD_MAKER', stat: 'support',
    tagline: 'チーム全体を見て\n場の力を引き出す',
    keywords: ['チーム', '雰囲気', 'みんな', '全体', '協力', '場を', '盛り上げ', '和ま', '和む', '空気', '一体感', 'ムード', '笑'],
    summary: '{name}は、自分の仕事だけでなく、チーム全体を見て動ける人です。その存在が場の雰囲気を良くし、みんなの力を引き出していることが今回の回答から見えてきました。',
    message: 'あなたがいるだけで、チームの空気が少し軽くなります。その存在の大きさは、いなくなったときにこそ分かるものです。',
  },
  initiative: {
    key: 'initiative', en: 'INITIATIVE', ja: '主体性', classKey: 'CHALLENGER', stat: 'action',
    tagline: '言われる前に考え\n自分から一歩踏み出す',
    keywords: ['自分から', '自ら', '提案', '主体', '積極', '挑戦', '新しい', 'アイデア', '発案', '前向き', '率直', '進んで'],
    summary: '{name}は、言われる前に自分で考え、動き出せる人です。新しい提案や挑戦がチームに刺激を与え、停滞を防いでいることが今回の回答から見えてきました。',
    message: '自分から動いてくれるあなたの姿勢が、周りの「やってみよう」につながっています。その一歩を、みんなが頼りにしています。',
  },
  judgment: {
    key: 'judgment', en: 'JUDGMENT', ja: '判断力', classKey: 'STRATEGIST', stat: 'problemSolving',
    tagline: '迷う場面で\n的確に方向を決める',
    keywords: ['判断', '決め', '決断', '見極め', '優先順位', '的確', '本質', '線引き', '決めて', '割り切'],
    summary: '{name}は、迷う場面で的確に方向を決められる人です。その判断がチームの迷いを減らし、みんなが安心して動ける状況をつくっていることが今回の回答から見えてきました。',
    message: '迷ったときにあなたが決めてくれるから、チームは前に進めます。その判断を、みんなが信頼しています。',
  },
  reassurance: {
    key: 'reassurance', en: 'REASSURANCE', ja: '安心感', classKey: 'TEAM_GUARDIAN', stat: 'trust',
    tagline: '困ったときに自然と頼られる\nチームのセーフティーネット',
    keywords: ['安心', 'いてくれ', '心強', '支柱', '頼りに', '大丈夫', '存在', 'ほっと', '落ち着け', '柱', '頼り'],
    summary: '{name}は、目立つタイプではなくても、周囲の状況をよく見て自然に支えられる人です。困ったときに相談しやすく、チームに安心感を生み出していることが今回の回答から見えてきました。',
    message: 'いつも当たり前のように助けてもらっていますが、その存在に救われている人は、思っている以上に多いと思います。',
  },
};

export const STRENGTH_KEYS = Object.keys(STRENGTHS) as StrengthKey[];

/** 各質問が特に映しやすい強み（回答があるだけで少し加点する） */
export const QUESTION_AFFINITY: Record<number, StrengthKey[]> = {
  1: ['trust', 'expertise'],
  2: ['teamwork', 'support'],
  3: ['communication', 'reassurance'],
  4: ['support', 'care'],
  5: ['accuracy', 'persistence'],
  6: ['calm', 'problemSolving'],
  7: ['expertise', 'judgment'],
  8: ['teaching', 'responsibility'],
  9: ['persistence', 'teamwork'],
  10: ['reassurance', 'trust'],
};

/** 「思いつかない…」ヒントの語からも強みを拾えるようにするための対応表 */
export const HINT_KEYWORDS: Record<string, StrengthKey[]> = {
  '資料作成': ['accuracy', 'trust'],
  '顧客・取引先対応': ['communication', 'trust'],
  '数字のチェック': ['accuracy'],
  '段取り・調整': ['adjust'],
  '急ぎのトラブル対応': ['problemSolving', 'speed'],
  '情報の整理・共有': ['communication', 'problemSolving'],
  '雰囲気づくり': ['teamwork'],
  '細かい確認作業': ['accuracy'],
  '誰も見ていない地味な作業': ['persistence', 'responsibility'],
  '相談相手がいなくなる': ['reassurance', 'communication'],
  '判断に迷うとき': ['judgment'],
  '人間関係のこと': ['care', 'communication'],
  '専門的な内容': ['expertise'],
  '急ぎの対応': ['speed', 'action'],
  '気持ちが落ち込んだとき': ['care', 'reassurance'],
  '自然な声かけ': ['care'],
  'さりげないフォロー': ['support'],
  '段取りの良さ': ['adjust'],
  '場の空気が和む': ['teamwork'],
  '面倒な作業を引き受ける': ['support', 'responsibility'],
  '仕事の速さ': ['speed'],
  '気配り': ['care'],
  '正確さ': ['accuracy'],
  '知識': ['expertise'],
  '説明の分かりやすさ': ['teaching'],
  '責任感': ['responsibility'],
  '冷静に状況を整理する': ['calm', 'problemSolving'],
  'すぐに動く': ['action'],
  '間に入って調整する': ['adjust'],
  '周りを落ち着かせる': ['calm', 'reassurance'],
  '原因を探す': ['problemSolving'],
  '判断の速さ': ['judgment', 'speed'],
  '説明力': ['teaching'],
  '集中力': ['persistence'],
  '人当たりの良さ': ['communication'],
  '知識・経験': ['expertise'],
  '粘り強さ': ['persistence'],
  '挨拶・報連相': ['communication', 'responsibility'],
  '丁寧さ': ['accuracy'],
  '仕事への姿勢': ['responsibility'],
  '相手への気遣い': ['care'],
  '準備の仕方': ['accuracy', 'adjust'],
  '地味な作業を続けている': ['persistence'],
  '縁の下で支えている': ['support'],
  '継続している努力': ['persistence'],
  '周りへの配慮': ['care'],
  'ミスしない安定感': ['accuracy', 'trust'],
  '助けてもらったとき': ['support'],
  'トラブルを乗り切ったとき': ['problemSolving', 'calm'],
  '雰囲気が和んだとき': ['teamwork'],
  '成果が出たとき': ['action', 'responsibility'],
  '新しい提案をしてくれたとき': ['initiative'],
};
