# @hilum/app-shell

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
