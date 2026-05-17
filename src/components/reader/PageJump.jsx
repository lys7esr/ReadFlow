import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/classNames';

export const PageJump = ({ page, totalPages, onJump, className }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);

  const open = () => {
    setDraft(String(page));
    setEditing(true);
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n >= 1 && n <= (totalPages || 1)) {
      onJump?.(n);
    }
    setEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') commit();
    if (e.key === 'Escape') setEditing(false);
    e.stopPropagation();
  };

  if (!editing) {
    return (
      <button
        onClick={open}
        title="Jump to page"
        className={cn(
          'tabular-nums text-xs text-text-secondary whitespace-nowrap',
          'hover:text-text-primary transition-colors duration-150',
          'px-2 py-1 rounded-lg hover:bg-white/5 active:scale-95 focus-ring',
          className
        )}
      >
        {page} <span className="text-text-muted">/</span> {totalPages || '–'}
      </button>
    );
  }

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <input
        ref={inputRef}
        type="number"
        min={1}
        max={totalPages}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        className={cn(
          'w-16 text-center text-xs tabular-nums',
          'bg-bg-surface border border-[var(--vibe-accent)]/40 rounded-lg',
          'px-2 py-1 text-text-primary outline-none',
          'focus:border-[var(--vibe-accent)]/70',
          '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none'
        )}
        aria-label="Jump to page"
      />
      <span className="text-text-muted text-xs">/ {totalPages || '–'}</span>
    </div>
  );
};