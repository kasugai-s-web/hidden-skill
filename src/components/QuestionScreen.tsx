import { useRef, useState } from 'react';
import type { Question } from '../data/questions';
import { PixelButton } from './PixelButton';
import { ProgressBar } from './ProgressBar';

interface Props {
  name: string;
  question: Question;
  index: number; // 0-based
  total: number;
  answer: string;
  direction: 'forward' | 'back';
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const MAX_LEN = 300;

export function QuestionScreen({ name, question, index, total, answer, direction, onChange, onNext, onBack }: Props) {
  const [showHints, setShowHints] = useState(false);
  const [pickedHint, setPickedHint] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // ヒント表示のリセットは、App 側で key={question.id} を付けて再マウントすることで行う

  const isLast = index === total - 1;
  const hasAnswer = answer.trim().length > 0;

  const pickHint = (hint: string) => {
    setPickedHint(hint);
    const current = answer.trim();
    if (!current) {
      onChange(`${hint}：`);
    } else if (!current.includes(hint)) {
      onChange(`${current}${/[。、：]$/.test(current) ? '' : '。'}${hint}：`);
    }
    // 入力欄にフォーカスして「具体的には？」を促す
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    });
  };

  return (
    <section className={`screen ${direction === 'forward' ? 'slide-forward' : 'slide-back'}`}>
      <header>
        <div className="q-header">
          <div className="q-number">
            QUESTION {String(index + 1).padStart(2, '0')} <small>/ {String(total).padStart(2, '0')}</small>
          </div>
          <div className="q-player" title={name}>
            PLAYER: {name}
          </div>
        </div>
        <ProgressBar value={index + 1} max={total} />
      </header>

      <div className="q-body">
        <div className="label-en" style={{ marginTop: 14 }}>
          {name}について答えてください
        </div>
        <h2 className="q-text">
          <span className="q-mark">Q{index + 1}</span>
          {question.text}
        </h2>
        <div className="q-purpose">▸ {question.purpose}</div>

        <label className="sr-only" htmlFor={`answer-${question.id}`}>
          回答
        </label>
        <textarea
          id={`answer-${question.id}`}
          ref={textareaRef}
          className="answer-area"
          rows={5}
          maxLength={MAX_LEN}
          placeholder={question.placeholder}
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          enterKeyHint="done"
        />
        <div className="answer-meta">
          <button
            type="button"
            className="link-btn"
            aria-expanded={showHints}
            onClick={() => setShowHints((v) => !v)}
          >
            {showHints ? 'ヒントを閉じる' : '思いつかない…'}
          </button>
          <span className="char-count">
            {answer.length} / {MAX_LEN}
          </span>
        </div>

        {showHints && (
          <div className="hint-box">
            <div className="hint-box__title">HINT</div>
            <p className="hint-box__lead">近いものを1つ選んでみてください。そのあと「具体的には？」を書き足します。</p>
            <div className="hint-chips">
              {question.hints.map((hint) => (
                <button key={hint} type="button" className="hint-chip" onClick={() => pickHint(hint)}>
                  {hint}
                </button>
              ))}
            </div>
            {pickedHint && (
              <div className="hint-followup">
                「{pickedHint}」を選びました。具体的には？ どんな場面でそう感じましたか？
              </div>
            )}
          </div>
        )}
      </div>

      <div className="nav-row">
        <PixelButton variant="ghost" className="pixel-btn--back" se="back" onClick={onBack}>
          ◀ BACK
        </PixelButton>
        <PixelButton
          className="pixel-btn--next"
          variant={isLast ? 'secondary' : 'primary'}
          se={isLast ? 'start' : 'next'}
          onClick={onNext}
        >
          {isLast ? (hasAnswer ? 'ANALYZE ▶' : 'SKIP & ANALYZE ▶') : hasAnswer ? 'NEXT ▶' : 'SKIP ▶'}
        </PixelButton>
      </div>
    </section>
  );
}
