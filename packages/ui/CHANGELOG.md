# @hilum/ui

## 0.1.4

### Patch Changes

- 5166c27: Ship Inter (variable) + Instrument Serif (400 + italic) as self-hosted `.woff2` files inside `@hilum/ui`.

  The library now provides `@hilum/ui/fonts.css` with `@font-face` declarations pointing at bundled font files in `dist/fonts/`. Consumers no longer need to wire up Google Fonts `<link>` tags or add `@fontsource` dependencies — the font setup is now part of the design system itself.

  **Consumer setup:**

  ```ts
  // In your entry file (main.tsx, index.tsx, etc.):
  import "@hilum/ui/fonts.css";
  ```

  This is the same pattern used by `@fontsource/*` packages: JS-side import so the bundler resolves the `url()` references in `@font-face` and emits the `.woff2` assets next to your output CSS. (CSS-side `@import` does inline the @font-face block but most bundlers don't rebase relative URLs from `node_modules` — use the JS import.)

  **What ships:**
  - Inter variable (latin + latin-ext, normal + italic — covers weights 100–900)
  - Instrument Serif (latin + latin-ext, 400 + italic)
  - ~340 KB total, opt-in (only loaded if you import `@hilum/ui/fonts.css`)

  **Why self-host:**
  - No Google Fonts runtime dependency (offline-safe, no privacy/compliance concerns)
  - No DNS lookup at runtime
  - Bundler fingerprints + caches the assets

## 0.1.3

### Patch Changes

- 7b82093: Re-ship `src/` so consumers don't have to add their own `@source` directive.

  The library's `dist/tokens.css` includes `@source "../src"` — a Tailwind v4 directive that tells the consumer's Tailwind build to scan the library's own components for utility class names. For this to resolve, `src/` must be present in `node_modules/@hilum/ui/`. Commit `040065c` accidentally narrowed `files` to `dist` only, so consumers got an unstyled build because Tailwind couldn't see any class names to compile.

  After this fix, the documented setup works as-is:

  ```css
  @import "tailwindcss";
  @import "@hilum/ui/tokens.css";
  ```

  No `@source` needed in the consumer.

## 0.1.2

### Patch Changes

- cfe6bec: Exclude internal test files from the published package tarball.

## 0.1.1

### Patch Changes

- 9b21b57: Fix npm packaging and release metadata, add MIT licensing, tighten published files, and document the blocks CLI.
