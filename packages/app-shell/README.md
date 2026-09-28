# @hilum/app-shell

Composed product-app layouts — app frame, sidebar navigation, top bar, page headers, detail/settings screens. Built on `@hilum/ui` primitives. Used by every Hilum product app (CRM, admin, dashboard, etc.) to ensure structural consistency.

```tsx
import {
  AppCommandButton,
  AppCommandPalette,
  AppHeader,
  AppMobileNav,
  AppShell,
  AppSidebar,
} from "@hilum/app-shell";
import Link from "next/link";

<AppShell
  linkComponent={Link}
  sidebar={<AppSidebar sections={sections} user={currentUser} className="hidden md:flex" />}
  banner={<AppMobileNav brand="Hilum Shop" sections={sections} user={currentUser} />}
  header={
    <AppHeader breadcrumbs={[{ label: "Products", href: "/products" }, { label: "T-shirt" }]} />
  }
  search={<AppCommandButton />}
  loading={isNavigating}
>
  <AppCommandPalette sections={sections} onNavigate={router.push} />
  {children}
</AppShell>;
```

`sections` is a `NavSection[]`:

```ts
const sections: NavSection[] = [
  {
    label: "Store",
    items: [
      { label: "Home", href: "/", icon: HomeIcon, active: pathname === "/" },
      {
        label: "Products",
        href: "/products",
        icon: PackageIcon,
        children: [
          {
            label: "Collections",
            href: "/products/collections",
            active: pathname === "/products/collections",
          },
          { label: "Inventory", href: "/products/inventory" },
        ],
      },
      { label: "Analytics", href: "/analytics", disabled: true },
    ],
  },
];
```

## Routing

`@hilum/app-shell` is router-agnostic. Pass your router's link component via `<AppShell linkComponent={Link}>`. Active state is caller-computed — pass `active: boolean` per nav item using your router's pathname.

The link context lives in `@hilum/ui` (`LinkProvider`, `useLink`, `LinkComponent`, `LinkComponentProps`) and is re-exported here, so **one provider drives links in both packages** — `@hilum/ui` components rendered inside `<AppShell linkComponent>` navigate client-side too. You can also mount `<LinkProvider value={Link}>` yourself above the app.

## The app frame (`AppShell` / `AppShellStacked`)

There is no separate `AppFrame` component: the two shells _are_ the frame and share the same frame props (`AppFrameProps`). Pick `AppShell` for sidebar layouts and `AppShellStacked` for top-nav layouts.

| Prop            | Default          | What it does                                                                                                                                                                                     |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `linkComponent` | plain `<a>`      | Router link used by every Hilum link (see Routing).                                                                                                                                              |
| `sidebar`       | —                | `AppShell` only. Navigation column (`<AppSidebar>`).                                                                                                                                             |
| `header`        | —                | `AppShell` only. Top bar (`<AppHeader>`).                                                                                                                                                        |
| `banner`        | —                | Content above the header (`AppShell`) or below the navbar (`AppShellStacked`) — status banners, `<AppMobileNav>`.                                                                                |
| `search`        | —                | Top-bar search slot. `<AppHeader>` / `<Navbar>` render it automatically (their own `search` prop wins).                                                                                          |
| `loading`       | `false`          | Thin indeterminate progress bar at the top of the frame; sets `aria-busy` on `<main>`. Static under `prefers-reduced-motion`.                                                                    |
| `loadingLabel`  | `"Loading"`      | Accessible name of the progress bar.                                                                                                                                                             |
| `toaster`       | `true`           | Mounts `@hilum/ui`'s `<Toaster>` once. Pass `ToasterProps` to configure, or `false` if the app already mounts one. Fire toasts with `toast()` from `@hilum/ui`.                                  |
| `main`          | `true`           | Wraps children in `<main id={mainId} tabIndex={-1}>`. Pass `false` to render your own `<main>` (give it the same id).                                                                            |
| `mainId`        | `"main-content"` | Id of the main region / skip-link target.                                                                                                                                                        |
| `mainClassName` | —                | Classes for the generated `<main>`.                                                                                                                                                              |
| `skipLink`      | `true`           | Renders a "Skip to content" link that becomes visible on focus. Pass a node to change its text, `false` to omit.                                                                                 |
| `headerHeight`  | `"4rem"`         | Sets `--hilum-header-height` on the frame. `AppHeader` and `Navbar` size themselves from it; sticky surfaces such as `ContextualSaveBar` can offset with `top-[var(--hilum-header-height,0px)]`. |

The frame fills the dynamic viewport (`h-dvh`), so it doesn't hide behind mobile browser toolbars. Components inside the frame can read `{ search, mainId }` with `useAppFrame()`.

> **Migrating from the children-only composition.** Earlier versions expected `<AppSidebar>`, `<AppHeader>` and your own `<main>` as children. `AppShell` now wraps children in `<main>`, so either move the sidebar/header into the `sidebar`/`header` props (recommended), or keep the old markup and pass `main={false}` plus `id="main-content"` on your `<main>`.

`SkipLink` and `AppLoadingBar` are exported for custom frames.

## Navigation

- **`AppSidebar`** — sectioned navigation wrapped in `<nav aria-label={navLabel}>` (default "Main"). Works standalone (renders an `<aside>`) or inside `@hilum/ui`'s `<Sidebar>` (collapsible, `collapsed` for the icon rail).
- **Nested items** — `NavItem.children` render as a collapsible sub-list with a toggle button (`aria-expanded` / `aria-controls`). A parent auto-expands whenever one of its descendants is `active` (also after client-side navigation); `defaultExpanded` sets the initial state otherwise.
- **Disabled items** — `disabled: true` renders a non-focusable `<span role="link" aria-disabled="true">` (no `href`) in every navigation component.
- **`AppMobileNav`** — mobile (below `md`) top bar with two variants:
  - `variant="tabs"` — horizontally scrolling tab strip of top-level items.
  - `variant="drawer"` — hamburger button opening a sheet with the full sectioned + nested navigation (`<AppNavTree>`), closing on navigate.
  - Default: `drawer` when there are more than 5 top-level items or any item has `children`, otherwise `tabs`.
- **`Navbar`** — top bar for `AppShellStacked` / marketing pages. Below `md` its links move into a menu sheet (`mobileMenu`, `menuLabel`, `menuTitle`); `navLabel` names the landmark.
- **`AppNavTree`** — the full nested nav list used by the drawers; drop it into any custom sheet.
- **`AppCommandPalette`** — ⌘K palette; includes nested nav items.
- Helpers: `flattenNavSections`, `flattenNavItems`, `isNavItemActive`.

## Breadcrumbs

`<AppHeader breadcrumbs>` renders `<nav aria-label="Breadcrumb"><ol><li>…`, with the last crumb marked `aria-current="page"` (never a link).

## PageHeader

Polaris `Page`-style header:

```tsx
<PageHeader
  title="Summer sale"
  backAction={{ label: "Collections", href: "/collections" }}
  titleMetadata={<StatusBadge status="active" />}
  description="24 products"
  primaryAction={{ label: "Save", onAction: save, loading: saving }}
  secondaryActions={[
    { label: "Duplicate", onAction: duplicate },
    { label: "Preview", href: "/preview" },
    { label: "Delete", destructive: true, onAction: remove },
  ]}
/>
```

- `primaryAction` / `secondaryActions` (`PageHeaderAction`: `label`, `href` or `onAction`, `icon`, `disabled`, `loading`, `destructive`, `accessibilityLabel`).
- Secondary actions show inline on wide headers (up to `maxVisibleSecondaryActions`, default 3; the rest overflow) and collapse into a **"More actions"** menu (`moreActionsLabel`) when the header is narrow. Sizing uses **container queries** on the header (`@container/page-header`), not the viewport, so it adapts inside split panes and modals.
- `backAction` — icon-only back button beside the title ("Back to {label}"). The text-style `back` link is still supported.
- `titleMetadata` (alias of `badges`) — inline metadata after the title; `meta` — metadata row below.
- `actions` still accepts free-form nodes (rendered after the structured actions). `PageHeaderActions` no longer relies on app-specific classes (`.dashboard-action-*`) or viewport widths; give a child `data-span="full"` to keep it full-width in the stacked layout.

## Other screens

`DetailScreen`, `SettingsScreen`, `SignInScreen` (renders its form inside `<main id="main-content">`), `AppStatusBanner`, `AppNotificationMenu`.

## RTL

Layout classes are logical (`ms`/`me`/`ps`/`pe`/`start`/`end`, `text-start`, `border-s`/`border-e`) and directional icons flip under `dir="rtl"`.
