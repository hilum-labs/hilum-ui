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
