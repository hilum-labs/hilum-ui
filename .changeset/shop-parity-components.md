---
"@hilum/ui": minor
"@hilum/app-shell": minor
"@hilum/designer": minor
---

Shop-parity components so product apps can drop app-local UI:

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
