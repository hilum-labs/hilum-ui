import { BarChart2, FolderOpen, LayoutDashboard, Users } from "lucide-react";
import { AppShellStacked, PageHeader, type LinkComponentProps } from "@hilum/app-shell";
import { Input } from "@hilum/ui";

// Keep demo links inside the preview instead of navigating the catalog.
function DemoLink({ href, children, onClick, ...rest }: LinkComponentProps) {
  return (
    <a
      href={href}
      {...rest}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}

/**
 * `@hilum/app-shell` stacked frame: below `md` the navbar links move into a
 * menu sheet; the search slot, skip link and `<main>` come from the frame.
 */
export default function AppFrameStacked() {
  return (
    <AppShellStacked
      linkComponent={DemoLink}
      toaster={false}
      className="h-[480px]"
      mainClassName="bg-background p-4 sm:p-6"
      logo={<span className="body font-bold text-foreground">Hilum</span>}
      items={[
        { label: "Dashboard", href: "#dashboard", icon: LayoutDashboard, active: true },
        { label: "Team", href: "#team", icon: Users },
        { label: "Projects", href: "#projects", icon: FolderOpen },
        { label: "Reports", href: "#reports", icon: BarChart2, disabled: true },
      ]}
      search={
        <Input type="search" placeholder="Search…" aria-label="Search" className="hidden sm:flex" />
      }
    >
      <PageHeader
        title="Dashboard"
        description="Resize the preview below 768px to reveal the menu button."
        primaryAction={{ label: "New project", href: "#projects/new" }}
        secondaryActions={[{ label: "Export" }, { label: "Share" }]}
      />
    </AppShellStacked>
  );
}
