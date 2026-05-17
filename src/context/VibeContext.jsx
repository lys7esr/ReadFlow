import { createContext, useContext, useEffect, useMemo } from 'react';
import { VIBES, DEFAULT_VIBE } from '../constants/vibes';
import { STORAGE_KEYS } from '../constants/reader';
import { useLocalStorage } from '../hooks/useLocalStorage';

const VibeContext = createContext(null);

export const VibeProvider = ({ children }) => {
  const [vibeId, setVibeId] = useLocalStorage(STORAGE_KEYS.vibe, DEFAULT_VIBE);
  const vibe = VIBES[vibeId] || VIBES[DEFAULT_VIBE];

  // Sync CSS variables whenever vibe changes — drives all visual changes
  useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--vibe-accent', vibe.config.accentColor);
    r.setProperty('--vibe-page-margin', `${vibe.config.pageMargin}px`);
    r.setProperty('--vibe-page-radius', vibe.config.pageRadius);
    r.setProperty('--vibe-page-shadow', vibe.config.pageShadow);
    r.setProperty('--vibe-progress-h', vibe.config.progressHeight);
  }, [vibe]);

  const value = useMemo(() => ({ vibe, vibeId, setVibeId }), [vibe, vibeId, setVibeId]);
  return <VibeContext.Provider value={value}>{children}</VibeContext.Provider>;
};

export const useVibe = () => {
  const ctx = useContext(VibeContext);
  if (!ctx) throw new Error('useVibe must be used inside VibeProvider');
  return ctx;
};