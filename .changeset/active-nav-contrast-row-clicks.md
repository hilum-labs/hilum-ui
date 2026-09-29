---
"@hilum/ui": patch
"@hilum/app-shell": patch
---

Active nav items meet WCAG AA contrast, and clickable rows ignore clicks inside portals.

**Visible change to check in your app:** the active item in `Sidebar` (`SidebarMenuButton`, `SidebarMenuSubButton`, so every `AppSidebar` item), the `AppMobileNav` tabs and `AppNavTree` (the mobile drawer) keeps its brand tint, but its text and icon use the new `--brand-text` token instead of `brand-primary`: a darker purple in light mode (`#9c00c0`), a lighter one in dark mode (`#d870f9`) and white in the mid theme. `#C100F1` on its own 10% tint was 3.9:1 in light mode (3.1:1 on dark cards), below the 4.5:1 AA needs, so axe flagged the sidebar on every page; it is now 5.1–8:1 in every theme, hovered too.

- **`--brand-text` (`text-brand-text`):** brand-coloured text that stays ≥ 4.5:1 on every surface and on the brand tint (`bg-brand-primary/10`–`/15`), for your own active or selected items. `createTheme()` emits it for light, dark and mid (the palette shade closest to `primary` that passes; on the mid gray a bright brand gets the best of black and white), and returns it as `brandText`.
- **`DataTable` `onRowClick` ignores clicks inside portals.** React bubbles events through portals, so confirming a row action's `ConfirmDialog` (or picking an item in its `DropdownMenu`, or clicking anywhere in a `Dialog` opened from the row) also clicked the row and navigated. Rows (and `mobileLayout="cards"` cards) now only react to clicks on their own DOM; buttons, links, form controls and `data-row-click-ignore` inside the row are still ignored, and Enter/Space on a focused row still open it. Apps can delete the wrappers that stopped click propagation around row actions. `StackedListItem` and `ResourceItem` with `onClick` get the same guard.
