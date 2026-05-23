---
'@hilum/ui': patch
---

Re-ship `src/` so consumers don't have to add their own `@source` directive.

The library's `dist/tokens.css` includes `@source "../src"` — a Tailwind v4 directive that tells the consumer's Tailwind build to scan the library's own components for utility class names. For this to resolve, `src/` must be present in `node_modules/@hilum/ui/`. Commit `040065c` accidentally narrowed `files` to `dist` only, so consumers got an unstyled build because Tailwind couldn't see any class names to compile.

After this fix, the documented setup works as-is:

```css
@import "tailwindcss";
@import "@hilum/ui/tokens.css";
```

No `@source` needed in the consumer.
