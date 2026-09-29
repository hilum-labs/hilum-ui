# @hilum/designer

## 4.4.3

## 4.4.2

## 4.4.1

## 4.4.0

### Patch Changes

- b00c23c: Hilum Shop parity, part 3: fixes and small APIs from the shop migration's third review, and no CSP violations from Hilum's own dependencies under `style-src 'self'`.

  **Visible changes to check in your app:** `Combobox` and `MultiCombobox` lists open in a popover layer above the page (a portal), no longer inside the field, so cards and dialogs with `overflow: hidden` don't clip them; on phones they are the Select-style bottom sheet. `DataTable` `mobileLayout="cards"` now switches by the table's own width, so a table in a narrow column, card or dialog shows cards on desktop too (`mobileBreakpointBasis="viewport"` restores the media query). `InputNumber` is full width inside a `Field` (192px elsewhere). Progress, `UsageBar` and `Steps` progress tracks use the border colour (they were invisible on dark cards). `StatCard` values can go down to 16px (was 18px) in very narrow cards so numbers don't break mid-number. `FontPicker` search no longer matches category text. `InputGroup`'s error border is the full destructive colour. `tokens.css` now carries the toast and drawer CSS, and `vendor.css` is empty.

  - **Strict Content-Security-Policy: no violations from sonner, vaul or input-otp.** sonner (toasts) and vaul (drawers) insert a `<style>` as soon as they are imported, so every page of a `style-src 'self'` app logged four CSP violations, even with 4.2's `vendor.css`. `@hilum/ui` now bundles both with that injection stripped at build time (the build fails if a new version injects differently), and their CSS ships in `tokens.css`, so apps without a CSP get it too. `@hilum/ui/vendor.css` is an empty, deprecated stub: remove its import. `InputOTP` keeps input-otp from appending its (blocked) `<style>`; its rules are in `tokens.css`. What remains are three Radix `<style>` tags that Radix's API can't turn off (the modal scroll lock, and the Select and ScrollArea viewports): the ui README lists them, why, and the three CSP hashes that allow them so a strict policy logs nothing. sonner and vaul are no longer dependencies of `@hilum/ui` (bundled, MIT notice in its LICENSE); `@radix-ui/react-dialog` (vaul's) is. The `@hilum/ui` entry grows by their code (~16 kB brotli), which apps downloaded before as separate packages.
  - **`Combobox` and `MultiCombobox` in a popover layer:** the list renders in a portal on a Radix popover anchored to the field (same width, flips at the viewport edge). Focus stays in the input; Escape, an outside click or focus leaving the field closes it. The list scrolls with the wheel inside a modal `Dialog` and doesn't chain its overscroll to the page. `labels.closeOptions` is unused (deprecated): on phones the sheet's backdrop dismisses it, as with Select.
  - **`MultiCombobox` never shows a raw id.** A selected value that isn't in `options` (results still loading, a deleted record) takes its label from the new `selectedOptions` (options for the selection, e.g. loaded with the record) or `getOptionLabel(value)`, then from any option seen before; with none, the chip reads `labels.loadingOption` ("Loading…") while `loading`, otherwise `labels.unknownOption` ("Unknown item"), in a muted chip (`data-unknown`).
  - **`InputGroup` joins a surrounding `Field`:** its built-in input takes the field's id (the label targets it), hint / error, `aria-invalid`, `aria-required` and `disabled`, like `Input`, so apps can drop manual `htmlFor`s. New `required`, `name` and `inputProps` (autoComplete, onBlur, a register ref, …) for the built-in input.
  - **`DataTable`:** `meta.label` is declared on TanStack's `ColumnMeta` (module augmentation), so `{ meta: { label: "Total" } }` type-checks without a cast; it labels the column's mobile card rows and its "Columns" menu entry. `mobileLayout="cards"` compares `mobileBreakpoint` with the table's width (measured before paint, kept current with a ResizeObserver); new `mobileBreakpointBasis` (`"container"` default, or `"viewport"`), and `mobileBreakpoint` also takes px.
  - **`TimeSeriesChart`:** a custom `valueFormat` function gets `{ context: "axis" | "tooltip" }`, so apps can shorten axis ticks and keep full values in the tooltip. `valueFormat="currency"` takes `currencyDisplay` (as in Intl / `formatCurrency`; default `"symbol"`, consistent with `formatCurrency`) and `currencySymbol`, which replaces Intl's sign on the axis and in the tooltip. Intl has no local sign for some currencies in some locales (the sol is "PEN" in English, for both `symbol` and `narrowSymbol`; "S/" only in es-PE), so `currencySymbol="S/"` is how a sol store in English shows "S/". `formatCurrency` (and `useFormatter().currency`) gains the same `currencySymbol` option.
  - **`InputNumber`:** new `fullWidth`; defaults to `true` inside a `Field` (two-column form rows fit a phone) and `false` elsewhere (192px).
  - **Tracks in dark mode:** `Progress` (e.g. in `SetupGuide`), `UsageBar` and the `Steps` progress bar drew their track in the muted colour, the card colour in dark mode; they use the border colour (1.26:1 light, 1.7:1 dark on cards). The `ScrollArea` thumb (also muted) uses the strong border colour, and the `Drawer` handle the sheet grabber colour. The Slider track and `AppLoadingBar` were checked and are unchanged.
  - **`PreviewFrame`** treats `src="about:blank"` (or empty) as loaded: its load event fired while React inserted the frame, which React drops, so the skeleton stayed. A same-origin frame that finished loading during insertion also counts; `onLoad` is called once per load.
  - **`StatCard`:** each value is its own size container, so it scales with the card in any grid, not only inside `StatCardGrid`; text values are sized to fit their longest unbreakable run ("12,345,678.90") on one line (30px down to 16px), and Intl's no-break space between a currency and its amount becomes a normal space, so a narrow card wraps "S/" / "1,234,567.89" instead of breaking inside the number. 4.3 already covered "S/ 1,234,567.89" in a 375px two-column grid; 8-digit amounts at 320px and cards outside a `StatCardGrid` broke inside the number.
  - **@hilum/designer:** `FontPicker` search matches family names only, in the order of `fonts` ("play" no longer lists every "display" font); a query that names a category exactly ("serif", "display", "sans serif") adds that category's other fonts after the name matches.

## 4.3.0

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

### Patch Changes

- Updated dependencies [717b08e]
  - @hilum/ui@4.0.0

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

### Minor Changes

- 4d67c29: Add mobile-ready editor chrome variants for responsive Studio shells: sheet panels, bottom sidebars, docked toolbars, and coarse-pointer toolbar targets.

## 3.7.1

## 3.7.0

## 3.6.12

## 3.6.11

## 3.6.10

## 3.6.9

## 3.6.8

## 3.6.7

## 3.6.6

## 3.6.5

## 3.6.4

## 3.6.3

## 3.6.2

## 3.6.1

## 3.6.0

## 3.5.4

## 3.5.3

## 3.5.2

## 3.5.1

## 3.5.0

## 3.4.0

### Minor Changes

- 96bd6ec: Add compact two-value and four-value designer controls for dense inspector panels.

  `@hilum/ui` InputNumber now supports mixed values and live commit-on-change behavior for editor controls.

## 3.3.4

### Patch Changes

- @hilum/ui@3.3.4

## 3.3.3

### Patch Changes

- @hilum/ui@3.3.3

## 3.3.2

### Patch Changes

- @hilum/ui@3.3.2

## 3.3.1

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.3.1

## 3.3.0

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.3.0

## 3.2.14

### Patch Changes

- Improve AppStatusBanner mobile layout so actions stack below the message instead of squeezing banner copy.
- Updated dependencies
  - @hilum/ui@3.2.14

## 3.2.13

### Patch Changes

- @hilum/ui@3.2.13

## 3.2.12

### Patch Changes

- @hilum/ui@3.2.12

## 3.2.11

### Patch Changes

- Updated dependencies [aa3c2db]
  - @hilum/ui@3.2.11

## 3.2.10

### Patch Changes

- Updated dependencies [0dd03fd]
  - @hilum/ui@3.2.10

## 3.2.9

### Patch Changes

- Updated dependencies [ba1614b]
  - @hilum/ui@3.2.9

## 3.2.8

### Patch Changes

- 9de7762: Reduce designer toolbar and sidebar icon controls from 40px to 36px.
  - @hilum/ui@3.2.8

## 3.2.7

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.2.7

## 3.2.6

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.2.6

## 3.2.5

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.2.5

## 3.2.4

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.2.4

## 3.2.3

### Patch Changes

- 9a27459: Remove the extra border from DesignerToolbar so the native toolbar surface uses only the Hilum natural shadow.
  - @hilum/ui@3.2.3

## 3.2.2

### Patch Changes

- Updated dependencies [6610a27]
  - @hilum/ui@3.2.2

## 3.2.1

### Patch Changes

- Updated dependencies [48ddf55]
  - @hilum/ui@3.2.1

## 3.2.0

### Patch Changes

- Updated dependencies [b020e15]
- Updated dependencies [147ef45]
  - @hilum/ui@3.2.0

## 3.1.2

### Patch Changes

- Updated dependencies [421a631]
  - @hilum/ui@3.1.2

## 3.1.1

### Patch Changes

- f04ade5: Widen lucide-react peer compatibility to support dashboard apps using newer 0.x releases such as 0.542.x.
- Updated dependencies [f04ade5]
  - @hilum/ui@3.1.1

## 3.1.0

### Patch Changes

- Updated dependencies [784078f]
  - @hilum/ui@3.1.0

## 3.0.0

### Patch Changes

- Updated dependencies [e1b6340]
  - @hilum/ui@3.0.0

## 2.1.2

### Patch Changes

- Reduce AccountMenu sizing so it reads as a dropdown instead of a large account panel.
- Updated dependencies
  - @hilum/ui@2.1.2

## 2.1.1

### Patch Changes

- Restyle AccountMenu to use the standard light dropdown/card surface and foreground tokens.
- Updated dependencies
  - @hilum/ui@2.1.1

## 2.1.0

### Minor Changes

- Add reusable account menu primitives for profile dropdowns.

### Patch Changes

- Updated dependencies
  - @hilum/ui@2.1.0

## 2.0.4

### Patch Changes

- Allow designer property row controls to paint focus rings without clipping while preserving width constraints.
  - @hilum/ui@2.0.4

## 2.0.3

### Patch Changes

- af5108e: Add designer property row primitives and clamp pane content horizontal overflow.
  - @hilum/ui@2.0.3

## 2.0.2

### Patch Changes

- 51cd5e0: Fix designer panel horizontal overflow and make property row labels stack above controls by default.
- Updated dependencies [51cd5e0]
  - @hilum/ui@2.0.2

## 2.0.1

### Patch Changes

- 8a8961c: Migrate component styling to semantic token utilities and refresh catalog coverage for foundations and designer exports.
- Updated dependencies [8a8961c]
  - @hilum/ui@2.0.1

## 2.0.0

### Patch Changes

- Updated dependencies [eb7a2bb]
  - @hilum/ui@2.0.0

## 1.0.1

### Patch Changes

- Updated dependencies [842ee65]
  - @hilum/ui@1.0.1

## 1.0.0

### Patch Changes

- Updated dependencies [a35d39b]
  - @hilum/ui@1.0.0

## 0.1.5

### Patch Changes

- Updated dependencies [29977b5]
  - @hilum/ui@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies [5166c27]
  - @hilum/ui@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies [7b82093]
  - @hilum/ui@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies [cfe6bec]
  - @hilum/ui@0.1.2

## 0.1.1

### Patch Changes

- 9b21b57: Fix npm packaging and release metadata, add MIT licensing, tighten published files, and document the blocks CLI.
- Updated dependencies [9b21b57]
  - @hilum/ui@0.1.1
