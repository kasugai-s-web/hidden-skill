import { useState, type FormEvent } from 'react';
import { PixelButton } from './PixelButton';

interface Props {
  initialName: string;
  onSubmit: (name: string) => void;
  onBack: () => void;
}

const MAX_LEN = 20;

export function PlayerInputScreen({ initialName, onSubmit, onBack }: Props) {
  const [name, setName] = useState(initialName);
  const trimmed = name.trim();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!trimmed) return;
    onSubmit(trimmed);
  };

  return (
    <section className="screen slide-forward">
      <div className="label-en">SELECT PLAYER</div>
      <h2 className="heading-ja">誰を思い浮かべますか？</h2>
      <p className="muted" style={{ margin: 0, fontSize: 14 }}>
        仕事仲間・部下・上司など、1人だけ思い浮かべてください。
      </p>

      <form className="form-block" onSubmit={handleSubmit}>
        <label className="label-en" htmlFor="player-name" style={{ display: 'block', marginBottom: 8 }}>
          NAME / NICKNAME
        </label>
        <input
          id="player-name"
          className="pixel-input"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="off"
          enterKeyHint="go"
          maxLength={MAX_LEN}
          placeholder="例：田中さん"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <p className="field-note">
          ここで入力した名前は、質問文に「{trimmed || '田中さん'}について答えてください」のように表示されます。
          <br />
          入力内容は外部に送信されず、この端末のブラウザ内だけで処理されます。
        </p>

        <div className="nav-row">
          <PixelButton variant="ghost" className="pixel-btn--back" se="back" onClick={onBack}>
            ◀ BACK
          </PixelButton>
          <PixelButton type="submit" className="pixel-btn--next" se="next" disabled={!trimmed}>
            NEXT ▶
          </PixelButton>
        </div>
      </form>
    </section>
  );
}
