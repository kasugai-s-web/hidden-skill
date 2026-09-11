import { formatDate } from '../lib/format';
import type { HistoryEntry } from '../lib/types';
import { PixelButton } from './PixelButton';

interface Props {
  entries: HistoryEntry[];
  onOpen: (entry: HistoryEntry) => void;
  onDelete: (entry: HistoryEntry) => void;
  onBack: () => void;
}

export function RecordsScreen({ entries, onOpen, onDelete, onBack }: Props) {
  return (
    <section className="screen slide-forward">
      <div className="label-en">SAVED RESULTS</div>
      <h2 className="heading-ja">RECORDS</h2>
      <p className="muted" style={{ margin: '0 0 14px', fontSize: 14 }}>
        これまでの診断結果です。タップすると結果を見返せます（この端末のブラウザ内にだけ保存されています）。
      </p>

      {entries.length === 0 ? (
        <div className="window records-empty">
          <div className="label-en">NO DATA</div>
          <p className="muted" style={{ margin: '8px 0 0' }}>
            まだ記録がありません。診断が完了すると自動でここに保存されます。
          </p>
        </div>
      ) : (
        <ul className="records">
          {entries.map((e, i) => (
            <li key={e.id} className="record">
              <button type="button" className="record__main" onClick={() => onOpen(e)}>
                <span className="record__no">{String(entries.length - i).padStart(2, '0')}</span>
                <span className="record__body">
                  <span className="record__name">{e.name}</span>
                  <span className="record__skill">
                    <span className="record__skill-en">{e.result.mainStrength.en}</span>
                    <span className="record__skill-ja">{e.result.mainStrength.ja}</span>
                  </span>
                  <span className="record__meta">
                    {e.result.className} ・ {formatDate(e.createdAt)}
                  </span>
                </span>
                <span className="record__arrow">▶</span>
              </button>
              <button
                type="button"
                className="record__delete"
                aria-label={`${e.name}の記録を削除`}
                onClick={() => onDelete(e)}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="nav-row" style={{ marginTop: 'auto' }}>
        <PixelButton variant="ghost" se="back" onClick={onBack}>
          ◀ BACK TO TOP
        </PixelButton>
      </div>
    </section>
  );
}
