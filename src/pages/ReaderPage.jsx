import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PdfRenderer } from '../components/reader/PdfRenderer';
import { ReaderControls } from '../components/reader/ReaderControls';
import { Countdown } from '../components/reader/Countdown';
import { EndOfDocumentModal } from '../components/reader/EndOfDocumentModal';
import { AmbientPanel } from '../components/ambient/AmbientPanel';
import { useReader } from '../context/ReaderContext';
import { useVibe } from '../context/VibeContext';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { useFullscreen } from '../hooks/useFullScreen';
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

  const idleEnabled = isMobile() && isPlaying;
  const [controlsVisible] = useIdleVisibility(idleEnabled, vibe.config.autoHideDelay);

  // Study and Accessibility always show controls
  const showControls = vibe.config.controlsAlwaysVisible
    ? true
    : (controlsVisible || !isPlaying);

  useEffect(() => {
    if (!activePdf) navigate('/', { replace: true });
  }, [activePdf, navigate]);

  useEffect(() => {
    if (!isPlaying) setSpeed(vibe.config.defaultSpeed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vibe.id]);

  useEffect(() => {
    if (!activePdf) return;
    const prev = sessionStore.get(activePdf.id);
    if (!prev) return;
    if (prev.speed) setSpeed(prev.speed);
    requestAnimationFrame(() => {
      if (scrollRef.current && prev.scrollTop) scrollRef.current.scrollTop = prev.scrollTop;
    });
  }, [activePdf, setSpeed]);

  useEffect(() => {
    if (!activePdf) return;
    const el = scrollRef.current;
    if (!el) return;
    const save = () => {
      sessionStore.save(activePdf.id, {
        name: activePdf.name,
        page, totalPages, speed,
        scrollTop: el.scrollTop,
      });
    };
    const onScroll = () => {
      const ratio = el.scrollHeight > 0
        ? el.scrollTop / Math.max(el.scrollHeight - el.clientHeight, 1)
        : 0;
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

  useEffect(() => {
    onEnd(() => setShowEndModal(true));
  }, [onEnd]);

  const startWithCountdown = useCallback(() => setShowCountdown(true), []);

  const handleToggle = useCallback(() => {
    if (isPlaying) toggle();
    else if (!showCountdown) startWithCountdown();
  }, [isPlaying, toggle, startWithCountdown, showCountdown]);

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    play();
  }, [play]);

  const handleSpeedChange = useCallback((v) => {
    setSpeed(clamp(v, READER_CONFIG.speed.min, READER_CONFIG.speed.max));
  }, [setSpeed]);

  // Smooth-scroll to any page number
  const handlePageJump = useCallback((targetPage) => {
    const el = scrollRef.current;
    if (!el) return;
    const pageEl = el.querySelector(`[data-page="${targetPage}"]`);
    if (!pageEl) return;
    el.scrollTo({ top: pageEl.offsetTop - 24, behavior: 'smooth' });
  }, []);

  const handleSurfaceClick = (e) => {
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

  const readerMaxWidth =
    vibe.config.uiDensity === 'comfortable' ? 'max-w-3xl' :
    vibe.config.uiDensity === 'compact'     ? 'max-w-2xl' :
    vibe.config.uiDensity === 'sparse'      ? 'max-w-2xl' :
    'max-w-3xl';

  const bgOverlay = vibe.config.bgOverlay;

  return (
    <div className="fixed inset-0 bg-bg-base">
      {/* Manga vibe dark overlay */}
      {bgOverlay !== 'rgba(11, 12, 15, 0.0)' && (
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-700"
          style={{ background: bgOverlay }}
        />
      )}

      <div
        ref={scrollRef}
        onClick={handleSurfaceClick}
        className="relative z-10 h-full w-full overflow-y-auto overflow-x-hidden"
        style={{
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
          paddingBottom: '180px',
          scrollBehavior: 'auto',
        }}
      >
        <div className={`mx-auto ${readerMaxWidth} px-3`}>
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
          visible={showControls}
          onPageJump={handlePageJump}
        />
        {!isFullscreen && <AmbientPanel />}
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