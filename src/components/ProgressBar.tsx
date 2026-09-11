interface Props {
  /** 完了した問題数（現在の問題を含めるかは呼び出し側で決める） */
  value: number;
  max: number;
}

export function ProgressBar({ value, max }: Props) {
  const ratio = Math.min(1, Math.max(0, value / max));
  const level = ratio >= 1 ? 'is-full' : ratio >= 0.7 ? 'is-high' : ratio >= 0.4 ? 'is-mid' : '';
  return (
    <div
      className="hp-bar"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={`進捗 ${value} / ${max}`}
    >
      <div className={`hp-bar__fill ${level}`} style={{ width: `${ratio * 100}%` }} />
      <div className="hp-bar__segments" />
    </div>
  );
}
