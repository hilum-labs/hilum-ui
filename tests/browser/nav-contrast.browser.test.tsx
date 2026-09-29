/**
 * Nav items meet WCAG AA contrast with the real tokens.css, in every theme,
 * active and inactive, resting and hovered: SidebarMenuButton /
 * SidebarMenuSubButton (and AppSidebar, which uses them), the AppMobileNav
 * tabs and AppNavTree (the mobile drawer), on every surface they sit on.
 * brand-primary text on its own 10% tint was 3.9:1 in light mode (4.4.2), and
 * mid's muted text was 3.8:1 on the mid page background.
 */
import axe from "axe-core";
import { render, screen } from "@testing-library/react";
import { page, userEvent } from "vitest/browser";
import { Inbox } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@hilum/ui";
import { AppMobileNav, AppNavTree, AppSidebar } from "@hilum/app-shell";
import { contrast, effectiveBackground } from "./contrast";

/** Text (and icon) contrast of a nav item against what's behind it. */
function expectLegible(el: HTMLElement, label: string) {
  const background = effectiveBackground(el);
  const text = contrast(getComputedStyle(el).color, background);
  expect(text, `${label} text ${text.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
  const icon = el.querySelector("svg");
  if (icon) {
    const iconContrast = contrast(getComputedStyle(icon).color, background);
    expect(iconContrast, `${label} icon`).toBeGreaterThanOrEqual(3);
  }
}

/**
 * axe's colour-contrast rule on everything rendered (labels, badges, the
 * brand block and every item). Disabled items are exempt (WCAG 1.4.3).
 */
async function expectNoContrastViolations(container: Element) {
  const results = await axe.run(container, {
    runOnly: { type: "rule", values: ["color-contrast"] },
    resultTypes: ["violations", "incomplete"],
  });
  const report = (list: axe.Result[]) =>
    list.flatMap((v) => v.nodes.map((n) => `${n.target.join(" ")}: ${n.failureSummary}`));
  expect(report(results.violations)).toEqual([]);
}

/** Every enabled nav link: legible at rest and hovered. */
async function expectEveryItemLegible(container: Element, label: string) {
  const links = [...container.querySelectorAll<HTMLElement>("a[href]")].filter((link) =>
    link.checkVisibility(),
  );
  expect(links.length).toBeGreaterThan(1);
  for (const link of links) {
    const name = `${label} "${link.textContent}"${link.getAttribute("aria-current") ? " (active)" : ""}`;
    expectLegible(link, name);
    await userEvent.hover(link);
    expectLegible(link, `${name}, hovered`);
  }
  await userEvent.unhover(links[0]!);
}

const THEMES = ["light", "mid", "dark"] as const;
const SURFACES = ["background", "card", "surface", "muted"] as const;
// Literal class names so Tailwind generates them.
const SURFACE_CLASS: Record<(typeof SURFACES)[number], string> = {
  background: "bg-background",
  card: "bg-card",
  surface: "bg-surface",
  muted: "bg-muted",
};

/** A theme scope painted with the theme's page background. */
function Themed({ theme, children }: { theme: string; children: React.ReactNode }) {
  return (
    <div data-theme={theme} style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {children}
    </div>
  );
}

const SECTIONS = [
  {
    label: "Store",
    items: [
      { label: "Home", href: "#home", icon: Inbox },
      {
        label: "Products",
        href: "#products",
        icon: Inbox,
        badge: "12",
        children: [
          { label: "Collections", href: "#collections", active: true },
          { label: "Inventory", href: "#inventory" },
        ],
      },
      { label: "Orders", href: "#orders", icon: Inbox, active: true },
      { label: "Customers", href: "#customers" },
      { label: "Analytics", href: "#analytics", disabled: true },
    ],
  },
];

describe("nav items meet WCAG AA contrast (real browser)", () => {
  afterEach(async () => {
    await page.viewport(1280, 800);
  });

  test.each(THEMES.flatMap((theme) => SURFACES.map((surface) => [theme, surface] as const)))(
    "Sidebar primitives, %s theme on %s",
    async (theme, surface) => {
      const { container } = render(
        <Themed theme={theme}>
          <nav aria-label="Sidebar" className={`${SURFACE_CLASS[surface]} p-2`}>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <a href="#orders" aria-current="page">
                    <Inbox />
                    <span>Orders</span>
                  </a>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#drafts" isActive aria-current="page">
                      Drafts
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton href="#abandoned">Abandoned</SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#products">
                    <Inbox />
                    <span>Products</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </nav>
        </Themed>,
      );
      const active = screen.getByRole("link", { name: "Orders" });
      // Still reads as active: a brand tint the inactive item doesn't have.
      expect(effectiveBackground(active)).not.toBe(
        effectiveBackground(screen.getByRole("link", { name: "Products" })),
      );
      await expectNoContrastViolations(container);
      await expectEveryItemLegible(container, `${theme}/${surface}`);
    },
  );

  test.each(THEMES)("AppSidebar, %s", async (theme) => {
    const { container } = render(
      <Themed theme={theme}>
        <AppSidebar brand="Shop" subtitle="Lima store" sections={SECTIONS} />
      </Themed>,
    );
    await expectNoContrastViolations(container);
    await expectEveryItemLegible(container, `${theme} AppSidebar`);
  });

  test.each(THEMES.flatMap((theme) => SURFACES.map((surface) => [theme, surface] as const)))(
    "AppMobileNav tabs and AppNavTree (drawer), %s theme on %s",
    async (theme, surface) => {
      await page.viewport(390, 800);
      const { container } = render(
        <Themed theme={theme}>
          <div className={SURFACE_CLASS[surface]}>
            <AppMobileNav brand="Shop" subtitle="Lima store" variant="tabs" sections={SECTIONS} />
            <AppNavTree label="Drawer" sections={SECTIONS} />
          </div>
        </Themed>,
      );
      await expectNoContrastViolations(container);
      await expectEveryItemLegible(container, `${theme}/${surface} mobile`);
    },
  );
});
