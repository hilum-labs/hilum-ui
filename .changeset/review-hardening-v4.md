---
"@hilum/ui": major
"@hilum/app-shell": major
"@hilum/designer": major
"@hilum/designer-canvas": major
"@hilum/blocks": major
---

Platform hardening: security fixes, accessibility, admin-grade components, RTL, and leaner packaging.

## Breaking changes and migration

- **@hilum/ui: AI components moved to `@hilum/ui/ai`.** `AskUserQuestions`, `ChatMessage`, `InputMessage`, `ThinkingIndicator`, `ThinkingSteps*` and `UrlRedirectPrompt` (plus their helpers and types) are no longer exported from `@hilum/ui`. Change the import to `@hilum/ui/ai`.
- **@hilum/ui: icon libraries are opt-in.** The main entry only depends on `lucide-react`. Tabler, Phosphor, Hugeicons and Untitled UI are optional peer dependencies. To use them, install them and pass `<IconProvider libraries={iconLibraries}>` with `iconLibraries` imported from `@hilum/ui/icon-libraries`. An unregistered library falls back to Lucide.
- **@hilum/ui: no more global keyboard shortcuts.** `IconProvider` and `ShapeProvider` no longer take over the "i" and "r" keys. To keep that behavior, call `useIconLibraryCycleShortcut()` or `useShapeCycleShortcut()`.
- **@hilum/ui: `Select` is rebuilt on Radix Select.** Export names are unchanged. `SelectItem`'s `index` prop is ignored, `value=""` is no longer allowed, and page scroll is locked while the list is open instead of the list closing.
- **@hilum/ui: `InputNumber` has `role="spinbutton"`.** Tests that query it by `textbox` need updating. Values are parsed and formatted using the locale.
- **@hilum/ui: `badgeColors` values are `var(--categorical-*)` references.** For raw hex values, use `tokens.categorical` from `@hilum/ui/tokens`.
- **@hilum/ui: `FilterBar`.**
  - Its group role is now `group` (was `toolbar`).
  - It no longer bleeds to the screen edges on mobile unless you pass `mobileBleed`.
- **@hilum/ui: `ConfirmDialog`** stays open and shows an inline error when `onConfirm` rejects. Pass `error={false}` for the old behavior.
- **@hilum/ui: `Field` auto-wires its control.**
  - It generates the control's `id`.
  - It sets `aria-describedby`, `aria-invalid` and `aria-required` on the control.
- **@hilum/ui: `RadioGroup` renders one `role="radio"` element per item.** The hidden Radix radio is gone. New `name`, `required`, `disabled` and `form` props give native form support.
- **@hilum/ui: `forwardRef` removed.** Components take `ref` as a regular prop (React 19). Prop types now include `ref`.
- **@hilum/ui: layout classes are logical** (`ms`/`me`/`ps`/`pe`/`start`/`end`), and directional icons flip in RTL. Snapshot and class-name assertions may need updating.
- **@hilum/app-shell: `AppShell` and `AppShellStacked` render `<main>` and a skip link.**
  - Move `AppSidebar` and `AppHeader` into the new `sidebar` and `header` props.
  - Or pass `main={false}` and put `id="main-content"` on your own `<main>`.
  - `AppShell` also mounts a `Toaster` by default. Pass `toaster={false}` if your app already mounts one.
- **@hilum/app-shell: `PageHeaderActions` no longer styles `.dashboard-action-primary` or `.dashboard-action-wide`.** Use `primaryAction` / `secondaryActions`, or `data-span="full"`.
- **@hilum/designer: history changes.**
  - `useHistory` keeps at most 100 entries by default (`{ limit }` to change).
  - `undo()` and `redo()` return the new state.
- **@hilum/designer: `useKeybindings` skips focused inputs and contentEditable regions.** Set `allowInInputs` to opt out.
- **@hilum/designer-canvas: keyboard shortcuts are on by default.** Set `<Designer keyboardShortcuts={false}>` to turn them off. `LayerView` wraps renderers in a `[data-layer-content]` element.

## Fixes

- **@hilum/blocks:** closed a command-injection hole. Installs no longer run through a shell, and every dependency spec is validated.
- **@hilum/blocks:** block names can no longer write files outside the target directory.
- **@hilum/blocks:** the registry response is validated and has a timeout, and plain http is allowed only for localhost.
- **@hilum/ui:** `RichTextEditor` sanitizes all HTML with DOMPurify, including incoming values, pasted content and dropped content.
- **@hilum/designer-canvas:** fixed undo/redo, which re-applied the current state instead of the previous one.
- **@hilum/designer-canvas:** a drag is now a single undo step.
- **@hilum/designer-canvas:** marquee selection works again.
- **@hilum/designer-canvas:** shift-clicking a layer and then dragging moves the whole selection.
- **@hilum/designer-canvas:** the wheel handler no longer re-subscribes on every pan or zoom.
- **@hilum/ui:** reduced motion is respected by every animated component. `HilumProvider` provides an app-wide override.
- **@hilum/ui:** better semantics and keyboard support for `ColorPicker` (2D slider), `Slider` thumb labels, `RadioCards` (a real `radiogroup`) and `ContextualSaveBar` announcements.

## New

- **@hilum/ui:**
  - `DataTable` gains:
    - row selection
    - bulk actions and select-all across pages
    - server-side sorting, filtering and pagination
    - sticky headers
    - column visibility, pinning and resizing
    - virtualization
  - `FilterBar` gains applied-filter pills and saved views.
  - New components: `TreeView`, `SortableList`, `TimePicker`, `DateTimePicker`, `PageLayout` / `AnnotatedSection`, `FormLayout`, `SkeletonPage` and friends.
  - New `@hilum/ui/form` entry: a react-hook-form adapter. `react-hook-form` is an optional peer dependency.
  - `LinkProvider` / `useLink` let links inside components navigate client-side.
  - All user-facing strings can be overridden through `labels` props, and the English defaults are exported as `*_DEFAULT_LABELS`.
  - `data-slot` attributes on component parts.
- **@hilum/app-shell:**
  - nested navigation
  - mobile nav drawers
  - a skip link and landmarks
  - `search`, `loading` (top loading bar) and `toaster` props on the frame
  - `PageHeader` gains `primaryAction`, `secondaryActions` (overflowing into a menu), `backAction` and `titleMetadata`
- **@hilum/blocks:** new `--force`, `--dry-run` and `--registry` options, plus `HILUM_REGISTRY_URL`, bun support and detection of lockfiles in parent directories.

## Dependencies

- **@hilum/ui:** `tailwind-merge` 3 (Tailwind v4 class groups).
- The packages are built and tested with React 19.2, TypeScript 6 and Vitest 4.
