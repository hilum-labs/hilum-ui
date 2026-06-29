export const mobileDialogSheetContentClassName = [
  "fixed inset-x-0 bottom-0 z-50 max-h-[calc(100dvh-1rem)] w-full overflow-y-auto",
  "max-lg:!w-full max-lg:!max-w-none max-lg:!rounded-b-none",
  "rounded-t-2xl border border-border bg-card p-6 shadow-elevated",
  "max-lg:pb-[calc(1.5rem+env(safe-area-inset-bottom))] max-lg:pt-8",
  "max-lg:before:absolute max-lg:before:left-1/2 max-lg:before:top-3 max-lg:before:h-1 max-lg:before:w-9",
  "max-lg:before:-translate-x-1/2 max-lg:before:rounded-full max-lg:before:bg-muted-foreground/35",
].join(" ");

export const desktopDialogContentClassName =
  "lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:max-h-[calc(100dvh-2rem)] lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-2xl";

export const dialogSheetMotionClassName = [
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
  "lg:data-[state=closed]:zoom-out-95 lg:data-[state=open]:zoom-in-95",
].join(" ");

export const mobilePopperSheetPositionClassName = [
  "max-md:!fixed max-md:!inset-x-3 max-md:!bottom-3 max-md:!top-auto max-md:!left-3 max-md:!right-3",
  "max-md:!w-auto max-md:!min-w-0 max-md:!max-w-none max-md:!transform-none",
].join(" ");

export const mobilePopperSheetSurfaceClassName =
  "max-md:max-h-[min(70dvh,28rem)] max-md:rounded-2xl max-md:border max-md:border-border max-md:shadow-elevated";

export const mobilePopperSheetMotionClassName = [
  "max-md:data-[state=closed]:slide-out-to-bottom max-md:data-[state=open]:slide-in-from-bottom",
].join(" ");

export const mobilePopperSheetStyle = `
@media (max-width: 767px) {
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
