import { useEffect, useState } from 'react';

const BLOCKS = 10;
const LOGS = ['LOADING ANSWERS', 'SCANNING KEYWORDS', 'MAPPING STRENGTHS', 'ASSIGNING CLASS', 'BUILDING RESULT'];

interface Props {
  name: string;
}

export function AnalyzingScreen({ name }: Props) {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    // 約1.6秒で満タンになる（分析が長引く場合は最後の1ブロック手前で待つ）
    const timer = setInterval(() => {
      setFilled((v) => (v < BLOCKS - 1 ? v + 1 : v));
    }, 160);
    return () => clearInterval(timer);
  }, []);

  const logCount = Math.min(LOGS.length, Math.floor((filled / BLOCKS) * LOGS.length) + 1);

  return (
    <section className="screen screen--center" aria-live="polite">
      <div className="analyzing-title cursor-blink">ANALYZING...</div>
      <div className="loading-blocks" aria-hidden="true">
        {Array.from({ length: BLOCKS }, (_, i) => (
          <span key={i} className={i < filled ? 'is-on' : ''} />
        ))}
      </div>
      <div className="analyzing-log">
        {LOGS.slice(0, logCount).map((line, i) => (
          <div key={line}>
            &gt; {line}
            {i < logCount - 1 || filled >= BLOCKS - 1 ? <span className="ok"> ... OK</span> : null}
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>
        {name}の回答から、見えていない強みを探しています
      </p>
    </section>
  );
}
