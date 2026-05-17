import { useCallback, useEffect, useState } from 'react';

export const useFullscreen = () => {
  const [isFs, setIsFs] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch { /* gracefully ignore (e.g. iOS Safari) */ }
  }, []);

  return { isFullscreen: isFs, toggleFullscreen: toggle };
};