# Hilum UI — Architecture & Migration Plan

> **Status:** Draft v1.2 — 2026-05-04  
> **Platform name:** Hilum UI — the shared design system and component platform for all Hilum apps  
> **Scope:** Monorepo setup, four shared packages (`@hilum/ui`, `@hilum/app-shell`, `@hilum/designer`, `@hilum/designer-canvas`), design catalog integration, publish to registry. Pappery integration is out of scope — see §14.  
> **Audience:** Engineering team building on the shared platform

### Project Metadata

| | |
|---|---|
| **GitHub repo** | `git@github.com:hilum-labs/hilum-ui.git` |
| **GitHub org** | `hilum-labs` |
| **Local path** | `/Users/william/Documents/hilum-ui/` |
| **Catalog deploy** | `https://ui.hilum.dev` |
| **Package namespace** | `@hilum/*` |
| **Package registry** | GitHub Packages (private), under `hilum-labs` org |
| **Owner / sole publisher** | William (controls all releases, reviews, infra) |
| **Platform scope (v1)** | React (browser) + Electron (Chromium). Expo / RN deferred — see D11. |
| **Brand model** | Model A — fixed across all Hilum apps. Primary `#FF4D01`, success `#CDEA19`, warning `#FDE086`. No per-app accent overrides (D8). |
| **Color modes** | Light + dark. Auto via `prefers-color-scheme` with `[data-theme]` override (D7). |
| **Performance target** | 60fps canvas interactions w/ 100 layers on M-series; 30fps min on 5-yr-old hardware (D12). |

---

## 1. Context

| Project | Location | Stack | Role in this plan |
|---|---|---|---|
| Hilum UI (design system) | `/Documents/hilum-ui` | Next.js 15, React 19, Tailwind v4 | **The thing we are building.** Hosts all four packages + the catalog. |
| Pappery | `/Documents/Pappery/apps/frontend` | Vite + Tauri, React 19, Tailwind v4 | **Reference source only.** We read its `src/components/designer/` to understand existing implementations of editor chrome, canvas, hooks, and actions — then generalize and reimplement them inside Hilum UI packages. Pappery itself is **not modified** in this plan. |

**Hilum UI** is the design system platform — its components, tokens, shells, editor chrome, and canvas engine are consumed by every Hilum app to keep them visually and structurally consistent. The catalog at `apps/catalog` is the public-facing reference (the equivalent of `ds.shadcn.com`).

The goal: **four installable packages** under the `@hilum/` namespace, published from this repo, that any app consumes. No duplication. One source of truth.

### 1.1 Reusability rule

> **No app — including Pappery — owns code that another app could conceivably reuse.**
>
> Editor chrome (toolbar, panel, pane, header, sidebar), canvas engine (pan/zoom, drag/resize, snap, marquee), generic hooks (useHistory, useKeybindings), and the 55 generic ActionXxx components all belong in Hilum UI. Apps own only their domain: data model, business logic, app-specific widgets, and configuration that is meaningful only to them (e.g. Pappery's `productType`, `dpi`, `bleed`, layer types, PDF export, WASM geometry/font services).
>
> When in doubt, default to placing the code in Hilum UI. The cost of moving something from an app into Hilum UI later is much higher than the cost of placing it correctly the first time.

### 1.2 How we use the Pappery codebase

Phases 3 and 4 of this plan extract editor chrome and canvas engine into `@hilum/designer` and `@hilum/designer-canvas`. Those components already exist in working form inside Pappery — they are not generic, but they are battle-tested. Our process:

1. **Read.** Browse `Pappery/apps/frontend/src/components/designer/` for the source of truth on each component's behavior, state shape, and integration points.
2. **Identify the generic core.** Strip Pappery-specific concerns (`productType`, `bindingType`, layer type assumptions, print logic, WASM dependencies).
3. **Reimplement in the package.** Build the generalized version inside `packages/designer/` or `packages/designer-canvas/`. This is *not* a `git mv` — it's a clean reimplementation informed by the reference.
4. **Don't touch Pappery.** Pappery's own migration to the new packages is out of scope. After Phase 7 publishes, Pappery's team handles their own switchover on their own timeline.

Two distinct kinds of consumer:
- **Product apps** (CRM, admin, dashboard, marketing) — need UI primitives + a shared app shell (sidebar, header, page layouts).
- **Editor apps** (Pappery, future form builder, future layout editor) — need everything above *plus* canvas-editor chrome and (optionally) the canvas engine.

---

## 2. Decisions

### 2.1 Resolved

| # | Decision | Resolution |
|---|---|---|
| D1 | Org namespace | **`@hilum/`** — design system is named "Hilum UI"; all packages live under the `@hilum/` scope (`@hilum/ui`, `@hilum/app-shell`, `@hilum/designer`, `@hilum/designer-canvas`). |
| D2 | Monorepo root | **`/Documents/hilum-ui/`** — this repo is the Hilum UI monorepo. It hosts the four packages plus the catalog app. Pappery and other consuming apps live in their own repos and depend on `@hilum/*` via the published registry. |
| D3 | Package registry | **GitHub Packages (private)** under `hilum-labs` org. Cross-repo consumption (Pappery is a separate repo) means `workspace:*` is insufficient. Packages must be published from day one of consumer integration. |
| D5 | Distribution model | **npm install only.** No copy-paste CLI (no `npx hilum add button`). Consistency wins over per-app customization. Components ship `.tsx` source for Tailwind scanning + compiled `dist/` for imports; tokens ship as a generated `.css` file consumers `@import`. |
| D6 | Token strategy | **Tokens live inside `@hilum/ui`.** Authored JS-first in `packages/ui/src/tokens/tokens.ts`; build step generates `packages/ui/dist/tokens.css` and `packages/ui/dist/tokens.js`. Consumers `@import "@hilum/ui/tokens.css"` in their globals. JS-first authoring keeps a future `@hilum/tokens` extraction painless when native (Option 1, see D11) arrives. |
| D7 | Color modes | **Light + dark, both modes.** Default behavior auto-respects `prefers-color-scheme`; consumers can force a mode by setting `<html data-theme="light">` or `<html data-theme="dark">`. Components reference semantic CSS variables only (e.g. `var(--surface)`, not `var(--taupe-50)`); both modes redefine those semantics in the same `tokens.css`. |
| D8 | Brand model | **Model A — fully fixed brand.** Every Hilum app uses `--brand-orange` (#FF4D01) as primary, `--brand-lime` (#CDEA19) as success, `--brand-yellow` (#FDE086) as warning, taupe scale as neutrals. **No per-app accent overrides.** Marketing pages may decoratively use brand-yellow / brand-lime tints in heroes/illustrations, but UI accents stay fixed across all apps. Goal: maximum brand recognition (Linear/Stripe/Notion/Apple model, not Google/Adobe). |
| D9 | Typography ownership | **Fonts ship with `@hilum/ui`.** Inter (UI/body) + Gabarito (display/heading) bundled via `@fontsource` + `@font-face` declarations inside `fonts.css`. Apps don't load fonts separately. Single source of font truth. |
| D10 | Icon ownership | **Icons ship with `@hilum/ui`.** Curated subset of lucide-react re-exported from `@hilum/ui/icons` (sub-export). Apps `import { ChevronDown } from "@hilum/ui/icons"`; they do not install lucide-react directly. Stops drift between two apps using slightly different icon sets. |
| D11 | Platform scope | **Web-first now (Option 1).** `@hilum/*` v1 targets React in the browser and Electron (Chromium). Expo / React Native consumers are deferred to a future `@hilum/ui-native` sister package that will share `@hilum/tokens` (extracted from D6 at that time). To make that future split painless, tokens are authored JS-first today (see D6). |
| D12 | Performance target | **60fps target on canvas interactions** (drag, resize, marquee, pan/zoom) with 100 layers on M-series Mac. **30fps minimum** on 5-year-old hardware. Implementation: RAF-driven, transform-only updates (no layout reflow), `contain: layout paint`, memoized layer renderers. |
| D20 | App framework | **No Next.js anywhere.** All Hilum apps — including the catalog — are plain React, built with **Vite** for the web and **Electron** / **Expo** for desktop and native respectively. No `"use client"` directives, no server components, no SSR. Catalog uses **Vite + React Router + `vite-plugin-pages`** (Next-style file-based routing without the framework). |
| D4 | Package versioning | **Lockstep.** All four packages publish at the same version (`@hilum/ui@1.4.0`, `@hilum/app-shell@1.4.0`, etc.) even when only one changed. Simpler to communicate ("install Hilum 1.4"), simpler dependency matrix in catalog. Cost: dead version bumps for unchanged packages — accepted. |
| D13 | `@hilum/app-shell` routing | **Injected `LinkComponent`** + caller-computed active state. `<AppShellProvider linkComponent={Link}>` lets each app pass its router's link component (Next.js `Link`, react-router `NavLink`, raw `<a>`, etc.). Each `AppSidebarItem` accepts `active: boolean` — caller decides which item is active using its own routing state. Component stays router-agnostic. |
| D14 | Per-component documentation | **Hand-written `page.tsx` per component** (continues the current catalog pattern). Prop tables auto-generated from TypeScript types via a small `<PropsTable componentType={typeof Button}/>` utility so they cannot drift. No MDX, no Storybook docs. |
| D15 | Figma parity | **None.** Hilum UI does not ship a Figma library, Code Connect mappings, or Figma Variables sync. Designers reference the live catalog at `ui.hilum.dev`. The earlier "Phase 8 — Figma parity" idea is removed from scope. |
| D16 | Accessibility | **No formal WCAG commitment.** Components use Radix UI primitives, which provide baseline keyboard navigation and ARIA semantics — that's the floor we get for free. No axe-core in CI, no documented a11y guarantees, no a11y section per component in the catalog. Risk accepted. |
| D17 | Visual regression testing | **Manual review during PRs only.** No Chromatic, no Playwright screenshots, no automated diff. Reviewers eyeball changes against the catalog at `ui.hilum.dev` before merging. Risk acknowledged: a CSS change can silently break visuals across the catalog and consumer apps. Revisit if it bites. |
| D18 | Internationalization | **English + Spanish.** Every user-facing string in component code comes from a prop — no hardcoded "Next", "Close", "Loading…", "No results", etc. Apps pass localized strings. **No RTL support** in v1; logical CSS properties used where convenient but not enforced. |
| D19 | Contribution scaffolding | **Deferred.** No `CONTRIBUTING.md`, `CODEOWNERS`, PR templates, or issue templates until the repo gains external contributors or the team grows. |

### 2.2 Pending

*All decisions resolved.*

---

## 3. Target Architecture

### 3.1 Package Map

```
@hilum/ui                  Atoms and molecules from the design system
                            Button, Badge, Input, Dialog, Command, etc.
                            ~65 components — used by every app.

@hilum/app-shell           Composed product-app layouts
                            AppShell, AppSidebar, AppSidebarSection,
                            AppSidebarItem, AppHeader, AppShellStacked,
                            PageHeader, DetailScreen, SettingsScreen,
                            SignInScreen, Navbar
                            Depends on: @hilum/ui
                            Used by: every product app (CRM, admin, dashboard).
                            NOT used by editor apps' canvas chrome.

@hilum/designer            Canvas-editor shell chrome — engine-agnostic
                            DesignerShell, DesignerHeader, DesignerSidebar,
                            DesignerPanel, DesignerPane, DesignerPaneTitle,
                            DesignerPaneContent, DesignerToolbar,
                            DesignerToolbarGroup, DesignerToolbarButton,
                            DesignerToolbarSeparator
                            useHistory<T>, useKeybindings, ShellContext
                            Depends on: @hilum/ui
                            Used by: editor-style apps only (Pappery, future
                            form builder, layout editor, etc.).

@hilum/designer-canvas     Canvas rendering engine
                            Designer, DesignerCanvas, DesignerFrame,
                            DesignerStaticFrame, all overlays, all 55
                            ActionXxx components, layer renderers,
                            interaction hooks
                            Depends on: @hilum/ui + @hilum/designer
                            Used by: apps with a free-positioned layer canvas.
```

### 3.2 Monorepo Structure

```
/Documents/hilum-ui/             ← Hilum UI monorepo root (this repo)
├── pnpm-workspace.yaml               ← NEW
├── turbo.json                        ← NEW
├── package.json                      ← updated (root scripts)
├── tsconfig.base.json                ← NEW (shared TS config)
├── .changeset/                       ← NEW (versioning, see Phase 7)
│
├── packages/                         ← NEW
│   ├── ui/                           @hilum/ui
│   │   ├── src/
│   │   │   ├── components/           (moved from src/components/ui/)
│   │   │   └── index.ts              barrel export
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   │
│   ├── app-shell/                    @hilum/app-shell
│   │   ├── src/
│   │   │   ├── components/           AppShell, AppSidebar, AppHeader,
│   │   │   │                         PageHeader, DetailScreen, SettingsScreen,
│   │   │   │                         SignInScreen, Navbar
│   │   │   │                         (extracted from apps/catalog/src/app/blocks/)
│   │   │   ├── types.ts              NavSection, NavItem, Crumb, User
│   │   │   └── index.ts              barrel export
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   │
│   ├── designer/                     @hilum/designer
│   │   ├── src/                      (reimplemented from Pappery reference,
│   │   │   ├── shell/                 see §1.2)
│   │   │   ├── components/           Toolbar, Panel, Pane, Header, Sidebar
│   │   │   ├── hooks/                useHistory, useKeybindings
│   │   │   └── index.ts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsup.config.ts
│   │
│   └── designer-canvas/              @hilum/designer-canvas
│       ├── src/                      (reimplemented from Pappery reference,
│       │   ├── context/               see §1.2)
│       │   ├── components/           Canvas, Frame, StaticFrame, Overlays
│       │   ├── hooks/                useLayers, useZoom, useDrag, etc.
│       │   ├── actions/              all 55 ActionXxx components
│       │   └── index.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── tsup.config.ts
│
└── apps/
    └── catalog/                      ← moved from src/app/ (Hilum UI docs site)
                                       This is the only app in this repo.
```

**Out of this repo:**
- `/Documents/Pappery/` — separate repo, reference source only (see §1.2). After Phase 7 publishes, Pappery's team adds `@hilum/*` to its own `package.json` and migrates on its own schedule.
- Any future Hilum app (CRM, admin, dashboard, form builder, etc.) — separate repo, consumes published `@hilum/*` packages.

### 3.3 Dependency Graph

```
@hilum/ui                          ← every app installs this
    ↑          ↑
    │          │
    │     @hilum/app-shell         ← every product app installs this too
    │          ↑
    │          │
    │     apps/* (CRM, admin, dashboard, marketing — product apps)
    │
    └── @hilum/designer            ← only editor-style apps
            ↑
        @hilum/designer-canvas     ← only apps with a layer canvas
            ↑
        Pappery (separate repo) and future free-positioned editor apps

apps/catalog                        ← imports everything for documentation
```

**Install matrix:**

| App type | `ui` | `app-shell` | `designer` | `designer-canvas` |
|---|---|---|---|---|
| Product app (CRM, admin, dashboard) | ✅ | ✅ | — | — |
| Editor app with a non-canvas surface (form builder, CMS) | ✅ | ✅ | ✅ | — |
| Editor app with a layer canvas (Pappery) | ✅ | optional | ✅ | ✅ |
| Marketing site | ✅ | optional | — | — |

Note: `@hilum/designer` is **canvas-editor chrome** — toolbar/panel/pane primitives designed around a `selectedIds` + `activeTool` ShellContext. It is *not* a substitute for `@hilum/app-shell`. Product apps use `app-shell`; editor apps use `designer` (and may also use `app-shell` for non-editor pages like settings or dashboards).

---

## 4. Package Specifications

### 4.1 `@hilum/ui`

**What goes in:**  
Everything currently in `src/components/ui/` of this repo — all 65+ components.  
Accordion, Alert, AlertDialog, AspectRatio, Avatar, Badge, Breadcrumb, Button, ButtonGroup, Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Combobox, Command, ContextMenu, DataTable, DatePicker, Dialog, Drawer, DropdownMenu, HoverCard, Input, InputOTP, Kbd, Label, Menubar, NativeSelect, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Spinner, Steps, Switch, Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip.

**Reference for gaps:**  
Pappery has 27 UI duplicates inside `/Documents/Pappery/apps/frontend/src/components/designer/ui/` (Button, Input, Dialog, Tabs, FontPicker, ColorPicker, InputNumber, etc.). The overlap with this repo's `src/components/ui/` is large but not total. P0.2 audits the gaps; Phase 2 fills them by adding the missing atoms to `@hilum/ui`. Pappery's local copies are not deleted by this plan — that is Pappery's own migration step (§14).

**Peer dependencies:** `react`, `react-dom`, `radix-ui`  
**Dev dependencies:** `tailwindcss` (Tailwind is a build-time tool, not bundled)

---

### 4.2 `@hilum/app-shell`

**What goes in:**  
Composed product-app layouts. Currently exist as one-off showcase pages in `apps/catalog/src/app/blocks/` — this package extracts them into real importable components driven by props. Each app passes its nav config, user, breadcrumbs, etc.; the layout, spacing, collapse behavior, and responsive breakpoints are owned by the package.

**Components:**
```
AppShell                Root layout — sidebar + header + main (CSS grid)
AppSidebar              Left navigation rail (sections, items, user menu bottom)
AppSidebarSection       Group of nav items with optional heading
AppSidebarItem          Single nav link — icon + label + optional badge
AppHeader               Top bar — breadcrumbs left, actions right, user menu
AppShellStacked         Top-nav variant (no sidebar) — for marketing/admin
Navbar                  Standalone top navigation (use outside AppShell)
PageHeader              In-content header — title, description, action buttons
DetailScreen            Two-column layout — main content + meta sidebar
SettingsScreen          Tabbed/sectioned layout for settings pages
SignInScreen            Auth shell — centered card on full-bleed background
```

**Shared types (`src/types.ts`):**
```ts
interface NavSection { label?: string; items: NavItem[] }
interface NavItem {
  label: string
  href: string
  icon?: LucideIcon
  badge?: string | number
  active?: boolean
}
interface Crumb { label: string; href?: string }
interface User { name: string; email: string; avatarUrl?: string }
```

**What does NOT go in:**  
Page-content components — forms, tables, dashboards. Apps build those from `@hilum/ui` directly. This package only owns the *frame* every product app sits inside.

**What is the relationship to `@hilum/designer`?**  
None. `app-shell` is built around standard product-app navigation patterns (a section/item nav config, breadcrumbs, user menu). `designer` is built around a canvas editor's selection model (`selectedIds`, `activeTool`). An editor app may import both: `app-shell` for its dashboard/settings pages, `designer` for its editor route.

**Peer dependencies:** `react`, `react-dom`, `@hilum/ui`

---

### 4.3 `@hilum/designer`

**What goes in:**  
Pure presentational shell components + thin shared context + generic hooks. Zero assumptions about what is being edited or rendered.

**Components:**
```
DesignerShell           Root layout (flex-col, fills viewport)
DesignerHeader          Top bar slot — accepts children
DesignerSidebar         Icon navigation rail
DesignerPanel           Left/right resizable panel shell
DesignerPane            Collapsible section — NEW (see §5.1)
DesignerPaneTitle       Pane heading
DesignerPaneContent     Pane body
DesignerToolbar         Floating toolbar container
DesignerToolbarGroup    Grouped buttons inside toolbar
DesignerToolbarButton   Individual tool button
DesignerToolbarSeparator  Divider
```

**Hooks:**
```ts
useHistory<T>(initial: T)           // generic undo/redo stack, engine-agnostic
useKeybindings(config: KeybindingConfig[])  // keyboard shortcut registry
```

**ShellContext** — the only shared state between shell and engine:
```ts
interface ShellContextValue {
  selectedIds: string[]           // IDs of whatever is selected (layers, fields, nodes)
  setSelectedIds: (ids: string[]) => void
  activeTool: string              // "select" | "hand" | "text" — app defines valid values
  setActiveTool: (tool: string) => void
  readOnly: boolean
}
```

The canvas engine initialises ShellContext with its own layer selection state. A form builder initialises it with its own field selection state. The shell components (Pane's `showFor`, Toolbar buttons) read from ShellContext — they never know what the IDs refer to.

**Peer dependencies:** `react`, `react-dom`, `@hilum/ui`

---

### 4.4 `@hilum/designer-canvas`

**What goes in:**  
Everything canvas-specific — the rendering engine, layer model, interactions.

**State (slimmed `DesignerContext`):**  
After extracting shell concerns, the canvas context owns:

```ts
interface CanvasContextValue {
  // Layer model
  layers: Layer[]
  addLayer, updateLayer, updateLayers, setLayers,
  deleteLayer, deleteSelectedLayers, reorderLayers

  // Canvas viewport
  zoom: number
  panX: number
  panY: number
  zoomIn, zoomOut, resetZoom, setZoom, setPan

  // Frame
  frameSize: FrameSize
  setFrameSize

  // Grid
  gridContainer?: GridContainer
  setGridContainer, clearGridContainer, updateGridContainer

  // Clipboard
  copySelectedLayers, cutSelectedLayers, pasteLayers
  canPaste: boolean

  // History (delegates to shell's useHistory<Layer[]>)
  canUndo: boolean
  canRedo: boolean
  undo, redo

  // Canvas-specific settings
  artboardName, artboardColor, artboardOpacity, artboardClipContent
  uiColor, canvasColor, accentColor
  setUIColor, setCanvasColor, setAccentColor

  // Internal
  canvasRef
  isControlled
}
```

**Excluded from package state (compared to Pappery's `DesignerContext`):**  
`productType`, `unitSystem`, `dpi`, `bindingType`, `bindingPosition`, `bindingSize`, `pageMargin`, `bleed` — all Pappery print-specific. They live in Pappery's own app-level config/context, never in Hilum UI.

**Components:**
```
Designer              Root — mounts ShellProvider + CanvasProvider
DesignerCanvas        Pan/zoom viewport
DesignerFrame         Interactive layer container
DesignerStaticFrame   NEW — read-only render (for thumbnails, previews)
GridOverlay
SnapGuidesOverlay
MarqueeOverlay
LayerSelectionOverlay
DragGhost
```

**Hooks (reimplemented in this package, reading Pappery's `hooks/` as reference):**
```
useLayers, useLayersWithStyles, getCachedLayerStyles
useSelectedLayer, useSelectedLayers, useSelectedLayerIds
useDesignerZoom, useDesignerTool, useIsLayerSelected
useDragInteraction, useResizeInteraction
useTextEditInteraction, useMarqueeInteraction
useLayerRenderer, useLayerTypes
useZoom, useFrameSize, useUnitSystem
useHistoryActions (wraps shell's useHistory<Layer[]>)
```

**Actions (all 55 ActionXxx components move here):**  
They depend on `useDesignerState()` / `useDesignerDispatch()` which live in this package.

**Peer dependencies:** `react`, `react-dom`, `@hilum/ui`, `@hilum/designer`

---

## 5. The Context Split in Detail

### 5.1 DesignerPane — the new component

`DesignerPane` is the key new piece in `@hilum/designer`. It makes properties panels declarative:

```tsx
// Pappery today: conditional logic buried in DesignerProperties.tsx
{selectedLayer?.type === 'text' && <TextActions />}
{selectedLayer?.type === 'image' && <ImageActions />}

// New (composable):
<DesignerPane showFor={["text"]}>
  <DesignerPaneTitle>Typography</DesignerPaneTitle>
  <DesignerPaneContent>
    <ActionFontFamily />
    <ActionFontSize />
  </DesignerPaneContent>
</DesignerPane>
```

`showFor` reads `selectedIds` from ShellContext, then asks the engine how to resolve types. Because `@hilum/designer` doesn't know about layers, `showFor` accepts either a string array (layer types) or a predicate function:

```ts
interface DesignerPaneProps {
  showFor?: string[] | ((selectedIds: string[]) => boolean)
  collapsible?: boolean
  defaultOpen?: boolean
  children: ReactNode
}
```

For canvas apps, the canvas engine provides a context value that maps IDs → types, and the Pane's resolution logic reads from it if present. For non-canvas apps, they pass a predicate function directly.

### 5.2 History split

Current: `state.history: Layer[][]` and `state.historyIndex` live in the canvas reducer.

After split:
```ts
// @hilum/designer — generic hook
function useHistory<T>(initial: T): {
  state: T
  setState: (next: T) => void   // adds to stack
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

// @hilum/designer-canvas — uses it
const { state: layers, setState: setLayers, undo, redo, canUndo, canRedo }
  = useHistory<Layer[]>(initialLayers)
```

The toolbar's undo/redo buttons call `undo()` / `redo()` from ShellContext — they never touch `Layer[]`.

### 5.3 Keybindings split

Current: `useDesignerKeybindings` takes `DesignerState` and `DesignerAction` directly — fully canvas-coupled.

After split:
```ts
// @hilum/designer — generic
useKeybindings(bindings: KeybindingConfig[])

// @hilum/designer-canvas — builds canvas-specific bindings
const bindings: KeybindingConfig[] = [
  { key: 'z', meta: true, action: undo },
  { key: 'd', meta: true, action: duplicateSelected },
  { key: 'v', action: () => setActiveTool('select') },
  // ...
]
useKeybindings([...defaultBindings, ...bindings, ...customBindings])
```

---

## 6. CSS / Tailwind / Tokens Strategy

**Hybrid distribution model** (per D5, D6):
- **Components:** TSX source distribution. Consumers run Tailwind over the package source at their own build time.
- **Tokens, fonts, base styles:** compiled CSS distribution. Consumers `@import "@hilum/ui/tokens.css"` once and get the entire Hilum visual identity (colors, typography, fonts, light/dark themes).

### 6.1 Token authoring (JS-first, see D6 / D11)

Tokens are authored as a **TypeScript module** so they can be consumed by both CSS (web today) and a future `@hilum/ui-native` sister package (RN tomorrow):

```ts
// packages/ui/src/tokens/tokens.ts — single source of truth
export const tokens = {
  color: {
    taupe: { 50: 'oklch(...)', 100: '...', /* ... */ 950: '...' },
    brand: {
      orange: '#FF4D01',  // primary (D8 — fixed across all apps)
      lime:   '#CDEA19',  // success
      yellow: '#FDE086',  // warning
    },
    semantic: {
      light: { surface: '...', text: '...', border: '...', primary: '...' },
      dark:  { surface: '...', text: '...', border: '...', primary: '...' },
    },
  },
  typography: { /* ... */ },
  spacing:    { /* ... */ },
  radius:     { /* ... */ },
  shadow:     { /* ... */ },
} as const
```

A build step generates these artifacts:

- `dist/tokens.css` — the file consumers import. Contains:
  - `:root` CSS variables for every token
  - Light defaults + dark overrides via `@media (prefers-color-scheme: dark)` AND `[data-theme="dark"]` (D7)
- `dist/fonts.css` — optional self-hosted `@font-face` declarations for Inter + Gabarito (D9).
- `dist/tokens.js` + `dist/tokens.d.ts` — the same values as a JS object, exported for non-CSS consumers (component utilities, future native package).

### 6.2 Package `package.json` exports

```json
{
  "exports": {
    ".":            { "import": "./dist/index.js",    "types": "./dist/index.d.ts" },
    "./icons":      { "import": "./dist/icons.js",    "types": "./dist/icons.d.ts" },
    "./tokens":     { "import": "./dist/tokens.js",   "types": "./dist/tokens.d.ts" },
    "./tokens.css": "./dist/tokens.css"
  },
  "files": ["dist", "src"]
}
```

Both `dist/` (compiled JS + types + tokens.css) and `src/` (TSX source for Tailwind scanning) are published.

### 6.3 Consumer setup (one-time per app)

```css
/* app's globals.css — three lines, that's the whole setup */
@import "tailwindcss";
@import "@hilum/ui/tokens.css";

@source "../../node_modules/@hilum/ui/src";
@source "../../node_modules/@hilum/app-shell/src";
@source "../../node_modules/@hilum/designer/src";
@source "../../node_modules/@hilum/designer-canvas/src";
```

After this, the app has the Hilum palette, Hilum typography (fonts loaded), light/dark switching, and every Hilum component renders correctly.

### 6.4 Light / dark switching (D7)

Components reference **semantic** variables only:

```tsx
// ✅ correct — semantic
<div className="bg-[var(--surface)] text-[var(--text)] border-[var(--border)]" />

// ❌ never — concrete
<div className="bg-[var(--taupe-50)]" />
```

`tokens.css` defines those semantics twice — once for light, once for dark — and the dark block is gated by both `prefers-color-scheme: dark` and `[data-theme="dark"]`. Apps can build a toggle that flips `<html data-theme>` to override the OS preference.

### 6.5 No per-app theme overrides (D8)

Apps should not redeclare brand variables. The system is fixed. If an app legitimately needs a one-off color for a marketing illustration or hero treatment, it uses a local CSS variable scoped to that section, not a global override.

---

## 7. TypeScript Strategy

**Base config** (`tsconfig.base.json` at monorepo root):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

**Per-package config** (e.g. `packages/ui/tsconfig.json`):
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": { "@hilum/ui/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

**Build tool** (`tsup.config.ts` — same pattern for all packages):
```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react', 'react-dom', 'radix-ui', '@hilum/ui', '@hilum/designer'],
  sourcemap: true,
  clean: true,
  treeshake: true,
})
```

---

## 8. Build & Workspace Config

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

**`turbo.json`:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "lint": {}
  }
}
```

**Root `package.json`:**
```json
{
  "name": "hilum-platform",
  "private": true,
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "typecheck": "turbo typecheck",
    "test": "turbo test",
    "lint": "turbo lint",
    "build:packages": "turbo build --filter=./packages/*"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.7.0"
  }
}
```

---

## 9. Phase 0 — Preparation & Decisions

**Goal:** All decisions resolved, both codebases fully audited, no surprises in later phases.  
**Duration:** 3–5 days  
**Prerequisites:** None

### Tasks

All audits read **Pappery as a reference source** (see §1.2) — Pappery is not modified.

- [ ] P0.1 — Resolve D4 and D5 in §2.2. Write answers in §2.1 (Resolved).
- [ ] P0.2 — **Audit Pappery's UI duplicates.** Walk `/Documents/Pappery/apps/frontend/src/components/designer/ui/` (27 components). Map each to its equivalent in this repo's `src/components/ui/`. Mark gaps — components Pappery has that Hilum UI does not. Each gap becomes a new component to add to `@hilum/ui` in Phase 2.
- [ ] P0.3 — **Audit Pappery's actions.** Walk `/Documents/Pappery/apps/frontend/src/components/designer/actions/` (55 components). For each, list: (a) the `useDesignerState`/`dispatch` calls it makes, (b) whether it touches Pappery-specific config (`productType`, `bindingType`, `dpi`, `unitSystem`, `bleed`, etc.). Pappery-specific actions need an abstraction layer (config injected via context, not imported directly).
- [ ] P0.4 — **Audit Pappery's designer types and reducer.** Walk `/Documents/Pappery/apps/frontend/src/components/designer/types.ts` and `reducer.ts`. Identify which slices are generic (layers, zoom, pan, frameSize, grid, clipboard, history, ui colors) vs Pappery-specific (productType, dpi, binding*, pageMargin, bleed). The generic slices go into `@hilum/designer-canvas`; the Pappery-specific slices stay out of Hilum UI.
- [ ] P0.5 — **Verify version alignment between Pappery and this repo.** React major must match (both currently 19). Tailwind: this repo uses v4.0, Pappery uses v4.2 — confirm utility class compatibility before building packages that both will consume.
- [ ] P0.6 — **Document WASM strategy.** Pappery's `GeometryService` and `FontService` (in `/Documents/Pappery/apps/frontend/src/wasm/`) are NOT moved into Hilum UI. The renderers in `@hilum/designer-canvas` consume these services via an injected interface — Pappery provides the implementation; the package is WASM-free. Define the service interface signature now so Phase 4 can target it.

### Exit Validation

```bash
# D4 and D5 resolved in §2.1
# Pappery audits (P0.2, P0.3, P0.4) complete with a written gap list
# WASM service interface signature documented (P0.6)
# No blocker found that requires phase restructuring
```

**Do not proceed to Phase 1 if any P0 task is open.**

---

## 10. Phase 1 — Monorepo Foundation

**Goal:** This repo becomes a pnpm + Turborepo workspace. The existing Next.js app at the repo root moves into `apps/catalog/` and runs identically. Empty `packages/` directory ready for Phase 2.  
**Duration:** 2–3 days  
**Prerequisites:** Phase 0 complete

### Tasks

- [ ] P1.1 — Restructure repo root: `/Documents/hilum-ui/` becomes the workspace root. Update root `package.json` to `{ "name": "hilum-platform", "private": true, ... }` per §8.
- [ ] P1.2 — Move the existing Next.js app from repo root into `apps/catalog/`. Specifically: `src/`, `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `tsconfig.json`, `tsconfig.tsbuildinfo`, `package.json` (the app's), `pnpm-lock.yaml`'s app deps. Update any hardcoded paths.
- [ ] P1.3 — Add `pnpm-workspace.yaml` (content in §8). Run `pnpm install` from new root — verify catalog dependencies resolve.
- [ ] P1.4 — Add `turbo.json` (content in §8).
- [ ] P1.5 — Add `tsconfig.base.json` (content in §7).
- [ ] P1.6 — Create empty `packages/` directory with placeholder `README.md` files for each of the four packages: `ui/`, `app-shell/`, `designer/`, `designer-canvas/`. No code yet.
- [ ] P1.7 — Verify `pnpm --filter apps/catalog dev` opens the catalog at localhost:3000 with all atoms/blocks rendering identically to before.
- [ ] P1.8 — Add shared ESLint config at root (optional but recommended).
- [ ] P1.9 — Add `turbo build` to root scripts. Verify it exits 0 (nothing to build yet — packages are empty).
- [ ] P1.10 — Create a minimal CI workflow (GitHub Actions) that runs `turbo typecheck` and `turbo build` on PR.

### Exit Validation

```bash
# From repo root:
pnpm install                          # exits 0, no peer dep warnings
pnpm --filter apps/catalog dev        # catalog opens on localhost:3000
turbo build                           # exits 0
turbo typecheck                       # exits 0

# Catalog behaves identically to before the move.
# No regressions in any catalog page.
```

---

## 11. Phase 2 — `@hilum/ui` Package

**Goal:** All design system UI components live in an installable package. Catalog consumes it via `workspace:*`. Gaps identified in P0.2 (components Pappery uses but Hilum UI lacks) are filled.  
**Duration:** 1–2 weeks  
**Prerequisites:** Phase 1 complete

### Tasks

**Package scaffolding:**
- [ ] P2.1 — Create `packages/ui/` with `package.json`, `tsconfig.json`, `tsup.config.ts` (content in §7).
- [ ] P2.2 — Move `apps/catalog/src/components/ui/` → `packages/ui/src/components/`. Update all internal imports in catalog.
- [ ] P2.3 — Move `apps/catalog/src/lib/utils.ts` → `packages/ui/src/lib/utils.ts`. Update imports.
- [ ] P2.4 — Create `packages/ui/src/index.ts` — barrel export of every component.
- [ ] P2.5 — Add `@hilum/ui` as a workspace dependency in `apps/catalog/package.json`: `"@hilum/ui": "workspace:*"`.
- [ ] P2.6 — Update all catalog `import` statements from `@/components/ui/...` to `@hilum/ui`.
- [ ] P2.7 — Run `turbo build --filter=@hilum/ui` — verify `dist/` is produced with ESM, CJS, and `.d.ts`.

**Tailwind setup:**
- [ ] P2.8 — Add `@source` directive in catalog's `globals.css` pointing to `packages/ui/src`. Verify all utility classes resolve.

**Fill gaps from Pappery audit:**
- [ ] P2.9 — Resolve any gaps found in P0.2 (components Pappery uses that don't exist in `@hilum/ui` yet — typically things like `FontPicker`, `ColorPicker`, `InlineColorPicker`, `InputNumber`, `InputGroup`, `Action` wrapper). Build them as new atoms in the package, drawing on Pappery's implementation as a reference but generalizing.
- [ ] P2.10 — Add catalog pages for any new atoms added in P2.9 so they are discoverable and documented.
- [ ] P2.11 — Update `apps/catalog/src/app/atoms/page.tsx` counts to reflect added components.

**Validation:**
- [ ] P2.12 — Run typecheck across monorepo. Zero errors.
- [ ] P2.13 — Visual regression: spot-check 10 atoms in the catalog vs screenshots taken before migration.

**Validation:**
- [ ] P2.15 — Run typecheck across monorepo. Zero errors.
- [ ] P2.16 — Visual regression: spot-check 10 atoms in the catalog vs screenshots taken before migration.

### Exit Validation

```bash
turbo build --filter=@hilum/ui       # dist/ produced, no errors
turbo typecheck                        # zero errors across all packages and apps
pnpm --filter apps/catalog dev        # catalog renders all atoms with correct styling

# Verify catalog imports use the package, not the old path:
grep -r "@/components/ui" apps/catalog/src | wc -l
# → must output 0

# Pappery is unchanged — verify by running it from its own repo:
# (cd /Documents/Pappery/apps/frontend && pnpm dev) → still works as before
```

**Rollback:** Git revert.

---

## 11.5 Phase 2.5 — `@hilum/app-shell` Package

**Goal:** Composed product-app layouts (sidebar, header, screen shells) extracted from catalog blocks into an installable package. Any product app — CRM, admin, dashboard — gets the same nav structure, header, and page layouts by importing one component and passing config as props. This is what makes "all our apps feel like one product."  
**Duration:** 1 week  
**Prerequisites:** Phase 2 complete

### Tasks

**Package scaffolding:**
- [ ] P2.5.1 — Create `packages/app-shell/` with `package.json`, `tsconfig.json`, `tsup.config.ts`.
- [ ] P2.5.2 — Set peer deps: `react`, `react-dom`, `@hilum/ui`.

**Types:**
- [ ] P2.5.3 — Create `packages/app-shell/src/types.ts` with `NavSection`, `NavItem`, `Crumb`, `User` (signatures in §4.2). Export from package index.

**Component extraction (from `apps/catalog/src/app/blocks/`):**
- [ ] P2.5.4 — Extract `app-shell-sidebar/page.tsx` → `AppShell`, `AppSidebar`, `AppSidebarSection`, `AppSidebarItem`, `AppHeader`. Drive structure via props (`sections: NavSection[]`, `user: User`, `breadcrumbs?: Crumb[]`). Hardcoded demo nav data stays in the catalog page; the package contains only the layout primitives.
- [ ] P2.5.5 — Extract `app-shell-stacked/page.tsx` → `AppShellStacked` (top-nav variant for marketing/admin).
- [ ] P2.5.6 — Extract `navbar/page.tsx` → standalone `Navbar` component for use outside `AppShell`.
- [ ] P2.5.7 — Extract `detail-screen/page.tsx` → `DetailScreen` (two-column main + meta sidebar layout).
- [ ] P2.5.8 — Extract `settings-screen/page.tsx` → `SettingsScreen` (tabbed/sectioned settings layout).
- [ ] P2.5.9 — Extract `sign-in/page.tsx` → `SignInScreen` (auth shell).
- [ ] P2.5.10 — Build `PageHeader` — in-content header with title, description, action slot. Currently inlined across multiple block pages — consolidate.

**Barrel export:**
- [ ] P2.5.11 — Create `packages/app-shell/src/index.ts` exporting all components and types.
- [ ] P2.5.12 — Run `turbo build --filter=@hilum/app-shell` — verify `dist/` is produced.

**Tailwind setup:**
- [ ] P2.5.13 — Add `@source "../../packages/app-shell/src"` to catalog's `globals.css`. Verify all utility classes resolve.

**Catalog integration:**
- [ ] P2.5.14 — Update each block page in `apps/catalog/src/app/blocks/` to import from `@hilum/app-shell` instead of inlining the layout. Pages now demonstrate real package usage, not duplicated reference code.
- [ ] P2.5.15 — Add prop tables and usage docs for each shell component to its catalog page.

**Validation:**
- [ ] P2.5.16 — Run typecheck across monorepo. Zero errors.
- [ ] P2.5.17 — Visual regression: spot-check each block page vs screenshots taken before extraction.

### Exit Validation

```bash
turbo build --filter=@hilum/app-shell  # exits 0, dist/ produced
turbo typecheck                          # zero errors
pnpm --filter apps/catalog dev          # all block pages render identically to before

# Critical check — no canvas-editor coupling:
grep -r "DesignerShell\|DesignerToolbar\|DesignerCanvas\|ShellContext" packages/app-shell/src
# → must return no matches. app-shell must not depend on @hilum/designer.

# Sanity — package only depends on @hilum/ui and React:
cat packages/app-shell/package.json | grep -A 5 peerDependencies
# → react, react-dom, @hilum/ui only
```

**Rollback:** Git revert. Block pages remain as copy-paste reference until extraction is reverted.

---

## 12. Phase 3 — `@hilum/designer` Shell Package

**Goal:** Engine-agnostic shell chrome shipped as `@hilum/designer`. The catalog mounts Toolbar, Panel, and Pane with zero canvas dependency to prove the shell is reusable. Pappery's existing chrome is read as reference and reimplemented in generic form (per §1.2).  
**Duration:** 1–2 weeks  
**Prerequisites:** Phase 2 complete

> **Reference path:** All "read from Pappery" tasks in this phase target `/Documents/Pappery/apps/frontend/src/components/designer/`. Pappery is not modified.

### Tasks

**Package scaffolding:**
- [ ] P3.1 — Create `packages/designer/` with `package.json`, `tsconfig.json`, `tsup.config.ts`.
- [ ] P3.2 — Set peer deps: `react`, `react-dom`, `@hilum/ui`.

**ShellContext:**
- [ ] P3.3 — Create `packages/designer/src/shell/ShellContext.tsx` implementing the interface from §4.3.
- [ ] P3.4 — Ensure ShellContext has a no-op default so components render without a provider (useful for the catalog showcase).

**Component reimplementation (read Pappery, build generic):**
- [ ] P3.5 — Read Pappery's `DesignerToolbar.tsx`. Reimplement in `packages/designer/src/components/DesignerToolbar.tsx` with **zero `DesignerContext` imports** — toolbar takes children only, parents wire actions through ShellContext or props.
- [ ] P3.6 — Read Pappery's `DesignerPanel.tsx`. Reimplement as a generic resizable panel — no canvas-state coupling.
- [ ] P3.7 — Read Pappery's `DesignerSidebar.tsx`. Reimplement as a generic icon rail — `items: { icon, label, onClick }[]` driven, no designer-state coupling.
- [ ] P3.8 — Read Pappery's `DesignerHeader.tsx`. Reimplement with canvas-specific bits (zoom display, tool labels) replaced by named slot props (children).
- [ ] P3.9 — **Build new:** `DesignerShell.tsx` — root layout (flex col, fills viewport, themed CSS vars). Pappery has no equivalent; this is a new abstraction.
- [ ] P3.10 — **Build new:** `DesignerPane.tsx`, `DesignerPaneTitle.tsx`, `DesignerPaneContent.tsx` — with `showFor` prop system (see §5.1). Replaces the conditional `selectedLayer?.type === 'text' && <TextActions />` patterns Pappery currently has inlined in `DesignerProperties.tsx`.
- [ ] P3.11 — **Build new:** `DesignerToolbarGroup.tsx`, `DesignerToolbarButton.tsx`, `DesignerToolbarSeparator.tsx` — decompose Pappery's monolithic toolbar into reusable primitives.

**Generic hooks (read Pappery, generalize):**
- [ ] P3.12 — Read Pappery's `hooks/useHistory.ts`. Reimplement in `packages/designer/src/hooks/useHistory.ts` as generic `useHistory<T>` (see §5.2) — strip all `Layer` type references; the hook should know nothing about what it stacks.
- [ ] P3.13 — Read Pappery's `hooks/useDesignerKeybindings.ts`. Reimplement in `packages/designer/src/hooks/useKeybindings.ts` as a generic registry — accepts `KeybindingConfig[]` not `DesignerState` (see §5.3).

**Barrel export:**
- [ ] P3.14 — Create `packages/designer/src/index.ts` exporting all components and hooks.

**Catalog integration test:**
- [ ] P3.15 — Create `apps/catalog/src/app/designer/page.tsx` — a page that mounts `DesignerShell` with panels and a toolbar using **no canvas components**. Demo data is plain strings/numbers. Serves as proof the shell is engine-agnostic.

### Exit Validation

```bash
turbo build --filter=@hilum/designer # exits 0, dist/ produced
turbo typecheck                        # zero errors

# Manual test — visit /designer in catalog:
# DesignerShell renders with Toolbar, Panel, and Pane components
# Pane showFor predicate works correctly
# useHistory<string[]> works (undo/redo with string array as test data)
# useKeybindings fires callbacks on correct key combos

# Critical check:
grep -r "useDesignerState\|DesignerContext\|useDesigner" packages/designer/src
# → must return no matches. The shell must not import from designer-canvas.
```

---

## 13. Phase 4 — `@hilum/designer-canvas` Package

**Goal:** Generic free-positioned canvas engine shipped as `@hilum/designer-canvas`. The catalog mounts an interactive canvas demo with toy layers to prove the engine works standalone. Pappery's existing canvas is read as reference and reimplemented in generic form (per §1.2).  
**Duration:** 2–3 weeks (highest risk phase)  
**Prerequisites:** Phase 3 complete

> **Reference path:** All "read from Pappery" tasks target `/Documents/Pappery/apps/frontend/src/components/designer/`. Pappery is not modified.

### Tasks

**Package scaffolding:**
- [ ] P4.1 — Create `packages/designer-canvas/` with `package.json`, `tsconfig.json`, `tsup.config.ts`.
- [ ] P4.2 — Set peer deps: `react`, `react-dom`, `@hilum/ui`, `@hilum/designer`.

**Generic canvas state (read Pappery's `DesignerContext.tsx`, build slim version):**
- [ ] P4.3 — Create `packages/designer-canvas/src/context/CanvasContext.tsx`. Read Pappery's `DesignerContext.tsx` and reimplement with:
  - **Excluded:** `productType`, `unitSystem`, `dpi`, `bindingType`, `bindingPosition`, `bindingSize`, `pageMargin`, `bleed` (Pappery domain — apps inject via `appConfig` prop or their own context).
  - **Excluded:** `activeTool`, `selectedLayerIds` → delegate to ShellContext from `@hilum/designer`.
  - **Excluded:** `history`, `historyIndex`, `canUndo`, `canRedo` → delegate to `useHistory<Layer[]>` from `@hilum/designer`.
  - **Included:** layer CRUD, zoom/pan, frameSize, grid, clipboard, artboard settings, ui/canvas/accent color.
- [ ] P4.4 — Read Pappery's `reducer.ts` and reimplement the slim version. Drop Pappery-specific action types (`SET_PRODUCT_TYPE`, `SET_BINDING_TYPE`, etc.) — the package-level reducer handles only generic actions.
- [ ] P4.5 — Wire CanvasContext to ShellContext: on layer selection change → call `setSelectedIds()` on ShellContext. On tool change → read `activeTool` from ShellContext.
- [ ] P4.6 — Build `CanvasProvider.tsx` (renamed from Pappery's `DesignerProvider`). It wraps `ShellProvider` from `@hilum/designer` inside itself.

**Generic types:**
- [ ] P4.7 — Define a generic `Layer` type in `packages/designer-canvas/src/types/`: `id`, `type: string`, `x`, `y`, `width`, `height`, `rotation?`, `opacity?`, `data: Record<string, unknown>`. Apps narrow `type` and `data` for their own layer kinds. Read Pappery's `types/types.ts` as reference but don't import its concrete `LayerType` enum — the package stays open.

**Components (read Pappery, reimplement generic):**
- [ ] P4.8 — Reimplement `DesignerCanvas.tsx` (pan/zoom viewport).
- [ ] P4.9 — Reimplement `DesignerFrame.tsx` (interactive layer container).
- [ ] P4.10 — **Build new:** `DesignerStaticFrame.tsx` — read-only render of layers with no interaction hooks. Used for dashboard thumbnails. Uses the same layer renderers but no event handlers, no selection, no drag/resize.
- [ ] P4.11 — Reimplement all overlay components (GridOverlay, SnapGuidesOverlay, MarqueeOverlay, LayerSelectionOverlay, DragGhost, CanvasWithBackgroundClick).

**Hooks (read Pappery's `hooks/` and `interaction/`, reimplement generic):**
- [ ] P4.12 — Reimplement layer hooks: `useLayers`, `useLayersWithStyles`, `useSelectedLayer`, `useSelectedLayers`, `useSelectedLayerIds`, `useIsLayerSelected`. Wire `useHistoryActions` to delegate to `@hilum/designer`'s `useHistory<Layer[]>`.
- [ ] P4.13 — Reimplement interaction hooks: `useDragInteraction`, `useResizeInteraction`, `useTextEditInteraction`, `useMarqueeInteraction`. These should operate on the generic `Layer` shape.

**Renderers (pluggable, not bundled):**
- [ ] P4.14 — Build a renderer registry: apps register their own renderers per `layer.type`. The package ships **no concrete renderers** — Pappery's `ProTextRenderer`, `ShapeRenderer`, `RegionRenderer`, `UniversalWidgetRenderer` stay in Pappery because they depend on Pappery's layer schema and WASM services.
- [ ] P4.15 — Define the `LayerRenderer` interface and `useLayerRenderer` hook so apps can plug in their renderers. Document the contract in the package README.
- [ ] P4.16 — Define the WASM service interface (per P0.6) for geometry/font services. The package consumes these via injection — Pappery passes its WASM-backed implementation; the package itself is WASM-free.

**Actions (read Pappery's 55 actions, build a generic subset):**
- [ ] P4.17 — Reimplement only the **generic** actions that operate on the `Layer` shape: opacity, alignment (center, distribute), z-order (front/back), fill color, stroke, rotation, position, size, lock, visibility, duplicate, delete, group/ungroup. ~25–30 of Pappery's 55 actions are generic in this sense.
- [ ] P4.18 — Pappery-specific actions (`ActionDPISelector`, `ActionUnitSelector`, `ActionExport`, `ActionBinding*`, font picker, anything that touches `productType`/`dpi`) **stay in Pappery**. They depend on Pappery-specific app state that doesn't exist in the package.
- [ ] P4.19 — Update all package actions to import UI primitives from `@hilum/ui`.

**Barrel export:**
- [ ] P4.20 — Create `packages/designer-canvas/src/index.ts`.

### Exit Validation

```bash
turbo build --filter=@hilum/designer-canvas  # exits 0, dist/ produced
turbo typecheck                                 # zero errors

# Catalog demo at /designer/canvas:
# - mounts <Designer defaultLayers={[<3 toy rect/text layers>]} frameSize={{width:600, height:400}}>
#           <DesignerCanvas><DesignerFrame /></DesignerCanvas>
#         </Designer>
# - registers a trivial RectRenderer + TextRenderer at the app layer
# - drag a layer, resize it, undo/redo, marquee select, zoom — all functional

# Critical check — no Pappery-specific concepts leaked:
grep -rE "productType|bindingType|bleed|dpi|unitSystem" packages/designer-canvas/src
# → must return no matches.

grep -rE "ProTextRenderer|UniversalWidgetRenderer|GeometryService|FontService" packages/designer-canvas/src
# → must return no matches (interface definitions only — no concrete implementations).
```

---

## 14. Pappery Integration — Out of Scope

Migrating Pappery to consume `@hilum/*` is **not part of this plan**. After Phase 7 publishes the packages, Pappery's team takes the following on its own schedule (in its own repo, in its own PRs):

1. Add `@hilum/ui`, `@hilum/app-shell` (where relevant), `@hilum/designer`, and `@hilum/designer-canvas` to `package.json` and authenticate against the registry from D3.
2. Create `apps/frontend/src/context/PapperyDesignerConfig.tsx` (or equivalent) — a Pappery-specific provider that owns `productType`, `unitSystem`, `dpi`, `bindingType`, `bindingPosition`, `bindingSize`, `pageMargin`, `bleed`. These never live in Hilum UI.
3. Update Pappery-specific actions (`ActionDPISelector`, `ActionUnitSelector`, `ActionExport`, binding actions) to read from the new config provider instead of the old `DesignerContext`.
4. Register Pappery's renderers (`ProTextRenderer`, `ShapeRenderer`, `RegionRenderer`, `UniversalWidgetRenderer`) with `@hilum/designer-canvas`'s renderer registry (P4.14). Pass Pappery's WASM-backed `GeometryService` and `FontService` implementations through the service-injection interface (P4.16).
5. Replace imports — `@/components/designer/*` → `@hilum/designer*`, `@/components/ui/*` → `@hilum/ui`, etc.
6. Delete `apps/frontend/src/components/designer/` once all references are gone.
7. Run feature parity checklist (drag, resize, text edit, undo/redo, copy/paste, snap guides, marquee, zoom, keyboard shortcuts) and confirm no regressions.

If Pappery hits a blocker (missing primitive, broken contract, surprise coupling), Hilum UI cuts a patch release on the affected package. The integration is the final validation that the packages are correctly designed — but it happens **after** Hilum UI 1.0.0 ships.

---

## 15. Phase 6 — Design Catalog Integration

**Goal:** The catalog documents and showcases all four packages. Engineers and designers building new Hilum apps have a complete reference.  
**Duration:** 1 week  
**Prerequisites:** Phase 4 complete

### Tasks

- [ ] P6.1 — Add a "Designer" section to `apps/catalog` sidebar alongside Atoms, Molecules, Blocks, App Shells.
- [ ] P6.2 — Create `apps/catalog/src/app/designer/shell/page.tsx` — showcase `DesignerShell`, `DesignerPanel`, `DesignerPane`, `DesignerPaneTitle`, `DesignerPaneContent`.
- [ ] P6.3 — Create `apps/catalog/src/app/designer/toolbar/page.tsx` — showcase `DesignerToolbar`, `DesignerToolbarGroup`, `DesignerToolbarButton`, `DesignerToolbarSeparator`.
- [ ] P6.4 — Create `apps/catalog/src/app/designer/canvas/page.tsx` — live demo of `Designer` + `DesignerCanvas` + `DesignerFrame` with a simple layer set.
- [ ] P6.5 — Create `apps/catalog/src/app/designer/static-frame/page.tsx` — showcase `DesignerStaticFrame` for rendering thumbnail previews.
- [ ] P6.6 — Create `apps/catalog/src/app/designer/pane-visibility/page.tsx` — interactive demo of `showFor` with multiple layer type selection buttons.
- [ ] P6.7 — Document each package's public API in the catalog (props tables, usage examples, copy-paste code snippets).
- [ ] P6.8 — Update the catalog home page counts and section cards to include the Designer section.
- [ ] P6.9 — Update `MEMORY.md` and memory files to reflect the new Designer section in the catalog.

### Exit Validation

```bash
pnpm --filter apps/catalog build       # exits 0
# Visit /designer/shell — DesignerShell renders with panels and panes
# Visit /designer/canvas — interactive canvas demo works
# Visit /designer/static-frame — layer thumbnails render correctly
# All code snippets in PreviewBlock are copy-pasteable and correct
```

---

## 16. Phase 7 — Production Hardening

**Goal:** Packages are versioned, tested, and publishable. CI enforces quality.  
**Duration:** 1 week  
**Prerequisites:** Phase 6 complete

### Tasks

**Versioning:**
- [ ] P7.1 — Install `changesets` at monorepo root: `pnpm add -D @changesets/cli`.
- [ ] P7.2 — Run `pnpm changeset init`. Configure for **lockstep / fixed versioning** (D4): set `"fixed": [["@hilum/ui", "@hilum/app-shell", "@hilum/designer", "@hilum/designer-canvas"]]` in `.changeset/config.json` so all packages publish at the same version on every release.
- [ ] P7.3 — Document the change workflow: every PR that touches a package must include a changeset file.

**Testing:**
- [ ] P7.4 — Add `vitest` to each package. Write unit tests for:
  - `useHistory<T>` — push, undo, redo, boundary conditions
  - `useKeybindings` — key combination matching, custom override
  - `DesignerPane showFor` — predicate evaluation
  - Canvas reducer — every action type
- [ ] P7.5 — Target: 80% coverage on `@hilum/designer` hooks. Canvas renderer tests are lower priority.

**CI:**
- [ ] P7.6 — GitHub Actions workflow:
  ```yaml
  on: [pull_request]
  jobs:
    ci:
      steps:
        - pnpm install
        - turbo typecheck
        - turbo test
        - turbo build
  ```
- [ ] P7.7 — Add `changeset status` check to CI — PRs touching packages without a changeset fail.

**Publishing:**
- [ ] P7.8 — If using GitHub Packages: configure `publishConfig` in each `package.json`. Add publish workflow triggered on `main` merge.
- [ ] P7.9 — If workspace-only: skip publishing, rely on `workspace:*` protocol forever.

**Documentation:**
- [ ] P7.10 — Each package gets a `README.md` with: installation, quick start, props reference, Tailwind setup instructions.

### Exit Validation

```bash
turbo test                             # all tests pass
turbo build                            # all packages build clean
pnpm changeset status                  # no unpublished changesets (or expected ones only)
# GitHub Actions CI: green on main branch
```

---

## 17. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| WASM coupling sneaks into `designer-canvas` | High | High | Define the service interface in P0.6, enforce in P4.16. Add a CI grep that fails the build if `wasm` strings appear in package source. |
| Tailwind class purging misses package source | Medium | Medium | Add explicit `@source` directives. Run visual smoke tests against the catalog before/after each phase. |
| Pappery-specific concepts leak into the package (productType, dpi, layer-type assumptions) | High | Medium | P0.3 / P0.4 audits identify them upfront. Phase 4 exit validation greps the package for those keywords; CI re-runs the grep on every PR. |
| Generic `useHistory<T>` breaks undo in edge cases | Medium | High | Read Pappery's existing history tests as input cases. Port the same sequences into the package's vitest suite (P7.4) before shipping. |
| React version mismatch between Hilum packages and consumer apps | Low | High | Pin React to exact major in peer deps. Both this repo and Pappery currently on 19. |
| Breaking change in `@hilum/ui` ripples to all consumers at once | Medium | Medium | Lockstep versioning (D4) — all packages bump together; semver enforced via Changesets. A single major bump is the contract for any breaking change anywhere in Hilum UI. Pappery and others control their upgrade cadence by pinning to a major. |
| Visual regression slips through manual review (D17 risk) | Medium | High | No automated visual diff means CSS changes can silently break the catalog or consumer apps. Mitigation: small, focused PRs; reviewer must visit `ui.hilum.dev` preview before approving. Revisit Chromatic if regressions become recurring. |
| A11y compliance gap (D16 risk) | Low–Medium | Variable | No formal WCAG commitment; a Hilum app sold into a market with regulatory a11y requirements (EU EAA, US Section 508) may need to add its own a11y layer. Radix primitives keep the floor reasonable but not certified. Revisit if a regulated market becomes a target. |
| Pappery integration (out of scope) reveals an API design flaw | Medium | Medium | Treat the Pappery integration as the real-world test of the API. Cut a patch release on whatever package is wrong; do not block other consumers. |
| Pappery audit (P0.2–P0.4) misses a coupling and we discover it mid-phase | Medium | Medium | The audits are checklists, not guarantees. Budget 1–2 buffer days inside Phases 3 and 4 for unforeseen abstractions. |

---

## 18. Open Questions

All architectural and product decisions are now resolved in §2.1 (D1–D19). The two remaining questions below are implementation-detail choices made inside their phase.

| Q | Relevant Phase | Question |
|---|---|---|
| Q4 | Phase 3 | Does `DesignerPane`'s `showFor` resolve layer-type → category via ShellContext, or via a render-prop the app supplies? |
| Q8 | Phase 4 | Does `@hilum/designer-canvas` ship a default `RectRenderer` and `TextRenderer` for the catalog demo, or are renderers always app-supplied? |

**Pappery-internal questions (out of scope of this plan, listed for Pappery's team):**

| Q | Pappery decides |
|---|---|
| ~~Q2~~ | Whether `GeometryService` becomes a separate `@pappery/geometry` package or stays in `apps/frontend/src/wasm/`. Hilum UI does not require either choice. |
| ~~Q3~~ | Whether the `widgets/` folder (CalendarComponent, Checklist, HabitTracker) ever gets shared. Hilum UI does not host them. |
| ~~Q7~~ | Whether `ActionExport` (PDF generation) stays as an action component or moves to Pappery's app layer. Either way, it does not live in `@hilum/designer-canvas`. |

---

## 19. Timeline Summary

| Phase | Name | Duration | Cumulative |
|---|---|---|---|
| 0 | Preparation & Pappery audit | 3–5 days | Week 1 |
| 1 | Monorepo Foundation | 2–3 days | Week 1–2 |
| 2 | `@hilum/ui` | 1–2 weeks | Week 2–3 |
| 2.5 | `@hilum/app-shell` | 1 week | Week 3–4 |
| 3 | `@hilum/designer` Shell | 1–2 weeks | Week 4–6 |
| 4 | `@hilum/designer-canvas` | 2–3 weeks | Week 6–9 |
| 6 | Catalog Integration | 1 week | Week 9–10 |
| 7 | Production Hardening + publish | 1 week | Week 10–11 |

**Total: 10–11 weeks** with a single engineer. Can compress to 6–7 weeks with two engineers.

Parallelism opportunities (after Phase 2 ships):
- **Phase 2.5** and **Phase 3** are independent — both depend only on `@hilum/ui`. Run in parallel.
- **Phase 4** depends on Phase 3.
- **Phase 6** (catalog docs) can start incrementally as each package ships, not only at the end.

**Pappery integration** (§14) happens *after* Phase 7 publishes, on Pappery's own schedule, in Pappery's own repo. Not counted in this timeline.

---

*This document should live at the monorepo root once Phase 1 is complete. Update it as decisions are resolved and phases are marked done.*
