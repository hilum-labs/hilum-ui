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
    bottom: 0.75rem !important;
    top: auto !important;
    width: calc(100dvw - 1.5rem) !important;
    min-width: 0 !important;
    max-width: none !important;
    transform: none !important;
    pointer-events: auto;
  }
}
`;
