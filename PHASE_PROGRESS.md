# Hilum UI — Phase Progress Tracker

> Updated: 2026-05-04
> Source of truth for "where are we in the plan." Each loop iteration reads this first to know where to continue.

## Status

| Phase | Status | Notes |
|---|---|---|
| Phase 0 — Audit | ✅ Complete | Output: `PHASE_0_AUDIT.md` |
| Phase 1 — Monorepo foundation | ✅ Complete | Workspace running, all packages stub-build |
| Phase 2 — `@hilum/ui` | ✅ Complete | 70 components moved + 4 new (ColorPicker, ColorInput, InputNumber, PropertyRow). JS-first tokens → tokens.css build. Catalog migrated Next.js → Vite + React Router (D20). |
| Phase 2.5 — `@hilum/app-shell` | ✅ Complete | 9 components shipped (AppShell, AppSidebar+Section, AppHeader, Navbar, AppShellStacked, PageHeader, DetailScreen, SettingsScreen, SignInScreen) + injectable LinkComponent context. |
| Phase 3 — `@hilum/designer` | ✅ Complete | ShellContext + DesignerShell/Header/Sidebar/Panel/Pane/Toolbar primitives + useHistory<T> + useKeybindings. Engine-agnostic. |
| Phase 4 — `@hilum/designer-canvas` | ✅ Complete | Generic Layer<TData>, slim reducer (24 action types), CanvasProvider wrapping ShellProvider, RendererRegistry, services interfaces, Designer/Canvas/Frame/StaticFrame, 3 overlays, 11 toolbar action components. |
| Phase 6 — Catalog integration | ✅ Complete | 4 designer showcase pages (`/designer`, `/designer/shell`, `/designer/canvas`, `/designer/static-frame`, `/designer/pane-visibility`) + sidebar Designer entry. Catalog consumes all four `@hilum/*` packages. |
| Phase 7 — Production hardening | ✅ Complete | Changesets configured for lockstep (D4), vitest (29 tests), GitHub Actions CI + release workflow, dependabot, RELEASING.md. All packages publish-ready under `hilum-labs` org on GitHub Packages. |

## Phase 1 — what shipped

```
/Users/william/Documents/hilum-ui/
├── .gitignore                            ← NEW
├── .npmrc                                ← NEW (hoist Radix for TS2742 fix)
├── PHASE_0_AUDIT.md
├── PHASE_PROGRESS.md                     ← NEW (this file)
├── PLATFORM_PLAN.md
├── README.md                             ← NEW
├── package.json                          ← NEW (workspace root, hilum-platform)
├── pnpm-lock.yaml                        ← regenerated as workspace lockfile
├── pnpm-workspace.yaml                   ← NEW
├── tsconfig.base.json                    ← NEW
├── turbo.json                            ← NEW
│
├── apps/
│   └── catalog/                          ← MOVED from repo root
│       ├── package.json                  ← renamed @hilum/catalog, Tailwind ^4.2
│       ├── tsconfig.json                 ← extends tsconfig.base.json (declaration: false to avoid TS2742 from vaul/menubar transitive types)
│       ├── next.config.ts
│       ├── next-env.d.ts
│       ├── postcss.config.mjs
│       └── src/
│
└── packages/                             ← NEW
    ├── ui/                  @hilum/ui              (stub — Phase 2 fills)
    ├── app-shell/           @hilum/app-shell       (stub — Phase 2.5 fills)
    ├── designer/            @hilum/designer        (stub — Phase 3 fills)
    └── designer-canvas/     @hilum/designer-canvas (stub — Phase 4 fills)
```

Each package has: `package.json` with workspace deps + GitHub Packages publishConfig + lockstep version 0.1.0; `tsconfig.json` extending base; `tsup.config.ts` for ESM + .d.ts emission; stub `src/index.ts`; `README.md`.

`@hilum/ui` additionally has `src/icons.ts`, `src/tokens/tokens.ts`, and `scripts/build-tokens.mjs` placeholders ready for Phase 2.

### Verified

```
pnpm install      → 6 workspace projects resolved, no peer-dep errors
pnpm typecheck    → 7 / 7 successful
pnpm build        → 5 / 5 successful (4 packages + catalog Next.js static build)
```

Catalog builds with all existing routes (atoms, molecules, blocks, marketing, foundations) intact. No regressions.

## Phase 2 — what shipped

- 70 components from `apps/catalog/src/components/ui/` moved into `packages/ui/src/components/`. Internal imports rewritten (`@/lib/utils` → `../lib/utils`, cross-component refs → `./X`).
- `packages/ui/src/lib/utils.ts` — `cn()` re-exported from barrel.
- 4 new components per P0.2 gap analysis:
  - `color-picker.tsx` — full picker with swatch + popover + hex + native color input + presets.
  - `color-input.tsx` — compact panel-friendly variant with optional opacity.
  - `input-number.tsx` — steppers + arrow-key step (Shift = ×10) + unit suffix + min/max + precision.
  - `property-row.tsx` — horizontal label + controls layout for designer inspector panels.
- Barrel `src/index.ts` re-exports all 74 components + `cn`.
- Curated `src/icons.ts` re-export from lucide-react.
- JS-first tokens (`src/tokens/tokens.ts`) — full Hilum palette (taupe + brand + destructive), light/dark semantic mappings, typography, radius, shadow, animations.
- `scripts/build-tokens.mjs` — generates `dist/tokens.css` (6430 bytes) with `@theme`, `@theme inline`, `:root` light, `@media (prefers-color-scheme: dark)`, `[data-theme="dark"]`, `@custom-variant dark`, type-scale `@utility` blocks, keyframes, base styles.
- `tsup.config.ts` — `dts: { resolve: ['vaul', '@radix-ui/react-dialog', '@radix-ui/react-context'] }` to bundle transitive types.
- `.npmrc` set to `node-linker=hoisted` to fix TS2742 portable-types issues with vaul/radix transitives.
- Catalog migrated **Next.js → Vite + React Router + vite-plugin-pages** (locked in D20). All `next/link` → `react-router-dom Link`, `next/font` removed, `usePathname` → `useLocation`, `app/layout.tsx` replaced by `src/App.tsx` + `src/main.tsx`. All `"use client"` directives stripped. 129 page.tsx files preserved as-is — vite-plugin-pages auto-discovers them.
- All `@/components/ui/X` and `@/lib/utils` imports across catalog rewritten to `@hilum/ui` (133 files).

### Verified

```
pnpm install      → 6 workspace projects, hoisted node_modules
pnpm typecheck    → 7 / 7 successful
pnpm build        → 5 / 5 successful (4 packages + Vite-built catalog)
```

### Phase 2 follow-ups deferred to later iterations

- Catalog loads Inter + Gabarito through `@hilum/ui/fonts.css` so it exercises the same self-hosted package path as consumers.
- Catalog atom pages for the 4 new components (color-picker, color-input, input-number, property-row).
- Expand the icon re-export list as the catalog needs more.

These are non-blocking; the package and catalog both build and the brand identity is consumed end-to-end.

## Phase 2.5 — what shipped

Package at `packages/app-shell/`:

- **`src/types.ts`** — `NavItem`, `NavSection`, `Crumb`, `User`, `LinkComponent`, `LinkComponentProps`. `NavItem` carries caller-computed `active: boolean` per D13.
- **`src/link-context.tsx`** — `LinkProvider` + `useLink()` with a default plain-anchor implementation. Apps inject their router's link via `<AppShell linkComponent={...}>`.
- **`src/app-shell.tsx`** — `AppShell` root layout; flex container, full viewport, taupe-50 surface.
- **`src/app-sidebar.tsx`** — `AppSidebar` + `AppSidebarSection`. Logo+brand, scrollable nav grouped by section, optional user dropdown at the bottom (DropdownMenu-driven). Collapsed mode supported.
- **`src/app-header.tsx`** — `AppHeader` with breadcrumb trail (rendered via injected `LinkComponent`), optional center slot (e.g. search), right-side action slot.
- **`src/navbar.tsx`** — standalone top nav for marketing/landing.
- **`src/app-shell-stacked.tsx`** — variant that uses Navbar instead of sidebar (top-nav layout).
- **`src/page-header.tsx`** — in-content title + description + actions + eyebrow + level (1/2/3).
- **`src/detail-screen.tsx`** — two-column main + meta sidebar with breakpoint control.
- **`src/settings-screen.tsx`** — left-rail section nav + scrollable content area; takes `activeId` for active-state.
- **`src/sign-in-screen.tsx`** — auth shell with optional decorative panel.
- **`src/index.ts`** — barrel.

### Verified

```
pnpm turbo build --filter=@hilum/app-shell  → ESM 13.88 KB, .d.ts 8.22 KB
pnpm turbo typecheck                        → 7 / 7 successful
pnpm turbo build                            → 5 / 5 successful
```

### Phase 2.5 follow-ups deferred

Migrating catalog block pages (`apps/catalog/src/app/blocks/*`) from inlined implementations to `@hilum/app-shell` imports is the natural next step but belongs in Phase 6 (catalog integration). The package is functionally complete and ready for any consuming app.

## Phase 3 — what shipped

Package at `packages/designer/`:

- **`src/shell/ShellContext.tsx`** — `ShellContextValue` (selectedIds, activeTool, readOnly, optional resolveKind), `ShellProvider` (uncontrolled state with optional controlled override), `useShellContext()`. Default value is no-op so components render outside a provider (catalog showcase use case).
- **`src/components/DesignerShell.tsx`** — root flex layout, full viewport, themed surface.
- **`src/components/DesignerHeader.tsx`** — slot-driven (left / center / right). No engine knowledge.
- **`src/components/DesignerSidebar.tsx`** — vertical icon rail driven by `items: SidebarItem[]`. Tooltipped icon buttons. Optional bottom group. `aria-pressed` on active items.
- **`src/components/DesignerPanel.tsx`** — left/right side panel (240px default, configurable).
- **`src/components/DesignerPane.tsx`** — collapsible inspector section with `showFor` (string[] of kinds, or predicate, or omitted = always visible). Resolves kinds via `ShellContext.resolveKind`. Plus `DesignerPaneTitle` and `DesignerPaneContent` siblings.
- **`src/components/DesignerToolbar.tsx`** — `DesignerToolbar` (floating or inline) + `DesignerToolbarGroup` + `DesignerToolbarSeparator` + `DesignerToolbarButton` (with label / icon / onClick / active / disabled / shortcut).
- **`src/hooks/useHistory.ts`** — generic `useHistory<T>(initial)` returning `{ state, setState, replaceState, undo, redo, reset, canUndo, canRedo, pastSize, futureSize }`. No `Layer` references — purely typed by the consumer's `T`.
- **`src/hooks/useKeybindings.ts`** — accepts `KeybindingConfig[]`. Each binding has key + modifier flags + `mod: true` for cross-platform Ctrl/Cmd. Skips inputs by default. preventDefault on by default. Single keydown listener attached to window or a custom target.

### Verified

```
turbo build --filter=@hilum/designer  → ESM 12.05 KB, .d.ts 10.21 KB
turbo build                           → 5 / 5 successful
```

Engine-coupling check: `grep -rE 'useDesignerState|DesignerContext|\bLayer\b'` only finds a docstring comment referencing `Layer` as an example use-case; no real type or import coupling. The shell is genuinely engine-agnostic — `@hilum/designer-canvas` will mount on top of it in Phase 4.

## Phase 4 — what shipped

Package at `packages/designer-canvas/`. ESM 37.80 KB, .d.ts 21.69 KB.

### Types and services
- **`src/types.ts`** — Generic `Layer<TData>` with first-class typed geometry (x/y/width/height/rotation/opacity), plus `GridItem`, `FrameSize`, `GridContainer`, `LayerTypeDescriptor` (renderer registry).
- **`src/services/types.ts`** — `PathService`, `FontService`, `UnitConverter`, `UploadImage`, `CanvasServices` container per `PHASE_0_AUDIT.md` §P0.6.

### State + reducer + provider
- **`src/context/state.ts`** — slim `CanvasState<TData>` with 14 fields. No Pappery domain (productType, dpi, binding*, bleed all excluded).
- **`src/context/reducer.ts`** — `canvasReducer` handling 24 action types. Selection-driven actions (ALIGN, NUDGE, GROUP, ARRANGE, TRANSFORM, COPY, etc.) accept explicit `targetLayerIds` payload — decoupled from ShellContext per P0.4. Includes `alignLayers`, `distributeLayers`, `arrangeLayers` helpers exported as `__test`.
- **`src/context/CanvasContext.tsx`** — `useCanvasContext<TData>()` typed-narrowing hook.
- **`src/context/CanvasProvider.tsx`** — wraps `ShellProvider` from `@hilum/designer`, supplies `resolveKind` so `DesignerPane.showFor` works, optional `onChange` callback for syncing to external storage.

### Renderer registry
- **`src/renderer/types.ts`** — `LayerRenderer`, `LayerRendererProps`, `LayerRendererContext`, `RendererRegistry`.
- **`src/renderer/RendererProvider.tsx`** — `<RendererProvider renderers={...}>` + `useLayerRenderer(type)` + `useAllRenderers()`. Package ships zero concrete renderers.

### Components
- **`Designer`** — root provider (CanvasProvider + RendererProvider).
- **`DesignerCanvas`** — pan/zoom viewport with wheel zoom (Ctrl/Cmd) and trackpad pan; transform applied via `translate + scale`.
- **`DesignerFrame`** — interactive layer container; renders artboard background, all layers (via LayerView), MarqueeOverlay, LayerSelectionOverlay, optional GridOverlay; click-on-background clears selection.
- **`DesignerStaticFrame`** — read-only render for thumbnails / previews.
- **`LayerView`** (internal) — wraps app-supplied renderer with position/size/rotation/opacity, wires `useDragInteraction`, click-to-select with shift-extend.

### Overlays
- **`GridOverlay`** — SVG cell pattern based on `state.gridContainer`.
- **`LayerSelectionOverlay`** — outline rectangles around selected layers using `state.accentColor`.
- **`MarqueeOverlay`** — pointer-driven drag rectangle; intersection-based selection on release; shift-extends.

### Hooks
- **`useLayers<TData>()`**, **`useLayer(id)`**, **`useSelectedLayerIds`**, **`useSelectedLayers`**, **`useSelectedLayer`**, **`useIsLayerSelected`**.
- **`useZoom()`** — returns `{ zoom, setZoom, zoomIn, zoomOut, resetZoom, fitZoom }` with stepped zoom levels.
- **`useDragInteraction({ layerId, scale })`** — pointer drag; shift-locks to axis; multi-select drag if layer is in selection; pointer capture.
- **`useHistoryActions()`** — wires `@hilum/designer`'s generic `useHistory<Layer[]>` to the canvas reducer.

### Actions (11 representative components from the 49 generic identified in P0.3)
- **`ActionAddLayer`** — buttons per registered layer type (uses `state.layerTypes`).
- **`ActionAlign`** — left/center/right + top/middle/bottom + horizontal/vertical distribute.
- **`ActionArrange`** — front/forward/backward/back.
- **`ActionDelete`**, **`ActionDuplicate`**, **`ActionGroup`** (group + ungroup).
- **`ActionTransform`** — flip horizontal / vertical (writes `data._flipX/_flipY`).
- **`ActionLock`** — lock/unlock + show/hide.
- **`ActionTool`** — tool selector (default: Select + Pan; configurable).
- **`ActionUndoRedo`**, **`ActionZoom`** (zoom in/out/reset with live percentage).

The remaining ~38 actions (text family, image family, fill/stroke/shadow, padding, alignItems/direction, layer-name editor, etc.) are dispatchable directly via `useCanvasContext()`. Apps that want them as toolbar buttons can build on top using `DesignerToolbarButton` + `dispatch`.

### Verified

```
turbo build --filter=@hilum/designer-canvas → ESM 37.80 KB, .d.ts 21.69 KB
turbo build                                  → 5 / 5 successful
turbo typecheck                              → 7 / 7 successful
```

Coupling check: package source contains zero references to `productType`, `bindingType`, `bleed`, `dpi`, `unitSystem`, `ProTextRenderer`, `UniversalWidgetRenderer`, `GeometryService`, or `FontService` outside of (a) the documentation comment in `state.ts` explicitly stating they're excluded, and (b) the **interface definitions** in `services/types.ts`. Genuinely engine-pure.

### Phase 4 follow-ups deferred

- **Resize / rotate handles** on `LayerSelectionOverlay` (Pappery has these — useful for any consumer; can ship in a later iteration).
- **Snap guides overlay** (alignment-while-dragging guides).
- **Text-edit interaction** (`useTextEditInteraction` — needs the text renderer's API to be defined first).
- **The remaining 38 generic actions** — most are 5–15 line components dispatching one of the 24 action types. Phase 7 or post-1.0.
- **Performance pass** — D12 says 60fps with 100 layers; verifying that target needs Pappery's fonts/renderers loaded. Belongs in a Pappery-integration phase.

## Phase 6 — entry plan

The big one. Per `PHASE_0_AUDIT.md` §P0.3 / §P0.4 / §P0.6:

1. **Generic Layer type** at `src/types.ts`:
   ```ts
   interface Layer<TData = Record<string, unknown>> {
     id, type, name?, x, y, width, height,
     rotation?, opacity?, isLocked?, isVisible?,
     groupId?, gridItem?, data: TData
   }
   ```
2. **Service interfaces** at `src/services/types.ts` — `PathService` and `FontService` per P0.6. Apps inject via `<CanvasProvider services={...}>`.
3. **Slim CanvasState** + reducer at `src/context/`:
   - State: `layers`, `zoom`, `panX/Y`, `frameSize`, `gridContainer?`, `copiedLayers`, artboard chrome, `uiColor`/`canvasColor`/`accentColor`, `layerTypes` registry, `readOnly`.
   - Actions: per P0.4 GENERIC list (~31 action types).
   - Selection-driven actions (ALIGN, GROUP, NUDGE, etc.) accept explicit `targetLayerIds: string[]` payloads.
4. **CanvasProvider** at `src/context/CanvasProvider.tsx` — wraps `ShellProvider` from `@hilum/designer`. Selection moves to ShellContext; history wired through `useHistory<Layer[]>`.
5. **Renderer registry** at `src/renderer/`:
   - `LayerRenderer` interface
   - `RendererProvider` + `useLayerRenderer(type)` hook — apps register `{ [type]: Component }`.
6. **Components** at `src/components/`:
   - `Designer` — root provider (ShellProvider + CanvasProvider + RendererProvider).
   - `DesignerCanvas` — pan/zoom viewport.
   - `DesignerFrame` — interactive layer container (drag, select, marquee).
   - `DesignerStaticFrame` — read-only render for thumbnails.
   - Overlays: `GridOverlay`, `SnapGuidesOverlay`, `MarqueeOverlay`, `LayerSelectionOverlay`, `DragGhost`.
7. **Hooks** at `src/hooks/`:
   - `useLayers`, `useSelectedLayer(s)`, `useIsLayerSelected`
   - `useDragInteraction`, `useResizeInteraction`, `useMarqueeInteraction`, `useTextEditInteraction`
   - `useZoom`, `useFrameSize`
   - `useHistoryActions` (wires `@hilum/designer`'s `useHistory<Layer[]>`)
8. **49 generic actions** at `src/actions/` per P0.3:
   - Layer mutation, add layer, tools, history, zoom, transform, fill/stroke/shadow, layout, text, image (43 generic + 6 edge-cases with abstractions: `unitConverter`, `fontProvider`, `uploadImage`, renderer-side warp).
9. **Barrel** at `src/index.ts`.

### Phase 4 exit gates

- `turbo build --filter=@hilum/designer-canvas` produces dist/ with .js + .d.ts.
- `turbo typecheck` green.
- `grep -rE 'productType|bindingType|bleed|dpi|unitSystem' packages/designer-canvas/src` → 0 matches (no Pappery domain leaked).
- `grep -rE 'ProTextRenderer|UniversalWidgetRenderer|GeometryService|FontService' packages/designer-canvas/src/renderer src/components src/actions` → 0 matches (only interface definitions in `src/services/types.ts`).
- Catalog mounts a working `<Designer>` demo (deferred until Phase 6 — Phase 4 just needs the package to build clean and pass typecheck).

When the next iteration picks up:

1. **Survey catalog block pages** — `apps/catalog/src/app/blocks/{app-shell-sidebar,app-shell-stacked,navbar,detail-screen,settings-screen,sign-in,form-layout}/page.tsx` are the source.
2. **Build typed primitives** — `packages/app-shell/src/`:
   - `AppShell` (root grid layout, takes `linkComponent` via context per D13)
   - `AppSidebar` + `AppSidebarSection` + `AppSidebarItem` (nav config via props, caller-computed `active: boolean`)
   - `AppHeader` (breadcrumbs left, actions right, user menu)
   - `AppShellStacked` (top-nav variant)
   - `Navbar` (standalone)
   - `PageHeader` (in-content title + description + action slot)
   - `DetailScreen` (two-column main + meta sidebar)
   - `SettingsScreen` (tabbed/sectioned)
   - `SignInScreen` (auth shell)
3. **Shared types** — `src/types.ts` with `NavSection`, `NavItem`, `Crumb`, `User`.
4. **Update catalog block pages** to import from `@hilum/app-shell` and pass nav config as props.
5. **Wire `@source` directive** in catalog globals.css for `@hilum/app-shell/src` so Tailwind picks up its utility classes.

### Phase 2.5 exit gates

- `turbo build --filter=@hilum/app-shell` produces dist/.
- `turbo typecheck` green.
- Catalog block pages render identically using the new package, no canvas-editor coupling (`grep DesignerShell` in app-shell src returns nothing).

## Loop guidance

- **Never output `<promise>DONE</promise>` until every phase above is ✅ Complete.** Promise must be unequivocally true.
- Each iteration: read this file, pick up at the next `⏳` phase, advance it, update this file, end the turn.
- If a phase is too large for one iteration, mark it `🔄 In progress` with a sub-checklist.
- Do not skip exit gates. A phase isn't done until its build/typecheck passes.
