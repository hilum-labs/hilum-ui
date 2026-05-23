---
'@hilum/ui': patch
---

Ship Inter (variable) + Instrument Serif (400 + italic) as self-hosted `.woff2` files inside `@hilum/ui`.

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
