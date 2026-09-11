import { forwardRef } from 'react';
import type { AnalysisResult } from '../lib/types';

interface Props {
  name: string;
  result: AnalysisResult;
}

const RANK = ['1st', '2nd', '3rd'];

/** 画像保存用の縦長カード（360px 固定幅） */
export const ResultCard = forwardRef<HTMLDivElement, Props>(function ResultCard({ name, result }, ref) {
  const date = new Date();
  const stamp = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

  return (
    <div ref={ref} className="card">
      <div>
        <div className="card__logo">HIDDEN SKILL</div>
        <div className="card__kicker">HIDDEN SKILL FOUND!</div>
      </div>

      <div className="card__name">{name}</div>

      <div className="card__main">
        <div className="card__section-label">MAIN SKILL</div>
        <div className="card__main-en">{result.mainStrength.en}</div>
        <div className={`card__main-ja${result.mainStrength.ja.length > 7 ? ' is-long' : ''}`}>
          {result.mainStrength.ja}
        </div>
        <div className="card__tagline">{result.mainStrengthDescription}</div>
      </div>

      <div>
        <div className="card__section-label">TOP 3 STRENGTHS</div>
        <div className="card__top3">
          {result.topStrengths.map((s, i) => (
            <div key={`${s.ja}-${i}`} className={`card__top3-row rank-${i + 1}`}>
              <span className="rank">{RANK[i]}</span>
              <span>
                <span className="card__top3-ja">{s.ja}</span>
                <span className="card__top3-en" style={{ display: 'block' }}>
                  {s.en}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card__class">
        <div className="card__section-label" style={{ color: 'var(--orange)' }}>
          CLASS
        </div>
        <div className="card__class-en">{result.className}</div>
        <div className="card__class-ja">{result.classNameJa}</div>
      </div>

      <div className="card__message">{result.message}</div>

      <div className="card__footer">
        <span>HIDDEN SKILL</span>
        <span>{stamp}</span>
      </div>
    </div>
  );
});
