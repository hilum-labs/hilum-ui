# @hilum/designer

Engine-agnostic canvas-editor chrome. Provides the shell, toolbar, side panels, collapsible panes, and generic hooks (undo/redo stack, keyboard shortcuts) — works with any kind of editing surface (free-positioned canvas, form builder, layout editor, code editor).

For the actual canvas (pan/zoom viewport, layers, drag/resize), use `@hilum/designer-canvas` on top.

## Components

- `<DesignerShell>` — root layout (full viewport, themed)
- `<DesignerHeader>` / `<DesignerSidebar>` / `<DesignerPanel>` — chrome
- `<DesignerPane>` — collapsible property panel section with `showFor` predicate
- `<DesignerToolbar>` + `Group` / `Button` / `Separator` — composable toolbar

## Hooks

- `useHistory<T>(initial)` — generic undo/redo stack
- `useKeybindings(config)` — keyboard shortcut registry
- `useShellContext()` — selection, active tool, read-only flag
