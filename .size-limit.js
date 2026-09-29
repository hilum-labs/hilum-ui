// Bundle-size budgets for the published dist entries (`pnpm size`, part of
// `pnpm verify`). Run after `pnpm build:packages`.
//
// Uses @size-limit/file: each check measures the brotli-compressed size of the
// listed built files as shipped (no re-bundling, peers not included). Budgets
// are the measured size + ~10% headroom (measured 2026-09-28, target ES2022).
// When a budget is exceeded on purpose, re-measure with `pnpm size --json` and
// raise the limit in the same PR so the growth is reviewed.
import { existsSync } from "node:fs";

/** @type {import('size-limit').SizeLimitConfig} */
const checks = [
  // @hilum/ui — "." (component entry; imports shared chunks below)
  // 4.0 moved the AI components to `@hilum/ui/ai`, so the primitives both
  // entries use (Button, Tooltip, Accordion, Callout, motion, …) now live in
  // the shared chunks: index alone dropped ~116 → ~93 kB, chunks grew.
  { name: "@hilum/ui", path: "packages/ui/dist/index.js", limit: "102 kB" },
  // Shared code-split chunks imported by several @hilum/ui entries.
  { name: "@hilum/ui (shared chunks)", path: "packages/ui/dist/chunk-*.js", limit: "22 kB" },
  // @hilum/ui/ai — AI/chat components (imports shared chunks above).
  { name: "@hilum/ui/ai", path: "packages/ui/dist/ai.js", limit: "16.7 kB" },
  { name: "@hilum/ui/icons", path: "packages/ui/dist/icons.js", limit: "700 B" },
  { name: "@hilum/ui/tokens", path: "packages/ui/dist/tokens.js", limit: "100 B" },
  { name: "@hilum/ui/create-theme", path: "packages/ui/dist/create-theme.js", limit: "2.2 kB" },
  // 4.1 added the compact editor-chrome vars and base rules: 2.74 → 2.88 kB.
  { name: "@hilum/ui/tokens.css", path: "packages/ui/dist/tokens.css", limit: "3.2 kB" },
  { name: "@hilum/app-shell", path: "packages/app-shell/dist/index.js", limit: "13.2 kB" },
  { name: "@hilum/designer", path: "packages/designer/dist/index.js", limit: "8.1 kB" },
  {
    name: "@hilum/designer-canvas",
    path: "packages/designer-canvas/dist/index.js",
    limit: "10.5 kB",
  },
];

// Upcoming @hilum/ui entries. They are measured (reported, no budget) as soon
// as the build emits them; once an entry ships, measure it, add a `limit`
// (+~10%), and move it into `checks` above so a missing file fails loudly.
const upcoming = [
  { name: "@hilum/ui/form", path: "packages/ui/dist/form.js" },
  { name: "@hilum/ui/icon-libraries", path: "packages/ui/dist/icon-libraries.js" },
];

const root = new URL(".", import.meta.url);
for (const entry of upcoming) {
  if (existsSync(new URL(entry.path, root))) checks.push(entry);
}

export default checks;
