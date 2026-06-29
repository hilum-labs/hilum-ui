# @hilum/ui

## 3.5.3

### Patch Changes

- Add a responsive `Card` variant for mobile-flattened dashboard and admin panels.

## 3.5.2

### Patch Changes

- Add a shared `UsageBar` component for compact quota, readiness, and capacity meters across admin and dashboard surfaces.

## 3.5.1

## 3.5.0

### Minor Changes

- 9a25e44: Add Fluid Functionalism parity across Hilum UI primitives, interaction foundations, and catalog examples.

## 3.4.0

### Minor Changes

- 96bd6ec: Add compact two-value and four-value designer controls for dense inspector panels.

  `@hilum/ui` InputNumber now supports mixed values and live commit-on-change behavior for editor controls.

## 3.3.4

## 3.3.3

## 3.3.2

## 3.3.1

### Patch Changes

- Tighten `SidebarMenuButton` default vertical spacing for denser sidebar navigation.

  Move mobile sidebar close-on-navigation behavior into `AppSidebar` when it is rendered inside a shared `SidebarProvider`.

## 3.3.0

### Minor Changes

- Add complete catalog coverage for Hilum UI atom and molecule exports, generate package-level `llms.txt` from the canonical component registry, improve catalog mobile navigation, and quiet Recharts prerender output for chart docs.

## 3.2.14

### Patch Changes

- Improve AppStatusBanner mobile layout so actions stack below the message instead of squeezing banner copy.

## 3.2.13

## 3.2.12

## 3.2.11

### Patch Changes

- aa3c2db: Reduce empty-state icon containers from 48px to 36px for tighter dashboard and admin layouts.
  Reduce mobile app navigation items from 40px to 36px to keep compact operator headers.

## 3.2.10

### Patch Changes

- 0dd03fd: Reduce compact calendar, carousel, and step controls from 40px to 36px.

## 3.2.9

### Patch Changes

- ba1614b: Reduce ColorPicker compact controls from 40px to 36px for tighter editor layouts.

## 3.2.8

## 3.2.7

### Patch Changes

- Reduce compact icon controls from 40px to h-9 w-9 across Button, Toggle, pagination, rich text editor toolbar, dialog close, sheet close, notifications, and collapsed sidebar items.

## 3.2.6

### Patch Changes

- Add icon support to StatusBadge for shared status and risk labels.

## 3.2.5

### Patch Changes

- Reduce compact icon trigger defaults from 40px to h-9 w-9 for tighter dashboard controls.

## 3.2.4

### Patch Changes

- Use mobile bottom-sheet presentation for dialogs, alert dialogs, dropdown menus, and select menus.
- Extend mobile bottom-sheet presentation to popovers and add safe-area grabbers to mobile menu/select sheets.
- Extend mobile bottom-sheet presentation to context menus, menubars, color pickers, and combobox option lists.
- Stack dialog and alert dialog footer actions full-width on mobile while preserving desktop modal footers.
- Add a reusable `CommandDialog` composition for modal command palettes.
- Add mobile sheet state and `SidebarInput` to the reusable sidebar primitive.
- Add `SearchableTable` for controlled search, filters, sorting, pagination, and mobile list views.
- Add `RichTextEditor` for product, content, theme, and admin HTML editing surfaces.
- Add `FileDropzone` for reusable drag-and-click upload surfaces.
- Add `MediaAssetCard` for reusable media library and product media cards.
- Add `StatusBadge` for consistent status labels, tones, and compact dots.
- Add `HelpTooltip` package coverage for touch-friendly contextual field help.
- Add `TitledCard` and `StatCardGrid` package coverage for dashboard card migration.
- Add `DataTransferControls` for reusable scoped import/export toolbars with mobile sheet menus.
- Add `Callout` for reusable inline notices, warnings, validation states, and action prompts.
- Consolidate the mobile bottom-sheet contract for dialogs, alert dialogs, selects, dropdowns, popovers, context menus, and menubars with safe-area spacing.

## 3.2.3

## 3.2.2

### Patch Changes

- 6610a27: Tighten ButtonGroup sizing so the iOS-style segmented control renders smaller and less chunky by default.

## 3.2.1

### Patch Changes

- 48ddf55: Restyle ButtonGroup as an iOS-style segmented control with a muted rounded track and selected card pill.

## 3.2.0

### Minor Changes

- 147ef45: Apply interface polish across component primitives: explicit transitions, tactile press states, balanced text wrapping, tabular metrics, and image outlines.

### Patch Changes

- b020e15: Add shared icon facade exports used by Hilum dashboard surfaces.

## 3.1.2

### Patch Changes

- 421a631: Improve InputGroup inset action alignment and spacing for icon buttons.

## 3.1.1

### Patch Changes

- f04ade5: Widen lucide-react peer compatibility to support dashboard apps using newer 0.x releases such as 0.542.x.

## 3.1.0

### Minor Changes

- 784078f: Add `trailingAction` support to `InputGroup` for inset buttons and controls inside the input boundary.

## 3.0.0

### Minor Changes

- e1b6340: Replace the display font from Instrument Serif to Gabarito for a friendlier, rounder product voice.

## 2.1.2

### Patch Changes

- Reduce AccountMenu sizing so it reads as a dropdown instead of a large account panel.

## 2.1.1

### Patch Changes

- Restyle AccountMenu to use the standard light dropdown/card surface and foreground tokens.

## 2.1.0

### Minor Changes

- Add reusable account menu primitives for profile dropdowns.

## 2.0.4

### Patch Changes

- Add an opaque bordered elevated surface to context menu content so menus remain readable above dense editor canvases.

## 2.0.3

## 2.0.2

### Patch Changes

- 51cd5e0: Fix designer panel horizontal overflow and make property row labels stack above controls by default.

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
