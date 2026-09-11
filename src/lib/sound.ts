// Web Audio API で生成するレトロゲーム風 SE（外部音源なし）
export type SeKind = 'tap' | 'start' | 'next' | 'back' | 'found' | 'result' | 'save';

let ctx: AudioContext | null = null;
let enabled = false;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

interface Note {
  freq: number;
  start: number; // 秒（相対）
  dur: number; // 秒
  type?: OscillatorType;
  gain?: number;
}

function playNotes(notes: Note[]): void {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  for (const n of notes) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = n.type ?? 'square';
    osc.frequency.setValueAtTime(n.freq, now + n.start);
    const vol = n.gain ?? 0.08;
    g.gain.setValueAtTime(0.0001, now + n.start);
    g.gain.exponentialRampToValueAtTime(vol, now + n.start + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, now + n.start + n.dur);
    osc.connect(g).connect(ac.destination);
    osc.start(now + n.start);
    osc.stop(now + n.start + n.dur + 0.02);
  }
}

const SE: Record<SeKind, Note[]> = {
  tap: [{ freq: 880, start: 0, dur: 0.06 }],
  start: [
    { freq: 523, start: 0, dur: 0.08 },
    { freq: 659, start: 0.08, dur: 0.08 },
    { freq: 784, start: 0.16, dur: 0.08 },
    { freq: 1047, start: 0.24, dur: 0.18 },
  ],
  next: [
    { freq: 660, start: 0, dur: 0.05 },
    { freq: 990, start: 0.05, dur: 0.09 },
  ],
  back: [
    { freq: 660, start: 0, dur: 0.05 },
    { freq: 440, start: 0.05, dur: 0.09 },
  ],
  found: [
    { freq: 392, start: 0, dur: 0.1 },
    { freq: 523, start: 0.1, dur: 0.1 },
    { freq: 659, start: 0.2, dur: 0.1 },
    { freq: 784, start: 0.3, dur: 0.12 },
    { freq: 1047, start: 0.42, dur: 0.35, gain: 0.1 },
    { freq: 1319, start: 0.42, dur: 0.35, type: 'triangle', gain: 0.06 },
  ],
  result: [
    { freq: 784, start: 0, dur: 0.07 },
    { freq: 988, start: 0.07, dur: 0.07 },
    { freq: 1175, start: 0.14, dur: 0.2 },
  ],
  save: [
    { freq: 1175, start: 0, dur: 0.06 },
    { freq: 1568, start: 0.06, dur: 0.14 },
  ],
};

export const sound = {
  setEnabled(on: boolean): void {
    enabled = on;
    if (on) getCtx(); // ユーザー操作のタイミングで AudioContext を起こす
  },
  isEnabled(): boolean {
    return enabled;
  },
  play(kind: SeKind): void {
    if (!enabled) return;
    try {
      playNotes(SE[kind]);
    } catch {
      /* 音が鳴らなくてもアプリは止めない */
    }
  },
};
