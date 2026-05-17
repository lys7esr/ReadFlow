import { useEffect } from 'react';
import { SHORTCUTS } from '../constants/shortcuts';

export const useKeyboardShortcuts = (handlers, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const match = SHORTCUTS.find((s) => s.keys.includes(e.key));
      if (!match) return;
      const fn = handlers[match.action];
      if (fn) { e.preventDefault(); fn(e); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers, enabled]);
};