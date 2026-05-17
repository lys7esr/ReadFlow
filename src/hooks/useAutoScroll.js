import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Frame-accurate auto-scroll with sub-pixel accumulator.
 * speed = pixels-per-second. Stops at end of scrollable area.
 */
export const useAutoScroll = (containerRef) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(45);
  const rafRef = useRef(0);
  const lastTsRef = useRef(0);
  const accumRef = useRef(0);
  const speedRef = useRef(speed);
  const onEndRef = useRef(null);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    lastTsRef.current = 0;
    accumRef.current = 0;
  }, []);

  const tick = useCallback((ts) => {
    const el = containerRef.current;
    if (!el) return;
    if (!lastTsRef.current) lastTsRef.current = ts;
    const dt = (ts - lastTsRef.current) / 1000;
    lastTsRef.current = ts;

    accumRef.current += speedRef.current * dt;
    const whole = Math.floor(accumRef.current);
    if (whole > 0) {
      el.scrollTop += whole;
      accumRef.current -= whole;
    }

    const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
    if (atEnd) {
      stop();
      onEndRef.current?.();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [containerRef, stop]);

  const play = useCallback(() => {
    if (rafRef.current) return;
    setIsPlaying(true);
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const toggle = useCallback(() => {
    setIsPlaying((p) => {
      if (p) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = 0; lastTsRef.current = 0;
        return false;
      }
      lastTsRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
      return true;
    });
  }, [tick]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const onEnd = useCallback((cb) => { onEndRef.current = cb; }, []);

  return { isPlaying, speed, setSpeed, play, stop, toggle, onEnd };
};