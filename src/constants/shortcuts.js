// Registry pattern → future shortcuts can be appended without changing hook code.
export const SHORTCUTS = [
  { id: 'toggle-play', keys: [' ', 'Space'], action: 'togglePlay', description: 'Play / Pause' },
  { id: 'speed-up', keys: ['ArrowUp'], action: 'speedUp', description: 'Increase scroll speed' },
  { id: 'speed-down', keys: ['ArrowDown'], action: 'speedDown', description: 'Decrease scroll speed' },
  { id: 'fullscreen', keys: ['f', 'F'], action: 'toggleFullscreen', description: 'Toggle fullscreen' },
];