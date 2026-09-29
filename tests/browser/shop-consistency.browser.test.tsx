import { render, screen } from "@testing-library/react";
import { page } from "vitest/browser";
import {
  Badge,
  Button,
  Callout,
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
import { AppStatusBanner } from "@hilum/app-shell";

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
