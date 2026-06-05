# @hilum/ui

## 2.0.1

### Patch Changes

- 8a8961c: Migrate component styling to semantic token utilities and refresh catalog coverage for foundations and designer exports.

## 2.0.0

### Minor Changes

- eb7a2bb: Add a `mid` semantic theme (medium-gray surfaces) and retune `dark` to better match the Pappery designer palette.
  - `semantic.mid` is a new theme variant sitting between `light` and `dark`. Opt in by setting `data-theme="mid"` on `<html>` (or any ancestor). Background uses `ground-500` with `ground-600` for cards and `ground-700` for hover/accent surfaces.
  - `semantic.dark` now uses `ground-900` for background, `ground-800` for card, and `ground-700` for accent/border so panels read as elevated over the canvas (was previously `#0a0a0a` background with `#171717` cards).
  - `[data-theme="mid"]` block is emitted from `build-tokens.mjs` as an explicit opt-in (no `prefers-color-scheme` auto-switch — light/dark only).

## 1.0.1

### Patch Changes

- 842ee65: Add `body-sm` type token (12px / weight 500) and make it the `SidebarMenuButton` default, so all sidebars render nav items at the smaller, slightly heavier scale.

## 1.0.0

### Minor Changes

- a35d39b: Add the **eyebrow / overline / kicker** typescale family.

  The existing `label` utility (12px uppercase tracked) was unnamed for the common "small uppercase label above a headline" pattern, so consumers were re-inventing it with `caption font-semibold uppercase tracking-wider` compositions.

  New utilities — all share the same CSS (12px Inter 600, uppercase, 0.1em tracking) so consumers can pick the vocabulary that reads best in their context. `eyebrow` is canonical.
  - `eyebrow` — canonical name. Use above a heading, on section markers, in cards.
  - `eyebrow-sm` — compact 0.625rem variant for badge-sized chips and tiny status pills.
  - `overline` — Material parlance alias of `eyebrow`.
  - `kicker` — editorial parlance alias of `eyebrow`.
  - `label` — kept as alias of `eyebrow` for backwards compatibility.

  Catalog (`/foundations`) gains a dedicated "Eyebrow / overline / kicker" section. `llms.txt` updated.

## 0.1.5

### Patch Changes

- 29977b5: Fix Sidebar width — use correct Tailwind v4 CSS variable syntax.

  The `Sidebar` component used `w-[--sidebar-width]` (a Tailwind **v3** arbitrary-value syntax). In Tailwind **v4** the same bracket form is treated as a literal value and emits invalid CSS — `width: --sidebar-width;` instead of `width: var(--sidebar-width);` — so the sidebar fell back to content-based width, ignoring both the default (`16rem`) and any consumer override on `SidebarProvider`'s `--sidebar-width`.

  Migrated all four affected utilities to v4's CSS-variable shorthand `(--var)`:
  - `w-[--sidebar-width]` → `w-(--sidebar-width)`
  - `w-[--sidebar-width-icon]` → `w-(--sidebar-width-icon)`
  - `max-w-[--skeleton-width]` → `max-w-(--skeleton-width)` (in `SidebarMenuSkeleton`)

  After this fix, consumers can set sidebar width via `<SidebarProvider style={{ '--sidebar-width': '13rem' }}>` and it'll take effect without needing a width override on `<Sidebar>` itself.

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
