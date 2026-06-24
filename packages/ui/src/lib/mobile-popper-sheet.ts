export const mobileDialogSheetContentClassName = [
  "fixed inset-x-0 bottom-0 z-50 max-h-[calc(100dvh-1rem)] w-full overflow-y-auto",
  "rounded-t-2xl border border-border bg-card p-6 shadow-elevated",
  "max-sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-sm:pt-8",
  "max-sm:before:absolute max-sm:before:left-1/2 max-sm:before:top-3 max-sm:before:h-1 max-sm:before:w-9",
  "max-sm:before:-translate-x-1/2 max-sm:before:rounded-full max-sm:before:bg-muted-foreground/35",
].join(" ");

export const desktopDialogContentClassName =
  "sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:max-h-[calc(100dvh-2rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl";

export const dialogSheetMotionClassName = [
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
  "sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95",
].join(" ");

export const mobilePopperSheetPositionClassName = [
  "max-sm:!fixed max-sm:!inset-x-3 max-sm:!bottom-3 max-sm:!top-auto max-sm:!left-3 max-sm:!right-3",
  "max-sm:!w-auto max-sm:!min-w-0 max-sm:!max-w-none max-sm:!transform-none",
].join(" ");

export const mobilePopperSheetSurfaceClassName =
  "max-sm:max-h-[min(70dvh,28rem)] max-sm:rounded-2xl max-sm:border max-sm:border-border max-sm:shadow-elevated";

export const mobilePopperSheetMotionClassName = [
  "max-sm:data-[state=closed]:slide-out-to-bottom max-sm:data-[state=open]:slide-in-from-bottom",
].join(" ");

export const mobilePopperSheetStyle = `
@media (max-width: 639px) {
  [data-radix-popper-content-wrapper]:has([data-hilum-mobile-sheet="true"]) {
    position: fixed !important;
    inset: 0 !important;
    min-width: 0 !important;
    transform: none !important;
    pointer-events: none;
    z-index: 50 !important;
  }

  [data-radix-popper-content-wrapper]:has([data-hilum-mobile-sheet="true"][data-state="open"])::before {
    content: "";
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 0.3);
    backdrop-filter: blur(4px);
    pointer-events: auto;
  }

  [data-hilum-mobile-sheet="true"] {
    position: fixed !important;
    left: 0.75rem !important;
    right: 0.75rem !important;
    bottom: max(0.75rem, env(safe-area-inset-bottom)) !important;
    top: auto !important;
    width: calc(100dvw - 1.5rem) !important;
    min-width: 0 !important;
    max-width: none !important;
    transform: none !important;
    pointer-events: auto;
    transform-origin: bottom center !important;
    overscroll-behavior: contain;
  }

  [data-hilum-mobile-sheet="true"]::before {
    content: "";
    position: absolute;
    top: 0.5rem;
    left: 50%;
    width: 2.25rem;
    height: 0.25rem;
    border-radius: 999px;
    background: hsl(var(--muted-foreground) / 0.35);
    transform: translateX(-50%);
  }
}
`;
