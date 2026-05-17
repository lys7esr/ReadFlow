import { cn } from '../../utils/classNames';

const sizes = { sm: 'h-9 w-9', md: 'h-11 w-11', lg: 'h-14 w-14' };

export const IconButton = ({ size = 'md', className, children, ...rest }) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-full',
      'text-text-primary hover:bg-white/5 active:scale-95 transition-all duration-150 focus-ring',
      sizes[size], className
    )}
    {...rest}
  >
    {children}
  </button>
);