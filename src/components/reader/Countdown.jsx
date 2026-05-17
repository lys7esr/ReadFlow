import { useEffect, useState } from 'react';
import { READER_CONFIG } from '../../constants/reader';

export const Countdown = ({ onComplete, onCancel }) => {
  const [n, setN] = useState(READER_CONFIG.countdownSeconds);

  useEffect(() => {
    if (n <= 0) { onComplete(); return; }
    const t = setTimeout(() => setN(n - 1), 1000);
    return () => clearTimeout(t);
  }, [n, onComplete]);

  return (
    <div
      className="fixed inset-0 z-40 grid place-items-center bg-black/65 backdrop-blur-md animate-fade-in"
      onClick={onCancel}
      role="status"
      aria-live="polite"
    >
      <div className="text-center select-none">
        <div
          className="text-[120px] sm:text-[160px] font-light leading-none tabular-nums"
          style={{
            color: 'var(--vibe-accent)',
            textShadow: '0 0 60px color-mix(in srgb, var(--vibe-accent) 40%, transparent)',
            animation: 'pulseSoft 1s ease-in-out infinite',
          }}
        >
          {n}
        </div>
        <div className="mt-4 text-sm text-text-secondary tracking-wide">Tap to cancel</div>
      </div>
    </div>
  );
};