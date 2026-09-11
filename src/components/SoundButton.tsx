interface Props {
  on: boolean;
  onToggle: (next: boolean) => void;
}

export function SoundButton({ on, onToggle }: Props) {
  return (
    <button
      type="button"
      className={`sound-btn${on ? ' is-on' : ''}`}
      aria-pressed={on}
      aria-label={`サウンド ${on ? 'オン' : 'オフ'}`}
      onClick={() => onToggle(!on)}
    >
      <span>SOUND</span>
      <span className="sound-btn__state">{on ? 'ON' : 'OFF'}</span>
    </button>
  );
}
