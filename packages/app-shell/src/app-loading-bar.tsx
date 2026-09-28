import { cn } from "@hilum/ui";

interface AppLoadingBarProps {
  /** Show the bar. Renders nothing when false. */
  active?: boolean;
  /** Accessible name for the progress indicator. Default: "Loading". */
  label?: string;
  className?: string;
}

// Keyframes ship with the component (React 19 hoists and de-dupes `<style href>`),
// so consumers don't need extra CSS. Reduced motion swaps the sweep for a static bar.
const LOADING_BAR_CSS = `
@keyframes hilum-app-loading-bar {
  0% { transform: translateX(-100%) scaleX(0.3); }
  50% { transform: translateX(30%) scaleX(0.6); }
  100% { transform: translateX(100%) scaleX(0.3); }
}
[data-slot="app-loading-bar-indicator"] {
  animation: hilum-app-loading-bar 1.2s ease-in-out infinite;
  transform-origin: 0 50%;
}
[dir="rtl"] [data-slot="app-loading-bar-indicator"] {
  animation-direction: reverse;
}
@media (prefers-reduced-motion: reduce) {
  [data-slot="app-loading-bar-indicator"] {
    animation: none;
    transform: none;
    opacity: 0.6;
  }
}
`;

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
      <style href="hilum-app-loading-bar" precedence="default">
        {LOADING_BAR_CSS}
      </style>
      <div data-slot="app-loading-bar-indicator" className="h-full w-full bg-brand-primary" />
    </div>
  );
}

export { AppLoadingBar };
export type { AppLoadingBarProps };
