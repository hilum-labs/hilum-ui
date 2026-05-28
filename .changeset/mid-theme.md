---
"@hilum/ui": minor
---

Add a `mid` semantic theme (medium-gray surfaces) and retune `dark` to better match the Pappery designer palette.

- `semantic.mid` is a new theme variant sitting between `light` and `dark`. Opt in by setting `data-theme="mid"` on `<html>` (or any ancestor). Background uses `ground-500` with `ground-600` for cards and `ground-700` for hover/accent surfaces.
- `semantic.dark` now uses `ground-900` for background, `ground-800` for card, and `ground-700` for accent/border so panels read as elevated over the canvas (was previously `#0a0a0a` background with `#171717` cards).
- `[data-theme="mid"]` block is emitted from `build-tokens.mjs` as an explicit opt-in (no `prefers-color-scheme` auto-switch — light/dark only).
