import { cn } from "@hilum/ui";

interface AppLoadingBarProps {
  /** Show the bar. Renders nothing when false. */
  active?: boolean;
  /** Accessible name for the progress indicator. Default: "Loading". */
  label?: string;
  className?: string;
}

// The sweep keyframes and reduced-motion fallback ship statically in
// @hilum/ui's tokens.css (keyed on data-slot="app-loading-bar-indicator"), so
// no runtime <style> is needed under a strict Content-Security-Policy.

/**
 * Thin indeterminate progress bar pinned to the top of its positioned parent.
 * `<AppShell loading>` renders one for route transitions / global saves.
 */
function AppLoadingBar({ active = true, label = "Loading", className }: AppLoadingBarProps) {
  if (!active) return null;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-busy="true"
      data-slot="app-loading-bar"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-[60] h-0.5 overflow-hidden bg-brand-primary/15",
        className,
      )}
    >
      <div data-slot="app-loading-bar-indicator" className="h-full w-full bg-brand-primary" />
    </div>
  );
}

export { AppLoadingBar };
export type { AppLoadingBarProps };
