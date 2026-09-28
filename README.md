# Hilum UI

[![CI](https://github.com/hilum-labs/hilum-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/hilum-labs/hilum-ui/actions/workflows/ci.yml)

Design system and component platform for Hilum apps.

- **Catalog (live docs):** [ui.hilum.dev](https://ui.hilum.dev)
- **Source:** [github.com/hilum-labs/hilum-ui](https://github.com/hilum-labs/hilum-ui)
- **Releasing:** [`RELEASING.md`](./RELEASING.md)
- **Architecture plan:** [`PLATFORM_PLAN.md`](./PLATFORM_PLAN.md)
- **Pappery reference audit:** [`PHASE_0_AUDIT.md`](./PHASE_0_AUDIT.md)

## Packages

| Package                  | Description                                                                |
| ------------------------ | -------------------------------------------------------------------------- |
| `@hilum/ui`              | UI primitives — Button, Input, Dialog, Combobox, etc. (~65 components)     |
| `@hilum/app-shell`       | Composed product-app layouts — AppShell, AppSidebar, AppHeader, PageHeader |
| `@hilum/designer`        | Canvas-editor chrome — Shell, Toolbar, Panel, Pane + generic hooks         |
| `@hilum/designer-canvas` | Generic free-positioned canvas engine — layers, drag/resize, snap, marquee |
| `@hilum/blocks`          | CLI (`hilum`) that adds marketing blocks to your project                   |

## Apps

| App            | Description                                                        |
| -------------- | ------------------------------------------------------------------ |
| `apps/catalog` | The Hilum UI documentation site (TanStack Start + TanStack Router) |

## Development

```bash
pnpm install
pnpm dev               # runs all apps in dev mode (turbo)
pnpm catalog           # runs only the catalog
pnpm build             # builds every package + app
pnpm build:packages    # builds only the published packages (dist/)
```

Checks (each is a step of `pnpm verify`; CI runs the same steps in `.github/workflows/ci.yml`):

```bash
pnpm format:check      # Prettier (pnpm format:write to fix)
pnpm lint              # ESLint, zero warnings allowed (packages, catalog, tests/)
pnpm lint:fix          # auto-fix what ESLint can
pnpm typecheck         # typechecks every package + app (turbo; builds deps first)
pnpm typecheck:tests   # typechecks the root tests/ (a11y suites, axe helper)
pnpm test              # vitest (happy-dom), all packages + tests/
pnpm test:coverage     # vitest + coverage thresholds from vitest.config.ts
pnpm test:a11y         # only the axe-core accessibility smoke tests (tests/a11y)
pnpm test:browser      # vitest browser mode in Chromium (needs `pnpm exec playwright install chromium`)
pnpm check:packages    # publint on the packed packages (after build:packages)
pnpm size              # bundle-size budgets for each dist entry (after build:packages)
pnpm changeset:status  # fails if packages changed vs origin/main without a changeset
pnpm verify            # all of the above, in CI order (verify:ci = everything but changeset:status)
```

- **Accessibility tests:** `tests/axe.ts` wraps `axe-core` with the rules happy-dom can't evaluate disabled and registers `expect(await axe(container)).toHaveNoAxeViolations()`. Add a case to `tests/a11y/*.a11y.test.tsx` for new components.
- **Bundle budgets:** `.size-limit.js`. When a component legitimately grows an entry, re-measure (`pnpm size --json`) and raise the limit in the same change.
- **Releasing:** add a changeset (`pnpm changeset`) for every package change. Merging to `main` opens a "Version Packages" PR; merging that publishes to npm from GitHub Actions (trusted publishing, with provenance). See [`RELEASING.md`](./RELEASING.md).
- **Deploying the catalog:** every push to `main` that touches `apps/catalog/` or `packages/` rebuilds the prerendered catalog and deploys it to GitHub Pages at [ui.hilum.dev](https://ui.hilum.dev) (`.github/workflows/pages.yml`).

## Brand model

Hilum UI ships a **fully-fixed** brand: every Hilum app uses the same primary (`brand-orange #FF4D01`), success (`brand-lime #CDEA19`), warning (`brand-yellow #FDE086`) and taupe scale. No per-app accent overrides. The goal is brand recognition through repetition (Linear / Stripe / Notion / Apple model).

See `PLATFORM_PLAN.md` §2.1 D8 for full rationale.

## Contributing

Sole maintainer: William. External contributions are not accepted at this time.

## Credits

Hilum UI includes component interaction ideas and MIT-compatible source adaptation from [Fluid Functionalism](https://github.com/mickadesign/fluid-functionalism) by Micka Touillaud.
