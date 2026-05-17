import { VIBES } from '../../constants/vibes';
import { useVibe } from '../../context/VibeContext';
import { cn } from '../../utils/classNames';

export const VibeSelector = () => {
  const { vibeId, setVibeId } = useVibe();
  return (
    <div>
      <h2 className="text-sm uppercase tracking-[0.18em] text-text-muted mb-4">Choose your vibe</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.values(VIBES).map((v) => {
          const Icon = v.icon;
          const active = vibeId === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setVibeId(v.id)}
              aria-pressed={active}
              className={cn(
                'group text-left p-4 rounded-2xl transition-all duration-300 focus-ring',
                'border', active
                  ? 'border-accent bg-accent/10 shadow-glow'
                  : 'border-bg-border bg-bg-elevated hover:border-text-muted hover:bg-bg-surface'
              )}
            >
              <Icon className={cn('h-5 w-5 mb-3', active ? 'text-accent' : 'text-text-secondary')} />
              <div className="text-sm font-medium">{v.label}</div>
              <div className="text-xs text-text-muted mt-1 leading-snug">{v.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};