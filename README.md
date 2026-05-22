# Hilum UI

Design system and component platform for Hilum apps.

- **Catalog (live docs):** [ui.hilum.dev](https://ui.hilum.dev)
- **Architecture plan:** [`PLATFORM_PLAN.md`](./PLATFORM_PLAN.md)
- **Pappery reference audit:** [`PHASE_0_AUDIT.md`](./PHASE_0_AUDIT.md)

## Packages

| Package | Description |
|---|---|
| `@hilum/ui` | UI primitives — Button, Input, Dialog, Combobox, etc. (~65 components) |
| `@hilum/app-shell` | Composed product-app layouts — AppShell, AppSidebar, AppHeader, PageHeader |
| `@hilum/designer` | Canvas-editor chrome — Shell, Toolbar, Panel, Pane + generic hooks |
| `@hilum/designer-canvas` | Generic free-positioned canvas engine — layers, drag/resize, snap, marquee |

## Apps

| App | Description |
|---|---|
| `apps/catalog` | The Hilum UI documentation site (TanStack Start + TanStack Router) |

## Local development

```bash
pnpm install
pnpm dev               # runs all apps in dev mode (turbo)
pnpm catalog           # runs only the catalog
pnpm typecheck         # typechecks every package + app
pnpm build             # builds every package + app
```

## Brand model

Hilum UI ships a **fully-fixed** brand: every Hilum app uses the same primary (`brand-orange #FF4D01`), success (`brand-lime #CDEA19`), warning (`brand-yellow #FDE086`) and taupe scale. No per-app accent overrides. The goal is brand recognition through repetition (Linear / Stripe / Notion / Apple model).

See `PLATFORM_PLAN.md` §2.1 D8 for full rationale.

## Contributing

Sole maintainer: William ([@hilum-labs](https://github.com/hilum-labs)). External contributions are not accepted at this time.
