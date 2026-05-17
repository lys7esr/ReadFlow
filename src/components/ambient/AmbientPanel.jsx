import { useState } from 'react';
import { Music2, Volume2, VolumeX, X } from 'lucide-react';
import { AMBIENT_TRACKS } from '../../constants/reader';
import { useAmbientSound } from '../../hooks/useAmbientSound';
import { cn } from '../../utils/classNames';

export const AmbientPanel = () => {
  const [open, setOpen] = useState(false);
  const { isPlaying, trackId, volume, selectTrack, setVolume, toggle } = useAmbientSound();

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ambient sound"
        className={cn(
          'fixed left-4 bottom-[calc(max(env(safe-area-inset-bottom),12px)+80px)] z-40',
          'h-10 w-10 rounded-full flex items-center justify-center',
          'glass shadow-float transition-all duration-200 active:scale-95',
          'hover:bg-white/5',
          isPlaying ? 'text-[var(--vibe-accent)]' : 'text-text-secondary'
        )}
      >
        {isPlaying ? <Volume2 className="h-4 w-4" /> : <Music2 className="h-4 w-4" />}
        {isPlaying && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[var(--vibe-accent)] animate-pulse-soft" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className={cn(
            'fixed left-4 z-50',
            'bottom-[calc(max(env(safe-area-inset-bottom),12px)+132px)]',
            'w-64 glass-strong rounded-2xl p-4 shadow-float-lg',
            'animate-slide-up-sm'
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs uppercase tracking-[0.18em] text-text-muted">Ambient Sound</span>
            <button
              onClick={() => setOpen(false)}
              className="h-6 w-6 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Track grid */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {AMBIENT_TRACKS.map((t) => {
              const active = trackId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    if (active && isPlaying) toggle();
                    else selectTrack(t.id);
                  }}
                  className={cn(
                    'flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-center',
                    'transition-all duration-200 active:scale-95',
                    active && isPlaying
                      ? 'bg-[color-mix(in_srgb,var(--vibe-accent)_15%,transparent)] border border-[var(--vibe-accent)]/30 text-[var(--vibe-accent)]'
                      : 'bg-bg-surface/60 border border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-surface'
                  )}
                >
                  <span className="text-lg leading-none">{t.emoji}</span>
                  <span className="text-[11px] font-medium">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <VolumeX className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.02}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="flex-1"
            />
            <Volume2 className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
          </div>

          {/* Status hint */}
          {!isPlaying && trackId && (
            <p className="mt-2.5 text-[11px] text-text-muted text-center">
              Tap a sound to play
            </p>
          )}
        </div>
      )}
    </>
  );
};