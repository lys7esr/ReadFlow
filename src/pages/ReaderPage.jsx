import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PdfRenderer } from '../components/reader/PdfRenderer';
import { ReaderControls } from '../components/reader/ReaderControls';
import { Countdown } from '../components/reader/Countdown';
import { EndOfDocumentModal } from '../components/reader/EndOfDocumentModal';
import { useReader } from '../context/ReaderContext';
import { useVibe } from '../context/VibeContext';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useFullscreen } from '../hooks/useFullscreen';
import { useIdleVisibility } from '../hooks/useIdleVisibility';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { sessionStore } from '../services/sessionStore';
import { READER_CONFIG } from '../constants/reader';
import { clamp } from '../utils/clamp';

const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

export const ReaderPage = () => {
  const navigate = useNavigate();
  const { activePdf } = useReader();
  const { vibe } = useVibe();
  const scrollRef = useRef(null);

  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const { isPlaying, speed, setSpeed, play, stop, toggle, onEnd } = useAutoScroll(scrollRef);
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [controlsVisible, setControlsVisible] = useIdleVisibility(isMobile() && isPlaying);

  useEffect(() => {
    if (!activePdf) navigate('/', { replace: true });
  }, [activePdf, navigate]);

  // Initialize speed from vibe on first mount or vibe change while not playing
  useEffect(() => {
    if (!isPlaying) setSpeed(vibe.config.defaultSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vibe.id]);

  // Restore previous session
  useEffect(() => {
    if (!activePdf) return;
    const prev = sessionStore.get(activePdf.id);
    if (!prev) return;
    if (prev.speed) setSpeed(prev.speed);
    requestAnimationFrame(() => {
      if (scrollRef.current && prev.scrollTop) scrollRef.current.scrollTop = prev.scrollTop;
    });
  }, [activePdf, setSpeed]);

  // Persist session continuously
  useEffect(() => {
    if (!activePdf) return;
    const el = scrollRef.current;
    if (!el) return;

    const save = () => {
      const ratio = el.scrollHeight > 0 ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 0;
      setProgress(ratio);
      sessionStore.save(activePdf.id, {
        name: activePdf.name,
        page, totalPages,
        speed,
        scrollTop: el.scrollTop,
      });
    };

    const onScroll = () => {
      const ratio = el.scrollHeight > 0 ? el.scrollTop / (el.scrollHeight - el.clientHeight) : 0;
      setProgress(ratio);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    const interval = setInterval(save, 1500);
    window.addEventListener('beforeunload', save);
    return () => {
      el.removeEventListener('scroll', onScroll);
      clearInterval(interval);
      window.removeEventListener('beforeunload', save);
      save();
    };
  }, [activePdf, page, totalPages, speed]);

  // End-of-doc handling
  useEffect(() => {
    onEnd(() => setShowEndModal(true));
  }, [onEnd]);

  const startWithCountdown = useCallback(() => {
    setShowCountdown(true);
  }, []);

  const handleToggle = useCallback(() => {
    if (isPlaying) {
      toggle();
    } else if (!showCountdown) {
      startWithCountdown();
    }
  }, [isPlaying, toggle, startWithCountdown, showCountdown]);

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    play();
  }, [play]);

  const handleSpeedChange = useCallback((v) => {
    setSpeed(clamp(v, READER_CONFIG.speed.min, READER_CONFIG.speed.max));
  }, [setSpeed]);

  // Mobile: tap container to toggle play/pause
  const handleSurfaceClick = (e) => {
    // Ignore clicks originating from controls
    if (e.target.closest('[data-controls]')) return;
    if (!isMobile()) return;
    if (showCountdown) return;
    handleToggle();
  };

  const handleRestart = () => {
    setShowEndModal(false);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    startWithCountdown();
  };

  const handleNewPdf = () => {
    stop();
    setShowEndModal(false);
    navigate('/');
  };

  useKeyboardShortcuts({
    togglePlay: handleToggle,
    speedUp: () => handleSpeedChange(speed + 5),
    speedDown: () => handleSpeedChange(speed - 5),
    toggleFullscreen,
  });

  if (!activePdf) return null;

  return (
    <div className="fixed inset-0 bg-bg-base">
      <div
        ref={scrollRef}
        onClick={handleSurfaceClick}
        className="h-full w-full overflow-y-auto overflow-x-hidden"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
          paddingBottom: '180px',
          scrollBehavior: 'auto',
        }}
      >
        <div className="mx-auto max-w-3xl px-3">
          <PdfRenderer
            ref={scrollRef}
            fileUrl={activePdf.url}
            onLoaded={({ numPages: n }) => setTotalPages(n)}
            onPageChange={setPage}
          />
        </div>
      </div>

      <div data-controls>
        <ReaderControls
          isPlaying={isPlaying}
          onToggle={handleToggle}
          speed={speed}
          onSpeedChange={handleSpeedChange}
          page={page}
          totalPages={totalPages}
          progress={progress}
          isFullscreen={isFullscreen}
          onFullscreenToggle={toggleFullscreen}
          onExit={() => { stop(); navigate('/'); }}
          visible={controlsVisible || !isPlaying}
        />
      </div>

      {showCountdown && (
        <Countdown
          onComplete={handleCountdownComplete}
          onCancel={() => setShowCountdown(false)}
        />
      )}

      <EndOfDocumentModal
        open={showEndModal}
        onRestart={handleRestart}
        onNew={handleNewPdf}
        onClose={() => setShowEndModal(false)}
      />
    </div>
  );
};