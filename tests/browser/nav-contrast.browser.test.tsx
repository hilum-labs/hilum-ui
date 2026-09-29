/**
 * Active nav items meet WCAG AA contrast with the real tokens.css, in every
 * theme: SidebarMenuButton / SidebarMenuSubButton (and AppSidebar, which uses
 * them), the AppMobileNav tabs and AppNavTree (the mobile drawer).
 * brand-primary text on its own 10% tint was 3.9:1 in light mode and axe
 * flagged every Hilum Shop page.
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

/** Paint `colors` bottom-up over white on a 1×1 canvas and read the sRGB pixel. */
function composite(colors: string[]) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1, 1);
  for (const color of colors) {
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
  }
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r}, ${g}, ${b})`;
}

/** The colour actually behind `el`: every ancestor background composited. */
function effectiveBackground(el: Element): string {
  const layers: string[] = [];
  for (let node: Element | null = el; node; node = node.parentElement) {
    layers.unshift(getComputedStyle(node).backgroundColor);
  }
  return composite(layers);
}

function luminance(color: string) {
  const [r, g, b] = composite([color])
    .match(/\d+/g)!
    .map((v) => {
      const c = Number(v) / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Text (and icon) contrast of an active item against what's behind it. */
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
 * axe's colour-contrast rule on the active items (and their contents). Only
 * those: the mid theme's muted text is sized for its card panels, not the
 * mid page background, which is outside this fix.
 */
async function expectNoContrastViolations(container: Element) {
  const active = container.querySelectorAll('[aria-current="page"], [data-active="true"]');
  expect(active.length).toBeGreaterThan(0);
  const results = await axe.run(active, {
    runOnly: { type: "rule", values: ["color-contrast"] },
    resultTypes: ["violations"],
  });
  expect(
    results.violations.flatMap((v) =>
      v.nodes.map((n) => `${n.target.join(" ")}: ${n.failureSummary}`),
    ),
  ).toEqual([]);
}

const THEMES = ["light", "mid", "dark"] as const;

/** Each theme's nav surfaces: sidebars sit on the card, mobile nav on the page. */
function Themed({ theme, children }: { theme: string; children: React.ReactNode }) {
  return (
    <div data-theme={theme} style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {children}
    </div>
  );
}

describe("active nav items meet WCAG AA contrast (real browser)", () => {
  afterEach(async () => {
    await page.viewport(1280, 800);
  });

  test.each(THEMES)("SidebarMenuButton and SidebarMenuSubButton, %s", async (theme) => {
    const { container } = render(
      <Themed theme={theme}>
        <nav aria-label="Sidebar" className="bg-card p-2">
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
                  <SidebarMenuSubButton href="#drafts" isActive>
                    Drafts
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#products">Products</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </nav>
      </Themed>,
    );
    const active = screen.getByRole("link", { name: "Orders" });
    const sub = screen.getByRole("link", { name: "Drafts" });
    // Still reads as active: a brand tint the inactive item doesn't have.
    expect(effectiveBackground(active)).not.toBe(
      effectiveBackground(screen.getByRole("link", { name: "Products" })),
    );
    expectLegible(active, `${theme} active`);
    expectLegible(sub, `${theme} active sub-item`);
    await expectNoContrastViolations(container);

    await userEvent.hover(active);
    expectLegible(active, `${theme} active, hovered`);
    await userEvent.hover(sub);
    expectLegible(sub, `${theme} active sub-item, hovered`);
    await expectNoContrastViolations(container);
  });

  test.each(THEMES)("AppSidebar, %s", async (theme) => {
    const { container } = render(
      <Themed theme={theme}>
        <AppSidebar
          brand="Shop"
          sections={[
            {
              label: "Store",
              items: [
                { label: "Home", href: "#home", icon: Inbox, active: true },
                { label: "Orders", href: "#orders" },
              ],
            },
          ]}
        />
      </Themed>,
    );
    expectLegible(screen.getByRole("link", { name: "Home" }), `${theme} AppSidebar`);
    await expectNoContrastViolations(container);
  });

  test.each(THEMES)("AppMobileNav tabs and AppNavTree (drawer), %s", async (theme) => {
    await page.viewport(390, 800);
    const { container } = render(
      <Themed theme={theme}>
        <AppMobileNav
          brand="Shop"
          variant="tabs"
          sections={[
            {
              items: [
                { label: "Home", href: "#home", icon: Inbox, active: true },
                { label: "Orders", href: "#orders" },
              ],
            },
          ]}
        />
        <div className="bg-card">
          <AppNavTree
            label="Drawer"
            sections={[
              {
                items: [
                  { label: "Products", href: "#products", icon: Inbox, active: true },
                  { label: "Orders", href: "#orders" },
                ],
              },
            ]}
          />
        </div>
      </Themed>,
    );
    expectLegible(screen.getByRole("link", { name: "Home" }), `${theme} mobile tab`);
    expectLegible(screen.getByRole("link", { name: "Products" }), `${theme} drawer item`);
    await expectNoContrastViolations(container);
  });
});
