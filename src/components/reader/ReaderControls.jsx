import { Play, Pause, Maximize, Minimize, X } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { SpeedSlider } from './SpeedSlider';
import { ProgressBar } from './ProgressBar';
import { cn } from '../../utils/classNames';

export const ReaderControls = ({
  isPlaying, onToggle, speed, onSpeedChange,
  page, totalPages, progress,
  isFullscreen, onFullscreenToggle, onExit,
  visible,
}) => (
  <div
    className={cn(
      'fixed left-0 right-0 bottom-0 z-30 px-3 pb-[max(env(safe-area-inset-bottom),12px)] pt-3',
      'transition-all duration-300',
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
    )}
  >
    <div className="glass mx-auto max-w-2xl rounded-2xl shadow-float px-4 py-3">
      <ProgressBar value={progress} />
      <div className="mt-3 flex items-center gap-3">
        <IconButton onClick={onToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </IconButton>

        <div className="flex-1 min-w-0">
          <SpeedSlider value={speed} onChange={onSpeedChange} />
        </div>

        <div className="hidden sm:block text-xs text-text-muted tabular-nums whitespace-nowrap">
          {page} / {totalPages || '–'}
        </div>

        <IconButton onClick={onFullscreenToggle} aria-label="Toggle fullscreen">
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </IconButton>
        <IconButton onClick={onExit} aria-label="Exit reader">
          <X className="h-5 w-5" />
        </IconButton>
      </div>
      <div className="sm:hidden mt-2 text-center text-[11px] text-text-muted tabular-nums">
        {page} / {totalPages || '–'}
      </div>
    </div>
  </div>
);