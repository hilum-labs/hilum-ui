# @hilum/designer

Engine-agnostic canvas-editor chrome. Provides the shell, toolbar, side panels, collapsible panes, and generic hooks (undo/redo stack, keyboard shortcuts) — works with any kind of editing surface (free-positioned canvas, form builder, layout editor, code editor).

For the actual canvas (pan/zoom viewport, layers, drag/resize), use `@hilum/designer-canvas` on top.

## Components

- `<DesignerShell>` — root layout (full viewport, themed)
- `<DesignerWorkspace>` / `<DesignerWorkspaceViewport>` — floating-chrome positioning boundary and safe canvas region
- `<DesignerHeader>` / `<DesignerSidebar>` / `<DesignerPanel>` — chrome
- `<DesignerPanelHeader>` / `<DesignerPanelTabs>` — panel title bar and value-based tabs
- `<DesignerPane>` (+ `DesignerPaneTitle`, `DesignerPaneContent`) — collapsible property panel section with `showFor` predicate
- `<DesignerPropertyRow>` / `DesignerPropertyLabel` / `DesignerPropertyControls` / `DesignerPropertyGroup` — inspector rows
- `TwoValueControl` / `FourValueControl` / `SpacingControl` / `CornerRadiusControl` — compound numeric inputs
- `<DesignerToolbar>` + `DesignerToolbarGroup` / `DesignerToolbarButton` / `DesignerToolbarSeparator` — composable toolbar

## Floating workspace

Use the workspace primitives when desktop editor chrome should float over a
full-bleed surface. Without `safeInsets`, the viewport fills the workspace and
floating panels overlay the canvas. Add `safeInsets` when an editor instead
needs an unobscured region for fit and center calculations.

Floating rails and panels size themselves to their content. Their configured
top and bottom insets define a maximum available height; overflowing content
scrolls inside the surface instead of stretching it to the full workspace.

```tsx
<DesignerWorkspace>
  <DesignerWorkspaceViewport>{canvas}</DesignerWorkspaceViewport>

  <DesignerSidebar variant="floating" floatingInset={{ left: 0 }} items={tools} />
  <DesignerPanel side="left" variant="floating" width={280} floatingInset={{ left: 60 }}>
    {library}
  </DesignerPanel>
  <DesignerPanel side="right" variant="floating" width={304}>
    {inspector}
  </DesignerPanel>

  <DesignerToolbar boundary="workspace" center="boundary">
    {actions}
  </DesignerToolbar>
</DesignerWorkspace>
```

To reserve an unobscured canvas between the floating surfaces, configure safe
insets and center the toolbar within the same region:

```tsx
<DesignerWorkspace safeInsets={{ top: 16, right: 336, bottom: 72, left: 376 }}>
  <DesignerWorkspaceViewport>{canvas}</DesignerWorkspaceViewport>

  <DesignerSidebar variant="floating" items={tools} />
  <DesignerPanel side="left" variant="floating" width={280} floatingInset={{ left: 76 }}>
    {library}
  </DesignerPanel>
  <DesignerPanel side="right" variant="floating" width={304}>
    {inspector}
  </DesignerPanel>

  <DesignerToolbar boundary="workspace" center="safe-area">
    {actions}
  </DesignerToolbar>
</DesignerWorkspace>
```

The existing inline desktop and sheet/bottom mobile variants remain available.

## Hooks

- `useShellContext()` / `<ShellProvider>` — selection, active tool, read-only flag
- `useHistory<T>(initial, options?)` — generic undo/redo stack
- `useKeybindings(bindings, options?)` — keyboard shortcut registry

### `useHistory`

```ts
const history = useHistory<Doc>(initialDoc, { limit: 100 });

history.setState(next); // records one undo step
history.replaceState(next); // overwrites without recording
const prev = history.undo(); // returns the new present state synchronously
const next = history.redo();

// Group a gesture (e.g. a drag) into a single undo step:
history.beginTransaction();
history.setState(a); // folded into the transaction
history.setState(b);
history.commitTransaction(); // one entry; or cancelTransaction() to revert
```

`limit` caps the undo depth (default 100; oldest entries are dropped). Transactions nest; only the outermost commit records. `undo` / `redo` commit an open transaction first. `getState()` reads the latest state from event handlers.

### `useKeybindings`

```ts
useKeybindings([
  { key: "z", code: "KeyZ", mod: "platform", action: undo },
  { key: "z", code: "KeyZ", mod: "platform", shift: true, action: redo },
  { key: "delete", action: remove },
  { key: "s", mod: "platform", allowInInputs: true, action: save },
]);
```

- `key` matches `KeyboardEvent.key` (case-insensitive); `code` matches the physical `KeyboardEvent.code` (layout-independent). Either one matching is enough.
- `mod: "platform"` means Cmd on macOS/iOS and Ctrl elsewhere. `mod: true` accepts either Ctrl or Cmd. `ctrl`, `meta`, `shift` and `alt` must match exactly.
- Bindings are skipped while focus is in an input, textarea, select or contentEditable element unless the binding sets `allowInInputs: true` (`skipInputs: false` still works).
- The first matching binding wins and `preventDefault()` is called unless `preventDefault: false`.
- Bindings are read through a ref, so an inline array doesn't re-subscribe the listener on each render. Options: `disabled`, `target` (default `window`), `platform` (`"apple"` / `"other"`, default detected).
