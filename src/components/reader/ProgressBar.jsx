import { clamp } from '../../utils/clamp';

export const ProgressBar = ({ value, height }) => {
  const pct = clamp(value, 0, 1) * 100;
  return (
    <div
      className="w-full bg-bg-border/60 overflow-hidden rounded-full"
      style={{ height: height || 'var(--vibe-progress-h, 3px)' }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-150 ease-linear"
        style={{ width: `${pct}%`, background: 'var(--vibe-accent)' }}
      />
    </div>
  );
};