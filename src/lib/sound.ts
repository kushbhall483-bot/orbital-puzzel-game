const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

let isSoundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  isSoundEnabled = enabled;
  localStorage.setItem('orbitalPuzzleSound', enabled ? '1' : '0');
};

export const getSoundEnabled = () => {
  const saved = localStorage.getItem('orbitalPuzzleSound');
  if (saved !== null) {
    isSoundEnabled = saved === '1';
  }
  return isSoundEnabled;
};

// Initialize from local storage
getSoundEnabled();

export const playClick = () => {
  if (!isSoundEnabled) return;
  const audio = new Audio('/click.wav');
  audio.volume = 1.0;
  audio.play().catch(e => console.error("Audio play failed:", e));
};

export const playTubeSelect = () => {
  if (!isSoundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(1.0, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
};

export const playError = () => {
  if (!isSoundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(150, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
  
  gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
};

export const playTimerWarning = () => {
  if (!isSoundEnabled) return;
  const audio = new Audio('/timer.wav');
  audio.volume = 0.8;
  audio.play().catch(e => console.error("Audio play failed:", e));
};

export const playPour = () => {
  if (!isSoundEnabled) return;
  const audio = new Audio('/mixkit-water-bubble-1317 (1) (1).wav');
  audio.volume = 1.0;
  audio.play().catch(e => console.error("Audio play failed:", e));
};

export const playWin = () => {
  if (!isSoundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  // Arpeggio for win
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.08);
    gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + i * 0.08 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.08 + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + i * 0.08);
    osc.stop(audioCtx.currentTime + i * 0.08 + 0.5);
  });
};

export const playGameOver = () => {
  if (!isSoundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const notes = [392.00, 370.00, 349.23, 329.63]; // G4, Gb4, F4, E4
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.2);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + i * 0.2 + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.2 + 0.4);
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + i * 0.2);
    osc.stop(audioCtx.currentTime + i * 0.2 + 0.4);
  });
};

export const playComplete = () => {
  if (!isSoundEnabled) return;
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const notes = [880.00, 1174.66, 1760.00]; // A5, D6, A6
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.05);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + i * 0.05 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.05 + 0.2);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(audioCtx.currentTime + i * 0.05);
    osc.stop(audioCtx.currentTime + i * 0.05 + 0.2);
  });
};
