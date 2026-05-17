export const READER_CONFIG = {
  speed: { min: 5, max: 150, step: 1 },
  scroll: { frameRate: 60, smoothing: 0.92 },
  countdownSeconds: 3,
  idleHideMs: 2200,
  pdfScaleMobile: 1.0,
  pdfScaleDesktop: 1.4,
};

export const STORAGE_KEYS = {
  vibe: 'readflow:vibe',
  sessions: 'readflow:sessions',
  lastSession: 'readflow:last-session',
};