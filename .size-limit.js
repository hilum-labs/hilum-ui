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
  // 4.3 added MultiCombobox, ResourcePicker, TagInput / Tag and PreviewFrame,
  // DataTable's mobile cards and Field wiring in nine more controls:
  // 98.4 → 106.8 kB.
  { name: "@hilum/ui", path: "packages/ui/dist/index.js", limit: "117 kB" },
  // Shared code-split chunks imported by several @hilum/ui entries.
  // 4.3: the Field control registry (useFieldControl lives in a shared chunk):
  // 21.3 → 22 kB, at the old budget.
  { name: "@hilum/ui (shared chunks)", path: "packages/ui/dist/chunk-*.js", limit: "24 kB" },
  // @hilum/ui/ai — AI/chat components (imports shared chunks above).
  { name: "@hilum/ui/ai", path: "packages/ui/dist/ai.js", limit: "16.7 kB" },
  { name: "@hilum/ui/icons", path: "packages/ui/dist/icons.js", limit: "700 B" },
  { name: "@hilum/ui/tokens", path: "packages/ui/dist/tokens.js", limit: "100 B" },
  { name: "@hilum/ui/create-theme", path: "packages/ui/dist/create-theme.js", limit: "2.2 kB" },
  // 4.1 added the compact editor-chrome vars and base rules: 2.74 → 2.88 kB.
  // 4.2 moved the component CSS that used to be injected with runtime <style>
  // tags (mobile sheets, rich text, loading bar, Radix fallbacks, color-scheme)
  // out of the JS and into tokens.css for strict-CSP apps: 2.88 → 3.81 kB.
  { name: "@hilum/ui/tokens.css", path: "packages/ui/dist/tokens.css", limit: "4.2 kB" },
  // 4.2: static copy of the CSS sonner + vaul inject at import, for strict-CSP
  // apps (opt-in import). Measured 3.36 kB.
  { name: "@hilum/ui/vendor.css", path: "packages/ui/dist/vendor.css", limit: "3.7 kB" },
  { name: "@hilum/app-shell", path: "packages/app-shell/dist/index.js", limit: "13.2 kB" },
  // 4.1.1 added the inspector grid row (its selector classes), DesignerPropertyField
  // and the restructured pane title: 7.65 → 8.55 kB.
  // 4.2 added FontPicker (searchable listbox with lazy font loading) and the
  // DesignerHeader action cluster with its "More actions" menu: 8.55 → 11.35 kB.
  { name: "@hilum/designer", path: "packages/designer/dist/index.js", limit: "12.5 kB" },
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
