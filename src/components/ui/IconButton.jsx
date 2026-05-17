import { cn } from '../../utils/classNames';

const sizes = { sm: 'h-8 w-8', md: 'h-11 w-11', lg: 'h-13 w-13' };

export const IconButton = ({ size = 'md', className, children, glow = false, ...rest }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-full flex-shrink-0',
      'text-text-primary transition-all duration-150 focus-ring',
      'hover:bg-white/5 active:scale-90',
      glow && 'text-[var(--vibe-accent)]',
      sizes[size],
      className
    )}
    style={glow ? { filter: 'drop-shadow(0 0 6px color-mix(in srgb, var(--vibe-accent) 60%, transparent))' } : undefined}
    {...rest}
  >
    {children}
  </button>
);