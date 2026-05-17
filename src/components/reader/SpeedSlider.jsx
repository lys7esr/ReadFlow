import { READER_CONFIG } from '../../constants/reader';

export const SpeedSlider = ({ value, onChange, compact = false }) => (
  <div className="flex items-center gap-2.5 w-full">
    <span className={`${compact ? 'hidden sm:block' : 'block'} text-[10px] uppercase tracking-[0.15em] text-text-muted flex-shrink-0`}>
      Speed
    </span>
    <input
      type="range"
      min={READER_CONFIG.speed.min}
      max={READER_CONFIG.speed.max}
      step={READER_CONFIG.speed.step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      aria-label="Scroll speed"
      className="flex-1"
    />
    <span className="text-xs text-text-secondary w-8 text-right tabular-nums flex-shrink-0">
      {value}
    </span>
  </div>
);