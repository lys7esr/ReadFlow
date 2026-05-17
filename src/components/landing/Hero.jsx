export const Hero = () => (
  <header className="text-center max-w-2xl mx-auto">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full surface text-xs text-text-secondary mb-6 animate-fade-in">
      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
      Hands-free immersive reading
    </div>
    <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
      Read<span className="text-accent">Flow</span>
    </h1>
    <p className="mt-5 text-text-secondary text-base sm:text-lg leading-relaxed">
      Upload a PDF. Pick your vibe. Let it scroll for you —
      <span className="text-text-primary"> calm, smooth, and effortless.</span>
    </p>
  </header>
);