import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { QUESTIONS, QUESTION_COUNT } from './data/questions';
import { analyzeWithAI } from './lib/ai';
import { analyzeLocally } from './lib/analyze';
import { sound } from './lib/sound';
import {
  clearState,
  emptyAnswers,
  hasProgress as checkProgress,
  loadSoundPref,
  loadState,
  saveSoundPref,
  saveState,
} from './lib/storage';
import type { AnalysisResult, Screen } from './lib/types';
import { AnalyzingScreen } from './components/AnalyzingScreen';
import { PlayerInputScreen } from './components/PlayerInputScreen';
import { QuestionScreen } from './components/QuestionScreen';
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
  const analyzingRef = useRef(false);

  // 途中再開用の保存
  useEffect(() => {
    if (screen === 'start' && !checkProgress(saved) && !name && answers.every((a) => !a)) return;
    saveState({
      // start 画面に戻っただけでは進捗を失わない（CONTINUE 用）
      screen: screen === 'start' ? (saved?.screen ?? 'start') : screen,
      name,
      answers,
      index,
      result,
    });
  }, [screen, name, answers, index, result, saved]);

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
    setDirection('forward');
  }, []);

  const startFresh = () => {
    resetAll();
    setScreen('player');
  };

  const continueSaved = () => {
    if (!saved) return;
    setDirection('forward');
    if (saved.screen === 'result' && saved.result) {
      setResultShown(true);
      setScreen('result');
    } else if (saved.screen === 'player' || !saved.name) {
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
    setTimeout(() => {
      setResult(res);
      setResultShown(false);
      setScreen('result');
      analyzingRef.current = false;
    }, wait);
  }, [name, answers]);

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

  const hasProgress = checkProgress(saved);

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
            savedName={saved?.name ?? ''}
            onStart={startFresh}
            onContinue={continueSaved}
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

        {screen === 'result' && result && (
          <ResultScreen
            name={name}
            result={result}
            skipIntro={resultShown}
            onNewPlayer={() => {
              resetAll();
              setScreen('player');
            }}
            onDeleteData={() => {
              resetAll();
              setScreen('start');
            }}
          />
        )}
      </div>
    </div>
  );
}
