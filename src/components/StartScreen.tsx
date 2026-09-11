import { QUESTION_COUNT } from '../data/questions';
import { PixelButton } from './PixelButton';

interface Props {
  hasProgress: boolean;
  savedName: string;
  onStart: () => void;
  onContinue: () => void;
}

export function StartScreen({ hasProgress, savedName, onStart, onContinue }: Props) {
  return (
    <section className="screen screen--center">
      <div className="title-wrap">
        <div className="title-kicker">▶ TEAM STRENGTH DISCOVERY</div>
        <h1 className="title-logo">
          <span className="line1">HIDDEN</span>
          <span className="line2">SKILL</span>
        </h1>
        <p className="title-sub">
          あなたの仲間の
          <br />
          <strong>「見えていない強み」</strong>を発見せよ。
        </p>
      </div>

      <div className="start-actions">
        {hasProgress && (
          <>
            <PixelButton variant="secondary" se="start" onClick={onContinue}>
              ▶ CONTINUE
            </PixelButton>
            <div className="continue-note">
              {savedName ? `「${savedName}」の途中データがあります` : '途中データがあります'}
            </div>
          </>
        )}
        <PixelButton se="start" blink glow onClick={onStart}>
          [ START ]
        </PixelButton>
        {hasProgress && <div className="continue-note">STARTを押すと途中データは消えて最初から始まります</div>}
      </div>

      <div className="title-meta">
        <span>{String(QUESTION_COUNT).padStart(2, '0')} QUESTIONS</span>
        <span>約3分</span>
      </div>
      <div className="insert-coin">THINK OF ONE TEAMMATE</div>

      <div className="credit">© HIDDEN SKILL / 入力内容は端末内だけで処理されます</div>
    </section>
  );
}
