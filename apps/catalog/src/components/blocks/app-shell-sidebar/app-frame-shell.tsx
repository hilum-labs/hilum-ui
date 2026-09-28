import { useState } from "react";
import {
  BarChart2,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Users,
} from "lucide-react";
import {
  AppCommandButton,
  AppCommandPalette,
  AppHeader,
  AppMobileNav,
  AppShell,
  AppSidebar,
  PageHeader,
  type NavSection,
} from "@hilum/app-shell";
import { Button, StatusBadge, toast } from "@hilum/ui";

// Scoped event so the demo palette doesn't fight the catalog's own ⌘K palette.
const PALETTE_EVENT = "catalog-demo:open-app-frame-palette";

const SECTIONS: NavSection[] = [
  {
    items: [
      { label: "Home", href: "#home", icon: LayoutDashboard },
      {
        label: "Orders",
        href: "#orders",
        icon: ShoppingCart,
        badge: "12",
        children: [
          { label: "Drafts", href: "#orders/drafts" },
          { label: "Abandoned checkouts", href: "#orders/abandoned" },
        ],
      },
      {
        label: "Products",
        href: "#products",
        icon: Package,
        children: [
          { label: "Collections", href: "#products/collections", active: true },
          { label: "Inventory", href: "#products/inventory" },
          { label: "Gift cards", href: "#products/gift-cards" },
        ],
      },
      { label: "Customers", href: "#customers", icon: Users },
      { label: "Discounts", href: "#discounts", icon: Tag },
      { label: "Analytics", href: "#analytics", icon: BarChart2, disabled: true },
    ],
  },
  {
    label: "Admin",
    items: [{ label: "Settings", href: "#settings", icon: Settings }],
  },
];

// Keep demo links inside the preview instead of navigating the catalog.
function DemoLink({
  href,
  children,
  onClick,
  ...rest
}: {
  href: string;
  children?: React.ReactNode;
  onClick?: (event: unknown) => void;
  [key: string]: unknown;
}) {
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
 * `@hilum/app-shell` frame: skip link, `<main>`, nested sidebar navigation,
 * header search slot, global loading bar and a Polaris-style page header whose
 * secondary actions overflow into "More actions" on narrow widths.
 */
export default function AppFrameShell() {
  const [loading, setLoading] = useState(false);

  function simulateSave() {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      toast.success("Collection saved");
    }, 1500);
  }

  return (
    <AppShell
      linkComponent={DemoLink}
      // The catalog already mounts a <Toaster /> at the root.
      toaster={false}
      loading={loading}
      className="h-[640px]"
      mainClassName="bg-background p-4 sm:p-6"
      sidebar={
        <AppSidebar
          brand="Hilum Shop"
          subtitle="Demo store"
          sections={SECTIONS}
          className="hidden h-full md:flex"
        />
      }
      banner={
        <AppMobileNav
          brand="Hilum Shop"
          subtitle="Demo store"
          sections={SECTIONS}
          user={{ name: "Ada Lovelace", initials: "AL" }}
        />
      }
      header={
        <AppHeader
          className="hidden md:flex"
          breadcrumbs={[
            { label: "Products", href: "#products" },
            { label: "Collections", href: "#products/collections" },
            { label: "Summer sale" },
          ]}
        />
      }
      search={<AppCommandButton label="Search products, orders…" openEventName={PALETTE_EVENT} />}
    >
      <AppCommandPalette
        sections={SECTIONS}
        listenForHotkey={false}
        openEventName={PALETTE_EVENT}
        onNavigate={(href) => toast(`Navigate to ${href}`)}
      />
      <PageHeader
        title="Summer sale"
        backAction={{ label: "Collections", href: "#products/collections" }}
        titleMetadata={<StatusBadge status="active" />}
        description="24 products · Automated collection"
        primaryAction={{ label: "Save", onAction: simulateSave, loading }}
        secondaryActions={[
          { label: "Duplicate", onAction: () => toast("Duplicated") },
          { label: "Preview", href: "#preview" },
          { label: "Export", onAction: () => toast("Export started") },
          { label: "Delete collection", destructive: true, onAction: () => toast("Deleted") },
        ]}
      />
      <div className="mt-6 flex flex-col gap-3">
        <p className="body text-muted-foreground">
          Press <kbd className="caption rounded border border-border px-1">Tab</kbd> from the top of
          the preview to reveal the skip link. Resize the preview to see the actions collapse into
          “More actions” and the navigation move into a drawer.
        </p>
        <div>
          <Button variant="outline" onClick={() => setLoading((value) => !value)}>
            {loading ? "Stop loading" : "Toggle loading bar"}
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
