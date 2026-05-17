export const Spinner = ({ label = 'Loading' }) => (
  <div className="flex flex-col items-center gap-3 text-text-secondary">
    <div className="h-8 w-8 rounded-full border-2 border-bg-border border-t-accent animate-spin" />
    <span className="text-sm">{label}</span>
  </div>
);