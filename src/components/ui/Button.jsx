import { cn } from '../../utils/classNames';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-hover shadow-glow',
  secondary: 'bg-bg-surface text-text-primary hover:bg-bg-border border border-bg-border',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-bg-surface',
};

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = ({
  variant = 'primary', size = 'md', className, children, ...rest
}) => (
  <button
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-full font-medium',
      'transition-all duration-200 active:scale-[0.98] focus-ring disabled:opacity-50 disabled:pointer-events-none',
      variants[variant], sizes[size], className
    )}
    {...rest}
  >
    {children}
  </button>
);