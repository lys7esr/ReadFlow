import { clamp } from '../../utils/clamp';

export const ProgressBar = ({ value }) => {
  const pct = clamp(value, 0, 1) * 100;
  return (
    <div className="h-[3px] w-full bg-bg-border overflow-hidden rounded-full">
      <div
        className="h-full bg-accent transition-[width] duration-100 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};