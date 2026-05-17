import { useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS, AMBIENT_TRACKS } from '../constants/reader';

const createAudioContext = () =>
  new (window.AudioContext || window.webkitAudioContext)();

// ── Builders (connect to a passed `dest` node) ────────────────────────────────

function buildRainD(ctx, dest) {
  const bufLen = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1400; bp.Q.value = 0.4;
  const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 600;
  const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.07;
  const lfoG = ctx.createGain(); lfoG.gain.value = 0.08;
  lfo.connect(lfoG);
  const g = ctx.createGain(); g.gain.value = 1;
  lfoG.connect(g.gain);
  src.connect(bp); bp.connect(hp); hp.connect(g); g.connect(dest);
  src.start(); lfo.start();
  return { cleanup: null };
}

function buildOceanD(ctx, dest) {
  const bufLen = ctx.sampleRate * 6;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
  for (let i = 0; i < bufLen; i++) {
    const w = Math.random()*2-1;
    b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759;
    b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856;
    b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980;
    data[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)/7; b6=w*0.115926;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 500;
  const lfo = ctx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.10;
  const lfoG = ctx.createGain(); lfoG.gain.value = 0.18;
  lfo.connect(lfoG);
  const g = ctx.createGain(); g.gain.value = 0.9;
  lfoG.connect(g.gain);
  src.connect(lp); lp.connect(g); g.connect(dest);
  src.start(); lfo.start();
  return { cleanup: null };
}

function buildCafeD(ctx, dest) {
  const bufLen = ctx.sampleRate * 3;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random()*2-1;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const bp = ctx.createBiquadFilter(); bp.type='bandpass'; bp.frequency.value=1000; bp.Q.value=0.3;
  const lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2000;
  const g = ctx.createGain(); g.gain.value=0.45;
  src.connect(bp); bp.connect(lp); lp.connect(g); g.connect(dest);
  src.start();
  let t;
  const tick = () => {
    t = setTimeout(() => {
      if (ctx.state==='closed') return;
      const o=ctx.createOscillator(); const og=ctx.createGain();
      o.type='sine'; o.frequency.value=1800+Math.random()*600;
      og.gain.setValueAtTime(0.06, ctx.currentTime);
      og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.5);
      o.connect(og); og.connect(dest); o.start(); o.stop(ctx.currentTime+0.5);
      tick();
    }, 4000+Math.random()*9000);
  };
  tick();
  return { cleanup: () => clearTimeout(t) };
}

function buildLofiD(ctx, dest) {
  const bufLen = ctx.sampleRate * 4;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random()*2-1;
  const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
  const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=4000;
  const lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=10000;
  const hg = ctx.createGain(); hg.gain.value=0.06;
  src.connect(hp); hp.connect(lp); lp.connect(hg); hg.connect(dest);
  src.start();
  const pad = ctx.createOscillator(); pad.type='sine'; pad.frequency.value=55;
  const pf = ctx.createBiquadFilter(); pf.type='lowpass'; pf.frequency.value=180;
  const pg = ctx.createGain(); pg.gain.value=0.08;
  pad.connect(pf); pf.connect(pg); pg.connect(dest); pad.start();
  let ct;
  const crackle = () => {
    ct = setTimeout(() => {
      if (ctx.state==='closed') return;
      const o=ctx.createOscillator(); const og=ctx.createGain();
      o.type='sawtooth'; o.frequency.value=60+Math.random()*100;
      og.gain.setValueAtTime(0.03, ctx.currentTime);
      og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.06);
      o.connect(og); og.connect(dest); o.start(); o.stop(ctx.currentTime+0.06);
      crackle();
    }, 500+Math.random()*2000);
  };
  crackle();
  return { cleanup: () => { clearTimeout(ct); try { pad.stop(); } catch {} } };
}

function buildWithDest(trackId, ctx, dest) {
  switch (trackId) {
    case 'rain':  return buildRainD(ctx, dest);
    case 'ocean': return buildOceanD(ctx, dest);
    case 'cafe':  return buildCafeD(ctx, dest);
    case 'lofi':  return buildLofiD(ctx, dest);
    default: return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_STATE = { trackId: null, volume: 0.5, enabled: false };

export const useAmbientSound = () => {
  const [state, setState] = useLocalStorage(STORAGE_KEYS.ambient, DEFAULT_STATE);
  const ctxRef = useRef(null);
  const gainRef = useRef(null);
  const cleanupRef = useRef(null);
  const playingIdRef = useRef(null);

  const fadeTo = useCallback((targetVol, duration = 0.6) => {
    if (!gainRef.current || !ctxRef.current) return;
    const g = gainRef.current;
    g.gain.cancelScheduledValues(ctxRef.current.currentTime);
    g.gain.setValueAtTime(g.gain.value, ctxRef.current.currentTime);
    g.gain.linearRampToValueAtTime(targetVol, ctxRef.current.currentTime + duration);
  }, []);

  const stopCurrent = useCallback(() => {
    if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }
    if (ctxRef.current) {
      try { ctxRef.current.close(); } catch {}
      ctxRef.current = null;
    }
    gainRef.current = null;
    playingIdRef.current = null;
  }, []);

  const startTrack = useCallback((trackId, volume) => {
    stopCurrent();
    const ctx = createAudioContext();
    ctxRef.current = ctx;
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;
    const result = buildWithDest(trackId, ctx, masterGain);
    if (result?.cleanup) cleanupRef.current = result.cleanup;
    playingIdRef.current = trackId;
    const vol = Math.max(0.01, volume);
    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.8);
  }, [stopCurrent]);

  const setVolume = useCallback((vol) => {
    setState((s) => ({ ...s, volume: vol }));
    if (gainRef.current && ctxRef.current) fadeTo(vol, 0.3);
  }, [setState, fadeTo]);

  const selectTrack = useCallback((trackId) => {
    setState((s) => ({ ...s, trackId, enabled: true }));
    startTrack(trackId, state.volume);
  }, [setState, startTrack, state.volume]);

  const toggle = useCallback(() => {
    if (state.enabled && playingIdRef.current) {
      fadeTo(0, 0.6);
      setTimeout(stopCurrent, 700);
      setState((s) => ({ ...s, enabled: false }));
    } else {
      const trackId = state.trackId || AMBIENT_TRACKS[0].id;
      setState((s) => ({ ...s, enabled: true, trackId }));
      startTrack(trackId, state.volume);
    }
  }, [state, fadeTo, stopCurrent, setState, startTrack]);

  useEffect(() => () => stopCurrent(), [stopCurrent]);

  return {
    isPlaying: state.enabled && !!playingIdRef.current,
    trackId: state.trackId,
    volume: state.volume,
    enabled: state.enabled,
    selectTrack,
    setVolume,
    toggle,
  };
};