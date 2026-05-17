import { Pause, Play, Maximize, Minimize, X } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { SpeedSlider } from './SpeedSlider';
import { ProgressBar } from './ProgressBar';
import { PageJump } from './PageJump';
import { cn } from '../../utils/classNames';
import { useVibe } from '../../context/VibeContext';

export const ReaderControls = ({
  isPlaying, onToggle, speed, onSpeedChange,
  page, totalPages, progress,
  isFullscreen, onFullscreenToggle, onExit,
  visible, onPageJump,
}) => {
  const { vibe } = useVibe();
  const cfg = vibe.config;
  const iconSize = cfg.controlSize;
  const isCompact = cfg.uiDensity === 'compact';
  const isComfortable = cfg.uiDensity === 'comfortable';

  return (
    <div
      className={cn(
        'fixed left-0 right-0 bottom-0 z-30',
        isCompact
          ? 'px-2 pb-[max(env(safe-area-inset-bottom),8px)] pt-2'
          : 'px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-3',
        'transition-all duration-500 ease-spring',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5 pointer-events-none'
      )}
    >
      <div
        className={cn(
          'glass-strong mx-auto rounded-2xl shadow-float',
          isCompact ? 'max-w-xl px-3 py-2.5' : 'max-w-2xl px-4 py-3',
          isComfortable && 'max-w-2xl px-5 py-4',
        )}
        style={{ borderColor: `color-mix(in srgb, var(--vibe-accent) 12%, rgba(255,255,255,0.065))` }}
      >
        <ProgressBar value={progress} height={cfg.progressHeight} />

        <div className={cn(
          'flex items-center',
          isCompact ? 'mt-2.5 gap-2' : 'mt-3 gap-3',
          isComfortable && 'mt-4 gap-4'
        )}>
          <IconButton
            onClick={onToggle}
            size={iconSize}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            glow={isPlaying}
          >
            {isPlaying
              ? <Pause className={iconSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />
              : <Play  className={iconSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />
            }
          </IconButton>

          <div className="flex-1 min-w-0">
            <SpeedSlider value={speed} onChange={onSpeedChange} compact={isCompact} />
          </div>

          <div className="hidden sm:block">
            <PageJump page={page} totalPages={totalPages} onJump={onPageJump} />
          </div>

          <IconButton onClick={onFullscreenToggle} size={iconSize} aria-label="Toggle fullscreen">
            {isFullscreen
              ? <Minimize className={iconSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />
              : <Maximize className={iconSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />
            }
          </IconButton>

          <IconButton onClick={onExit} size={iconSize} aria-label="Exit reader">
            <X className={iconSize === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />
          </IconButton>
        </div>

        <div className="sm:hidden mt-2 flex items-center justify-center">
          <PageJump
            page={page}
            totalPages={totalPages}
            onJump={onPageJump}
            className="text-[11px]"
          />
        </div>
      </div>
    </div>
  );
};