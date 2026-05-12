# Phase 0 Audit — Pappery Reference Survey

> **Status:** Complete — 2026-05-04
> **Reference source:** `/Users/william/Documents/Pappery/apps/frontend/` (read-only — Pappery is not modified by this audit or any subsequent phase. See `PLATFORM_PLAN.md` §1.2.)
> **Output:** authoritative punch lists for Phases 2, 3, and 4. Cross-referenced from those phases in `PLATFORM_PLAN.md`.

This document is the result of P0.2–P0.6. It tells later phases exactly what to build, what to copy, what to generalize, and what to leave alone.

---

## P0.2 — UI primitives gap analysis

Pappery has 24 UI components in `src/components/designer/ui/` that pre-date Hilum UI. Each was compared against Hilum UI's `src/components/ui/` to determine whether Phase 2 must add it, reconcile it, or leave it alone.

### Direct matches (15) — clean swap when Pappery migrates

`Checkbox`, `ContextMenu`, `Dialog`, `DropdownMenu`, `Label`, `Menubar`, `Popover`, `RadioGroup`, `Select`, `Skeleton`, `Tabs`, `Textarea`, `Toggle`, `ToggleGroup`, `Tooltip`.

All thin Radix wrappers in both repos. APIs align. No work for Phase 2.

### API mismatches (5) — reconcile before swap

| Pappery | Hilum UI | Diff | Resolution |
|---|---|---|---|
| `Button` | `button.tsx` | Pappery uses `var(--designer-selection-color)`; Hilum hardcodes `bg-brand-orange`. Hilum has additional `brand` variant + `xs`, `icon-xs/sm/lg` sizes. | Per **D8** (fully fixed brand), Pappery's `--designer-selection-color` accent disappears in v1. All Hilum apps use the brand-orange primary. |
| `Input` | `input.tsx` | Theming tokens differ (`neutral-300`/`blue-500` vs `taupe-200`/`brand-orange`). Same API. | Same as above — Pappery adopts Hilum tokens. |
| `Slider` | `slider.tsx` | Theming-only diff (range fill var vs brand-orange). | Same. |
| `InputGroup` | `input-group.tsx` | Hilum is monolithic-prop (`leadingAddon`, `trailingIcon`, `trailingButton`); Pappery is compositional-children (`<InputGroupAddon><InputGroupInput />`). | Phase 2 adds the compositional API as a parallel surface. Both styles supported; call-sites migrate either way. |
| `Action` | `field.tsx` (closest, but different intent) | Pappery's `Action` is a horizontal property-row for inspector panels; Hilum's `Field` is a vertical form field with hint/error. | Phase 2 adds a new `PropertyRow` primitive to Hilum UI alongside `Field`. Different intent → different component. |

### Gaps (3) — Phase 2 must build

| New component | Source reference | Notes |
|---|---|---|
| `ColorPicker` | `Pappery/.../designer/ui/ColorPicker.tsx` | Full picker — swatch trigger + popover with hex input + native `<input type="color">`. |
| `InlineColorPicker` (or compact `ColorInput` variant) | `Pappery/.../designer/ui/InlineColorPicker.tsx` | Compact panel-friendly variant — color + opacity slider + hex. Used in property panels. |
| `InputNumber` | `Pappery/.../designer/ui/InputNumber.tsx` | Numeric input with steppers, drag-scrubbing on label, unit suffix prop, arrow-key step (Shift = ×10), high-value primitive. |

### Pappery-specific (1) — does not move

| Component | Reason |
|---|---|
| `FontPicker` | Tightly bound to `FontService` (Pappery's WASM-backed font registry), `useProjects`, asset-upload flow, Google/local/upload font sources. The shell pattern is generic (`Combobox` + `Popover`, both already in Hilum UI), so Pappery rebuilds the picker on top of Hilum primitives. The font-source logic stays Pappery. |

### Phase 2 punch list

```
P2.9.a  Add ColorPicker primitive          (src/components/ui/color-picker.tsx)
P2.9.b  Add InlineColorPicker / ColorInput (src/components/ui/color-input.tsx)
P2.9.c  Add InputNumber primitive          (src/components/ui/input-number.tsx)
P2.9.d  Add PropertyRow primitive          (src/components/ui/property-row.tsx)
P2.9.e  Add compositional InputGroup API   (extend src/components/ui/input-group.tsx)
P2.9.f  Catalog pages for each new atom    (atoms/color-picker, atoms/color-input,
                                            atoms/input-number, atoms/property-row)
P2.9.g  Update atoms count + sidebar entry
```

### Theming-architecture flag (resolved per D8)

Pappery currently reads from `--designer-selection-color` so its editor can have its own accent. With **D8** (Model A — fully fixed brand across all Hilum apps), this variable disappears. Pappery's editor surfaces will use `--brand-orange` like every other Hilum app. The audit recorded this for transparency; D8 already resolved the direction.

---

## P0.3 — Action classification (57 components)

Pappery has 57 `Action*.tsx` components in `src/components/designer/actions/`. Phase 4 ships the generic ones in `@hilum/designer-canvas`; the rest stay in Pappery.

### GENERIC — move to `@hilum/designer-canvas` (43)

These have **zero Pappery domain coupling** and operate on properties any layer-canvas app would have.

| Category | Actions |
|---|---|
| **Layer mutation** | `ActionDelete`, `ActionLayerName` |
| **Add layer** | `ActionAddText`, `ActionAddShape`, `ActionToolbarAddLayer` |
| **Tools** | `ActionToolSelect`, `ActionToolHand`, `ActionToolZoom` |
| **History** | `ActionUndo`, `ActionRedo`, `ActionToolbarHistory` |
| **Zoom** | `ActionZoom`, `ActionToolbarZoom` |
| **Transform / geometry** | `ActionRotate`, `ActionFlip`, `ActionAnchorPoint` |
| **Fill / stroke / shadow** | `ActionFill`, `ActionBorder`, `ActionBoxShadow`, `ActionShapeColor`, `ActionShapeBorder`, `ActionShapeShadow`, `ActionCorner`, `ActionOpacity` |
| **Layout** | `ActionPadding`, `ActionAlignItems`, `ActionDirection` |
| **Text** | `ActionColor`, `ActionFont`, `ActionFontSize`, `ActionFontStyle`, `ActionTextAlign`, `ActionTextDecoration`, `ActionTextDecorationPattern`, `ActionTextShadow`, `ActionTextStroke`, `ActionTextTransform`, `ActionTextValue`, `ActionLetterSpacing`, `ActionLineHeight` |
| **Image** | `ActionImage`, `ActionImageBrowser`, `ActionImageCropper`, `ActionImageFilter`, `ActionImageFit`, `ActionImageUrl` |

**Companion file moves:**
- `Pappery/.../lib/shapeStyle.ts` — used by `ActionShapeColor/Border/Shadow`, `ActionCorner`, `ActionOpacity`. Pure CSS-var parsing, no Pappery deps. Move to `packages/designer-canvas/src/lib/shapeStyle.ts` alongside the actions.

### PAPPERY-SPECIFIC — stays in Pappery (4)

| Action | Why it stays |
|---|---|
| `ActionDPISelector` | Reads/writes print DPI (`useDesignerDpi`). Print-only concept. |
| `ActionUnitSelector` | Sets `state.unitSystem` (mm / cm / in / pt). Print-only concept. |
| `ActionExport` | Exports a Pappery `Design` with `productType` and print-domain `frameSize`. |
| `ActionGridToggle` | Operates on Pappery's `GridContainer` page-grid concept (`DEFAULT_PAGE_GRID`). The grid *primitive* in `@hilum/designer-canvas` is generic; this specific toggle wires Pappery's page-grid defaults, so it stays. Apps with their own grid presets ship their own toggle. |

### EDGE CASES — refactor before moving (6)

These are generic in shape but currently couple to Pappery via a side-helper. Each gets a small abstraction so the generic version lives in the package and Pappery overrides.

1. **`ActionPosition`, `ActionSize`** — Logic is fully generic (writes `--translate-x/y`, `--width/height`). Display values are converted via Pappery's `useUnitSystem` + `useDPI` and `lib/units`. **Resolution:** generic action accepts a `unitConverter` prop. Default identity (px ↔ px). Pappery wires `mm`/`in`/`pt`/etc. through its own converter.

2. **`ActionFontFamily`, `ActionFontWeight`** — Generic intent (write `--font-family`, `--font-weight`). Currently use Pappery's `FontPicker` + `FontService` (WASM font registry). **Resolution:** ship a "plain" version that uses CSS web-safe fonts + system fonts. Apps override via a `fontProvider` plugin (interface in `useCanvasServices().fonts`, see P0.6). Pappery passes its WASM-backed implementation.

3. **`ActionTextWarp`, `ActionTransformation`** — UI just writes `--warp-type` / `--warp-amount` cssVars (declarative, generic). The actual warp *rendering* is a renderer-side concern, not action-side. **Resolution:** actions are generic and ship in the package; renderers that don't support warp treat `--warp-type` as no-op. Pappery's renderer (which calls WASM `warpPath`) honours it.

4. **`ActionAddImage`** — Generic in shape (creates an image layer). Currently bundles upload to Pappery's `/api/assets/upload` + Tauri detection + auth token. **Resolution:** extract a generic `ActionAddImage` accepting an `uploadImage(file): Promise<{ url: string; ... }>` prop. Default to `URL.createObjectURL` (in-memory blob URL). Pappery passes its uploader.

### Action classification summary

| | Count |
|---|---|
| Total audited | 57 |
| GENERIC (move to package) | 43 |
| EDGE CASES (refactor → move) | 6 |
| PAPPERY-SPECIFIC (stay in Pappery) | 4 |
| Total going into `@hilum/designer-canvas` | **49** |

Phase 4 P4.17 is now precisely scoped: 49 generic actions, 4 service-injection abstractions to define (`unitConverter`, `fontProvider`, `uploadImage`, renderer-side warp), and one helper file to relocate (`shapeStyle.ts`).

---

## P0.4 — State, reducer, and Layer shape

### State shape (31 fields in Pappery's `DesignerState`)

Classification:

| GENERIC (16) | PAPPERY-SPECIFIC (9) | MOVES TO SHELL (6) |
|---|---|---|
| `layers` | `productType` | `selectedLayerIds` |
| `zoom` | `unitSystem` | `activeTool` |
| `panX`, `panY` | `dpi` | `mode` |
| `frameSize` | `bindingType` | `history` |
| `gridContainer` | `bindingPosition` | `historyIndex` |
| `clipboard` (→ `copiedLayers`) | `bindingSize` | `canUndo`, `canRedo` |
| `artboardName`/`Color`/`Opacity`/`ClipContent` | `pageMargin` | |
| `uiColor`, `canvasColor`, `accentColor` | `bleed` | |
| `layerTypes` (renderer registry) | | |
| `readOnly` | | |

The slim package state for `@hilum/designer-canvas`:

```ts
interface CanvasState<TLayerData = Record<string, unknown>> {
  layers: Layer<TLayerData>[]
  zoom: number
  panX: number
  panY: number
  frameSize: { width: number; height: number }
  gridContainer?: GridContainer
  copiedLayers: Layer<TLayerData>[] | null
  artboardName: string
  artboardColor: string
  artboardOpacity: number
  artboardClipContent: boolean
  uiColor: 'light' | 'mid' | 'dark'
  canvasColor: 'light' | 'mid' | 'dark'
  accentColor: string
  layerTypes: LayerType[]   // renderer registry — apps register their kinds
  readOnly: boolean
}
```

Pappery layers its own slice on top with `productType`, `unitSystem`, `dpi`, etc. — fully out of `@hilum/*`.

### Reducer action types (47 in Pappery)

| GENERIC (most) | PAPPERY-SPECIFIC (8) | MOVES TO SHELL (~12) |
|---|---|---|
| `SET_LAYERS`, `ADD_LAYER`, `UPDATE_LAYER(S)`, `DELETE_LAYER`, `REORDER_LAYERS` | `SET_UNIT_SYSTEM`, `SET_DPI`, `SET_PRODUCT_TYPE` | `SELECT_LAYER`, `SELECT_LAYERS`, `TOGGLE_LAYER_SELECTION`, `CLEAR_SELECTION`, `SELECT_ALL` |
| `SET_ZOOM`, `SET_PAN`, `SET_FRAME_SIZE` | `SET_BINDING_TYPE`, `SET_BINDING_POSITION`, `SET_BINDING_SIZE` | `SET_ACTIVE_TOOL` |
| `SET_ARTBOARD_*`, `SET_UI_COLOR`, `SET_CANVAS_COLOR`, `SET_ACCENT_COLOR` | `SET_PAGE_MARGIN`, `SET_BLEED` | `UNDO`, `REDO`, `PUSH_HISTORY` |
| `COPY_SELECTED_LAYERS`, `PASTE_LAYERS` | | `CUT_SELECTED_LAYERS`, `DELETE_SELECTED_LAYERS`, `DUPLICATE_SELECTED_LAYERS` |
| `ALIGN_LAYERS`, `DISTRIBUTE_LAYERS`, `NUDGE_SELECTED_LAYERS` | | |
| `GROUP_SELECTED_LAYERS`, `UNGROUP_SELECTED_LAYERS` | | |
| `ARRANGE_LAYERS`, `TRANSFORM_LAYERS` | | |
| `SET_GRID_CONTAINER`, `CLEAR_GRID_CONTAINER`, `UPDATE_GRID_CONTAINER`, `SYNC_GRID_CONTAINER` | | |

### Critical refactor — explicit `targetLayerIds`

Pappery's selection-driven actions (`ALIGN_LAYERS`, `GROUP_SELECTED_LAYERS`, `NUDGE_SELECTED_LAYERS`, `ARRANGE_LAYERS`, `TRANSFORM_LAYERS`, `PASTE_LAYERS`) currently read `selectedLayerIds` from canvas state. Once selection moves to ShellContext (per D11 / Phase 3), the canvas reducer can no longer read selection.

**Resolution:** these actions accept an explicit `targetLayerIds: string[]` payload. The shell reads its own selection and passes the ids in. The canvas reducer becomes selection-agnostic — required by the §1.1 reusability rule.

### Layer shape — recommended generic type

Pappery's `Layer` stores geometry inside `cssVars: Record<string, string>` (`--translate-x`, `--translate-y`, `--width`, `--height`, `--rotate`, `--opacity`, `--locked`, `--visibility`). All values are **strings**. Reducer logic parses them on every align / nudge / distribute. This is fragile and non-typed.

**Recommendation for `@hilum/designer-canvas`:**

```ts
interface Layer<TData = Record<string, unknown>> {
  id: string
  type: string           // open string — apps register kinds via layerTypes registry
  name?: string

  // First-class geometry (promoted from cssVars)
  x: number
  y: number
  width: number
  height: number
  rotation?: number
  opacity?: number

  // Common flags
  isLocked?: boolean
  isVisible?: boolean
  groupId?: string
  gridItem?: { x: number; y: number; w: number; h: number }

  // Kind-specific data — apps narrow TData per layer kind
  data: TData
}
```

Pappery specialises as `Layer<TextData | ImageData | ShapeData | GroupData | WidgetData | RegionData>` with kind-specific fields in `data`. The `widget`, `region`, `master-layer`, and print `filters` concepts never leak into the package.

This is a **real design improvement** over Pappery's current shape — it converts a string-based, untyped geometry model into a typed one. Pappery's eventual migration must flatten geometry out of `cssVars` to consume the new Layer type. Worth highlighting because the migration cost is non-trivial; mitigated by writing a small one-off Pappery-side codemod that reads existing `cssVars` and produces typed geometry.

---

## P0.5 — Tailwind v4.0 vs v4.2 compatibility

| Repo | Version |
|---|---|
| Hilum UI (this repo) | `tailwindcss: ^4.0.0` |
| Pappery | `tailwindcss: ^4.2.0` |

**Verdict:** compatible. Both within the v4 major. v4.0 → v4.2 is minor-version, no breaking changes (per Tailwind v4 changelog). All utility classes used in `@hilum/ui` (`bg-*`, `text-*`, `flex`, `grid`, etc.) are stable across the range.

**Action item for Phase 1:** bump Hilum UI's `package.json` to `tailwindcss: ^4.2.0` (or latest 4.x at the time of Phase 1) so the dev environment matches what consumers will have. Trivial change.

```diff
- "tailwindcss": "^4.0.0"
+ "tailwindcss": "^4.2.0"
- "@tailwindcss/postcss": "^4.0.0"
+ "@tailwindcss/postcss": "^4.2.0"
```

---

## P0.6 — WASM service interface

Pappery's `GeometryService` (Rust/WASM) and `FontService` (font orchestration) are not extracted into Hilum UI (per `PLATFORM_PLAN.md` §1 reusability rule — they are Pappery's domain). The package consumes them via **injected interfaces**.

Reference implementations:
- `/Users/william/Documents/Pappery/apps/frontend/src/services/GeometryService.ts`
- `/Users/william/Documents/Pappery/apps/frontend/src/services/FontService.ts`

### Interface — `packages/designer-canvas/src/services/types.ts`

```ts
/**
 * Optional services consumers may inject for advanced canvas features.
 * Apps that don't need text-on-paths, custom fonts, warps, or thumbnails
 * can omit these — basic layer rendering does not require them.
 */

export interface PathService {
  /** Boolean union of two SVG path strings. */
  union(pathA: string, pathB: string): string

  /** Generate the SVG path for text rendered in a registered font. */
  getTextPath(
    text: string,
    fontName: string,
    fontSize: number,
    options?: {
      letterSpacing?: number
      underline?: boolean
      strikethrough?: boolean
    },
  ): string

  /** Detailed metrics for laid-out text. */
  getTextMetrics(
    text: string,
    fontName: string,
    fontSize: number,
    options?: { letterSpacing?: number },
  ): TextMetrics

  /** Warp a path — arch, wave, flag, custom kinds. */
  warpPath(pathData: string, warpType: string, amount: number): string

  /** Simple shape constructors. */
  createRectangle(width: number, height: number): string
  createTriangle(width: number, height: number): string
  createCircle(radius: number): string

  /** Path effects. */
  getShadow(pathData: string, offset: number, angle: number, blur: number): ShadowResult
  getOutline(pathData: string, outlineWidth: number): OutlineResult
  getPathEffect(
    pathData: string,
    shadowType: string,
    offset: number,
    angle: number,
    blur: number,
    outlineWidth: number,
  ): PathEffectResult

  /** Pattern fills. */
  getDecorationPattern(
    pathData: string,
    pattern: string,
    lineWeight: number,
    lineDistance: number,
    baseSize: number,
  ): string

  /** Layer thumbnails (Worker-friendly). */
  renderThumbnail(
    layersJson: string,
    frameWidth: number,
    frameHeight: number,
    outputWidth: number,
    outputHeight: number,
  ): Uint8Array | null
}

export interface FontService {
  fonts: FontDescriptor[]
  loadFont(family: string, weight?: string | number): Promise<string>
  getAvailableWeights(family: string): number[]
  isFontLoaded(family: string, weight?: string | number): boolean
  getFontKey(family: string, weight?: string | number): string
}

export interface TextMetrics {
  ascent: number
  descent: number
  width: number
  height: number
  bounds: { x: number; y: number; width: number; height: number }
}

export interface ShadowResult { path: string; shadow: string; blur: number }
export interface OutlineResult { path: string; outline: string; width: number }
export interface PathEffectResult { path: string; shadow: string; needsBlur: boolean; blur: number }

export interface FontDescriptor {
  family: string
  source: string         // generic — apps define their source enum (Pappery: 'google'|'local'|'upload')
  loaded: boolean
  weights?: number[]
}

/**
 * Service container. Passed once at the canvas root. Components consume via useCanvasServices().
 * Both fields are optional. Missing services degrade specific features to no-ops; basic
 * layer rendering does not depend on either.
 */
export interface CanvasServices {
  paths?: PathService | null
  fonts?: FontService | null
}
```

### Consumption pattern

```tsx
// Pappery (its own repo, after Hilum UI publishes)
import { GeometryService, FontService } from '@/services'
import { CanvasProvider } from '@hilum/designer-canvas'

<CanvasProvider services={{ paths: GeometryService, fonts: FontService }}>
  <DesignerCanvas>...</DesignerCanvas>
</CanvasProvider>
```

```tsx
// Inside the package — package code uses services via hook
const { paths, fonts } = useCanvasServices()
if (paths) {
  const shadow = paths.getShadow(layer.data.path, 4, 90, 8)
  // ...
}
```

The package itself imports nothing from `wasm/` and bundles no `.wasm` binary. Apps that need geometry features ship the binary in their own asset pipeline.

---

## Phase 0 exit checklist

- [x] **P0.1** — D4 resolved (lockstep versioning) in `PLATFORM_PLAN.md` §2.1.
- [x] **P0.2** — Pappery UI gap analysis complete. Phase 2 punch list has 6 items (3 new components, 1 PropertyRow, 1 InputGroup API extension, 1 catalog work batch).
- [x] **P0.3** — 57 actions classified (43 generic + 6 edge-case + 4 Pappery-specific). Phase 4 punch list scoped: 49 actions go into the package, 4 service-injection abstractions to define, 1 helper file relocates.
- [x] **P0.4** — State, reducer, and Layer shape audited. Recommended generic Layer type drafted. Critical refactor flagged: action payloads change from implicit-selection to explicit `targetLayerIds`.
- [x] **P0.5** — Tailwind compat verified. Bump Hilum UI to `^4.2.0` in Phase 1 P1.x (trivial).
- [x] **P0.6** — WASM service interface drafted. `PathService` and `FontService` interfaces ready to ship in `packages/designer-canvas/src/services/types.ts` at the start of Phase 4.

**No blockers found.** Ready to begin Phase 1.

---

## Decisions surfaced for confirmation

Two non-blocking items the audit revealed. Both have a default direction; flag if you want to override.

**1. Pappery's `--designer-selection-color` accent goes away in v1.**
P0.2 found that Pappery's `Button`, `Slider`, `ColorPicker`, etc. read accent color from a designer-scoped CSS variable so the editor can have its own tint independent of brand. With **D8** (Model A — fully fixed brand), this disappears. Pappery's editor surfaces use `--brand-orange` like every other Hilum app. Default: yes, ship D8 as-is. Override only if you want the designer to keep a distinct accent.

**2. Pappery must flatten its `cssVars` geometry to consume the new `Layer` type.**
P0.4 recommends promoting `x`, `y`, `width`, `height`, `rotation`, `opacity` from `cssVars: Record<string, string>` to first-class typed fields on `Layer`. This is a real design improvement (typed, faster reducer, simpler align/distribute logic) but it adds migration cost on Pappery's side — they need a one-off codemod that reads their existing `cssVars` and produces typed geometry. Default: yes, take the improvement; the codemod is small. Override only if you want to preserve the cssVars shape (less work for Pappery, weaker types in the package).

---

*This document is the source of truth for Phase 2, 3, and 4 implementation. Update it if any decision flagged here changes.*
