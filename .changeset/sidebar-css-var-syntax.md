---
'@hilum/ui': patch
---

Fix Sidebar width — use correct Tailwind v4 CSS variable syntax.

The `Sidebar` component used `w-[--sidebar-width]` (a Tailwind **v3** arbitrary-value syntax). In Tailwind **v4** the same bracket form is treated as a literal value and emits invalid CSS — `width: --sidebar-width;` instead of `width: var(--sidebar-width);` — so the sidebar fell back to content-based width, ignoring both the default (`16rem`) and any consumer override on `SidebarProvider`'s `--sidebar-width`.

Migrated all four affected utilities to v4's CSS-variable shorthand `(--var)`:

- `w-[--sidebar-width]` → `w-(--sidebar-width)`
- `w-[--sidebar-width-icon]` → `w-(--sidebar-width-icon)`
- `max-w-[--skeleton-width]` → `max-w-(--skeleton-width)` (in `SidebarMenuSkeleton`)

After this fix, consumers can set sidebar width via `<SidebarProvider style={{ '--sidebar-width': '13rem' }}>` and it'll take effect without needing a width override on `<Sidebar>` itself.
