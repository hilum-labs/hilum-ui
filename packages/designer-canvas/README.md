# @hilum/designer-canvas

Generic free-positioned canvas engine for Hilum apps, built on `@hilum/designer`. It provides a typed `Layer` model and reducer, a pan/zoom viewport, drag-to-move, marquee selection, shared undo/redo, keyboard shortcuts, and 11 toolbar action components.

The package ships **no concrete renderers**. Apps register one per layer type.

```tsx
import {
  Designer,
  DesignerCanvas,
  DesignerFrame,
  ActionUndoRedo,
  ActionZoom,
} from "@hilum/designer-canvas";
import { DesignerToolbar } from "@hilum/designer";

<Designer
  initial={{ layers, frameSize: { width: 800, height: 600 }, layerTypes }}
  renderers={{ rect: RectRenderer, text: TextRenderer }}
  onChange={(state) => save(state.layers)}
>
  <DesignerToolbar>
    <ActionUndoRedo />
    <ActionZoom />
  </DesignerToolbar>
  <DesignerCanvas>
    <DesignerFrame />
  </DesignerCanvas>
</Designer>;
```

## Providers

- `<Designer>` mounts `<CanvasProvider>` and `<RendererProvider>`, and wires the keyboard shortcuts. It takes `initial`, `renderers`, `services`, `readOnly`, `onChange`, `keyboardShortcuts` (default `true`) and `historyLimit` (default `100`).
- `<CanvasProvider>` mounts `ShellProvider` from `@hilum/designer` (selection, active tool, read-only), the canvas state (`useCanvasContext()` returns `{ state, dispatch, services, revision }`) and one shared layer history.
- `<RendererProvider renderers={{ [layer.type]: Component }}>` is the renderer registry. A renderer receives `{ layer, ctx: { selected, zoom, readOnly } }`. Position, size, rotation, opacity and flips are applied by the package's wrapper element.

## Components

- `<DesignerCanvas>` is the pan/zoom viewport:
  - Wheel or trackpad scrolling pans, and Shift+wheel pans horizontally.
  - Ctrl/Cmd+wheel or a trackpad pinch zooms, clamped to 0.05–32.
  - Dragging pans when the `hand` tool is active, while Space is held, or with the middle mouse button.
- `<DesignerFrame>` is the interactive artboard:
  - Renders every layer.
  - Click selects a layer and Shift+click adds to the selection.
  - Dragging moves the selection (unlocked layers only). Shift locks the drag to one axis.
  - Clicking the background clears the selection.
  - Also renders the selection outlines, the marquee and an optional grid (`showGrid`).
- `<DesignerStaticFrame>` is a read-only render with no overlays, for thumbnails and previews.

## Overlays

- `LayerSelectionOverlay` draws outline rectangles around the selected layers. It has no resize or rotate handles.
- `MarqueeOverlay` handles drag selection on the frame background. It selects visible layers whose unrotated bounding box intersects the box, and Shift adds to the current selection.
- `GridOverlay` draws a dashed cell grid from `state.gridContainer`.

## Actions

There are 11 toolbar components, each built on `DesignerToolbarButton`:

| Component         | Does                                                                          |
| ----------------- | ----------------------------------------------------------------------------- |
| `ActionAddLayer`  | One "Add" button per entry in `state.layerTypes`                              |
| `ActionAlign`     | Align left/center/right/top/middle/bottom; distribute horizontally/vertically |
| `ActionArrange`   | Bring to front / forward, send backward / to back                             |
| `ActionDelete`    | Delete selected layers                                                        |
| `ActionDuplicate` | Copy + paste selected layers (offset 16px)                                    |
| `ActionGroup`     | Group / ungroup (sets `groupId`)                                              |
| `ActionLock`      | Toggle `isLocked` / `isVisible`                                               |
| `ActionTool`      | Select / hand tool switcher (`tools` prop to override)                        |
| `ActionTransform` | Flip horizontal / vertical                                                    |
| `ActionUndoRedo`  | Undo / redo using the shared history                                          |
| `ActionZoom`      | Zoom out / reset / in, with the current zoom shown                            |

Anything else can be done with `dispatch` from `useCanvasContext()`. The reducer (`canvasReducer`) handles 32 action types:

- Layer CRUD
- Nudge, align, distribute, group, arrange, flip and set-property
- Zoom, pan and frame size
- Artboard name, color, opacity and clip
- Grid container
- Theme colors
- Copy and paste
- Read-only

Mutating actions no-op while `readOnly` is set.

## History

`CanvasProvider` owns one history per canvas, so every `<ActionUndoRedo>`, the keyboard shortcuts and app code share the same stack. Use `useHistoryActions()` (or `useCanvasHistory()`) to get `{ undo, redo, canUndo, canRedo, beginTransaction, commitTransaction, cancelTransaction }`.

- Each committed change to `state.layers` is one undo step.
- A drag gesture is grouped into one step.
- Wrap your own multi-dispatch gestures in `beginTransaction()` / `commitTransaction()` to group them the same way.
- The depth is capped by `historyLimit`, which defaults to 100.
- Only layers are tracked. Viewport, selection and artboard settings are not.

## Keyboard shortcuts

`<Designer>` enables these by default. Pass `keyboardShortcuts={false}` to turn them off, or call `useCanvasKeyboardShortcuts()` yourself when using `<CanvasProvider>` directly. Mod is Cmd on macOS and Ctrl elsewhere. Shortcuts are ignored while typing in inputs.

| Shortcut                    | Action                    |
| --------------------------- | ------------------------- |
| Mod+Z / Mod+Shift+Z / Mod+Y | Undo / redo / redo        |
| Delete, Backspace           | Delete selected layers    |
| Mod+A                       | Select all visible layers |
| Arrow keys (Shift ×10)      | Nudge selected layers     |
| Mod+D                       | Duplicate                 |
| Mod+G / Mod+Shift+G         | Group / ungroup           |
| Mod+= / Mod+- / Mod+0       | Zoom in / out / reset     |
| V / H                       | Select / hand tool        |
| Space (hold)                | Pan while dragging        |

In read-only mode only the non-mutating shortcuts (select all, zoom, tools) are active.

## Hooks

- `useLayers`, `useLayer`, `useSelectedLayerIds`, `useSelectedLayers`, `useSelectedLayer`, `useIsLayerSelected`
- `useZoom()` returns `zoom`, `setZoom`, `zoomIn`, `zoomOut`, `resetZoom` and `fitZoom`.
- `useDragInteraction({ layerId, scale })` provides pointer-drag for custom layer views.
- `useHistoryActions()` / `useCanvasHistory()` expose the shared undo/redo.
- `useCanvasKeyboardShortcuts({ disabled?, nudge? })` wires the shortcuts above.

## Services

`services` (`paths`, `fonts`, `units`, `uploadImage`) are optional interfaces that are passed through context so app renderers and panels can use them through `useCanvasContext().services`. The package itself doesn't call them and bundles no implementation.
