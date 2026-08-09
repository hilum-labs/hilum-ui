# @hilum/designer

Engine-agnostic canvas-editor chrome. Provides the shell, toolbar, side panels, collapsible panes, and generic hooks (undo/redo stack, keyboard shortcuts) — works with any kind of editing surface (free-positioned canvas, form builder, layout editor, code editor).

For the actual canvas (pan/zoom viewport, layers, drag/resize), use `@hilum/designer-canvas` on top.

## Components

- `<DesignerShell>` — root layout (full viewport, themed)
- `<DesignerWorkspace>` / `<DesignerWorkspaceViewport>` — floating-chrome positioning boundary and safe canvas region
- `<DesignerHeader>` / `<DesignerSidebar>` / `<DesignerPanel>` — chrome
- `<DesignerPane>` — collapsible property panel section with `showFor` predicate
- `<DesignerToolbar>` + `Group` / `Button` / `Separator` — composable toolbar

## Floating workspace

Use the workspace primitives when desktop editor chrome should float over a
full-bleed surface. `safeInsets` define the unobscured region used by the
canvas for fit and center calculations.

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

- `useHistory<T>(initial)` — generic undo/redo stack
- `useKeybindings(config)` — keyboard shortcut registry
- `useShellContext()` — selection, active tool, read-only flag
