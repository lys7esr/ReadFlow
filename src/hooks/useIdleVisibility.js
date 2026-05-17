import { useCallback, useEffect, useRef, useState } from 'react';

export const useIdleVisibility = (enabled = true, delay = 2200) => {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);
  const delayRef = useRef(delay);
  useEffect(() => { delayRef.current = delay; }, [delay]);

  const arm = useCallback(() => {
    setVisible(true);
    clearTimeout(timerRef.current);
    if (enabled) {
      timerRef.current = setTimeout(() => setVisible(false), delayRef.current);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) { setVisible(true); clearTimeout(timerRef.current); return; }
    arm();
    const events = ['mousemove', 'touchstart', 'pointerdown', 'keydown'];
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, arm));
      clearTimeout(timerRef.current);
    };
  }, [enabled, arm]);

  return [visible, setVisible];
};