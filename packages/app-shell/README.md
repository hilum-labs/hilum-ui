# @hilum/app-shell

Composed product-app layouts — sidebar navigation, top bar, page headers, detail/settings screens. Built on `@hilum/ui` primitives. Used by every Hilum product app (CRM, admin, dashboard, etc.) to ensure structural consistency.

```tsx
import { AppShell, AppSidebar, AppHeader } from "@hilum/app-shell"
import Link from "next/link"

<AppShell linkComponent={Link}>
  <AppSidebar
    sections={[
      {
        label: "Workspace",
        items: [
          { label: "Dashboard", href: "/", icon: HomeIcon, active: pathname === "/" },
          { label: "Projects", href: "/projects", icon: FolderIcon },
        ],
      },
    ]}
    user={currentUser}
  />
  <AppHeader breadcrumbs={[{ label: "Home", href: "/" }]} />
  <main>{children}</main>
</AppShell>
```

## Routing

`@hilum/app-shell` is router-agnostic. Pass your router's link component via `<AppShell linkComponent={Link}>`. Active state is caller-computed — pass `active: boolean` per nav item using your router's pathname.
