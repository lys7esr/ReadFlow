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
                'border active:scale-[0.98]',
                active
                  ? 'border-[var(--vibe-accent)]/40 shadow-[0_0_30px_-8px_color-mix(in_srgb,var(--vibe-accent)_30%,transparent)]'
                  : 'border-bg-border bg-bg-elevated hover:border-text-muted/40 hover:bg-bg-surface'
              )}
              style={active ? {
                background: `color-mix(in srgb, ${v.config.accentColor} 8%, #15171C)`,
              } : {}}
            >
              <Icon
                className="h-5 w-5 mb-3 transition-colors duration-300"
                style={{ color: active ? v.config.accentColor : undefined }}
              />
              <div className="text-sm font-medium">{v.label}</div>
              <div className="text-xs text-text-muted mt-1 leading-snug">{v.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};