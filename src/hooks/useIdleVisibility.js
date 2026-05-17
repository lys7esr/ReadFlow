import { useEffect, useRef, useState } from 'react';
import { READER_CONFIG } from '../constants/reader';

export const useIdleVisibility = (enabled = true, delay = READER_CONFIG.idleHideMs) => {
  const [visible, setVisible] = useState(true);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!enabled) { setVisible(true); return; }
    const arm = () => {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), delay);
    };
    arm();
    const events = ['mousemove', 'touchstart', 'pointerdown', 'keydown'];
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    return () => {
      events.forEach((e) => window.removeEventListener(e, arm));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, delay]);

  return [visible, setVisible];
};