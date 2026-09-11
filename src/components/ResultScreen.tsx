import { useEffect, useRef, useState } from 'react';
import { STAT_LABELS, STAT_ORDER } from '../data/strengths';
import type { AnalysisResult } from '../lib/types';
import { renderNodeToPng } from '../lib/renderCard';
import { sound } from '../lib/sound';
import { PixelButton } from './PixelButton';
import { ResultCard } from './ResultCard';

interface Props {
  name: string;
  result: AnalysisResult;
  /** 既に一度表示済みなら「FOUND!」演出を省く */
  skipIntro?: boolean;
  onNewPlayer: () => void;
  onDeleteData: () => void;
}

const RANK = ['1st', '2nd', '3rd'];
const FOUND_MS = 2000;
const RENDER_TIMEOUT_MS = 15000;

function Stars({ value }: { value: number }) {
  return (
    <span className="stars" aria-label={`${value} / 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? '' : 'off'}>
          {i < value ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

function canShareFiles(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function' && typeof navigator.canShare === 'function';
}

export function ResultScreen({ name, result, skipIntro = false, onNewPlayer, onDeleteData }: Props) {
  const [phase, setPhase] = useState<'found' | 'show'>(skipIntro ? 'show' : 'found');
  const [cardOpen, setCardOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [rendering, setRendering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase !== 'found') return;
    sound.play('found');
    const t = setTimeout(() => {
      setPhase('show');
      sound.play('result');
    }, FOUND_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const openCard = () => {
    setImageUrl(null);
    setImageBlob(null);
    setError(null);
    setRendering(true);
    setCardOpen(true);
  };

  useEffect(() => {
    if (!cardOpen) return;
    // フォント読み込みを待ってから描画（状態のリセットは openCard 側で済ませている）
    const run = async () => {
      try {
        await new Promise((r) => setTimeout(r, 120));
        const node = cardRef.current;
        if (!node) throw new Error('card not ready');
        const dataUrl = await renderNodeToPng(node, {
          pixelRatio: 2,
          backgroundColor: '#050614',
          timeoutMs: RENDER_TIMEOUT_MS,
        });
        const blob = await (await fetch(dataUrl)).blob();
        setImageUrl(dataUrl);
        setImageBlob(blob);
      } catch (e) {
        console.error(e);
        setError('画像の生成に失敗しました。スクリーンショットでの保存をお試しください。');
      } finally {
        setRendering(false);
      }
    };
    void run();
  }, [cardOpen]);

  const fileName = `hidden-skill_${name.replace(/[\\/:*?"<>|\s]+/g, '_')}.png`;

  const handleSave = async () => {
    if (!imageBlob || !imageUrl) return;
    sound.play('save');
    const file = new File([imageBlob], fileName, { type: 'image/png' });
    if (canShareFiles() && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'HIDDEN SKILL', text: `${name}の HIDDEN SKILL` });
        return;
      } catch (e) {
        // ユーザーがキャンセルした場合はそのまま
        if ((e as Error).name === 'AbortError') return;
      }
    }
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDelete = () => {
    if (window.confirm('この回答データと結果を削除して、最初の画面に戻ります。よろしいですか？')) {
      onDeleteData();
    }
  };

  if (phase === 'found') {
    return (
      <div className="found-flash" role="status">
        <div className="found-rays" />
        <div className="found-flash__text">
          HIDDEN
          <br />
          SKILL
          <br />
          FOUND!
        </div>
        <div className="found-flash__sub">▶ {name}</div>
      </div>
    );
  }

  return (
    <section className="screen result">
      <header className="result-head">
        <div className="result-head__label">RESULT</div>
        <div className="result-name">「{name}」</div>
        <div className="result-found">★ HIDDEN SKILL FOUND! ★</div>
      </header>

      {/* メインの強み */}
      <div className="window window--yellow main-skill">
        <div className="main-skill__label">MAIN SKILL</div>
        <div className="main-skill__en">{result.mainStrength.en}</div>
        <div className="main-skill__ja">{result.mainStrength.ja}</div>
        <p className="tagline">{result.mainStrengthDescription}</p>
      </div>

      {/* TOP3 */}
      <div className="window">
        <div className="window__title text-yellow">TOP 3 STRENGTHS</div>
        <div className="top3">
          {result.topStrengths.map((s, i) => (
            <div key={`${s.ja}-${i}`} className={`top3__row rank-${i + 1}`}>
              <span className="rank">{RANK[i]}</span>
              <div>
                <div className="top3__en">{s.en}</div>
                <div className="top3__ja">{s.ja}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ステータス */}
      <div className="window window--blue">
        <div className="window__title text-blue">STATUS</div>
        <div className="stats">
          {STAT_ORDER.map((key) => (
            <div key={key} className="stat-row">
              <span className="stat-row__label">{STAT_LABELS[key]}</span>
              <Stars value={result.stats[key]} />
            </div>
          ))}
        </div>
        <p className="stats-note">※ 人事評価ではなく、今回の回答から見えた特徴を相対的に表しています。</p>
      </div>

      {/* 隠れた強みの説明 */}
      <div className="window">
        <div className="window__title text-yellow">HIDDEN STRENGTH</div>
        <div className="label-en" style={{ marginTop: 4 }}>
          この人の隠れた強み
        </div>
        <p className="summary">{result.summary}</p>
      </div>

      {/* クラス */}
      <div className="window window--red class-box">
        <div className="class-box__label">YOUR CLASS</div>
        <div className="class-box__en">{result.className}</div>
        <div className="class-box__ja">「{result.classNameJa}」</div>
        <p className="class-box__desc">{result.classDescription}</p>
      </div>

      {/* メッセージ */}
      <div className="window window--yellow">
        <div className="window__title text-yellow">MESSAGE</div>
        <div className="label-en" style={{ marginTop: 4 }}>
          {name}に直接伝えるなら
        </div>
        <p className="message">
          <span className="message-quote">“</span>
          {result.message}
        </p>
      </div>

      <div className="result-actions">
        <PixelButton variant="secondary" se="save" onClick={openCard}>
          [ IMAGE SAVE ]
        </PixelButton>
        <PixelButton se="start" onClick={onNewPlayer}>
          [ NEW PLAYER ]
        </PixelButton>
        <span className="source-tag">ANALYSIS: {result.source === 'ai' ? 'AI' : 'LOCAL'}</span>
      </div>

      <div className="result-footer">
        <button type="button" className="link-btn text-red" onClick={handleDelete}>
          回答データを削除
        </button>
      </div>

      {cardOpen && (
        <div className="modal" role="dialog" aria-modal="true" aria-label="RESULT カード">
          <div className="modal__inner">
            <div className="modal__head">
              <span className="label-en">RESULT CARD</span>
              <PixelButton variant="ghost" size="sm" auto se="back" onClick={() => setCardOpen(false)}>
                ✕ CLOSE
              </PixelButton>
            </div>

            {/* 描画元カード（画像化のため実 DOM に置く） */}
            <div className="card-stage" style={imageUrl ? { position: 'absolute', left: -9999, top: 0 } : undefined}>
              <ResultCard ref={cardRef} name={name} result={result} />
            </div>

            {imageUrl && <img className="card-preview" src={imageUrl} alt={`${name}の HIDDEN SKILL カード`} />}

            {rendering && <p className="modal__note cursor-blink">RENDERING CARD...</p>}
            {error && <p className="modal__note text-red">{error}</p>}
            {imageUrl && (
              <p className="modal__note">
                保存できない場合は、上の画像を長押しして「写真に追加」してください。
              </p>
            )}

            <div className="modal__actions">
              <PixelButton se={null} disabled={!imageBlob} onClick={handleSave}>
                {canShareFiles() ? '[ SAVE / SHARE ]' : '[ IMAGE SAVE ]'}
              </PixelButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
