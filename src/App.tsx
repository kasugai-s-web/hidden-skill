import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QUESTIONS, QUESTION_COUNT } from './data/questions';
import { analyzeWithAI } from './lib/ai';
import { analyzeLocally } from './lib/analyze';
import { sound } from './lib/sound';
import {
  addHistoryEntry,
  clearState,
  deleteHistoryEntry,
  emptyAnswers,
  loadHistory,
  loadSoundPref,
  loadState,
  saveSoundPref,
  saveState,
} from './lib/storage';
import type { AnalysisResult, HistoryEntry, Screen } from './lib/types';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { PlayerInputScreen } from './components/PlayerInputScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { RecordsScreen } from './components/RecordsScreen';
import { ResultScreen } from './components/ResultScreen';
import { SoundButton } from './components/SoundButton';
import { StartScreen } from './components/StartScreen';

const MIN_ANALYZING_MS = 1600;

export default function App() {
  const saved = useMemo(() => loadState(), []);
  const [screen, setScreen] = useState<Screen>('start');
  const [name, setName] = useState(saved?.name ?? '');
  const [answers, setAnswers] = useState<string[]>(saved?.answers ?? emptyAnswers());
  const [index, setIndex] = useState(saved?.index ?? 0);
  const [result, setResult] = useState<AnalysisResult | null>(saved?.result ?? null);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [soundOn, setSoundOn] = useState(() => loadSoundPref());
  const [resultShown, setResultShown] = useState(false);
  const [historyId, setHistoryId] = useState<string | null>(saved?.historyId ?? null);
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory());
  /** RECORDS から開いている記録（null なら今回の診断結果を表示中） */
  const [viewingEntry, setViewingEntry] = useState<HistoryEntry | null>(null);
  const analyzingRef = useRef(false);

  const hasProgress = Boolean(name) || answers.some((a) => a.trim()) || Boolean(result);

  // 途中再開用の保存
  useEffect(() => {
    if (!hasProgress) return;
    // start / records 画面に戻っただけでは進捗を失わない（CONTINUE 用）
    const persistScreen: Screen =
      screen === 'start' || screen === 'records' ? (result ? 'result' : name ? 'question' : 'player') : screen;
    saveState({
      screen: persistScreen,
      name,
      answers,
      index,
      result,
      historyId,
    });
  }, [screen, name, answers, index, result, historyId, hasProgress]);

  useEffect(() => {
    sound.setEnabled(soundOn);
  }, [soundOn]);

  const handleSound = (next: boolean) => {
    setSoundOn(next);
    saveSoundPref(next);
    sound.setEnabled(next);
    if (next) sound.play('tap');
  };

  const resetAll = useCallback(() => {
    clearState();
    setName('');
    setAnswers(emptyAnswers());
    setIndex(0);
    setResult(null);
    setResultShown(false);
    setHistoryId(null);
    setViewingEntry(null);
    setDirection('forward');
  }, []);

  const startFresh = () => {
    resetAll();
    setScreen('player');
  };

  const continueSaved = () => {
    setDirection('forward');
    setViewingEntry(null);
    if (result) {
      setResultShown(true);
      setScreen('result');
    } else if (!name) {
      setScreen('player');
    } else {
      setScreen('question');
    }
  };

  const runAnalysis = useCallback(async () => {
    if (analyzingRef.current) return;
    analyzingRef.current = true;
    const started = Date.now();
    let res: AnalysisResult | null = null;
    try {
      res = await analyzeWithAI(name, answers);
    } catch {
      res = null;
    }
    if (!res) res = analyzeLocally(name, answers);
    const wait = Math.max(0, MIN_ANALYZING_MS - (Date.now() - started));
    const finalResult = res;
    setTimeout(() => {
      // あとから見返せるように履歴へ保存
      const entry = addHistoryEntry({ name, answers, result: finalResult });
      setHistory(loadHistory());
      setHistoryId(entry.id);
      setResult(finalResult);
      setResultShown(false);
      setViewingEntry(null);
      setScreen('result');
      analyzingRef.current = false;
    }, wait);
  }, [name, answers]);

  const openRecords = () => {
    setHistory(loadHistory());
    setViewingEntry(null);
    setDirection('forward');
    setScreen('records');
  };

  const deleteRecord = (entry: HistoryEntry) => {
    if (!window.confirm(`「${entry.name}」の記録を削除します。よろしいですか？`)) return;
    setHistory(deleteHistoryEntry(entry.id));
    if (historyId === entry.id) setHistoryId(null);
  };

  useEffect(() => {
    if (screen === 'analyzing') void runAnalysis();
  }, [screen, runAnalysis]);

  const updateAnswer = (value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const goNext = () => {
    setDirection('forward');
    if (index >= QUESTION_COUNT - 1) {
      setScreen('analyzing');
    } else {
      setIndex(index + 1);
    }
  };

  const goBack = () => {
    setDirection('back');
    if (index === 0) {
      setScreen('player');
    } else {
      setIndex(index - 1);
    }
  };

  return (
    <div className="crt">
      <div className="glow-line" aria-hidden="true" />
      <div className="app">
        <div className="top-bar">
          <span className="top-bar__logo">{screen === 'start' ? '' : 'HIDDEN SKILL'}</span>
          <SoundButton on={soundOn} onToggle={handleSound} />
        </div>

        {screen === 'start' && (
          <StartScreen
            hasProgress={hasProgress}
            savedName={name}
            recordCount={history.length}
            onStart={startFresh}
            onContinue={continueSaved}
            onRecords={openRecords}
          />
        )}

        {screen === 'player' && (
          <PlayerInputScreen
            initialName={name}
            onBack={() => {
              setDirection('back');
              setScreen('start');
            }}
            onSubmit={(n) => {
              setName(n);
              setDirection('forward');
              setIndex(0);
              setScreen('question');
            }}
          />
        )}

        {screen === 'question' && (
          <QuestionScreen
            key={QUESTIONS[index].id}
            name={name}
            question={QUESTIONS[index]}
            index={index}
            total={QUESTION_COUNT}
            answer={answers[index] ?? ''}
            direction={direction}
            onChange={updateAnswer}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {screen === 'analyzing' && <AnalyzingScreen name={name} />}

        {screen === 'records' && (
          <RecordsScreen
            entries={history}
            onOpen={(entry) => {
              setViewingEntry(entry);
              setDirection('forward');
              setScreen('result');
            }}
            onDelete={deleteRecord}
            onBack={() => {
              setDirection('back');
              setScreen('start');
            }}
          />
        )}

        {screen === 'result' && viewingEntry && (
          <ResultScreen
            key={viewingEntry.id}
            name={viewingEntry.name}
            result={viewingEntry.result}
            answers={viewingEntry.answers}
            createdAt={viewingEntry.createdAt}
            skipIntro
            onBack={openRecords}
            onNewPlayer={() => {
              resetAll();
              setScreen('player');
            }}
            deleteLabel="この記録を削除"
            onDeleteData={() => {
              setHistory(deleteHistoryEntry(viewingEntry.id));
              if (historyId === viewingEntry.id) setHistoryId(null);
              setViewingEntry(null);
              setScreen('records');
            }}
          />
        )}

        {screen === 'result' && !viewingEntry && result && (
          <ResultScreen
            name={name}
            result={result}
            answers={answers}
            skipIntro={resultShown}
            onNewPlayer={() => {
              resetAll();
              setScreen('player');
            }}
            onDeleteData={() => {
              // 今回の回答データと、その記録を削除
              if (historyId) setHistory(deleteHistoryEntry(historyId));
              resetAll();
              setScreen('start');
            }}
          />
        )}
      </div>
    </div>
  );
}
