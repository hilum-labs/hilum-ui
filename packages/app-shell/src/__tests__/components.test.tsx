import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppShell } from "../app-shell";
import { AppShellStacked } from "../app-shell-stacked";
import {
  APP_COMMAND_PALETTE_EVENT,
  AppCommandButton,
  AppCommandPalette,
} from "../app-command-palette";
import { AppAccountMenu } from "../app-account-menu";
import { AppHeader } from "../app-header";
import { AppMobileNav } from "../app-mobile-nav";
import { AppNotificationMenu } from "../app-notification-menu";
import { AppSidebar } from "../app-sidebar";
import { AppStatusBanner } from "../app-status-banner";
import { PageHeader, PageHeaderActions } from "../page-header";
import { DetailScreen } from "../detail-screen";
import { SettingsScreen } from "../settings-screen";
import { SignInDecoration, SignInScreen } from "../sign-in-screen";
import { Navbar } from "../navbar";
import { useLink } from "../index";

/* ------------------------------------------------------------------ */
/* AppShell                                                             */
/* ------------------------------------------------------------------ */

describe("AppShell", () => {
  it("renders children", () => {
    render(
      <AppShell>
        <p>App content</p>
      </AppShell>,
    );
    expect(screen.getByRole("main")).toHaveTextContent("App content");
  });

  it("renders without linkComponent", () => {
    render(
      <AppShell>
        <div>No link</div>
      </AppShell>,
    );
    expect(screen.getByText("No link")).toBeInTheDocument();
  });

  it("uses injected linkComponent", () => {
    const CustomLink = ({ href, children }: { href: string; children?: React.ReactNode }) => (
      <a data-testid="custom-link" href={href}>
        {children}
      </a>
    );
    render(
      <AppShell linkComponent={CustomLink}>
        <div>content</div>
      </AppShell>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* AppCommandPalette                                                    */
/* ------------------------------------------------------------------ */

describe("AppCommandPalette", () => {
  it("renders a command trigger with the default label and shortcut", () => {
    render(<AppCommandButton />);

    // The accessible name starts with the visible label (WCAG 2.5.3).
    const button = screen.getByRole("button", { name: "Search (Ctrl+K)" });
    expect(button).toHaveAttribute("aria-keyshortcuts", "Meta+K Control+K");
    expect(screen.getByText("Search")).toBeInTheDocument();
    expect(screen.getByText("Ctrl K")).toBeInTheDocument();
  });

  it("shows the ⌘ shortcut on Apple devices", async () => {
    const platform = Object.getOwnPropertyDescriptor(Navigator.prototype, "platform");
    Object.defineProperty(navigator, "platform", { value: "MacIntel", configurable: true });
    try {
      render(<AppCommandButton />);
      expect(await screen.findByText("⌘K")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Search (⌘K)" })).toBeInTheDocument();
    } finally {
      delete (navigator as unknown as { platform?: string }).platform;
      if (platform) Object.defineProperty(Navigator.prototype, "platform", platform);
    }
  });

  it("dispatches the command palette open event from the trigger", () => {
    let openCount = 0;
    const handleOpen = () => {
      openCount += 1;
    };
    window.addEventListener(APP_COMMAND_PALETTE_EVENT, handleOpen);

    render(<AppCommandButton />);
    fireEvent.click(screen.getByRole("button", { name: /^Search/ }));

    window.removeEventListener(APP_COMMAND_PALETTE_EVENT, handleOpen);
    expect(openCount).toBe(1);
  });

  it("renders navigation sections and actions", () => {
    render(
      <AppCommandPalette
        defaultOpen
        sections={[
          {
            label: "Navigate",
            items: [
              { label: "Dashboard", href: "/dashboard" },
              { label: "Orders", mobileLabel: "Sales", href: "/orders" },
            ],
          },
        ]}
        actions={[{ label: "Create product", href: "/products?action=create", group: "Actions" }]}
      />,
    );

    expect(screen.getByPlaceholderText("Search pages, actions...")).toBeInTheDocument();
    expect(screen.getByText("Navigate")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Orders")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
    expect(screen.getByText("Create product")).toBeInTheDocument();
  });

  it("calls onNavigate when a navigation item is selected", () => {
    let selectedHref = "";
    render(
      <AppCommandPalette
        defaultOpen
        sections={[{ items: [{ label: "Orders", href: "/orders" }] }]}
        onNavigate={(href) => {
          selectedHref = href;
        }}
      />,
    );

    fireEvent.click(screen.getByText("Orders"));

    expect(selectedHref).toBe("/orders");
  });
});

/* ------------------------------------------------------------------ */
/* AppHeader                                                            */
/* ------------------------------------------------------------------ */

describe("AppHeader", () => {
  it("renders a header element", () => {
    render(
      <AppShell>
        <AppHeader />
      </AppShell>,
    );
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders breadcrumbs", () => {
    render(
      <AppShell>
        <AppHeader breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Users" }]} />
      </AppShell>,
    );
    expect(screen.getByRole("navigation", { name: /breadcrumb/i })).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
  });

  it("renders actions", () => {
    render(
      <AppShell>
        <AppHeader actions={<button>Export</button>} />
      </AppShell>,
    );
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
  });

  it("renders center content", () => {
    render(
      <AppShell>
        <AppHeader center={<input placeholder="Search" />} />
      </AppShell>,
    );
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* AppSidebar                                                          */
/* ------------------------------------------------------------------ */

describe("AppSidebar", () => {
  it("renders Studio-style brand header, sections, badges, and footer slot", () => {
    render(
      <AppShell>
        <AppSidebar
          logo={<span aria-label="Logo">H</span>}
          brand="Pappery"
          subtitle="Admin"
          headerAction={<button>New</button>}
          sections={[
            {
              label: "Workspace",
              items: [
                { label: "Home", href: "/home", active: true, badge: "3" },
                { label: "Templates", href: "/templates" },
              ],
            },
          ]}
          footer={<button>Upgrade</button>}
          user={{ name: "Ada Lovelace", email: "ada@example.com", initials: "AL" }}
        />
      </AppShell>,
    );

    expect(screen.getByText("Pappery")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
    expect(screen.getByText("Workspace")).toBeInTheDocument();
    const activeLink = screen.getByRole("link", { name: /home/i });
    expect(activeLink).toHaveAttribute("aria-current", "page");
    expect(activeLink).toHaveClass("min-h-7", "py-1");
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
  });

  it("collapses labels while keeping icon navigation accessible by title", () => {
    render(
      <AppShell>
        <AppSidebar
          collapsed
          brand="Hilum"
          sections={[{ items: [{ label: "Dashboard", href: "/dashboard", active: true }] }]}
        />
      </AppShell>,
    );

    const link = screen.getByRole("link", { name: "Dashboard" });
    expect(link).toHaveAttribute("href", "/dashboard");
    expect(link).toHaveAttribute("title", "Dashboard");
    expect(screen.queryByText("Hilum")).not.toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
  });

  it("section labels are uppercase eyebrows by default, sentence case with sectionLabelVariant='plain'", () => {
    const sections = [
      { label: "Workspace", items: [{ label: "Home", href: "/home" }] },
      { label: "Library", items: [{ label: "Templates", href: "/templates" }] },
    ];
    const { unmount } = render(<AppSidebar sections={sections} />);
    for (const text of ["Workspace", "Library"]) {
      expect(screen.getByText(text)).toHaveClass("label");
      expect(screen.getByText(text)).not.toHaveClass("normal-case");
    }
    unmount();

    render(<AppSidebar sections={sections} sectionLabelVariant="plain" />);
    for (const text of ["Workspace", "Library"]) {
      const label = screen.getByText(text);
      expect(label).toHaveAttribute("data-slot", "sidebar-group-label");
      expect(label).toHaveClass("caption", "font-medium", "normal-case", "tracking-normal");
      expect(label).not.toHaveClass("label");
    }
  });
});

/* ------------------------------------------------------------------ */
/* AppNotificationMenu                                                  */
/* ------------------------------------------------------------------ */

describe("AppNotificationMenu", () => {
  it("renders a notification trigger with an unread badge", () => {
    render(<AppNotificationMenu items={[{ title: "Export ready" }, { title: "New order" }]} />);

    expect(screen.getByRole("button", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByLabelText("2 unread notifications")).toHaveTextContent("2");
  });

  it("the unread count uses the destructive pair, not the page background as text", () => {
    // `text-background` on the red badge was 1.6:1 in the mid theme.
    render(<AppNotificationMenu items={[{ title: "Export ready" }]} />);
    const badge = screen.getByLabelText("1 unread notifications");
    expect(badge).toHaveClass("bg-destructive", "text-destructive-foreground");
    expect(badge).not.toHaveClass("text-background");
  });

  it("renders empty state when there are no notifications", () => {
    render(<AppNotificationMenu defaultOpen />);

    expect(screen.getByText("No new notifications")).toBeInTheDocument();
  });

  it("renders notification rows and calls row select handlers", () => {
    let selected = false;

    render(
      <AppNotificationMenu
        defaultOpen
        items={[
          {
            title: "Order paid",
            message: "Order #1001 is ready to fulfill.",
            time: "Just now",
            onSelect: () => {
              selected = true;
            },
          },
        ]}
      />,
    );

    expect(screen.getByText("Order #1001 is ready to fulfill.")).toBeInTheDocument();
    expect(screen.getByText("Just now")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Order paid"));

    expect(selected).toBe(true);
  });

  it("calls clear handler from the menu header", () => {
    let cleared = false;

    render(
      <AppNotificationMenu
        defaultOpen
        items={[{ title: "Order paid" }]}
        onClear={() => {
          cleared = true;
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));

    expect(cleared).toBe(true);
  });
});

/* ------------------------------------------------------------------ */
/* AppStatusBanner                                                      */
/* ------------------------------------------------------------------ */

describe("AppStatusBanner", () => {
  it("renders title, description, and tone metadata", () => {
    const { container } = render(
      <AppStatusBanner
        tone="warning"
        title="Viewing as merchant"
        description="You have write access in this session."
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Viewing as merchant");
    expect(screen.getByText("You have write access in this session.")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='app-status-banner']")).toHaveAttribute(
      "data-tone",
      "warning",
    );
  });

  it("danger: a destructive tint under the regular text, with a readable icon", () => {
    const { container } = render(<AppStatusBanner tone="danger" title="Payment failed" />);
    const banner = container.querySelector("[data-slot='app-status-banner']")!;
    expect(banner).toHaveClass("bg-destructive/10", "text-foreground");
    const icon = banner.querySelector(".text-destructive-text");
    expect(icon).not.toBeNull();
    expect(banner.querySelector(".text-destructive")).toBeNull();
  });

  it("calls primary action and dismiss handlers", () => {
    let primaryCount = 0;
    let dismissCount = 0;

    render(
      <AppStatusBanner
        title="Maintenance mode"
        primaryAction={{ label: "Disable", onClick: () => (primaryCount += 1) }}
        onDismiss={() => (dismissCount += 1)}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Disable" }));
    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(primaryCount).toBe(1);
    expect(dismissCount).toBe(1);
  });

  it("renders linked actions through the app link provider", () => {
    const CustomLink = ({ href, children }: { href: string; children?: React.ReactNode }) => (
      <a data-testid="custom-link" href={href}>
        {children}
      </a>
    );

    render(
      <AppShell linkComponent={CustomLink}>
        <AppStatusBanner
          title="Preview mode"
          primaryAction={{ label: "Open store", href: "/store" }}
        />
      </AppShell>,
    );

    expect(screen.getByTestId("custom-link")).toHaveAttribute("href", "/store");
  });
});

/* ------------------------------------------------------------------ */
/* AppMobileNav                                                        */
/* ------------------------------------------------------------------ */

describe("AppMobileNav", () => {
  it("renders brand, subtitle, and compact mobile labels", () => {
    render(
      <AppShell>
        <AppMobileNav
          brand="Hilum Admin"
          subtitle="Platform operations"
          sections={[
            {
              items: [
                { label: "Dashboard", mobileLabel: "Home", href: "/dashboard", active: true },
                { label: "Platform Health", mobileLabel: "Health", href: "/health" },
              ],
            },
          ]}
        />
      </AppShell>,
    );

    expect(screen.getByText("Hilum Admin")).toBeInTheDocument();
    expect(screen.getByText("Platform operations")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Health" })).toHaveAttribute("href", "/health");
    expect(screen.queryByRole("link", { name: "Platform Health" })).not.toBeInTheDocument();
  });

  it("renders account menu trigger when user is provided", () => {
    render(
      <AppShell>
        <AppMobileNav
          brand="Admin"
          sections={[{ items: [{ label: "Dashboard", href: "/dashboard" }] }]}
          user={{ name: "Operator", email: "operator@example.com", initials: "OP" }}
        />
      </AppShell>,
    );

    expect(screen.getByRole("button", { name: "Open account menu" })).toBeInTheDocument();
    expect(screen.getByText("OP")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* PageHeader                                                           */
/* ------------------------------------------------------------------ */

describe("PageHeader", () => {
  it("renders the title as h1 by default", () => {
    render(<PageHeader title="Users" />);
    expect(screen.getByRole("heading", { level: 1, name: "Users" })).toBeInTheDocument();
  });

  it("renders h2 when level=2", () => {
    render(<PageHeader title="Section" level={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Section" })).toBeInTheDocument();
  });

  it("renders description", () => {
    render(<PageHeader title="Title" description="Manage users here." />);
    expect(screen.getByText("Manage users here.")).toBeInTheDocument();
  });

  it("renders eyebrow", () => {
    render(<PageHeader title="Title" eyebrow="Administration" />);
    expect(screen.getByText("Administration")).toBeInTheDocument();
  });

  it("renders actions", () => {
    render(<PageHeader title="Title" actions={<button>Add User</button>} />);
    expect(screen.getByRole("button", { name: "Add User" })).toBeInTheDocument();
  });

  it("uses the shared responsive actions layout", () => {
    const { container } = render(
      <PageHeader
        title="Title"
        actions={
          <>
            <button>Search</button>
            <button className="dashboard-action-primary">Create</button>
          </>
        }
        actionsClassName="custom-actions"
      />,
    );

    const actions = container.querySelector('[data-slot="page-header-actions"]');
    expect(actions).toHaveClass("flex-wrap");
    expect(actions).toHaveClass("custom-actions");
    expect(actions).toHaveTextContent("Search");
    expect(actions).toHaveTextContent("Create");
  });
});

/* ------------------------------------------------------------------ */
/* PageHeaderActions                                                    */
/* ------------------------------------------------------------------ */

describe("PageHeaderActions", () => {
  it("uses container-query layout instead of app-specific class hooks", () => {
    const { container } = render(
      <PageHeaderActions>
        <button>Export</button>
        <button data-span="full">Import</button>
      </PageHeaderActions>,
    );

    const actions = container.querySelector('[data-slot="page-header-actions"]');
    expect(actions).toHaveClass("flex", "flex-wrap");
    expect(actions).toHaveClass("[&>[data-span=full]]:basis-full");
    expect(actions?.className).not.toMatch(/dashboard-action|vw/);
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Import" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* DetailScreen                                                         */
/* ------------------------------------------------------------------ */

describe("DetailScreen", () => {
  it("renders main content", () => {
    render(
      <DetailScreen>
        <p>Main content</p>
      </DetailScreen>,
    );
    expect(screen.getByText("Main content")).toBeInTheDocument();
  });

  it("renders meta sidebar when provided", () => {
    render(
      <DetailScreen meta={<aside>Meta info</aside>}>
        <p>Content</p>
      </DetailScreen>,
    );
    expect(screen.getByText("Meta info")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("renders all breakpoints without error", () => {
    const breakpoints = ["md", "lg", "xl"] as const;
    for (const bp of breakpoints) {
      const { unmount } = render(
        <DetailScreen breakpoint={bp}>
          <div>Content</div>
        </DetailScreen>,
      );
      expect(screen.getByText("Content")).toBeInTheDocument();
      unmount();
    }
  });
});

/* ------------------------------------------------------------------ */
/* SettingsScreen                                                       */
/* ------------------------------------------------------------------ */

describe("SettingsScreen", () => {
  const sections = [
    { id: "profile", label: "Profile" },
    { id: "billing", label: "Billing" },
  ];

  it("renders section nav items", () => {
    render(
      <SettingsScreen sections={sections}>
        <div>Content</div>
      </SettingsScreen>,
    );
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Billing")).toBeInTheDocument();
  });

  it("renders title and description", () => {
    render(
      <SettingsScreen sections={sections} title="Settings" description="Manage your account">
        <div />
      </SettingsScreen>,
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Manage your account")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <SettingsScreen sections={sections}>
        <p>Settings content</p>
      </SettingsScreen>,
    );
    expect(screen.getByText("Settings content")).toBeInTheDocument();
  });

  it("marks active section visually", () => {
    render(
      <SettingsScreen sections={sections} activeId="billing">
        <div />
      </SettingsScreen>,
    );
    const billingLink = screen.getByText("Billing").closest("a");
    // Same selected style as the app sidebar, not an inverted block.
    expect(billingLink).toHaveAttribute("aria-current", "page");
    expect(billingLink).toHaveClass("bg-brand-primary/10", "text-brand-text");
    expect(billingLink).not.toHaveClass("bg-foreground");
  });
});

/* ------------------------------------------------------------------ */
/* SignInScreen                                                         */
/* ------------------------------------------------------------------ */

describe("SignInScreen", () => {
  it("renders title", () => {
    render(
      <SignInScreen title="Sign in to your account">
        <form />
      </SignInScreen>,
    );
    expect(screen.getByRole("heading", { name: "Sign in to your account" })).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <SignInScreen title="Login" description="Welcome back.">
        <form />
      </SignInScreen>,
    );
    expect(screen.getByText("Welcome back.")).toBeInTheDocument();
  });

  it("renders form children", () => {
    render(
      <SignInScreen title="Login">
        <button>Submit</button>
      </SignInScreen>,
    );
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("renders logo slot", () => {
    render(
      <SignInScreen title="Login" logo={<img alt="Logo" src="" />}>
        <div />
      </SignInScreen>,
    );
    expect(screen.getByAltText("Logo")).toBeInTheDocument();
  });
});

describe("SignInDecoration", () => {
  it("renders the headline, copy and each highlight", () => {
    render(
      <SignInDecoration
        title="Everything your store needs"
        description="Take orders and payments."
        highlights={[
          {
            icon: <svg data-testid="icon" />,
            title: "One dashboard",
            description: "Products and orders.",
          },
          { icon: <svg />, title: "Secure by default" },
        ]}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Everything your store needs" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Take orders and payments.")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("Products and orders.")).toBeInTheDocument();
    // Icons are decorative.
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute("aria-hidden", "true");
  });
});

/* ------------------------------------------------------------------ */
/* Navbar                                                               */
/* ------------------------------------------------------------------ */

describe("Navbar", () => {
  it("renders a labelled nav element", () => {
    render(
      <AppShell>
        <Navbar items={[{ label: "Home", href: "/" }]} />
      </AppShell>,
    );
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
  });

  it("renders logo", () => {
    render(
      <AppShell>
        <Navbar logo={<img alt="brand" src="" />} />
      </AppShell>,
    );
    expect(screen.getByAltText("brand")).toBeInTheDocument();
  });

  it("renders nav items", () => {
    render(
      <AppShell>
        <Navbar
          items={[
            { label: "Home", href: "/" },
            { label: "About", href: "/about" },
          ]}
        />
      </AppShell>,
    );
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* AppShellStacked                                                      */
/* ------------------------------------------------------------------ */

describe("AppShellStacked", () => {
  it("renders children", () => {
    render(
      <AppShellStacked items={[]}>
        <p>Dashboard</p>
      </AppShellStacked>,
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders navbar with items", () => {
    render(
      <AppShellStacked items={[{ label: "Docs", href: "/docs" }]}>
        <div />
      </AppShellStacked>,
    );
    expect(screen.getByText("Docs")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* useLink hook                                                         */
/* ------------------------------------------------------------------ */

describe("useLink", () => {
  it("returns default anchor component when no provider", () => {
    function TestComponent() {
      const Link = useLink();
      return <Link href="/test">Default link</Link>;
    }
    render(<TestComponent />);
    expect(screen.getByRole("link", { name: "Default link" })).toHaveAttribute("href", "/test");
  });
});

/* ------------------------------------------------------------------ */
/* Shop-parity extensions                                               */
/* ------------------------------------------------------------------ */

describe("PageHeader detail-page props", () => {
  it("renders a back link, inline badges and meta row", () => {
    render(
      <PageHeader
        back={{ href: "/orders", label: "Orders" }}
        title="#1042"
        badges={<span>Paid</span>}
        meta={<span>Sep 26, 2026</span>}
      />,
    );
    expect(screen.getByRole("link", { name: "Orders" })).toHaveAttribute("href", "/orders");
    expect(screen.getByRole("heading", { level: 1, name: "#1042" })).toBeInTheDocument();
    expect(screen.getByText("Paid").closest("[data-slot='page-header-badges']")).not.toBeNull();
    expect(
      screen.getByText("Sep 26, 2026").closest("[data-slot='page-header-meta']"),
    ).not.toBeNull();
  });
});

describe("DetailScreen header + responsive meta", () => {
  it("renders the header above both columns and a full-width stacked meta column", () => {
    render(
      <DetailScreen header={<h1>Order #1042</h1>} meta={<div>Customer</div>} metaWidth={360}>
        <div>Line items</div>
      </DetailScreen>,
    );
    expect(screen.getByRole("heading", { name: "Order #1042" })).toBeInTheDocument();
    const aside = screen.getByText("Customer").closest("aside")!;
    expect(aside).toHaveClass("w-full", "lg:w-(--detail-meta-width)");
    expect(aside.style.getPropertyValue("--detail-meta-width")).toBe("360px");
  });
});

describe("SettingsScreen mobile nav", () => {
  it("marks the active section with aria-current and a labelled nav", () => {
    render(
      <SettingsScreen
        sections={[
          { id: "general", label: "General" },
          { id: "checkout", label: "Checkout" },
        ]}
        activeId="checkout"
      >
        <div>Checkout settings</div>
      </SettingsScreen>,
    );
    expect(screen.getByRole("navigation", { name: "Settings sections" })).toHaveClass(
      "overflow-x-auto",
    );
    expect(screen.getByRole("link", { name: "Checkout" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "General" })).not.toHaveAttribute("aria-current");
  });
});

describe("AppMobileNav avatar size and overflow scroller", () => {
  it("renders the account avatar and a scrollable tab strip", () => {
    const { container } = render(
      <AppMobileNav
        brand="Hilum Admin"
        sections={[{ items: [{ label: "Merchants", href: "/merchants", active: true }] }]}
        user={{ name: "Ada Lovelace", initials: "AL" }}
        avatarSize="md"
      />,
    );
    expect(screen.getByText("AL")).toBeInTheDocument();
    expect(container.querySelector("[data-slot='app-mobile-nav-scroller']")).toHaveClass(
      "overflow-x-auto",
    );
  });
});

describe("PageHeader wrapTitle", () => {
  it("wraps instead of truncating when requested", () => {
    render(<PageHeader title="A very long merchant name" icon={<svg />} wrapTitle />);
    expect(screen.getByText("A very long merchant name")).toHaveClass("break-words");
  });
});

/* ------------------------------------------------------------------ */
/* AppAccountMenu                                                       */
/* ------------------------------------------------------------------ */

describe("AppAccountMenu", () => {
  it("opens the account menu from the avatar and runs an item", async () => {
    let loggedOut = false;
    render(
      <AppAccountMenu
        user={{ name: "Ada Lovelace", email: "ada@example.com", initials: "AL" }}
        items={[
          { label: "Your account", href: "/account" },
          { label: "Log out", destructive: true, onSelect: () => (loggedOut = true) },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Open account menu" });
    expect(trigger).toHaveTextContent("AL");
    fireEvent.keyDown(trigger, { key: "Enter" });

    const menu = await screen.findByRole("menu");
    expect(menu).toHaveTextContent("Ada Lovelace");
    expect(menu).toHaveTextContent("ada@example.com");
    expect(screen.getByRole("menuitem", { name: "Your account" })).toHaveAttribute(
      "href",
      "/account",
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "Log out" }));
    expect(loggedOut).toBe(true);
  });
});
