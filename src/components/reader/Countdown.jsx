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
      className="fixed inset-0 z-40 grid place-items-center bg-black/60 backdrop-blur-md animate-fade-in"
      onClick={onCancel}
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div className="text-[120px] sm:text-[160px] font-light leading-none text-text-primary animate-pulse-soft tabular-nums">
          {n}
        </div>
        <div className="mt-2 text-sm text-text-secondary">Tap to cancel</div>
      </div>
    </div>
  );
};