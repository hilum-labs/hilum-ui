import { fireEvent, render, screen } from "@testing-library/react";
import { page } from "vitest/browser";
import {
  Badge,
  Button,
  Callout,
  CommandPalette,
  ContextualSaveBar,
  StatusBadge,
  Combobox,
  DatePicker,
  Input,
  InputGroup,
  InputNumber,
  NativeSelect,
  PaginationLink,
  SearchInput,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  TimePicker,
} from "@hilum/ui";
import { AppHeader, AppShell, AppSidebar, AppStatusBanner, PageHeader } from "@hilum/app-shell";
import { DesignerHeader } from "@hilum/designer";

/** Resolve a CSS colour expression to its computed rgb() string. */
function resolveColor(value: string) {
  const probe = document.createElement("div");
  probe.style.color = value;
  document.body.append(probe);
  const color = getComputedStyle(probe).color;
  probe.remove();
  return color;
}

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
  return [r!, g!, b!] as const;
}

/** WCAG relative luminance of any CSS colour (composited over white). */
function luminance(color: string) {
  const [r, g, b] = composite([color]).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** The colour actually behind `el`: every ancestor background composited. */
function effectiveBackground(el: Element): string {
  const layers: string[] = [];
  for (let node: Element | null = el; node; node = node.parentElement) {
    layers.unshift(getComputedStyle(node).backgroundColor);
  }
  const [r, g, b] = composite(layers);
  return `rgb(${r}, ${g}, ${b})`;
}

const TRANSPARENT = "rgba(0, 0, 0, 0)";

describe("Button asChild fill (real browser)", () => {
  test.each(["primary", "brand", "secondary", "destructive"] as const)(
    "a %s asChild link paints the same fill and label colour as the plain button",
    (variant) => {
      render(
        <>
          <Button variant={variant}>Plain</Button>
          <Button variant={variant} asChild>
            <a href="#orders">Linked</a>
          </Button>
        </>,
      );
      const plain = screen.getByRole("button", { name: "Plain" });
      const link = screen.getByRole("link", { name: "Linked" });
      const plainFill = getComputedStyle(plain, "::before");
      const linkFill = getComputedStyle(link, "::before");
      expect(linkFill.backgroundColor).not.toBe(TRANSPARENT);
      expect(linkFill.backgroundColor).toBe(plainFill.backgroundColor);
      expect(linkFill.position).toBe("absolute");
      expect(getComputedStyle(link).color).toBe(getComputedStyle(plain).color);
      expect(link.getBoundingClientRect().height).toBe(plain.getBoundingClientRect().height);
    },
  );

  test("the primary label is legible over its fill", () => {
    render(
      <Button asChild>
        <a href="#new">New order</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "New order" });
    const fill = getComputedStyle(link, "::before").backgroundColor;
    expect(fill).toBe(resolveColor("var(--foreground)"));
    expect(contrast(getComputedStyle(link).color, fill)).toBeGreaterThan(7);
  });

  test("the active pagination page is a filled, legible square", () => {
    render(
      <PaginationLink href="#p2" isActive>
        2
      </PaginationLink>,
    );
    const page = screen.getByRole("link", { name: "2" });
    const fill = getComputedStyle(page, "::before").backgroundColor;
    expect(fill).toBe(resolveColor("var(--foreground)"));
    expect(contrast(getComputedStyle(page).color, fill)).toBeGreaterThan(7);
  });
});

describe("AppStatusBanner in dark mode (real browser)", () => {
  test.each(["success", "warning", "danger", "info", "neutral"] as const)(
    "%s keeps its title and actions legible",
    (tone) => {
      render(
        <div data-theme="dark" style={{ background: "var(--background)" }}>
          <AppStatusBanner
            tone={tone}
            title="Payouts are paused"
            primaryAction={{ label: "Review", onClick: () => {} }}
          />
        </div>,
      );
      const title = screen.getByText("Payouts are paused");
      const banner = title.closest("[data-slot='app-status-banner']")!;
      const surface = effectiveBackground(banner);
      // Dark surfaces stay dark (no mint / amber-100 banner in dark mode).
      expect(luminance(surface)).toBeLessThan(0.2);
      expect(contrast(getComputedStyle(title).color, surface)).toBeGreaterThan(4.5);
      const action = screen.getByRole("button", { name: "Review" });
      expect(contrast(getComputedStyle(action).color, surface)).toBeGreaterThan(4.5);
    },
  );
});

describe("single-line form controls (real browser)", () => {
  test("render 36px tall with 14px text at the default density", () => {
    const noop = () => {};
    const { container } = render(
      <div style={{ width: 320 }}>
        <Input aria-label="Title" />
        <SearchInput value="" onValueChange={noop} aria-label="Search" />
        <Select>
          <SelectTrigger aria-label="Status" />
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
        <NativeSelect aria-label="Country">
          <option>Peru</option>
        </NativeSelect>
        <Combobox aria-label="Customer" options={[{ value: "a", label: "Ana" }]} />
        <InputNumber aria-label="Quantity" value={1} onChange={noop} />
        <InputGroup
          aria-label="Domain"
          placeholder="shop"
          trailingButton={<Button>Check</Button>}
        />
        <TimePicker aria-label="Opens at" value="09:00" onChange={noop} />
        <DatePicker aria-label="Ships on" value={undefined} onChange={noop} />
      </div>,
    );
    const boxes: Array<[string, Element, Element]> = [
      ["Input", screen.getByLabelText("Title"), screen.getByLabelText("Title")],
      ["SearchInput", screen.getByRole("searchbox"), screen.getByRole("searchbox")],
      ["Select", screen.getByLabelText("Status"), screen.getByLabelText("Status")],
      ["NativeSelect", screen.getByLabelText("Country"), screen.getByLabelText("Country")],
      ["Combobox", screen.getByLabelText("Customer"), screen.getByLabelText("Customer")],
      [
        "InputNumber",
        container.querySelector("[data-slot='input-number']")!,
        screen.getByLabelText("Quantity"),
      ],
      [
        "InputGroup",
        container.querySelector("[data-slot='input-group']")!,
        screen.getByLabelText("Domain"),
      ],
      [
        "TimePicker",
        container.querySelector("[data-slot='time-picker']")!,
        container.querySelector("[data-slot='time-picker']")!,
      ],
      ["DatePicker", screen.getByLabelText("Ships on"), screen.getByLabelText("Ships on")],
    ];
    for (const [name, box, text] of boxes) {
      expect({ name, height: box.getBoundingClientRect().height }).toEqual({ name, height: 36 });
      expect({ name, font: getComputedStyle(text).fontSize }).toEqual({ name, font: "14px" });
    }
    // The InputGroup trailing button is inset: 28px inside the 36px field.
    expect(screen.getByRole("button", { name: "Check" }).getBoundingClientRect().height).toBe(28);
  });
});

describe("status dots and callout actions (real browser)", () => {
  test.each(["light", "dark"])("every tone's dot keeps 3:1 on its badge in %s", (theme) => {
    for (const tone of [
      "success",
      "info",
      "attention",
      "warning",
      "critical",
      "neutral",
    ] as const) {
      const { container, unmount } = render(
        <div data-theme={theme} style={{ background: "var(--background)" }}>
          <StatusBadge tone={tone} status={tone} showDot />
        </div>,
      );
      const badge = container.querySelector("[data-slot='status-badge']")!;
      const dot = container.querySelector("[data-slot='status-badge-dot']")!;
      const surface = effectiveBackground(badge);
      const dotColor = getComputedStyle(dot).backgroundColor;
      expect({ tone, ok: contrast(dotColor, surface) >= 3 }).toEqual({ tone, ok: true });
      unmount();
    }
  });

  test("a Callout badge action keeps its size on mobile widths", async () => {
    await page.viewport(375, 700);
    render(
      <Callout
        title="Payouts paused"
        actions={
          <>
            <Badge>Beta</Badge>
            <Button>Review</Button>
          </>
        }
      />,
    );
    const actions = document.querySelector("[data-slot='callout-actions']")!;
    const badge = actions.querySelector("[data-slot='badge']")!;
    const button = screen.getByRole("button", { name: "Review" });
    expect(badge.getBoundingClientRect().width).toBeLessThan(80);
    expect(button.getBoundingClientRect().width).toBeCloseTo(
      actions.getBoundingClientRect().width,
      0,
    );
  });
});

describe("CommandPalette (real browser)", () => {
  test("stays put while results shrink, and the close button clears the esc hint", async () => {
    await page.viewport(1280, 800);
    const items = Array.from({ length: 12 }, (_, i) => ({
      label: `Page ${i + 1}`,
      href: `/p/${i + 1}`,
      category: "Pages",
    }));
    render(<CommandPalette open onClose={() => {}} items={items} />);
    const dialog = await screen.findByRole("dialog");
    // Let the open animation settle.
    await new Promise((r) => setTimeout(r, 400));
    const before = dialog.getBoundingClientRect().top;
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Page 12" } });
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(dialog.getBoundingClientRect().top).toBeCloseTo(before, 0);
    expect(before).toBeLessThan(800 * 0.2);

    const esc = dialog.querySelector("[data-slot='command-palette-esc']")!.getBoundingClientRect();
    const close = screen.getByRole("button", { name: "Close" }).getBoundingClientRect();
    expect(close.left).toBeGreaterThanOrEqual(esc.right);
  });
});

describe("ContextualSaveBar inside AppShell (real browser)", () => {
  test("overlays the top bar instead of covering the sidebar and page header", async () => {
    await page.viewport(1280, 800);
    render(
      <AppShell
        toaster={false}
        headerHeight={56}
        sidebar={<AppSidebar brand="Shop" sections={[{ items: [{ label: "Home", href: "/" }] }]} />}
        header={<AppHeader breadcrumbs={[{ label: "Products" }]} />}
      >
        <h1>Edit product</h1>
        <ContextualSaveBar open onSave={() => {}} onDiscard={() => {}} />
      </AppShell>,
    );
    const bar = screen.getByRole("region", { name: "Unsaved changes" });
    await new Promise((r) => setTimeout(r, 300));
    const rect = bar.getBoundingClientRect();
    expect(rect.top).toBe(0);
    expect(rect.height).toBeGreaterThanOrEqual(56);
    // Nothing below the top bar is covered: the page title starts under it.
    const title = screen.getByRole("heading", { name: "Edit product" }).getBoundingClientRect();
    expect(title.top).toBeGreaterThanOrEqual(rect.bottom);
  });
});

describe("DesignerHeader (real browser)", () => {
  test("keeps Publish fully visible at 1440px with many actions", async () => {
    await page.viewport(1440, 900);
    render(
      <DesignerHeader
        left={<span>Theme editor · Dawn</span>}
        center={<span>Home page</span>}
        right={
          <>
            {Array.from({ length: 8 }, (_, i) => (
              <Button key={i} variant="outline" size="sm">
                Tool {i + 1}
              </Button>
            ))}
          </>
        }
        primaryAction={{ label: "Publish", onAction: () => {} }}
        secondaryActions={["Preview", "Share", "Export", "Duplicate"].map((label) => ({
          label,
          onAction: () => {},
        }))}
      />,
    );
    const header = document.querySelector("[data-designer-header]")!.getBoundingClientRect();
    const publish = screen.getByRole("button", { name: "Publish" }).getBoundingClientRect();
    expect(publish.width).toBeGreaterThan(40);
    expect(publish.right).toBeLessThanOrEqual(header.right);
    expect(publish.left).toBeGreaterThanOrEqual(header.left);
    // Wide header: two secondary actions inline, the rest in "More actions".
    expect(screen.getByRole("button", { name: "Preview" })).toBeVisible();
    expect(screen.getByRole("button", { name: "Share" })).toBeVisible();
    const more = screen
      .getAllByRole("button", { name: "More actions" })
      .filter((b) => b.offsetParent);
    expect(more).toHaveLength(1);
  });

  test("collapses every secondary action into the menu on a narrow header", async () => {
    await page.viewport(700, 900);
    render(
      <DesignerHeader
        primaryAction={{ label: "Publish" }}
        secondaryActions={[{ label: "Preview" }, { label: "Share" }]}
      />,
    );
    const header = document.querySelector("[data-designer-header]")!;
    expect(header.getBoundingClientRect().width).toBeLessThan(896);
    expect(screen.getByRole("button", { name: "Publish" })).toBeVisible();
    const preview = Array.from(header.querySelectorAll("button")).find(
      (button) => button.textContent === "Preview",
    );
    expect(preview).toBeDefined();
    expect(preview).not.toBeVisible();
  });
});

describe("AppHeader search (real browser)", () => {
  it("stays centered on the header whatever the breadcrumb length", async () => {
    await page.viewport(1280, 800);
    const searchCenter = (breadcrumbs: { label: string; href?: string }[]) => {
      const { container, unmount } = render(
        <AppHeader
          breadcrumbs={breadcrumbs}
          search={<button style={{ width: 208 }}>Search</button>}
          actions={<button>Account</button>}
        />,
      );
      const header = container
        .querySelector<HTMLElement>("[data-slot=app-header]")!
        .getBoundingClientRect();
      const search = screen.getByRole("button", { name: "Search" }).getBoundingClientRect();
      unmount();
      return { offset: search.left + search.width / 2 - (header.left + header.width / 2) };
    };

    const short = searchCenter([{ label: "Dashboard" }]);
    const long = searchCenter([
      { label: "Home", href: "/" },
      { label: "Merchants", href: "/merchants" },
      { label: "Admin lifecycle 1790715917821" },
    ]);
    expect(Math.abs(short.offset)).toBeLessThan(1);
    expect(Math.abs(long.offset)).toBeLessThan(1);
  });
});

describe("PageHeader actions on a phone (real browser)", () => {
  test("every action fills the row, including a lone one after the primary", async () => {
    await page.viewport(375, 700);
    const widths = async (secondaryCount: number) => {
      const { container, unmount } = render(
        <PageHeader
          title="Themes"
          primaryAction={{ label: "Customize", onAction: () => {} }}
          secondaryActions={Array.from({ length: secondaryCount }, (_, i) => ({
            label: `Action ${i + 1}`,
            onAction: () => {},
          }))}
        />,
      );
      const row = container
        .querySelector("[data-slot=page-header-actions]")!
        .getBoundingClientRect();
      const visible = [...container.querySelectorAll("[data-slot=page-header-actions] > *")]
        .map((el) => el.getBoundingClientRect())
        .filter((rect) => rect.width > 0);
      unmount();
      return { row: Math.round(row.width), actions: visible.map((rect) => Math.round(rect.width)) };
    };

    // "More actions" holds both secondaries on a phone.
    const menu = await widths(2);
    expect(menu.actions).toEqual([menu.row, menu.row]);
    // A lone secondary stays inline.
    const single = await widths(1);
    expect(single.actions).toEqual([single.row, single.row]);
  });
});
