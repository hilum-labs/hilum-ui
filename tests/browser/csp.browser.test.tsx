/**
 * Strict Content-Security-Policy (`style-src 'self'`): runtime <style> tags are
 * blocked, so Hilum components must work from the static CSS alone (tokens.css,
 * imported by tests/browser/styles.css). csp-page-load.browser.test.tsx checks
 * that the built package logs no violation at all.
 */
import { act, render, screen } from "@testing-library/react";
import { page } from "vitest/browser";
import { AppLoadingBar } from "@hilum/app-shell";
import {
  ChartContainer,
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  DrawerContent,
  DrawerTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Line,
  LineChart,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RichTextEditor,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Toaster,
  toast,
} from "@hilum/ui";

const violations: SecurityPolicyViolationEvent[] = [];

/** Radix renders these two and we can't turn them off; tokens.css ships static copies. */
const RADIX_SAMPLE =
  /data-radix-select-viewport|data-radix-scroll-area-viewport|with-scroll-bars-hidden|data-scroll-locked/;

beforeAll(async () => {
  // Vite serves the app CSS (Tailwind + tokens.css) through a
  // runtime <style> in dev, which the policy would block on its next update.
  // Stand in for a production `<link rel=stylesheet>` from 'self': once the
  // CSS is ready, move it into constructable stylesheets (not subject to CSP).
  const appCss = () =>
    Array.from(document.querySelectorAll<HTMLStyleElement>("style[data-vite-dev-id]"));
  for (
    let i = 0;
    i < 100 && !appCss().some((s) => s.textContent?.includes("hilum-mobile-sheet"));
    i++
  ) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  const sheets = appCss().map((style) => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(style.textContent ?? "");
    style.remove();
    return sheet;
  });
  expect(sheets.length).toBeGreaterThan(0);
  document.adoptedStyleSheets = [...document.adoptedStyleSheets, ...sheets];
  // Here @hilum/ui runs from source, which imports sonner and vaul unbundled:
  // they injected their CSS when imported, before this policy existed. Drop
  // those tags so only the static tokens.css can style them. (The published
  // bundle strips the injection; see csp-page-load.browser.test.tsx.)
  for (const style of Array.from(document.querySelectorAll("style"))) {
    if (/data-sonner-toaster|data-vaul-drawer/.test(style.textContent ?? "")) style.remove();
  }
  const meta = document.createElement("meta");
  meta.httpEquiv = "Content-Security-Policy";
  meta.content = "style-src 'self' 'report-sample'";
  document.head.append(meta);
  document.addEventListener("securitypolicyviolation", (event) => violations.push(event));
});

const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

function hilumViolations() {
  return violations
    .filter((event) => event.effectiveDirective.startsWith("style-src"))
    .filter((event) => !RADIX_SAMPLE.test(event.sample))
    .map((event) => `${event.effectiveDirective}: ${event.sample}`);
}

describe("under style-src 'self' (real browser)", () => {
  test("the policy is active: a runtime <style> is blocked", async () => {
    const style = document.createElement("style");
    style.textContent = "#csp-probe { color: rgb(1, 2, 3); }";
    document.head.append(style);
    render(<p id="csp-probe">probe</p>);
    await settle();
    expect(getComputedStyle(screen.getByText("probe")).color).not.toBe("rgb(1, 2, 3)");
    expect(violations.some((event) => event.sample.includes("csp-probe"))).toBe(true);
    style.remove();
    violations.length = 0;
  });

  test("toasts are positioned and sized by tokens.css", async () => {
    await page.viewport(1280, 800);
    render(<Toaster />);
    act(() => {
      toast("Product saved");
    });
    const text = await screen.findByText("Product saved");
    const toaster = document.querySelector<HTMLElement>("[data-sonner-toaster]")!;
    const toastEl = text.closest<HTMLElement>("[data-sonner-toast]")!;
    expect(getComputedStyle(toaster).position).toBe("fixed");
    // Not the unstyled full-width bar.
    expect(toastEl.getBoundingClientRect().width).toBeLessThan(420);
    expect(getComputedStyle(toastEl).position).toBe("absolute");
    await settle();
    expect(hilumViolations()).toEqual([]);
  });

  test("menus, selects and popovers become bottom sheets on mobile from tokens.css", async () => {
    await page.viewport(375, 700);
    render(
      <Select open value="a">
        <SelectTrigger aria-label="Status" />
        <SelectContent>
          <SelectItem value="a">Active</SelectItem>
          <SelectItem value="b">Draft</SelectItem>
        </SelectContent>
      </Select>,
    );
    const listbox = await screen.findByRole("listbox");
    await settle();
    const rect = listbox.getBoundingClientRect();
    expect(getComputedStyle(listbox).position).toBe("fixed");
    expect(Math.round(700 - rect.bottom)).toBeGreaterThanOrEqual(11);
    expect(Math.round(700 - rect.bottom)).toBeLessThanOrEqual(13);
    expect(Math.round(rect.left)).toBe(12);
    expect(hilumViolations()).toEqual([]);
  });

  test("dialogs, drawers, menus, popovers, the rich text editor and charts inject nothing", async () => {
    await page.viewport(1280, 800);
    render(
      <>
        <Dialog open>
          <DialogContent>
            <DialogTitle>Edit</DialogTitle>
          </DialogContent>
        </Dialog>
        <Popover open>
          <PopoverTrigger>Open</PopoverTrigger>
          <PopoverContent>Body</PopoverContent>
        </Popover>
        <DropdownMenu open modal={false}>
          <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <RichTextEditor aria-label="Description" value="<h2>Hi</h2>" onChange={() => {}} />
        <ChartContainer
          height={120}
          config={{ sales: { label: "Sales", theme: { light: "#111111", dark: "#eeeeee" } } }}
        >
          <LineChart data={[{ x: 1, sales: 1 }]}>
            <Line dataKey="sales" stroke="var(--color-sales)" />
          </LineChart>
        </ChartContainer>
      </>,
    );
    await settle();
    // Rich text typography comes from tokens.css.
    const heading = document.querySelector(".rich-text-editor-content h2")!;
    expect(getComputedStyle(heading).fontSize).toBe("20px");
    // Series colours are custom properties resolved with light-dark().
    const chart = document.querySelector<HTMLElement>("[data-slot='chart']")!;
    const probe = document.createElement("span");
    probe.style.color = "var(--color-sales)";
    chart.append(probe);
    expect(getComputedStyle(probe).color).toBe("rgb(17, 17, 17)");
    chart.setAttribute("data-theme", "dark");
    expect(getComputedStyle(probe).color).toBe("rgb(238, 238, 238)");
    expect(hilumViolations()).toEqual([]);
  });

  test("the app loading bar animates from tokens.css and honours reduced motion", async () => {
    render(<AppLoadingBar />);
    const indicator = document.querySelector<HTMLElement>(
      "[data-slot='app-loading-bar-indicator']",
    )!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const style = getComputedStyle(indicator);
    if (reduced) {
      expect(style.animationName).toBe("none");
      expect(style.opacity).toBe("0.6");
    } else {
      expect(style.animationName).toBe("hilum-app-loading-bar");
    }
    await settle();
    expect(hilumViolations()).toEqual([]);
  });

  test("drawers slide in with tokens.css", async () => {
    render(
      <Drawer open>
        <DrawerContent>
          <DrawerTitle>Cart</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    const drawer = document.querySelector<HTMLElement>("[data-vaul-drawer]")!;
    expect(drawer).not.toBeNull();
    expect(getComputedStyle(drawer).touchAction).toBe("none");
    await settle();
    expect(hilumViolations()).toEqual([]);
  });
});
