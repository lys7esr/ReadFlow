import { BookOpen, Coffee, Sparkles, Eye } from 'lucide-react';

export const VIBES = {
  study: {
    id: 'study',
    label: 'Study Mode',
    description: 'Slower pace for note-taking',
    icon: BookOpen,
    config: {
      defaultSpeed: 25,
      pageMargin: 20,
      controlSize: 'md',
      densityClass: 'tracking-normal',
    },
  },
  casual: {
    id: 'casual',
    label: 'Casual Reading',
    description: 'A relaxed cinematic flow',
    icon: Coffee,
    config: {
      defaultSpeed: 45,
      pageMargin: 16,
      controlSize: 'md',
      densityClass: 'tracking-normal',
    },
  },
  manga: {
    id: 'manga',
    label: 'Manga / Comic',
    description: 'Optimized for visual pages',
    icon: Sparkles,
    config: {
      defaultSpeed: 60,
      pageMargin: 8,
      controlSize: 'sm',
      densityClass: 'tracking-tight',
    },
  },
  accessibility: {
    id: 'accessibility',
    label: 'Accessibility',
    description: 'Bigger controls, gentler pace',
    icon: Eye,
    config: {
      defaultSpeed: 18,
      pageMargin: 24,
      controlSize: 'lg',
      densityClass: 'tracking-wide',
    },
  },
};

export const DEFAULT_VIBE = 'casual';