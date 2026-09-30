# @hilum/app-shell

## 4.5.0

### Patch Changes

- fb91ede: SettingsScreen marks the selected section with the same brand tint as the app sidebar and mobile nav instead of an inverted black block. EmptyState takes `headingLevel` so a whole-page empty state (like a 404) can title the page with a real heading.

## 4.4.4

## 4.4.3

## 4.4.2

### Patch Changes

- 4e57bdb: Active nav items meet WCAG AA contrast, and clickable rows ignore clicks inside portals.

  **Visible change to check in your app:** the active item in `Sidebar` (`SidebarMenuButton`, `SidebarMenuSubButton`, so every `AppSidebar` item), the `AppMobileNav` tabs and `AppNavTree` (the mobile drawer) keeps its brand tint, but its text and icon use the new `--brand-text` token instead of `brand-primary`: a darker purple in light mode (`#9c00c0`), a lighter one in dark mode (`#d870f9`) and white in the mid theme. `#C100F1` on its own 10% tint was 3.9:1 in light mode (3.1:1 on dark cards), below the 4.5:1 AA needs, so axe flagged the sidebar on every page; it is now 5.1–8:1 in every theme, hovered too.

  - **`--brand-text` (`text-brand-text`):** brand-coloured text that stays ≥ 4.5:1 on every surface and on the brand tint (`bg-brand-primary/10`–`/15`), for your own active or selected items. `createTheme()` emits it for light, dark and mid (the palette shade closest to `primary` that passes; on the mid gray a bright brand gets the best of black and white), and returns it as `brandText`.
  - **`DataTable` `onRowClick` ignores clicks inside portals.** React bubbles events through portals, so confirming a row action's `ConfirmDialog` (or picking an item in its `DropdownMenu`, or clicking anywhere in a `Dialog` opened from the row) also clicked the row and navigated. Rows (and `mobileLayout="cards"` cards) now only react to clicks on their own DOM; buttons, links, form controls and `data-row-click-ignore` inside the row are still ignored, and Enter/Space on a focused row still open it. Apps can delete the wrappers that stopped click propagation around row actions. `StackedListItem` and `ResourceItem` with `onClick` get the same guard.

## 4.4.1

## 4.4.0

## 4.3.0

### Minor Changes

- 29b12ef: Hilum Shop parity, part 2: Field wiring for every form control, multi-select and tag fields, a resource picker, a preview frame, and fixes found migrating the shop's dashboard and admin.

  **Visible changes to check in your app:** controls marked invalid (by `<Field error>` or `aria-invalid`) now have a destructive border, also on hover and focus, with a destructive focus halo; `SelectTrigger`'s `error` border is the full destructive colour (was 50%). `DataTable` body cells are 14px (were 13px). `StatCard` values no longer truncate: inside a `StatCardGrid` they scale down with the card and wrap. A `PageHeader` with one secondary action shows it inline on mobile instead of in a "More actions" menu. `Switch` forwards `id` and `aria-*` to the switch button instead of its wrapper.

  - **Select inside a `<form>`** no longer calls `onValueChange("")` when a controlled `value` changes after mount (data loaded with its options, a reset). Radix mirrored the value into a hidden native select, which resolved to "" before the option registered and reported it back, wiping the value and dirtying the form. An empty value can't come from the user, so Select drops it.
  - **`Field` label follows its control.** Controls register with the Field in mount order and the first one owns the label; when it unmounts (a loading Input replaced by the real one, an Input swapped for a Select) the next one takes over, and the label follows the owner's own `id` before paint. Apps no longer need `htmlFor` for Hilum controls. The label has an id (`<htmlFor or generated id>-label`); `useFieldControl()` takes `{ labelable: false }` for `role="group"` controls, which are named with `aria-labelledby` while the label drops its `for`. The react-hook-form `FormItem` bridge uses the same registry.
  - **`Field` wires more controls:** `Switch`, `Checkbox`, `Combobox`, `DatePicker`, `DateRangePicker`, `DateTimePicker`, `TimePicker`, `ColorInput` and `InputOTP` take the field's id (or keep their own), hint / error (`aria-describedby`), `aria-invalid`, `aria-required` (on the roles that support it) and `disabled`, and show the error state. `TimePicker`, `DateTimePicker` and `ColorInput` are groups named by the label; `DateTimePicker` passes the state to both halves. `ColorInput` gains `id` and `aria-*` props and names its swatch button (`labels.picker`; new `triggerAriaLabel` on `ColorPickerPopover`). `CheckboxCard` is its own label and doesn't join a surrounding Field. `Field`'s optional props accept `undefined` (for `exactOptionalPropertyTypes`).
  - **Error state for every control:** new `controlInvalidClasses` (aria-invalid) and `controlInvalidWithinClasses` (composite fields with `data-invalid`) for bespoke controls; the stacked variants out-rank plain hover / focus border classes.
  - **New `MultiCombobox`:** pick several options from a searchable list, shown as removable chips in the field; the list stays open while picking (`closeOnSelect`), Backspace removes the last chip, server-side search with `onSearchChange` + `loading` (chips keep their labels when results change; `filterOptions` to keep filtering), `maxSelected`, `clearable`, `name` (a hidden input per value), a screen-reader summary and announcements, the Combobox mobile sheet, Field wiring and `labels`.
  - **New `ResourcePicker`:** Shopify's resource picker as a dialog: search, rows with a thumbnail (a URL rendered as `Thumbnail`, or any node), title, subtitle and meta, checkboxes (or radio buttons with `multiple={false}`), a selection count and Add. Debounced `onSearch` (`searchDelay`), `loading` skeleton rows, `hasMore` / `onLoadMore`, `initialSelectedIds`, `maxSelected`, `renderItem`, and a selection that survives searching (`onSelect(ids, items)`).
  - **New `TagInput` and `Tag`:** free-text tags; Enter or a separator (`separators`, default comma) adds, Backspace removes the last tag, pasted text splits on separators and new lines, duplicates are dropped (case-insensitively unless `caseSensitive`), `normalize`, `maxLength`, `maxTags` (announced), optional `suggestions` with `onInputChange`, `addOnBlur`, `name`, Field wiring and `labels`. `Tag` is the removable chip, exported for filters and read-only labels.
  - **New `PreviewFrame`:** a sandboxed iframe for storefront and theme previews with a required `title`, a mobile / tablet / desktop toggle (Smartphone / Tablet / Monitor icons, `device`, `devices`, `deviceWidths`), the page scaled to fit its container (desktop fills wider ones; smaller devices are framed and centred), a loading skeleton, an error state with retry (`error`, `loadTimeout`, `onRetry`), `sandbox` / `allow` / `referrerPolicy` (default no-referrer), `showOpenInNewTab` and a `toolbar` slot. Sizes go through the style prop, so it works under a strict CSP.
  - **`Steps`:** the circles variant gives each step an equal, top-aligned column, so circles stay on one line when labels wrap (7 steps with long labels), and connectors run circle to circle; labels wrap between words. The bullets variant's upcoming dots are visible (hollow, in the muted text colour), and each dot's name and `aria-current` are on its link.
  - **`DataTable`:** `mobileLayout="cards"` renders rows as stacked cards below `mobileBreakpoint` (`sm` / `md`): the primary column (`mobilePrimaryColumn`) as the title and the other columns (`mobileColumns`) as label / value rows; selection with a select-all, bulk actions, row clicks, loading and empty states work the same. Body cells are 14px, the size of `ResourceCell`'s title, and the docs spell out the hierarchy: title (14px medium) › values (14px regular) › secondary lines (12px muted).
  - **`StatCard`:** labels wrap between words over at most two lines (full text in `title`), with a readable line height, hyphenation and tighter tracking in narrow cells; values scale with the `StatCardGrid` cell (30px down to 18px) and wrap instead of clipping.
  - **@hilum/app-shell:** `PageHeader` keeps a single secondary action inline at every width; the "More actions" menu is for two or more.

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

## 4.1.0

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

### Patch Changes

- Make `PageHeader` use the dashboard mobile-safe responsive layout by default so product apps can consume it directly without local heading adapters.

## 3.5.0

## 3.4.0

### Minor Changes

- 96bd6ec: Add compact two-value and four-value designer controls for dense inspector panels.

  `@hilum/ui` InputNumber now supports mixed values and live commit-on-change behavior for editor controls.

## 3.3.4

### Patch Changes

- Make AppSidebar navigation buttons vertically tighter while preserving the shared Studio-style sidebar structure.
  - @hilum/ui@3.3.4

## 3.3.3

### Patch Changes

- Make `AppSidebar` mirror Hilum Studio's sidebar structure exactly when it is rendered inside the shared `@hilum/ui` sidebar.

  The component now emits the same `SidebarHeader`, `MediaObject`, `SidebarContent`, grouped `SidebarMenu`, `SidebarSeparator`, and `SidebarFooter` primitive tree that Studio uses, without an extra app-shell-specific inner sidebar wrapper.
  - @hilum/ui@3.3.3

## 3.3.2

### Patch Changes

- Restyle the shared app sidebar and header around the Hilum Studio shell treatment.

  `AppSidebar` now composes the same `@hilum/ui` sidebar primitives used in Studio, including grouped menu rendering, brand-primary active states, sidebar badges, account footer styling, and collapsed accessibility labels. It also adds `subtitle`, `headerAction`, and `footer` slots so product apps can share the shell without moving app-specific behavior into the package.
  - @hilum/ui@3.3.2

## 3.3.1

### Patch Changes

- Tighten `SidebarMenuButton` default vertical spacing for denser sidebar navigation.

  Move mobile sidebar close-on-navigation behavior into `AppSidebar` when it is rendered inside a shared `SidebarProvider`.

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

- f41712c: Add compact disabled and loading action states to AppStatusBanner.
  - @hilum/ui@3.2.13

## 3.2.12

### Patch Changes

- f3bcc32: Keep the shared command palette trigger at the compact 36px app control height.
  - @hilum/ui@3.2.12

## 3.2.11

### Patch Changes

- aa3c2db: Reduce empty-state icon containers from 48px to 36px for tighter dashboard and admin layouts.
  Reduce mobile app navigation items from 40px to 36px to keep compact operator headers.
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

- @hilum/ui@3.2.8

## 3.2.7

### Patch Changes

- Reduce compact app-shell account, collapsed sidebar, and dismiss controls from 40px to h-9 w-9.
- Updated dependencies
  - @hilum/ui@3.2.7

## 3.2.6

### Patch Changes

- Updated dependencies
  - @hilum/ui@3.2.6

## 3.2.5

### Patch Changes

- Reduce compact icon trigger defaults from 40px to h-9 w-9 for tighter dashboard controls.
- Updated dependencies
  - @hilum/ui@3.2.5

## 3.2.4

### Patch Changes

- Add reusable page header icon and responsive action layout support for dense dashboard headers.
- Add a reusable `AppMobileNav` shell for compact mobile headers with account menu, horizontal section tabs, and optional mobile nav labels.
- Add `AppCommandPalette` for route/action command palettes driven by app shell navigation data.
- Add `AppCommandButton` for consistent app-shell command palette triggers.
- Add `AppNotificationMenu` for consistent top-bar notification bells, unread badges, empty states, and clear actions.
- Add `AppStatusBanner` for impersonation, preview, maintenance, and other app-level status sessions.
- Updated dependencies
  - @hilum/ui@3.2.4

## 3.2.3

### Patch Changes

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

- 9844039: Constrain AppHeader breadcrumbs so long labels truncate instead of wrapping in compact headers.
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

- @hilum/ui@2.0.4

## 2.0.3

### Patch Changes

- @hilum/ui@2.0.3

## 2.0.2

### Patch Changes

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
