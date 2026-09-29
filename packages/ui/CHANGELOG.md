# @hilum/ui

## 4.2.0

### Minor Changes

- 62a2281: Shopify-admin consistency: strict-CSP support, one form-control size, dashboard and onboarding components, and fixes found building Hilum Shop.

  **Visible changes to check in your app:** single-line form controls are 36px with 14px text (Input was 40px), Select triggers have no 160px minimum width, Select options use the foreground colour, `TitledCard` / `CardHeading` titles are 14px semibold headings, `StatusBadge` fallback labels are sentence case, the fixed `ContextualSaveBar` covers the app top bar instead of sitting under it, `AppStatusBanner` success / warning / danger colours changed (token surfaces), and `tokens.css` now sets `color-scheme`, so native scrollbars and date inputs follow dark mode.

  - **Strict Content-Security-Policy.** Hilum components no longer insert `<style>` elements, so apps work under `style-src 'self'`:
    - The mobile bottom-sheet rules of `Select`, `Popover`, `DropdownMenu`, `ContextMenu`, `Menubar`, `Dialog` and `AlertDialog`, the `RichTextEditor` content typography and the app-shell `AppLoadingBar` sweep ship statically in `tokens.css`. The sheet grabber, which used an invalid `hsl()` on hex tokens, is visible again.
    - `ChartContainer` sets series colours as `--color-<key>` custom properties through its `style` prop; `theme` colours use `light-dark()`, driven by the `color-scheme` that `tokens.css` now sets per theme. New `chartColorVariables(config)`; `ChartStyle` is deprecated (it renders a `<style>`) and no longer used.
    - New `@hilum/ui/vendor.css`: the CSS that sonner (toasts) and vaul (drawers) inject when imported, which neither library can turn off. Import it after `tokens.css` when your CSP blocks inline styles; without it, toasts render as an unstyled full-width bar.
    - Radix still renders two `<style>` tags (the modal scroll lock and the Select / ScrollArea scrollbar hiding); they are blocked harmlessly because `tokens.css` carries the same rules. `applyTheme()` / `ThemeProvider` accept a `nonce`. The ui README has a "Strict Content-Security-Policy" section.
  - **One size for form controls.** At the default density every single-line control is 36px tall with 14px text: `Input`, `SearchInput`, `Select`, `NativeSelect`, `Combobox`, `InputNumber` (was 32px / 12px), `InputGroup`, `ColorInput`, `TimePicker` and the `DatePicker` / `DateRangePicker` triggers (were 32px / 13px). 36px / 14px matches Hilum's `lg` button and the Select trigger, keeps body-size text readable, and gives the tighter rhythm of Shopify admin forms without shrinking text below 14px. The size is defined once and exported for bespoke controls (`controlSizeClasses`, `controlHeightClass`, `controlTextClass`; the `--density-input-height` token is now 36px); the compact editor tier and `density="compact"` are unchanged. Buttons in compositions line up: `FilterBar` filter and action Buttons take the control height (icon Buttons become 36px squares), an `InputGroup` `trailingButton` sits 4px inset, and the `RichTextEditor` link row and `DataTransferControls` match.
  - **`InputGroup` / `SearchableTable` search:** the wrapper is the control, with no vertical padding (the search field was 54px tall), the field surface, a focus-within ring, and `aria-label` naming the input. `SearchableTable` filter Select triggers are labelled with their placeholder.
  - **Select:** the trigger drops `min-w-40` (it overflowed narrow columns, dialogs and Fields; add `w-40` where you relied on it). `SelectItem` options render in the foreground colour at 14px; only disabled options are muted.
  - **Card headings:** `TitledCard` and `CardHeading` render their title as a heading element (`headingLevel`, default 2) in one style, 14px semibold, whether or not the card has actions. `TitledCard` uses one header layout for both cases. New `CardHeadingTitle`.
  - **Status labels:** `statusLabel()` (the `StatusBadge` fallback) is sentence case: `partially_fulfilled` reads "Partially fulfilled".
  - **`StatusBadge` dots** use the categorical token colours mixed towards the foreground instead of raw Tailwind hues, keeping at least 4:1 against the tinted badge in light and dark (the info dot was nearly invisible). `dotClassName` still overrides.
  - **Menus and account menus:** rich content inside `DropdownMenuLabel` / `ContextMenuLabel` / `MenubarLabel` (such as a user's name and email) shows as typed instead of uppercased; plain-text labels keep the eyebrow style. `AccountMenuHeader` never inherits the transform.
  - **`RadioCards`:** keyboard focus is a detached halo, distinct from the checked ring; unchecked option titles use the foreground colour.
  - **`Callout`:** on mobile only Buttons in `actions` stretch full width; badges and links keep their size.
  - **`CommandPalette`:** the close button sits in the search row after the `esc` hint instead of on top of it (`DialogContent` gains `showCloseButton`), and the dialog is anchored near the top so it no longer jumps as results shrink (`CommandDialog` too). New async result groups: `onQueryChange(query)` and `groups` (`{ id, label, items, loading?, emptyText? }`) render app-fetched orders, products or customers after the matching static items, with loading rows and a polite announcement. Strings via `labels`.
  - **`ContextualSaveBar`:** in `fixed` mode it replaces the app top bar on desktop (top 0, at least `--hilum-header-height` tall, above the header) instead of sitting below it over the sidebar and page header. `offsetTop` remains an explicit override.
  - **New `SetupGuide`:** Shopify-style onboarding card with "3 of 7 tasks complete" progress, grouped tasks (`groups`), one expanded task at a time (the first incomplete one by default) with a visible primary action (button or link through `LinkProvider`) and an optional secondary one, disclosure-pattern keyboard support, optional completion toggles (`onTaskCompleteChange`), collapse and dismiss, `labels`.
  - **New `TimeSeriesChart`:** sales-over-time style chart for dashboards without Recharts primitives: dates on the x-axis, money / number / percent values formatted with `FormatProvider`, a tooltip, dashed comparison series and legend, loading and empty states, token colours and reduced motion.
  - **New `Thumbnail`:** square product or resource image in four sizes (24 / 32 / 40 / 80px, matching `SkeletonThumbnail`), `fit` cover or contain, border and radius, `alt` text, and a neutral placeholder icon when there is no image or it fails to load.
  - **Icons:** `@hilum/ui/icons` exports `Smartphone`, `Tablet`, `Monitor` and `Keyboard`.
  - **Button:** `asChild` links, `buttonVariants()` elements and the active `PaginationLink` get the same fill as a plain `<button>` (the fill moved to `::before`; it used to be missing, leaving white text on nothing). `asChild` also supports `loading`, leading / trailing icons, `disabled` and ref forwarding, and the loading glyph animates again. `AlertDialogAction` / `AlertDialogCancel` with `asChild` keep their Button child's variant.
  - **@hilum/app-shell:**
    - `AppStatusBanner` uses semantic token surfaces: warning is the token warning surface, success a success-token tint with a solid icon chip, and danger the regular foreground on a destructive tint, so all tones stay legible in dark mode. The `PageHeader` icon chip no longer uses a fixed palette colour.
    - `AppMobileNav` gains `actions` (search, notifications, … before the account avatar), `accountMenu` (custom account menu content, e.g. the full desktop account menu) and `accountMenuClassName`.
    - `AppLoadingBar` renders no `<style>`; its keyframes ship in `tokens.css`.
  - **@hilum/designer:**
    - `DesignerHeader` gains `primaryAction`, `secondaryActions`, `maxVisibleSecondaryActions` (default 2) and `labels`: the primary action (e.g. Publish) is never cut off, and secondary actions overflow into a "More actions" menu on narrow headers. Free-form `right` content is clipped first.
    - New `FontPicker`: a compact, searchable font-family picker that previews each family in its own face (with a generic fallback until loaded), loads faces on demand through `onLoadFont`, and takes a controlled `value` / `onChange`.

## 4.1.1

### Patch Changes

- 8951638: Inspector grid: Figma-parity editor chrome, phase 1. Released as a patch (4.1.1) at the maintainers' request, although it adds APIs.

  - **Grid rows:** new `DesignerPropertyRow layout="grid"`, the Figma inspector row. It has two equal field columns plus a fixed action column (24px in compact density, 32px in default), with the label (the `label` prop or a `<label>` child) spanning the row above. The fields stretch to their cells, overriding the default widths of `InputNumber`, `Select`, `ColorInput`, segmented groups and `Slider`. A row's only field spans both columns. Icon-only `Button` children and the new `action` prop sit centred in the action column. The column is always there, so field edges line up down the panel whether or not a row has an action. A `DesignerPropertyControls` inside a grid row becomes `display: contents`, so its children join the grid; it now carries `data-slot="designer-property-controls"`.
  - **`DesignerPropertyField`:** new cell wrapper for grid rows. `span={2}` (or `data-span="2"` on any child) spans both field columns, and `span={1}` keeps a lone field in column 1. A field can hold several controls, such as a group of icon buttons.
  - **Pane titles:** `DesignerPaneTitle` is now a header row: the title, then its `action`, then the collapse chevron. The actions are no longer nested inside the title `<button>`. The title button has `aria-expanded`, plus `aria-controls` pointing at `DesignerPaneContent`, which gets a generated `id`. In compact density the leading chevron is hidden and the title sits flush with the field labels. A 24px muted chevron trails the actions; it is pointer-only, since the title button is the accessible control. New `muted` prop for empty or optional sections: a muted, normal-weight title, typically next to a "+" action. Compact pane content now spaces rows 8px apart, and compact stacked rows drop their extra vertical padding.
  - **Toolbar and rail:** `DesignerToolbarButton` and `DesignerSidebar` items are 32px (`rounded-md`, 16px icons with a 1.5px stroke) in every density, up from 36px outside compact. The touch sizes are unchanged. `DesignerToolbarSeparator` is 20px tall in every density.
  - **Value controls:** the `TwoValueControl` / `FourValueControl` field gap is 8px in compact density too, matching the grid's column gap.
  - **Button:** icon-only sizes (`icon`, `icon-xs`, `icon-sm`, `icon-lg`) render `data-icon-only` on the root, including with `asChild`. In compact density they all draw 14px icons.

## 4.1.0

### Minor Changes

- 69930b7: Editor chrome in the compact density tier. `data-density="compact"` (set by `DesignerShell` / `DesignerPanel`, or `<DensityProvider density="compact">`) now gives Figma-style inspector chrome out of the box, replacing app-level CSS override layers:

  - **Fields** (Input, Textarea, SearchInput, NativeSelect, InputNumber, ColorInput, the Select trigger) are 24px filled surfaces with a 5px radius and no resting border; hover shows the border, focus turns the field to the background with a ring-coloured border and no halo. Values are 12px, labels 11px. The Select trigger and ColorInput span their row; InputNumber's prefix label is a fixed 22px column (the unit suffix keeps its own width).
  - **Tokens:** new `--density-field`, `--density-field-hover` and `--density-divider` vars (`tokens.density.*.field / fieldHover / divider`). Compact subtrees use plain tabular Inter digits and a 1.5px lucide stroke (in the base layer, so hover-stroke utilities still apply).
  - **Button:** new `variant="tile"` for pressable preset tiles (quiet fill; pressed via `aria-pressed="true"` or `active` is a background tile with a hairline ring; pass `h-auto compact:h-auto` for content-sized tiles) and `variant="field"` for triggers that read as a field (e.g. a font picker). A pressed `ghost` button (`aria-pressed="true"`) now keeps a subtle fill in the foreground colour. Compact buttons don't wrap (`compact:whitespace-normal` opts back in).
  - **Segmented controls:** `ButtonGroup` accepts native div props (`role`, `aria-label`, …) and `ButtonGroupItem` reads `aria-pressed="true"` as active. New `ToggleGroup variant="segmented"` renders the same track and chip. In compact they are a 24px filled track with a white 20px chip; `w-full` stretches the items evenly.
  - **Designer:** compact pane titles are sentence case in the foreground colour, group titles sentence case and muted, pane dividers use `--density-divider`. Inline `DesignerPropertyRow`s give a composed `<label>` child the same fixed label column as their own label (72px in compact; `labelWidth` still overrides). The linked-value "All" prefix is no longer forced to upper case. The `DesignerSidebar` active tool is a soft neutral tile instead of a solid black square, and tool icons use a 1.5px stroke.

### Patch Changes

- d06a1d8: `Slider` and `SliderComfortable` put `aria-label` / `aria-labelledby` only on the thumb (the `role="slider"` element). In 4.0.0 they were also set on the root `div`, so two elements had the same accessible name.

## 4.0.0

### Major Changes

- 717b08e: Platform hardening: security fixes, accessibility, admin-grade components, RTL, and leaner packaging.

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

## 3.10.0

### Minor Changes

- 7c4ddf9: Shop-parity components so product apps can drop app-local UI:
  - **@hilum/ui**
    - New `ContextualSaveBar` + `useUnsavedChangesWarning` (unsaved-changes save/discard bar, ⌘S, form submit by id).
    - New `DateText` / `RelativeTime` and Intl-based helpers `formatDate`, `formatDateTime`, `formatDateRange`, `formatRelativeTime`, `formatNumber`, `formatCurrency` (minor units), `formatPercent`, `pluralize`, `toDate`, `toISODate`, plus `FormatProvider` / `useFormatter` for app-wide locale, currency and time zone.
    - Date styles: `date`/`short` give "Sep 26, 2026", plus `long`, `datetime`, `time`, `monthDay`, `month` and `iso`.
    - New `DateRangePicker` with presets and `value` or `from`/`to`. `DatePicker` gains `minDate`, `maxDate`, `clearable`, `locale`, `fullWidth` and `containerClassName`, and closes on select. Both are now **full width by default**; pass `fullWidth={false}` for the old 15rem trigger.
    - New `SearchInput`, `ResourceCell`, `ResourceItem`, `ConfirmDialog`, `PaginationBar`, `FilterBar`, `Rating` and `CodeBlock`.
    - Semantic `tone` (success, info, attention, warning, critical, neutral) on `Badge`, `StatusBadge` and `StatusTile`. `StatusBadge` and `StatusTile` also take `toneMap`. Adds a built-in commerce status map, `statusToneFor` and `STATUS_TONE_BADGE`.
    - `StatCard` gains `description`, `loading`, `href`, the `plain` variant and `trend.tone` / `trend.label`. `StatCardGrid` gains `columns`, and `StatGrid` is added as an alias.
    - `EmptyState` gains `secondaryAction`, element actions, `variant="card"`, `size` and `children`. `SearchableTable` forwards them.
    - `DataTable` gains `emptyState`, `onRowClick` and `itemLabel`, with pluralized counts.
    - `TabsList` now scrolls with edge fades instead of clipping (`scrollable`, default on). `TabsSubtle` gets the same fades and keeps the active tab in view.
    - `toast` and `useSonner` are re-exported, so apps no longer import `sonner`. `Toaster` defaults to `theme="system"`.
    - New `caption-sm` (11px) type utility.
    - Exported overflow helpers: `useScrollEdges`, `useHorizontalOverflowMask`, `horizontalEdgeMask` and `scrollStripItemIntoView`.
  - **@hilum/app-shell**
    - `PageHeader` gains `back`, `badges`, `meta` and `wrapTitle` (detail pages without duplicate breadcrumbs).
    - `AppMobileNav` gains `avatarSize` (default `sm`, so two-letter initials fit), plus edge fades on the scrolling tab strip.
    - `DetailScreen` gains a `header` slot, and its meta column is full-width when stacked.
    - The `SettingsScreen` nav becomes a horizontal scroller on mobile, with `aria-current`.
  - **@hilum/designer**
    - New `DesignerPanelHeader` and `DesignerPanelTabs`: value-based panel tabs that never clip.

## 3.9.0

### Minor Changes

- Editor-grade visual pass and fixes.
  - New compact density tier (`data-density="compact"` / `DensityProvider`): 24px controls, 28px rows, 12px text. `DesignerShell` and `DesignerPanel` default to compact; pass `density="default"` to opt out.
  - Define `surface-1..8` elevation tokens plus `hover`, `active`, `canvas`, `border-strong` and checker tokens. Stronger light (#e5e5e5) and dark (#4a4a4a) borders. The global border-color rule now lives in the base layer so `border-*` utilities apply.
  - Slider filled range and thumb; color picker alpha track, field chrome, preset grid and disabled state; InputNumber tabular numerals, label-as-scrub-handle `label` prop, compact steppers.
  - Consistent primary/secondary button semantics across themes; working outline/ghost/brand variants; uniform 2px focus rings.
  - Fixes: AskUserQuestions hook-order crash, Tooltip/FileThumbnail hook order, CanvasProvider revision/onChange.
  - A11y: MenuItem `type` prop (menuitem/radio/checkbox), CommandPalette title, arrow-key navigation and `onNavigate`, Combobox id/name/disabled/aria/ref support.
  - Packaging: `types` first in exports, `./package.json` export, `"use client"` banners on component entries, `sideEffects: false`, `lucide-react` required peer for app-shell/designer-canvas, configurable pdf.js `workerSrc`.

## 3.8.6

### Patch Changes

- Automated AWS CodeCommit patch release from e2326ac.

## 3.8.5

### Patch Changes

- Automated AWS CodeCommit patch release from 57a07f0.

## 3.8.4

### Patch Changes

- Automated AWS CodeCommit patch release from 7356988.

## 3.8.3

### Patch Changes

- Automated AWS CodeCommit patch release from 147b990.

## 3.8.2

### Patch Changes

- Automated AWS CodeCommit patch release from eba58b6.

## 3.8.1

### Patch Changes

- Automated AWS CodeCommit patch release from 3241174.

## 3.8.0

## 3.7.1

### Patch Changes

- Remove nested SearchableTable toolbar chrome and let TitledCard inherit Card surface styling.

## 3.7.0

### Minor Changes

- Add native mobile surface and density props to cards, tables, and form controls so app screens can use compact, flush mobile layouts without app-level style overrides.

### Patch Changes

- 585c22b: Keep dialog bottom-sheet behavior through tablet/mobile widths and prevent per-dialog max-width classes from narrowing mobile sheets.
- Keep dialogs and alert dialogs pinned as full-width bottom sheets on mobile, even when callers provide max-width or rounded shape classes.

## 3.6.12

### Patch Changes

- Add shared `outlined` and `elevated` Card variants for bordered application surfaces.

## 3.6.11

### Patch Changes

- Add `CheckboxCard` for reusable bordered checkbox option rows.

## 3.6.10

### Patch Changes

- Tighten mobile dialog sheet positioning and action layout for touch viewports.

## 3.6.9

### Patch Changes

- Add a responsive `StackedList` surface for desktop card lists that flatten on mobile.

## 3.6.8

### Patch Changes

- Add `MediaAssetGrid` and `MediaAssetGridItem` for responsive media library layouts.

## 3.6.7

### Patch Changes

- d160989: Pin dialog and alert dialog surfaces as full-width bottom sheets on mobile, even when callers provide max-width or rounded shape classes.

## 3.6.6

### Patch Changes

- 781d225: Allow caller-provided dialog max-width classes to override default desktop sizing while preserving mobile sheet behavior.

## 3.6.5

## 3.6.4

### Patch Changes

- 1b9c1b4: Keep dialogs, selects, menus, popovers, and comboboxes in mobile bottom-sheet mode until the md breakpoint.

## 3.6.3

### Patch Changes

- 46ca3d9: Add responsive `StatusTile` and `StatusTileGrid` primitives for service health and operational status panels.

## 3.6.2

### Patch Changes

- Add reusable `SummaryTile` components and a `TitledCard` mobile content padding option for compact dashboard panels.

## 3.6.1

### Patch Changes

- Render `DialogContent` as a true bottom sheet on mobile instead of keeping the panel centered.

## 3.6.0

### Minor Changes

- Flatten form control surfaces, default shape tokens to rounded, and align Fluid-inspired controls and catalog previews.

## 3.5.4

### Patch Changes

- Add a responsive StatCard surface for flat mobile metrics and carded desktop dashboards.

## 3.5.3

### Patch Changes

- Add a responsive `Card` variant for mobile-flattened dashboard and admin panels.

## 3.5.2

### Patch Changes

- Add a shared `UsageBar` component for compact quota, readiness, and capacity meters across admin and dashboard surfaces.

## 3.5.1

## 3.5.0

### Minor Changes

- 9a25e44: Add Fluid Functionalism parity across Hilum UI primitives, interaction foundations, and catalog examples.

## 3.4.0

### Minor Changes

- 96bd6ec: Add compact two-value and four-value designer controls for dense inspector panels.

  `@hilum/ui` InputNumber now supports mixed values and live commit-on-change behavior for editor controls.

## 3.3.4

## 3.3.3

## 3.3.2

## 3.3.1

### Patch Changes

- Tighten `SidebarMenuButton` default vertical spacing for denser sidebar navigation.

  Move mobile sidebar close-on-navigation behavior into `AppSidebar` when it is rendered inside a shared `SidebarProvider`.

## 3.3.0

### Minor Changes

- Add complete catalog coverage for Hilum UI atom and molecule exports, generate package-level `llms.txt` from the canonical component registry, improve catalog mobile navigation, and quiet Recharts prerender output for chart docs.

## 3.2.14

### Patch Changes

- Improve AppStatusBanner mobile layout so actions stack below the message instead of squeezing banner copy.

## 3.2.13

## 3.2.12

## 3.2.11

### Patch Changes

- aa3c2db: Reduce empty-state icon containers from 48px to 36px for tighter dashboard and admin layouts.
  Reduce mobile app navigation items from 40px to 36px to keep compact operator headers.

## 3.2.10

### Patch Changes

- 0dd03fd: Reduce compact calendar, carousel, and step controls from 40px to 36px.

## 3.2.9

### Patch Changes

- ba1614b: Reduce ColorPicker compact controls from 40px to 36px for tighter editor layouts.

## 3.2.8

## 3.2.7

### Patch Changes

- Reduce compact icon controls from 40px to h-9 w-9 across Button, Toggle, pagination, rich text editor toolbar, dialog close, sheet close, notifications, and collapsed sidebar items.

## 3.2.6

### Patch Changes

- Add icon support to StatusBadge for shared status and risk labels.

## 3.2.5

### Patch Changes

- Reduce compact icon trigger defaults from 40px to h-9 w-9 for tighter dashboard controls.

## 3.2.4

### Patch Changes

- Use mobile bottom-sheet presentation for dialogs, alert dialogs, dropdown menus, and select menus.
- Extend mobile bottom-sheet presentation to popovers and add safe-area grabbers to mobile menu/select sheets.
- Extend mobile bottom-sheet presentation to context menus, menubars, color pickers, and combobox option lists.
- Stack dialog and alert dialog footer actions full-width on mobile while preserving desktop modal footers.
- Add a reusable `CommandDialog` composition for modal command palettes.
- Add mobile sheet state and `SidebarInput` to the reusable sidebar primitive.
- Add `SearchableTable` for controlled search, filters, sorting, pagination, and mobile list views.
- Add `RichTextEditor` for product, content, theme, and admin HTML editing surfaces.
- Add `FileDropzone` for reusable drag-and-click upload surfaces.
- Add `MediaAssetCard` for reusable media library and product media cards.
- Add `StatusBadge` for consistent status labels, tones, and compact dots.
- Add `HelpTooltip` package coverage for touch-friendly contextual field help.
- Add `TitledCard` and `StatCardGrid` package coverage for dashboard card migration.
- Add `DataTransferControls` for reusable scoped import/export toolbars with mobile sheet menus.
- Add `Callout` for reusable inline notices, warnings, validation states, and action prompts.
- Consolidate the mobile bottom-sheet contract for dialogs, alert dialogs, selects, dropdowns, popovers, context menus, and menubars with safe-area spacing.

## 3.2.3

## 3.2.2

### Patch Changes

- 6610a27: Tighten ButtonGroup sizing so the iOS-style segmented control renders smaller and less chunky by default.

## 3.2.1

### Patch Changes

- 48ddf55: Restyle ButtonGroup as an iOS-style segmented control with a muted rounded track and selected card pill.

## 3.2.0

### Minor Changes

- 147ef45: Apply interface polish across component primitives: explicit transitions, tactile press states, balanced text wrapping, tabular metrics, and image outlines.

### Patch Changes

- b020e15: Add shared icon facade exports used by Hilum dashboard surfaces.

## 3.1.2

### Patch Changes

- 421a631: Improve InputGroup inset action alignment and spacing for icon buttons.

## 3.1.1

### Patch Changes

- f04ade5: Widen lucide-react peer compatibility to support dashboard apps using newer 0.x releases such as 0.542.x.

## 3.1.0

### Minor Changes

- 784078f: Add `trailingAction` support to `InputGroup` for inset buttons and controls inside the input boundary.

## 3.0.0

### Minor Changes

- e1b6340: Replace the display font from Instrument Serif to Gabarito for a friendlier, rounder product voice.

## 2.1.2

### Patch Changes

- Reduce AccountMenu sizing so it reads as a dropdown instead of a large account panel.

## 2.1.1

### Patch Changes

- Restyle AccountMenu to use the standard light dropdown/card surface and foreground tokens.

## 2.1.0

### Minor Changes

- Add reusable account menu primitives for profile dropdowns.

## 2.0.4

### Patch Changes

- Add an opaque bordered elevated surface to context menu content so menus remain readable above dense editor canvases.

## 2.0.3

## 2.0.2

### Patch Changes

- 51cd5e0: Fix designer panel horizontal overflow and make property row labels stack above controls by default.

## 2.0.1

### Patch Changes

- 8a8961c: Migrate component styling to semantic token utilities and refresh catalog coverage for foundations and designer exports.

## 2.0.0

### Minor Changes

- eb7a2bb: Add a `mid` semantic theme (medium-gray surfaces) and retune `dark` to better match the Pappery designer palette.
  - `semantic.mid` is a new theme variant sitting between `light` and `dark`. Opt in by setting `data-theme="mid"` on `<html>` (or any ancestor). Background uses `ground-500` with `ground-600` for cards and `ground-700` for hover/accent surfaces.
  - `semantic.dark` now uses `ground-900` for background, `ground-800` for card, and `ground-700` for accent/border so panels read as elevated over the canvas (was previously `#0a0a0a` background with `#171717` cards).
  - `[data-theme="mid"]` block is emitted from `build-tokens.mjs` as an explicit opt-in (no `prefers-color-scheme` auto-switch — light/dark only).

## 1.0.1

### Patch Changes

- 842ee65: Add `body-sm` type token (12px / weight 500) and make it the `SidebarMenuButton` default, so all sidebars render nav items at the smaller, slightly heavier scale.

## 1.0.0

### Minor Changes

- a35d39b: Add the **eyebrow / overline / kicker** typescale family.

  The existing `label` utility (12px uppercase tracked) was unnamed for the common "small uppercase label above a headline" pattern, so consumers were re-inventing it with `caption font-semibold uppercase tracking-wider` compositions.

  New utilities — all share the same CSS (12px Inter 600, uppercase, 0.1em tracking) so consumers can pick the vocabulary that reads best in their context. `eyebrow` is canonical.
  - `eyebrow` — canonical name. Use above a heading, on section markers, in cards.
  - `eyebrow-sm` — compact 0.625rem variant for badge-sized chips and tiny status pills.
  - `overline` — Material parlance alias of `eyebrow`.
  - `kicker` — editorial parlance alias of `eyebrow`.
  - `label` — kept as alias of `eyebrow` for backwards compatibility.

  Catalog (`/foundations`) gains a dedicated "Eyebrow / overline / kicker" section. `llms.txt` updated.

## 0.1.5

### Patch Changes

- 29977b5: Fix Sidebar width — use correct Tailwind v4 CSS variable syntax.

  The `Sidebar` component used `w-[--sidebar-width]` (a Tailwind **v3** arbitrary-value syntax). In Tailwind **v4** the same bracket form is treated as a literal value and emits invalid CSS — `width: --sidebar-width;` instead of `width: var(--sidebar-width);` — so the sidebar fell back to content-based width, ignoring both the default (`16rem`) and any consumer override on `SidebarProvider`'s `--sidebar-width`.

  Migrated all four affected utilities to v4's CSS-variable shorthand `(--var)`:
  - `w-[--sidebar-width]` → `w-(--sidebar-width)`
  - `w-[--sidebar-width-icon]` → `w-(--sidebar-width-icon)`
  - `max-w-[--skeleton-width]` → `max-w-(--skeleton-width)` (in `SidebarMenuSkeleton`)

  After this fix, consumers can set sidebar width via `<SidebarProvider style={{ '--sidebar-width': '13rem' }}>` and it'll take effect without needing a width override on `<Sidebar>` itself.

## 0.1.4

### Patch Changes

- 5166c27: Ship Inter (variable) + Instrument Serif (400 + italic) as self-hosted `.woff2` files inside `@hilum/ui`.

  The library now provides `@hilum/ui/fonts.css` with `@font-face` declarations pointing at bundled font files in `dist/fonts/`. Consumers no longer need to wire up Google Fonts `<link>` tags or add `@fontsource` dependencies — the font setup is now part of the design system itself.

  **Consumer setup:**

  ```ts
  // In your entry file (main.tsx, index.tsx, etc.):
  import "@hilum/ui/fonts.css";
  ```

  This is the same pattern used by `@fontsource/*` packages: JS-side import so the bundler resolves the `url()` references in `@font-face` and emits the `.woff2` assets next to your output CSS. (CSS-side `@import` does inline the @font-face block but most bundlers don't rebase relative URLs from `node_modules` — use the JS import.)

  **What ships:**
  - Inter variable (latin + latin-ext, normal + italic — covers weights 100–900)
  - Instrument Serif (latin + latin-ext, 400 + italic)
  - ~340 KB total, opt-in (only loaded if you import `@hilum/ui/fonts.css`)

  **Why self-host:**
  - No Google Fonts runtime dependency (offline-safe, no privacy/compliance concerns)
  - No DNS lookup at runtime
  - Bundler fingerprints + caches the assets

## 0.1.3

### Patch Changes

- 7b82093: Re-ship `src/` so consumers don't have to add their own `@source` directive.

  The library's `dist/tokens.css` includes `@source "../src"` — a Tailwind v4 directive that tells the consumer's Tailwind build to scan the library's own components for utility class names. For this to resolve, `src/` must be present in `node_modules/@hilum/ui/`. Commit `040065c` accidentally narrowed `files` to `dist` only, so consumers got an unstyled build because Tailwind couldn't see any class names to compile.

  After this fix, the documented setup works as-is:

  ```css
  @import "tailwindcss";
  @import "@hilum/ui/tokens.css";
  ```

  No `@source` needed in the consumer.

## 0.1.2

### Patch Changes

- cfe6bec: Exclude internal test files from the published package tarball.

## 0.1.1

### Patch Changes

- 9b21b57: Fix npm packaging and release metadata, add MIT licensing, tighten published files, and document the blocks CLI.
