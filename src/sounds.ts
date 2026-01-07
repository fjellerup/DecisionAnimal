// Audio context for generating sounds
let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// Tick sound when switching between options
export function playTickSound(pitch: number = 1) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = 800 * pitch;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialDecayTo(0.01, ctx.currentTime + 0.05);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.05);
}

// Final "ding" sound when decision is made
export function playDingSound() {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.frequency.value = 880;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
  gainNode.gain.exponentialDecayTo(0.01, ctx.currentTime + 0.5);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.5);
}

// Winning fanfare for confetti moments
export function playWinSound() {
  const ctx = getAudioContext();
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = freq;
    oscillator.type = 'sine';

    const startTime = ctx.currentTime + i * 0.1;
    gainNode.gain.setValueAtTime(0.2, startTime);
    gainNode.gain.exponentialDecayTo(0.01, startTime + 0.3);

    oscillator.start(startTime);
    oscillator.stop(startTime + 0.3);
  });
}

// Polyfill for exponentialDecayTo (not a real method, we'll use exponentialRampToValueAtTime)
declare global {
  interface AudioParam {
    exponentialDecayTo(value: number, endTime: number): void;
  }
}

AudioParam.prototype.exponentialDecayTo = function(value: number, endTime: number) {
  this.exponentialRampToValueAtTime(Math.max(value, 0.0001), endTime);
};
