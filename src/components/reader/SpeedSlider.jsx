import { READER_CONFIG } from '../../constants/reader';

export const SpeedSlider = ({ value, onChange }) => (
  <div className="flex items-center gap-3 w-full">
    <span className="text-[10px] uppercase tracking-widest text-text-muted">Speed</span>
    <input
      type="range"
      min={READER_CONFIG.speed.min}
      max={READER_CONFIG.speed.max}
      step={READER_CONFIG.speed.step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Scroll speed"
      className="flex-1 accent-accent h-1 rounded-full"
    />
    <span className="text-xs text-text-secondary w-10 text-right tabular-nums">{value}</span>
  </div>
);