import { useRef, useEffect, useCallback } from 'react';

const SOUNDS = {
  click1: 'https://raw.githubusercontent.com/AndrewRadev/typewriter.vim/master/sounds/click1.wav',
  click2: 'https://raw.githubusercontent.com/AndrewRadev/typewriter.vim/master/sounds/click2.wav',
  click3: 'https://raw.githubusercontent.com/AndrewRadev/typewriter.vim/master/sounds/click3.wav',
  carriage: 'https://raw.githubusercontent.com/AndrewRadev/typewriter.vim/master/sounds/carriage1.wav',
  bell: 'https://raw.githubusercontent.com/AndrewRadev/typewriter.vim/master/sounds/ding1.wav',
};

export default function useTypewriterSounds(soundPack = 'vintage') {
  const audioCtxRef = useRef(null);
  const buffersRef = useRef({});
  const noiseBufferRef = useRef(null);
  const soundPackRef = useRef(soundPack);

  // Sync ref
  useEffect(() => {
    soundPackRef.current = soundPack;
  }, [soundPack]);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      // Pre-generate white noise buffer for synthesizers
      const sr = ctx.sampleRate;
      const len = sr * 2;
      const buf = ctx.createBuffer(1, len, sr);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseBufferRef.current = buf;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Preload and decode sound files (Vintage Typewriter WAVs)
  useEffect(() => {
    const ctx = getCtx();
    Object.entries(SOUNDS).forEach(([key, url]) => {
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => ctx.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          buffersRef.current[key] = audioBuffer;
        })
        .catch(err => console.error(`Error loading typewriter sound "${key}":`, err));
    });
  }, [getCtx]);

  const playBuffer = useCallback((bufferName, rate = 1.0, volume = 1.0) => {
    const ctx = getCtx();
    const buffer = buffersRef.current[bufferName];
    if (!buffer) return;

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.setValueAtTime(rate, ctx.currentTime);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    source.connect(gainNode).connect(ctx.destination);
    source.start(0);
  }, [getCtx]);

  // Cherry MX Blue switch sound synthesizer
  const playCherryMX = useCallback((rate = 1.0, volume = 1.0) => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Slider Snap (high pitch mechanical click)
    const snapOsc = ctx.createOscillator();
    snapOsc.type = 'triangle';
    snapOsc.frequency.setValueAtTime(4600 * rate, now);
    snapOsc.frequency.exponentialRampToValueAtTime(1800, now + 0.005);

    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.045 * volume, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.006);

    snapOsc.connect(snapGain).connect(ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.008);

    // Housing Clack (impact thump)
    const clackOsc = ctx.createOscillator();
    clackOsc.type = 'sine';
    clackOsc.frequency.setValueAtTime(260 * rate, now);
    clackOsc.frequency.exponentialRampToValueAtTime(100, now + 0.015);

    const clackGain = ctx.createGain();
    clackGain.gain.setValueAtTime(0.065 * volume, now);
    clackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    clackOsc.connect(clackGain).connect(ctx.destination);
    clackOsc.start(now);
    clackOsc.stop(now + 0.022);

    // Noise component for case acoustics
    if (noiseBufferRef.current) {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBufferRef.current;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1300 * rate;
      filter.Q.value = 2;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.03 * volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

      noise.connect(filter).connect(noiseGain).connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.015);
    }
  }, [getCtx]);

  // IBM Model M Buckling Spring sound synthesizer
  const playIBMModelM = useCallback((rate = 1.0, volume = 1.0) => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Metallic spring ping (multi-oscillator ring)
    const freqs = [3100, 3850, 4400];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * rate, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01 * volume / (i + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05 + i * 0.01);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    });

    // Solid plastic frame clack
    const frameOsc = ctx.createOscillator();
    frameOsc.type = 'triangle';
    frameOsc.frequency.setValueAtTime(200 * rate, now);
    frameOsc.frequency.exponentialRampToValueAtTime(90, now + 0.02);

    const frameGain = ctx.createGain();
    frameGain.gain.setValueAtTime(0.08 * volume, now);
    frameGain.gain.exponentialRampToValueAtTime(0.001, now + 0.026);

    frameOsc.connect(frameGain).connect(ctx.destination);
    frameOsc.start(now);
    frameOsc.stop(now + 0.03);

    // Spring buckling friction noise
    if (noiseBufferRef.current) {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBufferRef.current;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1600 * rate;
      filter.Q.value = 1.2;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.045 * volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

      noise.connect(filter).connect(noiseGain).connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.02);
    }
  }, [getCtx]);

  // ─── Key Strike: plays corresponding sound pack sound ───
  const playKeyStrike = useCallback(() => {
    const pack = soundPackRef.current;
    if (pack === 'cherry') {
      playCherryMX(1.0 + (Math.random() - 0.5) * 0.05, 1.0);
    } else if (pack === 'ibm') {
      playIBMModelM(1.0 + (Math.random() - 0.5) * 0.05, 1.0);
    } else {
      const clicks = ['click1', 'click2', 'click3'];
      const chosen = clicks[Math.floor(Math.random() * clicks.length)];
      const rate = 0.96 + Math.random() * 0.08;
      playBuffer(chosen, rate, 1.0);
    }
  }, [playBuffer, playCherryMX, playIBMModelM]);

  // ─── Key Release ───
  const playKeyRelease = useCallback(() => {}, []);

  // ─── Carriage Advance ───
  const playCarriageAdvance = useCallback(() => {}, []);

  // ─── Carriage Return: real mechanical lever return sound ───
  const playCarriageReturn = useCallback(() => {
    playBuffer('carriage', 1.0, 1.0);
  }, [playBuffer]);

  // ─── Bell: real margin bell ding ───
  const playBell = useCallback(() => {
    playBuffer('bell', 1.0, 1.0);
  }, [playBuffer]);

  // ─── Spacebar: deeper, heavier click ───
  const playSpacebar = useCallback(() => {
    const pack = soundPackRef.current;
    if (pack === 'cherry') {
      playCherryMX(0.75 + (Math.random() - 0.5) * 0.05, 0.9);
    } else if (pack === 'ibm') {
      playIBMModelM(0.75 + (Math.random() - 0.5) * 0.05, 0.9);
    } else {
      const clicks = ['click1', 'click2', 'click3'];
      const chosen = clicks[Math.floor(Math.random() * clicks.length)];
      const rate = 0.78 + Math.random() * 0.04;
      playBuffer(chosen, rate, 0.95);
    }
  }, [playBuffer, playCherryMX, playIBMModelM]);

  // ─── Paper Scroll: paper friction zipping sound ───
  const playPaperScroll = useCallback(() => {
    const ctx = getCtx();
    const now = ctx.currentTime;

    if (noiseBufferRef.current) {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBufferRef.current;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.12);
      filter.Q.value = 1.0;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start(now);
      noise.stop(now + 0.15);
    }
  }, [getCtx]);


  return {
    playKeyStrike,
    playKeyRelease,
    playCarriageAdvance,
    playCarriageReturn,
    playBell,
    playSpacebar,
    playPaperScroll,
  };
}
