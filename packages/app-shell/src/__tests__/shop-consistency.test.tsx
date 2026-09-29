import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountMenuHeader, Button, DropdownMenuItem } from "@hilum/ui";
import { AppMobileNav } from "../app-mobile-nav";
import { AppStatusBanner, type AppStatusBannerTone } from "../app-status-banner";

/** Tailwind's default palette names; components must use semantic tokens instead. */
const RAW_PALETTE =
  /(^|[\s:])(bg|text|border|ring|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|ground)-\d/;

const classesOf = (root: Element) =>
  [root, ...Array.from(root.querySelectorAll("*"))]
    .map((el) => el.getAttribute("class") ?? "")
    .join(" ");

describe("AppStatusBanner tones", () => {
  const tones: AppStatusBannerTone[] = ["neutral", "info", "success", "warning", "danger"];

  it.each(tones)("%s uses semantic token surfaces only", (tone) => {
    const { container } = render(
      <AppStatusBanner
        tone={tone}
        title="Store is in preview"
        primaryAction={{ label: "Publish", onClick: () => {} }}
        secondaryAction={{ label: "Learn more", href: "/help" }}
        onDismiss={() => {}}
      />,
    );
    const banner = container.querySelector("[data-slot='app-status-banner']")!;
    expect(classesOf(banner)).not.toMatch(RAW_PALETTE);
  });

  it("warning is the token warning surface with its paired foreground", () => {
    const { container } = render(<AppStatusBanner tone="warning" title="Payments paused" />);
    expect(container.querySelector("[data-slot='app-status-banner']")).toHaveClass(
      "bg-warning",
      "text-warning-foreground",
    );
  });

  it("success tints with the success token and keeps a solid icon chip", () => {
    const { container } = render(<AppStatusBanner tone="success" title="Domain connected" />);
    const banner = container.querySelector("[data-slot='app-status-banner']")!;
    expect(banner).toHaveClass("bg-success/15", "text-foreground");
    expect(banner.querySelector("span[aria-hidden='true']")).toHaveClass(
      "bg-success",
      "text-success-foreground",
    );
  });
});

describe("AppMobileNav top bar", () => {
  const sections = [{ items: [{ label: "Home", href: "/" }] }];

  it("renders app actions (search, notifications) before the account menu", () => {
    const { container } = render(
      <AppMobileNav
        brand="Shop"
        sections={sections}
        user={{ name: "Ana", email: "ana@shop.pe" }}
        actions={
          <>
            <Button size="icon" variant="ghost" aria-label="Search">
              <span />
            </Button>
            <Button size="icon" variant="ghost" aria-label="Notifications">
              <span />
            </Button>
          </>
        }
      />,
    );
    const actions = container.querySelector("[data-slot='app-mobile-nav-actions']")!;
    expect(actions).toContainElement(screen.getByRole("button", { name: "Search" }));
    expect(actions).toContainElement(screen.getByRole("button", { name: "Notifications" }));
    const account = screen.getByRole("button", { name: "Open account menu" });
    expect(
      actions.compareDocumentPosition(account) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it("shows a custom, full account menu", async () => {
    render(
      <AppMobileNav
        brand="Shop"
        sections={sections}
        user={{ name: "Ana Pérez", email: "ana@shop.pe" }}
        accountMenu={
          <>
            <AccountMenuHeader name="Ana Pérez" email="ana@shop.pe" />
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </>
        }
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Open account menu" }));
    const menu = await screen.findByRole("menu");
    expect(menu).toHaveAttribute("data-slot", "app-mobile-nav-account-menu");
    expect(screen.getByRole("menuitem", { name: "Billing" })).toBeInTheDocument();
    expect(screen.getByText("ana@shop.pe")).toBeInTheDocument();
    // The built-in default items are replaced.
    expect(screen.queryByRole("menuitem", { name: "Profile" })).toBeNull();
  });
});
