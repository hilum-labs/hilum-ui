import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppShell } from "../app-shell";
import { AppShellStacked } from "../app-shell-stacked";
import { AppCommandPalette } from "../app-command-palette";
import { AppHeader } from "../app-header";
import { AppMobileNav } from "../app-mobile-nav";
import { PageHeader } from "../page-header";
import { DetailScreen } from "../detail-screen";
import { SettingsScreen } from "../settings-screen";
import { SignInScreen } from "../sign-in-screen";
import { Navbar } from "../navbar";
import { useLink } from "../link-context";

/* ------------------------------------------------------------------ */
/* AppShell                                                             */
/* ------------------------------------------------------------------ */

describe("AppShell", () => {
  it("renders children", () => {
    render(
      <AppShell>
        <main>App content</main>
      </AppShell>,
    );
    expect(screen.getByText("App content")).toBeInTheDocument();
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
    expect(billingLink).toHaveClass("bg-foreground");
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

/* ------------------------------------------------------------------ */
/* Navbar                                                               */
/* ------------------------------------------------------------------ */

describe("Navbar", () => {
  it("renders nav element", () => {
    render(
      <AppShell>
        <Navbar />
      </AppShell>,
    );
    expect(screen.getByRole("navigation")).toBeInTheDocument();
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
