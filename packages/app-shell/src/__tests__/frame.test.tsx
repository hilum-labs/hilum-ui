import { describe, it, expect, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LayoutDashboard, Package } from "lucide-react";
import { LinkProvider as UiLinkProvider, useLink as useUiLink } from "@hilum/ui";
import {
  AppCommandPalette,
  AppHeader,
  AppLoadingBar,
  AppMobileNav,
  AppNavTree,
  AppShell,
  AppShellStacked,
  AppSidebar,
  flattenNavSections,
  isNavItemActive,
  LinkProvider,
  Navbar,
  PageHeader,
  SignInScreen,
  SkipLink,
  useAppFrame,
  useLink,
  type LinkComponent,
  type NavItem,
  type NavSection,
} from "../index";

const nestedSections: NavSection[] = [
  {
    label: "Store",
    items: [
      { label: "Home", href: "/", icon: LayoutDashboard },
      {
        label: "Products",
        href: "/products",
        icon: Package,
        children: [
          { label: "Collections", href: "/products/collections", active: true },
          { label: "Inventory", href: "/products/inventory" },
        ],
      },
      {
        label: "Orders",
        href: "/orders",
        children: [{ label: "Drafts", href: "/orders/drafts" }],
      },
      { label: "Analytics", href: "/analytics", disabled: true },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Link context                                                         */
/* ------------------------------------------------------------------ */

describe("link context is shared with @hilum/ui", () => {
  it("re-exports the @hilum/ui provider and hook", () => {
    expect(LinkProvider).toBe(UiLinkProvider);
    expect(useLink).toBe(useUiLink);
  });

  it("AppShell linkComponent drives @hilum/ui's useLink", () => {
    const CustomLink: LinkComponent = ({ href, children }) => (
      <a data-testid="custom" href={href}>
        {children}
      </a>
    );
    function UiConsumer() {
      const Link = useUiLink();
      return <Link href="/x">ui link</Link>;
    }
    render(
      <AppShell linkComponent={CustomLink} toaster={false}>
        <UiConsumer />
      </AppShell>,
    );
    expect(screen.getByTestId("custom")).toHaveTextContent("ui link");
  });
});

/* ------------------------------------------------------------------ */
/* Landmarks & skip link                                                */
/* ------------------------------------------------------------------ */

describe("AppShell frame", () => {
  it("renders a skip link targeting a focusable main region", () => {
    render(
      <AppShell toaster={false} sidebar={<div>side</div>} header={<AppHeader />}>
        <p>Page</p>
      </AppShell>,
    );
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(main).toHaveTextContent("Page");

    const skip = screen.getByRole("link", { name: "Skip to content" });
    expect(skip).toHaveAttribute("href", "#main-content");
    expect(skip).toHaveClass("sr-only", "focus:not-sr-only");
    fireEvent.click(skip);
    expect(document.activeElement).toBe(main);
  });

  it("supports a custom main id and opting out of main / skip link", () => {
    const { rerender } = render(
      <AppShell toaster={false} mainId="content" skipLink="Jump to page">
        <p>Page</p>
      </AppShell>,
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "content");
    expect(screen.getByRole("link", { name: "Jump to page" })).toHaveAttribute("href", "#content");

    rerender(
      <AppShell toaster={false} main={false} skipLink={false}>
        <main id="main-content">Own main</main>
      </AppShell>,
    );
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.queryByRole("link", { name: /skip/i })).not.toBeInTheDocument();
  });

  it("uses dynamic viewport height and exposes --hilum-header-height", () => {
    const { container } = render(
      <AppShell toaster={false} headerHeight={56}>
        <p>Page</p>
      </AppShell>,
    );
    const frame = container.querySelector("[data-slot='app-frame']") as HTMLElement;
    expect(frame).toHaveClass("h-dvh");
    expect(frame.className).not.toMatch(/h-screen/);
    expect(frame.style.getPropertyValue("--hilum-header-height")).toBe("56px");
  });

  it("shows a loading bar and marks main as busy while loading", () => {
    const { rerender } = render(
      <AppShell toaster={false} loading loadingLabel="Loading page">
        <p>Page</p>
      </AppShell>,
    );
    expect(screen.getByRole("progressbar", { name: "Loading page" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");

    rerender(
      <AppShell toaster={false}>
        <p>Page</p>
      </AppShell>,
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getByRole("main")).not.toHaveAttribute("aria-busy");
  });

  it("mounts the toaster by default and allows opting out", () => {
    const { rerender } = render(
      <AppShell>
        <p>Page</p>
      </AppShell>,
    );
    expect(document.querySelector("[aria-label^='Notifications']")).toBeInTheDocument();

    rerender(
      <AppShell toaster={false}>
        <p>Page</p>
      </AppShell>,
    );
    expect(document.querySelector("[aria-label^='Notifications']")).not.toBeInTheDocument();
  });

  it("passes the search slot to AppHeader through the frame context", () => {
    function Probe() {
      return <span data-testid="main-id">{useAppFrame()?.mainId}</span>;
    }
    render(
      <AppShell
        toaster={false}
        search={<input aria-label="Search store" />}
        header={<AppHeader breadcrumbs={[{ label: "Home" }]} />}
      >
        <Probe />
      </AppShell>,
    );
    const header = screen.getByRole("banner");
    expect(within(header).getByRole("textbox", { name: "Search store" })).toBeInTheDocument();
    expect(screen.getByTestId("main-id")).toHaveTextContent("main-content");
  });

  it("renders banner content above the header in the content column", () => {
    render(
      <AppShell toaster={false} banner={<div>Trial ends soon</div>} header={<AppHeader />}>
        <p>Page</p>
      </AppShell>,
    );
    const banner = screen.getByText("Trial ends soon");
    expect(
      banner.compareDocumentPosition(screen.getByRole("banner")) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe("AppShellStacked frame", () => {
  it("renders skip link, main, navbar search and loading state", () => {
    render(
      <AppShellStacked
        toaster={false}
        loading
        items={[{ label: "Docs", href: "/docs" }]}
        search={<input aria-label="Search docs" />}
      >
        <p>Body</p>
      </AppShellStacked>,
    );
    expect(screen.getByRole("link", { name: "Skip to content" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("textbox", { name: "Search docs" })).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});

describe("AppLoadingBar / SkipLink", () => {
  it("renders nothing when inactive", () => {
    const { container } = render(<AppLoadingBar active={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders no runtime <style>: its sweep and reduced-motion rules ship in tokens.css", () => {
    const before = document.querySelectorAll("style").length;
    const { container } = render(<AppLoadingBar />);
    expect(document.querySelectorAll("style")).toHaveLength(before);
    expect(container.querySelector("[data-slot='app-loading-bar-indicator']")).toBeInTheDocument();
  });

  it("does nothing special when the target is missing", () => {
    render(<SkipLink targetId="nowhere" />);
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(fireEvent.click(link)).toBe(true);
  });
});

describe("SignInScreen landmark", () => {
  it("wraps the form in a main region", () => {
    render(
      <SignInScreen title="Sign in">
        <form aria-label="Sign in form" />
      </SignInScreen>,
    );
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(within(main).getByRole("heading", { name: "Sign in" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Breadcrumbs                                                          */
/* ------------------------------------------------------------------ */

describe("AppHeader breadcrumbs", () => {
  it("renders an ordered list with the last crumb as the current page", () => {
    render(
      <AppHeader
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: "T-shirt", href: "/products/1" },
        ]}
      />,
    );
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    const list = within(nav).getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    const current = within(nav).getByText("T-shirt");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(within(nav).queryByRole("link", { name: "T-shirt" })).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Sidebar: landmarks, disabled + nested items                          */
/* ------------------------------------------------------------------ */

describe("AppSidebar navigation", () => {
  it("wraps items in a labelled nav and uses dvh in standalone mode", () => {
    const { container } = render(<AppSidebar sections={nestedSections} navLabel="Store nav" />);
    expect(screen.getByRole("navigation", { name: "Store nav" })).toBeInTheDocument();
    expect(container.querySelector("aside")).toHaveClass("h-dvh");
  });

  it("renders disabled items as non-focusable, aria-disabled placeholders", () => {
    render(<AppSidebar sections={nestedSections} />);
    const disabled = screen.getByRole("link", { name: "Analytics" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).not.toHaveAttribute("href");
    expect(disabled.tagName).toBe("SPAN");
    expect(disabled).not.toHaveAttribute("tabindex");
  });

  it("auto-expands a parent with an active child and toggles sub-items", () => {
    render(<AppSidebar sections={nestedSections} />);
    const productsToggle = screen.getByRole("button", { name: "Collapse Products" });
    expect(productsToggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "Collections" })).toHaveAttribute(
      "aria-current",
      "page",
    );

    const ordersToggle = screen.getByRole("button", { name: "Expand Orders" });
    expect(ordersToggle).toHaveAttribute("aria-expanded", "false");
    const ordersList = document.getElementById(ordersToggle.getAttribute("aria-controls")!);
    expect(ordersList).not.toBeVisible();

    fireEvent.click(ordersToggle);
    expect(ordersToggle).toHaveAttribute("aria-expanded", "true");
    expect(ordersList).toBeVisible();
    expect(screen.getByRole("link", { name: "Drafts" })).toHaveAttribute("href", "/orders/drafts");
  });

  it("expands when a child becomes active after navigation", () => {
    const sections = (active: boolean): NavSection[] => [
      {
        items: [
          {
            label: "Orders",
            href: "/orders",
            children: [{ label: "Drafts", href: "/orders/drafts", active }],
          },
        ],
      },
    ];
    const { rerender } = render(<AppSidebar sections={sections(false)} />);
    expect(screen.getByRole("button", { name: "Expand Orders" })).toBeInTheDocument();
    rerender(<AppSidebar sections={sections(true)} />);
    expect(screen.getByRole("button", { name: "Collapse Orders" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("calls item onClick for nested links", () => {
    const onClick = vi.fn();
    render(
      <AppSidebar
        sections={[
          {
            items: [
              {
                label: "Orders",
                href: "/orders",
                defaultExpanded: true,
                children: [{ label: "Drafts", href: "/orders/drafts", onClick }],
              },
            ],
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("link", { name: "Drafts" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});

/* ------------------------------------------------------------------ */
/* Mobile navigation                                                    */
/* ------------------------------------------------------------------ */

describe("AppMobileNav variants", () => {
  const manyItems: NavItem[] = ["A", "B", "C", "D", "E", "F"].map((label) => ({
    label,
    href: `/${label.toLowerCase()}`,
  }));

  it("keeps the tab strip for few items and renders disabled tabs without href", () => {
    render(
      <AppMobileNav
        brand="Admin"
        sections={[
          {
            items: [
              { label: "Home", href: "/" },
              { label: "Soon", href: "/soon", disabled: true },
            ],
          },
        ]}
      />,
    );
    expect(screen.queryByRole("button", { name: "Open navigation" })).not.toBeInTheDocument();
    const disabled = screen.getByRole("link", { name: "Soon" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
    expect(disabled).not.toHaveAttribute("href");
  });

  it("defaults to the drawer variant above five items", () => {
    render(<AppMobileNav brand="Admin" sections={[{ items: manyItems }]} />);
    expect(screen.getByRole("button", { name: "Open navigation" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "A" })).not.toBeInTheDocument();
  });

  it("opens a sheet with the full sectioned + nested nav and closes on navigate", async () => {
    render(<AppMobileNav brand="Shop" variant="drawer" sections={nestedSections} />);
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const dialog = await screen.findByRole("dialog");
    const nav = within(dialog).getByRole("navigation", { name: "Mobile sections" });
    expect(within(nav).getByText("Store")).toBeInTheDocument();
    expect(within(nav).getByRole("link", { name: "Collections" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(within(nav).getByRole("button", { name: "Collapse Products" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(within(nav).getByRole("link", { name: "Analytics" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    fireEvent.click(within(nav).getByRole("link", { name: "Home" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("drawer section labels follow sectionLabelVariant", async () => {
    const { unmount } = render(
      <AppMobileNav brand="Shop" variant="drawer" sections={nestedSections} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    expect(within(await screen.findByRole("dialog")).getByText("Store")).toHaveClass("label");
    unmount();

    render(
      <AppMobileNav
        brand="Shop"
        variant="drawer"
        sections={nestedSections}
        sectionLabelVariant="plain"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open navigation" }));
    const label = within(await screen.findByRole("dialog")).getByText("Store");
    expect(label).toHaveClass("caption", "font-medium", "normal-case", "tracking-normal");
    expect(label).not.toHaveClass("label");
  });

  it("allows forcing the tab variant", () => {
    render(<AppMobileNav brand="Admin" variant="tabs" sections={[{ items: manyItems }]} />);
    expect(screen.getByRole("link", { name: "F" })).toHaveAttribute("href", "/f");
  });
});

describe("Navbar mobile menu", () => {
  it("renders a menu button that opens a sheet listing every item", async () => {
    render(
      <Navbar
        items={[
          { label: "Home", href: "/", active: true },
          { label: "Pricing", href: "/pricing" },
          { label: "Careers", href: "/careers", disabled: true },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Open menu" });
    expect(trigger).toHaveClass("md:hidden");
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("link", { name: "Pricing" })).toHaveAttribute(
      "href",
      "/pricing",
    );
    expect(within(dialog).getByRole("link", { name: "Careers" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("omits the menu button when mobileMenu is false or there are no items", () => {
    const { rerender } = render(
      <Navbar items={[{ label: "Home", href: "/" }]} mobileMenu={false} />,
    );
    expect(screen.queryByRole("button", { name: "Open menu" })).not.toBeInTheDocument();
    rerender(<Navbar />);
    expect(screen.queryByRole("button", { name: "Open menu" })).not.toBeInTheDocument();
  });
});

describe("AppNavTree", () => {
  it("renders a labelled nav and calls onNavigate after clicks", () => {
    const onNavigate = vi.fn();
    render(<AppNavTree sections={nestedSections} label="Drawer" onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("link", { name: "Home" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("navigation", { name: "Drawer" })).toBeInTheDocument();
  });

  it("section labels are uppercase eyebrows by default, sentence case with sectionLabelVariant='plain'", () => {
    const { rerender } = render(<AppNavTree sections={nestedSections} />);
    expect(screen.getByText("Store")).toHaveClass("label", "px-2", "text-muted-foreground");
    rerender(<AppNavTree sections={nestedSections} sectionLabelVariant="plain" />);
    const label = screen.getByText("Store");
    expect(label).toHaveClass(
      "caption",
      "font-medium",
      "normal-case",
      "tracking-normal",
      "px-2",
      "text-muted-foreground",
    );
    expect(label).not.toHaveClass("label");
  });
});

describe("active nav item colours", () => {
  // tokens.test.ts checks text-brand-text on these brand tints in every theme;
  // brand-primary text on its own 10% tint was 3.9:1.
  const expectBrandText = (element: HTMLElement) => {
    expect(element.className).toContain("bg-brand-primary/10");
    expect(element.className).toContain("text-brand-text");
    expect(element.className).not.toContain("text-brand-primary");
  };

  it("AppNavTree (the mobile drawer) and AppMobileNav tabs", () => {
    render(<AppNavTree sections={nestedSections} label="Drawer" />);
    expectBrandText(screen.getByRole("link", { name: "Collections" }));
    cleanup();
    render(
      <AppMobileNav
        brand="Admin"
        variant="tabs"
        sections={[{ items: [{ label: "Home", href: "/", active: true }] }]}
      />,
    );
    expectBrandText(screen.getByRole("link", { name: "Home" }));
  });

  it("AppSidebar top-level and nested items", () => {
    render(
      <AppSidebar
        sections={[
          {
            items: [
              { label: "Orders", href: "/orders", active: true },
              ...nestedSections[0]!.items,
            ],
          },
        ]}
      />,
    );
    expectBrandText(screen.getByRole("link", { name: "Orders", current: "page" }));
    const nested = screen.getByRole("link", { name: "Collections" });
    expect(nested.className).toContain("text-brand-text");
    expect(nested.className).not.toContain("text-brand-primary");
  });
});

describe("nav helpers", () => {
  it("flattens nested items and detects active descendants", () => {
    expect(flattenNavSections(nestedSections).map((item) => item.label)).toEqual([
      "Home",
      "Products",
      "Collections",
      "Inventory",
      "Orders",
      "Drafts",
      "Analytics",
    ]);
    expect(isNavItemActive(nestedSections[0]!.items[1]!)).toBe(true);
    expect(isNavItemActive(nestedSections[0]!.items[2]!)).toBe(false);
  });

  it("includes nested items in the command palette", () => {
    render(<AppCommandPalette open sections={nestedSections} />);
    expect(screen.getByText("Collections")).toBeInTheDocument();
    expect(screen.getByText("Drafts")).toBeInTheDocument();
    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
  });

  it("toggles the command palette with the hotkey without re-subscribing", () => {
    const onOpenChange = vi.fn();
    render(<AppCommandPalette sections={nestedSections} onOpenChange={onOpenChange} />);
    fireEvent.keyDown(document, { key: "k", metaKey: true });
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});

/* ------------------------------------------------------------------ */
/* PageHeader                                                           */
/* ------------------------------------------------------------------ */

describe("PageHeader actions API", () => {
  it("renders primary, inline secondary and a More actions menu", () => {
    const onExport = vi.fn();
    const { container } = render(
      <PageHeader
        title="Products"
        primaryAction={{ label: "Add product", href: "/products/new" }}
        secondaryActions={[
          { label: "Export", onAction: onExport },
          { label: "Import" },
          { label: "Archive", destructive: true },
          { label: "Duplicate" },
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Add product" })).toHaveAttribute(
      "href",
      "/products/new",
    );
    // Wide: first 3 secondaries inline (hidden below @3xl), 4th overflows.
    const exportButton = screen.getByRole("button", { name: "Export" });
    expect(exportButton).toHaveClass("hidden", "@3xl/page-header:inline-flex");
    fireEvent.click(exportButton);
    expect(onExport).toHaveBeenCalledTimes(1);

    const menus = container.querySelectorAll("[data-slot='page-header-more-actions']");
    expect(menus).toHaveLength(2);
    expect(menus[0]).toHaveClass("@3xl/page-header:hidden");
    expect(menus[0]).toHaveTextContent("More actions");
    expect(container.querySelector("[data-slot='page-header']")).toHaveClass(
      "@container/page-header",
    );
  });

  it("opens the overflow menu and runs the action", async () => {
    const onDuplicate = vi.fn();
    render(
      <PageHeader
        title="Products"
        maxVisibleSecondaryActions={0}
        secondaryActions={[{ label: "Duplicate", onAction: onDuplicate }]}
      />,
    );
    const user = userEvent.setup();
    await user.click(screen.getAllByRole("button", { name: /more actions/i })[0]!);
    await user.click(await screen.findByRole("menuitem", { name: "Duplicate" }));
    expect(onDuplicate).toHaveBeenCalledTimes(1);
  });

  it("renders a back action button and title metadata", () => {
    const onBack = vi.fn();
    const { rerender } = render(
      <PageHeader
        title="#1042"
        backAction={{ label: "Orders", href: "/orders" }}
        titleMetadata={<span>Paid</span>}
      />,
    );
    expect(screen.getByRole("link", { name: "Back to Orders" })).toHaveAttribute("href", "/orders");
    expect(screen.getByText("Paid").closest("[data-slot='page-header-badges']")).not.toBeNull();

    rerender(<PageHeader title="#1042" backAction={{ label: "Orders", onAction: onBack }} />);
    fireEvent.click(screen.getByRole("button", { name: "Back to Orders" }));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("keeps free-form actions working alongside structured ones", () => {
    render(
      <PageHeader
        title="Orders"
        primaryAction={{ label: "Create order", onAction: () => {} }}
        actions={<button>Custom</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Create order" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Custom" })).toBeInTheDocument();
  });
});
