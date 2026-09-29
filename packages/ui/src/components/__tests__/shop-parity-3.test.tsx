import { afterEach, describe, it, expect, vi } from "vitest";
import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { DataTable, type ColumnDef } from "../data-table";
import { Field } from "../field";
import { InputGroup } from "../input-group";
import { InputNumber } from "../input-number";
import { PreviewFrame } from "../preview-frame";
import { StatCard } from "../stat-card";
import { formatCurrency } from "../../lib/format";
import { MultiCombobox, MULTI_COMBOBOX_DEFAULT_LABELS } from "../multi-combobox";
import type { ComboboxOption } from "../combobox";

const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

/* ------------------------------------------------------------------ */
/* DataTable: meta.label and container-width cards                     */
/* ------------------------------------------------------------------ */

interface Order {
  id: string;
  number: string;
  total: string;
}

const ORDERS: Order[] = [
  { id: "1", number: "#1001", total: "$20.00" },
  { id: "2", number: "#1002", total: "$35.00" },
];

// `meta.label` type-checks without a cast (ColumnMeta augmentation).
const COLUMNS: ColumnDef<Order>[] = [
  { id: "order", header: "Order", cell: ({ row }) => row.original.number },
  {
    id: "total",
    header: () => <span aria-hidden="true">Σ</span>,
    meta: { label: "Total" },
    cell: ({ row }) => row.original.total,
  },
];

function mockViewport(matches: boolean) {
  vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        matches,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as unknown as MediaQueryList,
  );
}

function mockWidth(width: number) {
  return vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const w = this.getAttribute("data-slot") === "data-table" ? width : 0;
    return { x: 0, y: 0, top: 0, left: 0, right: w, bottom: 0, width: w, height: 0 } as DOMRect;
  });
}

describe("DataTable meta.label", () => {
  afterEach(() => vi.restoreAllMocks());

  it("labels a card row when the header isn't text", () => {
    mockViewport(true);
    render(
      <DataTable
        columns={COLUMNS}
        data={ORDERS}
        mobileLayout="cards"
        mobileBreakpointBasis="viewport"
        showPagination={false}
      />,
    );
    const card = document.querySelector("[data-slot=data-table-card]")!;
    expect(Array.from(card.querySelectorAll("dt")).map((dt) => dt.textContent)).toEqual(["Total"]);
  });
});

describe("DataTable mobileBreakpointBasis", () => {
  afterEach(() => vi.restoreAllMocks());

  it("switches to cards when the table itself is narrow, on a wide screen", () => {
    mockViewport(false);
    mockWidth(420);
    render(<DataTable columns={COLUMNS} data={ORDERS} mobileLayout="cards" />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    expect(document.querySelectorAll("[data-slot=data-table-card]")).toHaveLength(2);
    expect(document.querySelector("[data-slot=data-table]")).toHaveAttribute(
      "data-layout",
      "cards",
    );
  });

  it("keeps the table when the table is wide, even on a narrow viewport", () => {
    mockViewport(true);
    mockWidth(900);
    render(<DataTable columns={COLUMNS} data={ORDERS} mobileLayout="cards" />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("accepts a breakpoint in px", () => {
    mockViewport(false);
    mockWidth(900);
    render(
      <DataTable columns={COLUMNS} data={ORDERS} mobileLayout="cards" mobileBreakpoint={1000} />,
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("uses the viewport before the table has a width, and with basis viewport", async () => {
    mockViewport(true);
    // No layout (happy-dom): width 0 falls back to the media query.
    const { unmount } = render(<DataTable columns={COLUMNS} data={ORDERS} mobileLayout="cards" />);
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    unmount();
    mockWidth(900);
    render(
      <DataTable
        columns={COLUMNS}
        data={ORDERS}
        mobileLayout="cards"
        mobileBreakpointBasis="viewport"
      />,
    );
    await tick();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* InputGroup inside a Field                                            */
/* ------------------------------------------------------------------ */

describe("InputGroup inside a Field", () => {
  it("links the built-in input to the label, hint, error, required and disabled state", () => {
    const { rerender } = render(
      <Field label="Store address" hint="Your store's web address" required>
        <InputGroup leadingAddon="https://" trailingAddon=".hilum.shop" placeholder="my-store" />
      </Field>,
    );
    const input = screen.getByLabelText(/Store address/);
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("data-slot", "input-group-input");
    expect(input).toHaveAccessibleDescription("Your store's web address");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).not.toHaveAttribute("aria-invalid");

    rerender(
      <Field label="Store address" error="That address is taken" disabled>
        <InputGroup leadingAddon="https://" trailingAddon=".hilum.shop" placeholder="my-store" />
      </Field>,
    );
    const invalid = screen.getByLabelText("Store address");
    expect(invalid).toHaveAttribute("aria-invalid", "true");
    expect(invalid).toHaveAccessibleDescription("That address is taken");
    expect(invalid).toBeDisabled();
    expect(document.querySelector("[data-slot=input-group]")).toHaveAttribute("data-invalid");
  });

  it("keeps its own id and explicit aria props; error marks it invalid", () => {
    render(
      <Field label="Domain">
        <InputGroup
          id="domain"
          leadingAddon="https://"
          error
          name="domain"
          aria-describedby="custom-help"
          inputProps={{ autoComplete: "off", maxLength: 63 }}
        />
      </Field>,
    );
    const input = screen.getByLabelText("Domain");
    expect(input).toHaveAttribute("id", "domain");
    expect(input).toHaveAttribute("aria-describedby", "custom-help");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("name", "domain");
    expect(input).toHaveAttribute("autocomplete", "off");
    expect(input).toHaveAttribute("maxlength", "63");
  });
});

/* ------------------------------------------------------------------ */
/* InputNumber width                                                    */
/* ------------------------------------------------------------------ */

describe("InputNumber width", () => {
  it("is full width inside a Field and compact elsewhere", () => {
    render(
      <>
        <Field label="Weight">
          <InputNumber value={1} onChange={() => {}} />
        </Field>
        <InputNumber aria-label="Quantity" value={1} onChange={() => {}} />
        <Field label="Width">
          <InputNumber value={1} onChange={() => {}} fullWidth={false} />
        </Field>
      </>,
    );
    const [inField, bare, optedOut] = Array.from(
      document.querySelectorAll("[data-slot=input-number]"),
    );
    expect(inField).toHaveClass("w-full");
    expect(inField).not.toHaveClass("w-48");
    expect(bare).toHaveClass("w-48");
    expect(optedOut).toHaveClass("w-48");
  });
});

/* ------------------------------------------------------------------ */
/* PreviewFrame with a blank page                                       */
/* ------------------------------------------------------------------ */

describe("PreviewFrame src=about:blank", () => {
  it("counts a blank frame as loaded at once and calls onLoad once", async () => {
    const onLoad = vi.fn();
    const { container, rerender } = render(
      <PreviewFrame src="about:blank" title="Preview" onLoad={onLoad} />,
    );
    expect(container.querySelector("[data-slot=preview-frame-loading]")).toBeNull();
    expect(container.querySelector("[data-slot=preview-frame-stage]")).not.toHaveAttribute(
      "aria-busy",
    );
    await tick();
    expect(onLoad).toHaveBeenCalledTimes(1);
    // An empty src is blank too.
    rerender(<PreviewFrame src="" title="Preview" onLoad={onLoad} />);
    expect(container.querySelector("[data-slot=preview-frame-loading]")).toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/* StatCard values                                                      */
/* ------------------------------------------------------------------ */

describe("StatCard value sizing", () => {
  it("lets a value wrap between currency and amount, and sizes it to its longest word", () => {
    render(
      <>
        <StatCard label="Net sales" value={"S/\u00a012,345,678.90"} />
        <StatCard label="Ventes" value={"1\u00a0234\u00a0567,89\u00a0zł"} />
        <StatCard label="Orders" value={8421} />
        <StatCard label="Custom" value={<span>42</span>} />
      </>,
    );
    const [money, grouped, number, node] = Array.from(
      document.querySelectorAll<HTMLElement>("[data-slot=stat-card-value]"),
    );
    expect(money!.textContent).toBe("S/ 12,345,678.90");
    expect(money!.style.getPropertyValue("--stat-value-chars")).toBe("13");
    // No-break spaces between digits (group separators) stay.
    expect(grouped!.textContent).toBe("1\u00a0234\u00a0567,89 zł");
    expect(grouped!.style.getPropertyValue("--stat-value-chars")).toBe("12");
    expect(number!.style.getPropertyValue("--stat-value-chars")).toBe("4");
    expect(node!.style.getPropertyValue("--stat-value-chars")).toBe("");
    // Each value sits in its own size container.
    expect(money!.parentElement).toHaveClass("@container/stat-card-value");
  });
});

/* ------------------------------------------------------------------ */
/* formatCurrency currencyDisplay / currencySymbol                      */
/* ------------------------------------------------------------------ */

describe("formatCurrency currency sign", () => {
  const plain = (text: string) => text.replace(/[\u00a0\u202f]/g, " ");

  it("passes currencyDisplay to Intl", () => {
    // es-PE has a local sign for the sol; narrowSymbol drops a country prefix.
    expect(plain(formatCurrency(1234.5, { currency: "PEN", locale: "es-PE" }))).toBe("S/ 1,234.50");
    expect(formatCurrency(5, { currency: "CAD", locale: "en" })).toBe("CA$5.00");
    expect(
      formatCurrency(5, { currency: "CAD", locale: "en", currencyDisplay: "narrowSymbol" }),
    ).toBe("$5.00");
    expect(
      plain(formatCurrency(72, { currency: "PEN", locale: "en-US", currencyDisplay: "code" })),
    ).toBe("PEN 72.00");
  });

  it("replaces the sign with currencySymbol, keeping position and spacing", () => {
    expect(
      plain(formatCurrency(72, { currency: "PEN", locale: "en-US", currencySymbol: "S/" })),
    ).toBe("S/ 72.00");
    expect(
      plain(
        formatCurrency(1234567, {
          currency: "PEN",
          locale: "en-US",
          currencySymbol: "S/",
          notation: "compact",
          maximumFractionDigits: 1,
        }),
      ),
    ).toBe("S/ 1.2M");
    // Trailing signs stay trailing.
    expect(
      plain(formatCurrency(5, { currency: "EUR", locale: "de-DE", currencySymbol: "EUR" })),
    ).toBe("5,00 EUR");
    expect(formatCurrency(null, { currencySymbol: "S/" })).toBe("—");
    expect(
      formatCurrency(1050, {
        currency: "PEN",
        locale: "en-US",
        minorUnits: true,
        currencySymbol: "S/",
      }),
    ).toMatch(/^S\/\s10\.50$/);
  });
});

/* ------------------------------------------------------------------ */
/* MultiCombobox: popover layer and labels for unknown values           */
/* ------------------------------------------------------------------ */

describe("MultiCombobox list layer", () => {
  const OPTIONS: ComboboxOption[] = [
    { value: "summer", label: "Summer" },
    { value: "sale", label: "Sale" },
  ];

  it("renders the list outside the field (a portal), so a card can't clip it", () => {
    const { container } = render(
      <div style={{ overflow: "hidden" }}>
        <MultiCombobox aria-label="Collections" options={OPTIONS} />
      </div>,
    );
    fireEvent.focus(screen.getByRole("combobox", { name: "Collections" }));
    const listbox = screen.getByRole("listbox", { name: "Collections" });
    expect(container).not.toContainElement(listbox);
    const content = listbox.closest("[data-slot=multi-combobox-content]")!;
    expect(content).toHaveAttribute("data-hilum-mobile-sheet", "true");
    // Not announced as a dialog: the listbox is the combobox's popup.
    expect(content).not.toHaveAttribute("role");
    fireEvent.click(screen.getByRole("option", { name: "Sale" }));
    // Still open after a pick (closeOnSelect is off).
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

describe("MultiCombobox labels for values not in options", () => {
  const chips = () =>
    Array.from(document.querySelectorAll("[data-slot=tag]")).map((tag) => tag.textContent);

  it("never shows a raw id: Loading… while loading, then Unknown item", () => {
    const { rerender } = render(
      <MultiCombobox aria-label="Products" options={[]} value={["gid://Product/42"]} loading />,
    );
    expect(chips()).toEqual([MULTI_COMBOBOX_DEFAULT_LABELS.loadingOption]);
    expect(document.querySelector("[data-slot=tag]")).toHaveAttribute("data-unknown");
    rerender(<MultiCombobox aria-label="Products" options={[]} value={["gid://Product/42"]} />);
    expect(chips()).toEqual(["Unknown item"]);
    expect(screen.getByRole("button", { name: "Remove Unknown item" })).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAccessibleDescription("1 selected: Unknown item");
    rerender(
      <MultiCombobox
        aria-label="Products"
        options={[]}
        value={["gid://Product/42"]}
        labels={{ unknownOption: "Producto eliminado", loadingOption: "Cargando…" }}
      />,
    );
    expect(chips()).toEqual(["Producto eliminado"]);
  });

  it("takes labels from selectedOptions and getOptionLabel, and remembers them", () => {
    function Remote() {
      const [query, setQuery] = React.useState("");
      const [value, setValue] = React.useState(["p1", "p2", "p3"]);
      return (
        <MultiCombobox
          aria-label="Products"
          // Search results only: none of the selected products.
          options={query ? [{ value: "p9", label: "Tea towel" }] : []}
          onSearchChange={setQuery}
          // Loaded with the record.
          selectedOptions={[{ value: "p1", label: "Ceramic mug" }]}
          getOptionLabel={(id) => (id === "p2" ? "Linen napkin" : undefined)}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    render(<Remote />);
    expect(chips()).toEqual(["Ceramic mug", "Linen napkin", "Unknown item"]);
    const input = screen.getByRole("combobox", { name: "Products" });
    fireEvent.change(input, { target: { value: "tea" } });
    fireEvent.click(screen.getByRole("option", { name: "Tea towel" }));
    fireEvent.change(input, { target: { value: "" } });
    // "Tea towel" left `options`, but its chip keeps the label.
    expect(chips()).toEqual(["Ceramic mug", "Linen napkin", "Unknown item", "Tea towel"]);
  });
});
