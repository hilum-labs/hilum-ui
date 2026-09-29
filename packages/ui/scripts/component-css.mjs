// component-css.mjs — static component CSS shipped in dist/tokens.css.
//
// These rules used to be injected at runtime with <style> elements, which a
// strict Content-Security-Policy (`style-src 'self'`) blocks. They are plain,
// unlayered CSS (as the injected tags were) so their precedence is unchanged.
// Keep selectors keyed on data attributes / fixed class names so they work in
// any app that imports tokens.css.

/**
 * `color-scheme` follows the Hilum theme, so native UI (scrollbars, date
 * inputs) and `light-dark()` (per-series chart colours) match light / dark.
 */
export const colorSchemeCss = `:root { color-scheme: light; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { color-scheme: dark; }
}
[data-theme="dark"], .dark { color-scheme: dark; }
[data-theme="light"] { color-scheme: light; }`;

/** Menus, selects and popovers become bottom sheets under 768px. */
export const mobilePopperSheetCss = `@media (max-width: 767px) {
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
    background: color-mix(in srgb, var(--muted-foreground) 35%, transparent);
    transform: translateX(-50%);
  }
}`;

/** Dialogs and alert dialogs become bottom sheets under 1024px. */
export const mobileDialogSheetCss = `@media (max-width: 1023px) {
  [data-hilum-dialog-sheet="true"] {
    position: fixed !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    top: auto !important;
    width: 100% !important;
    max-width: none !important;
    max-height: calc(100dvh - 1rem) !important;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    transform-origin: bottom center !important;
  }
}`;

/** Content typography inside RichTextEditor. */
export const richTextCss = `.rich-text-editor-content h1 { font-size: 1.5rem; font-weight: 700; line-height: 1.2; margin: 0.75rem 0 0.5rem; text-wrap: balance; }
.rich-text-editor-content h2 { font-size: 1.25rem; font-weight: 650; line-height: 1.25; margin: 0.75rem 0 0.5rem; text-wrap: balance; }
.rich-text-editor-content h3 { font-size: 1.1rem; font-weight: 650; line-height: 1.3; margin: 0.5rem 0 0.25rem; text-wrap: balance; }
.rich-text-editor-content blockquote { border-inline-start: 3px solid var(--border); color: var(--muted-foreground); margin: 0.75rem 0; padding-inline-start: 1rem; text-wrap: pretty; }
.rich-text-editor-content pre { background: var(--muted); border-radius: 0.5rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.85rem; margin: 0.75rem 0; overflow-x: auto; padding: 0.75rem; }
.rich-text-editor-content a { color: var(--brand-primary); text-decoration: underline; text-underline-offset: 3px; }
.rich-text-editor-content img { border-radius: 0.5rem; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--foreground) 10%, transparent); height: auto; margin: 0.5rem 0; max-width: 100%; }
.rich-text-editor-content hr { border: none; border-top: 1px solid var(--border); margin: 1rem 0; }
.rich-text-editor-content ul, .rich-text-editor-content ol { margin: 0.5rem 0; padding-inline-start: 1.5rem; }
.rich-text-editor-content li { margin: 0.25rem 0; }`;

/** @hilum/app-shell AppLoadingBar sweep (reduced motion: a static bar). */
export const appLoadingBarCss = `@keyframes hilum-app-loading-bar {
  0% { transform: translateX(-100%) scaleX(0.3); }
  50% { transform: translateX(30%) scaleX(0.6); }
  100% { transform: translateX(100%) scaleX(0.3); }
}
[data-slot="app-loading-bar-indicator"] {
  animation: hilum-app-loading-bar 1.2s ease-in-out infinite;
  transform-origin: 0 50%;
}
[dir="rtl"] [data-slot="app-loading-bar-indicator"] { animation-direction: reverse; }
@media (prefers-reduced-motion: reduce) {
  [data-slot="app-loading-bar-indicator"] { animation: none; transform: none; opacity: 0.6; }
}`;

/**
 * Scroll lock while a modal layer is open. Radix (via react-remove-scroll-bar)
 * injects the same rules plus a measured scrollbar gap at runtime; under a
 * strict CSP that tag is blocked, and this static copy keeps the page from
 * scrolling behind dialogs, sheets and menus (without the gap compensation).
 */
export const scrollLockCss = `body[data-scroll-locked] {
  overflow: hidden !important;
  overscroll-behavior: contain;
  position: relative !important;
}`;

/**
 * Radix Select and ScrollArea viewports render an inline <style> hiding the
 * native scrollbar (blocked under a strict CSP); same rules, statically.
 */
export const radixViewportCss = `[data-radix-select-viewport], [data-radix-scroll-area-viewport] {
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}
[data-radix-select-viewport]::-webkit-scrollbar,
[data-radix-scroll-area-viewport]::-webkit-scrollbar { display: none; }`;

/**
 * input-otp (InputOTP) appends a <style id="input-otp-style"> on first mount
 * and fills it with insertRule; under a strict CSP the tag is blocked (and
 * logged), so no rule lands. Hilum's InputOTP marks that id as taken (see
 * input-otp.tsx) and these are the same rules, statically: hide the real
 * input's selection and autofill paint, iOS spacing, and pointer events for
 * the slots rendered after the input.
 */
const otpHidden =
  "background: transparent !important; color: transparent !important; border-color: transparent !important; opacity: 0 !important; box-shadow: none !important; -webkit-box-shadow: none !important; -webkit-text-fill-color: transparent !important;";
export const inputOtpCss = `[data-input-otp]::selection { background: transparent !important; color: transparent !important; }
[data-input-otp]:autofill { ${otpHidden} }
[data-input-otp]:-webkit-autofill { ${otpHidden} }
@supports (-webkit-touch-callout: none) {
  [data-input-otp] { letter-spacing: -.6em !important; font-weight: 100 !important; font-stretch: ultra-condensed; font-optical-sizing: none !important; left: -1px !important; right: 1px !important; }
}
[data-input-otp] + * { pointer-events: all !important; }`;

export const componentCss = [
  "/* ---- Component CSS (static; was injected at runtime before 4.2) ---- */",
  colorSchemeCss,
  mobilePopperSheetCss,
  mobileDialogSheetCss,
  richTextCss,
  appLoadingBarCss,
  scrollLockCss,
  radixViewportCss,
  inputOtpCss,
].join("\n\n");
