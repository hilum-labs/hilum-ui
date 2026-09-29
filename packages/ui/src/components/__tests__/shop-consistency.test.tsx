import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button, buttonVariants } from "../button";
import { PaginationLink } from "../pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from "../alert-dialog";
import { Input } from "../input";
import { SearchInput } from "../search-input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import { NativeSelect } from "../native-select";
import { Combobox } from "../combobox";
import { InputNumber } from "../input-number";
import { InputGroup } from "../input-group";
import { TimePicker } from "../time-picker";
import { DatePicker, DateRangePicker } from "../date-picker";
import { ColorInput } from "../color-input";
import { FilterBar } from "../filter-bar";
import { SearchableTable } from "../searchable-table";
import { Field } from "../field";
import { TitledCard } from "../titled-card";
import { CardHeading } from "../card-heading";
import { AccountMenuHeader } from "../account-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { RadioCards } from "../radio-card";
import { StatusBadge } from "../status-badge";
import { Callout } from "../callout";
import { Badge } from "../badge";
import { CommandPalette } from "../command-palette";
import { CommandDialog, CommandInput } from "../command";
import { ContextualSaveBar } from "../contextual-save-bar";
import { controlHeightClass, controlTextClass } from "../../lib/interaction";
import "@testing-library/jest-dom";

/** The classes that paint a button's fill (its `::before` layer). */
const fillClasses = (el: Element) =>
  Array.from(el.classList)
    .filter((c) => c.includes("before:"))
    .sort();

/* ------------------------------------------------------------------ */
/* Button asChild fill parity                                           */
/* ------------------------------------------------------------------ */

describe("Button fill parity", () => {
  const variants = [
    "primary",
    "brand",
    "secondary",
    "outline",
    "destructive",
    "ghost",
    "tile",
    "field",
  ] as const;

  it.each(variants)("a %s asChild link gets the same fill as the plain button", (variant) => {
    render(
      <>
        <Button variant={variant}>Plain</Button>
        <Button variant={variant} asChild>
          <a href="/orders">Linked</a>
        </Button>
      </>,
    );
    const plain = screen.getByRole("button", { name: "Plain" });
    const link = screen.getByRole("link", { name: "Linked" });
    expect(fillClasses(link)).toEqual(fillClasses(plain));
    expect(link.className).toBe(plain.className);
  });

  it("paints the primary fill, hover and press on the element itself", () => {
    render(
      <Button asChild>
        <a href="/orders">Orders</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Orders" });
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link).toHaveClass(
      "isolate",
      "before:absolute",
      "before:inset-0",
      "before:-z-10",
      "before:rounded-[inherit]",
      "before:bg-foreground",
      "hover:before:bg-foreground/90",
      "active:before:bg-foreground/80",
      "text-background",
    );
    // A single element child stays a single element: no extra fill span.
    expect(link.children).toHaveLength(0);
    expect(link).toHaveTextContent("Orders");
  });

  it("the plain button no longer renders a separate fill span", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.querySelector("span[aria-hidden]")).toBeNull();
    expect(button).toHaveClass("before:bg-foreground");
  });

  it("`active` swaps the fill for the held fill on both renderings", () => {
    render(
      <>
        <Button variant="secondary" active>
          Plain
        </Button>
        <Button variant="secondary" active asChild>
          <a href="/x">Linked</a>
        </Button>
      </>,
    );
    for (const el of [
      screen.getByRole("button", { name: "Plain" }),
      screen.getByRole("link", { name: "Linked" }),
    ]) {
      expect(el).toHaveClass("before:bg-foreground/[0.15]", "hover:before:bg-foreground/[0.15]");
      expect(el).not.toHaveClass(
        "before:bg-foreground/[0.07]",
        "hover:before:bg-foreground/[0.11]",
      );
      expect(el).toHaveAttribute("data-active");
    }
  });

  it("asChild supports loading: busy, inert and the same loading glyph", () => {
    const onClick = vi.fn();
    render(
      <Button asChild loading onClick={onClick}>
        <a href="/save">Save</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Save" });
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link.querySelector("svg path.animate-hilum-orbit")).not.toBeNull();
    const click = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("asChild renders leading icons inside the child and forwards refs", () => {
    const ref = vi.fn();
    const Icon = (props: { size?: number }) => <svg data-testid="lead" width={props.size} />;
    render(
      <Button asChild leadingIcon={Icon} ref={ref}>
        <a href="/new">New order</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "New order" });
    expect(link).toContainElement(screen.getByTestId("lead"));
    expect(ref).toHaveBeenCalledWith(link);
  });

  it("disabled asChild links are aria-disabled and don't navigate", () => {
    render(
      <Button asChild disabled>
        <a href="/x">Blocked</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Blocked" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveClass("aria-disabled:opacity-50", "aria-disabled:pointer-events-none");
    expect(fireEvent.click(link)).toBe(false);
  });

  it("the loading spinner animates (hilum-orbit) and respects reduced motion", () => {
    render(<Button loading>Saving</Button>);
    const path = screen.getByRole("button").querySelector("svg path");
    expect(path).toHaveClass("animate-hilum-orbit", "motion-reduce:animate-none");
    expect(path).not.toHaveAttribute("style");
  });

  it("buttonVariants() alone carries the fill for foreign elements", () => {
    const classes = buttonVariants({ variant: "destructive" });
    expect(classes).toContain("before:bg-destructive/10");
    expect(classes).toContain("hover:before:bg-destructive/15");
  });
});

/* ------------------------------------------------------------------ */
/* Pagination active page                                               */
/* ------------------------------------------------------------------ */

describe("PaginationLink", () => {
  it("fills the current page with the inverted foreground", () => {
    render(
      <>
        <PaginationLink href="?page=1">1</PaginationLink>
        <PaginationLink href="?page=2" isActive>
          2
        </PaginationLink>
      </>,
    );
    const current = screen.getByRole("link", { name: "2" });
    expect(current).toHaveAttribute("aria-current", "page");
    expect(current).toHaveClass("text-background", "before:bg-foreground");
    const other = screen.getByRole("link", { name: "1" });
    expect(other).not.toHaveClass("before:bg-foreground");
    expect(other).toHaveClass("hover:before:bg-foreground/[0.06]");
  });
});

/* ------------------------------------------------------------------ */
/* AlertDialogAction asChild                                            */
/* ------------------------------------------------------------------ */

describe("AlertDialogAction / AlertDialogCancel asChild", () => {
  it("lets a Button child keep its own variant", () => {
    render(
      <AlertDialog open>
        <AlertDialogContent>
          <AlertDialogTitle>Delete product?</AlertDialogTitle>
          <AlertDialogCancel asChild>
            <Button variant="outline">Keep</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>,
    );
    const action = screen.getByRole("button", { name: "Delete" });
    expect(action).toHaveAttribute("data-slot", "alert-dialog-action");
    expect(action).toHaveClass("text-destructive", "before:bg-destructive/10");
    expect(action).not.toHaveClass("bg-brand-primary", "text-background");
    const cancel = screen.getByRole("button", { name: "Keep" });
    expect(cancel).toHaveClass("border-border");
    expect(cancel).not.toHaveClass("bg-card", "rounded-xl");
  });
});

/* ------------------------------------------------------------------ */
/* One size for single-line form controls                               */
/* ------------------------------------------------------------------ */

/** Unprefixed height utilities (h-9, h-10, …), ignoring variants like compact:h-6. */
const heights = (el: Element) => Array.from(el.classList).filter((c) => /^h-\d/.test(c));
/** Unprefixed font-size utilities. */
const textSizes = (el: Element) =>
  Array.from(el.classList).filter((c) => /^(text-(xs|sm|base|lg|\[\d+px\])|body|caption)$/.test(c));

describe("single-line form control size", () => {
  it("is one height (36px) and one text size (14px)", () => {
    expect(controlHeightClass).toBe("h-9");
    expect(controlTextClass).toBe("text-sm");
  });

  it("every default-density control uses it", () => {
    const noop = () => {};
    const { container } = render(
      <>
        <Input aria-label="Title" />
        <SearchInput value="" onValueChange={noop} aria-label="Search orders" />
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
        <InputGroup aria-label="Domain" placeholder="shop" trailingAddon=".hilum.shop" />
        <TimePicker aria-label="Opens at" value="09:00" onChange={noop} />
        <DatePicker aria-label="Ships on" value={undefined} onChange={noop} />
        <DateRangePicker aria-label="Period" onChange={noop} />
        <ColorInput value="#c100f1" onChange={noop} />
      </>,
    );
    const controls: Array<[string, Element, Element]> = [
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
        container.querySelector("[data-slot='input-group']")!,
      ],
      [
        "TimePicker",
        container.querySelector("[data-slot='time-picker']")!,
        container.querySelector("[data-slot='time-picker']")!,
      ],
      ["DatePicker", screen.getByLabelText("Ships on"), screen.getByLabelText("Ships on")],
      ["DateRangePicker", screen.getByLabelText("Period"), screen.getByLabelText("Period")],
      [
        "ColorInput",
        container.querySelector("[data-slot='color-input']")!,
        screen.getByLabelText("Hex colour"),
      ],
    ];
    for (const [name, box, text] of controls) {
      expect({ name, heights: heights(box) }).toEqual({ name, heights: ["h-9"] });
      expect({ name, text: textSizes(text) }).toEqual({ name, text: ["text-sm"] });
    }
  });

  it("keeps the compact editor tier at 24px / 12px", () => {
    render(<Input aria-label="X" />);
    expect(screen.getByLabelText("X")).toHaveClass("compact:h-6", "compact:text-[12px]");
  });

  it("buttons beside controls in a FilterBar take the control height", () => {
    const { container } = render(
      <FilterBar
        search={{ value: "", onValueChange: () => {} }}
        active
        onClear={() => {}}
        actions={<Button size="sm">Export</Button>}
      >
        <Button variant="outline">More filters</Button>
      </FilterBar>,
    );
    const actions = container.querySelector("[data-slot='filter-bar-actions']")!;
    const filters = container.querySelector("[data-slot='filter-bar-filters']")!;
    for (const row of [actions, filters]) {
      expect(row.className).toContain("[&>[data-slot=button]:not([data-icon-only])]:h-9");
      expect(row.className).toContain("[&>[data-slot=button][data-icon-only]]:size-9");
    }
  });

  it("an InputGroup trailing button sits inset in the 36px field", () => {
    const { container } = render(
      <InputGroup aria-label="Coupon" placeholder="Code" trailingButton={<Button>Apply</Button>} />,
    );
    const slot = container.querySelector("[data-slot='input-group-button']")!;
    expect(slot).toContainElement(screen.getByRole("button", { name: "Apply" }));
    expect(slot.className).toContain("[&>[data-slot=button]]:h-7");
    expect(container.querySelector("[data-slot='input-group']")).toHaveClass("pe-1");
  });
});

/* ------------------------------------------------------------------ */
/* InputGroup / SearchableTable search                                  */
/* ------------------------------------------------------------------ */

describe("InputGroup as a control", () => {
  it("has no vertical padding and shows the focus ring while its input has focus", () => {
    const { container } = render(<InputGroup aria-label="Search" placeholder="Search" />);
    const group = container.querySelector("[data-slot='input-group']")!;
    expect(group).not.toHaveClass("py-2");
    expect(group).toHaveClass("focus-within:border-ring", "focus-within:ring-2");
    expect(screen.getByRole("textbox", { name: "Search" })).toHaveClass("h-full");
  });

  it("names the input, not the wrapper, with aria-label", () => {
    const { container } = render(<InputGroup aria-label="Search" placeholder="Search" />);
    expect(screen.getByRole("textbox", { name: "Search" })).toBeInTheDocument();
    expect(container.querySelector("[data-slot='input-group']")).not.toHaveAttribute("aria-label");
  });
});

describe("SearchableTable toolbar", () => {
  it("renders a standard-height, labelled search field and labelled filters", () => {
    const { container } = render(
      <SearchableTable
        data={[{ id: "1", name: "Mug" }]}
        columns={[{ key: "name", label: "Name" }]}
        searchTerm=""
        onSearchChange={() => {}}
        searchPlaceholder="Search products"
        filters={{
          status: {
            value: "all",
            onChange: () => {},
            placeholder: "Status",
            options: [{ value: "all", label: "All" }],
          },
        }}
      />,
    );
    const group = container.querySelector("[data-slot='input-group']")!;
    expect(heights(group)).toEqual(["h-9"]);
    expect(group).not.toHaveClass("py-2");
    expect(screen.getByRole("textbox", { name: "Search products" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Status" })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Select width and option colour                                       */
/* ------------------------------------------------------------------ */

describe("Select trigger width", () => {
  it("does not force a 160px minimum width (fits narrow columns and Fields)", () => {
    render(
      <Field label="Currency">
        <Select>
          <SelectTrigger />
          <SelectContent>
            <SelectItem value="pen">PEN</SelectItem>
          </SelectContent>
        </Select>
      </Field>,
    );
    const trigger = screen.getByRole("combobox", { name: "Currency" });
    expect(trigger).not.toHaveClass("min-w-40");
    expect(trigger).toHaveClass("min-w-0", "max-w-full");
  });
});

describe("SelectItem colour", () => {
  it("renders options in the foreground colour and mutes only disabled ones", () => {
    render(
      <Select open value="a">
        <SelectTrigger aria-label="Pick" />
        <SelectContent>
          <SelectItem value="a">Active</SelectItem>
          <SelectItem value="b">Draft</SelectItem>
          <SelectItem value="c" disabled>
            Archived
          </SelectItem>
        </SelectContent>
      </Select>,
    );
    const draft = screen.getByRole("option", { name: "Draft" });
    expect(draft).toHaveClass("text-foreground");
    expect(draft).not.toHaveClass("text-muted-foreground");
    const archived = screen.getByRole("option", { name: "Archived" });
    expect(archived).toHaveAttribute("data-disabled");
    expect(archived).toHaveClass("data-[disabled]:text-muted-foreground");
  });
});

/* ------------------------------------------------------------------ */
/* Card headings                                                        */
/* ------------------------------------------------------------------ */

describe("card headings", () => {
  it("TitledCard renders one heading style (an h2) with or without actions", () => {
    render(
      <>
        <TitledCard title="Plain">Body</TitledCard>
        <TitledCard title="With actions" actionButtons={<button type="button">Edit</button>}>
          Body
        </TitledCard>
      </>,
    );
    const plain = screen.getByRole("heading", { level: 2, name: "Plain" });
    const withActions = screen.getByRole("heading", { level: 2, name: "With actions" });
    expect(plain.className).toBe(withActions.className);
    expect(plain).toHaveClass("body", "font-semibold");
    expect(withActions).not.toHaveClass("text-base", "sm:text-lg", "subheading");
  });

  it("TitledCard and CardHeading take a heading level", () => {
    render(
      <>
        <TitledCard title="Payments" headingLevel={3} />
        <CardHeading title="Team" headingLevel={4} />
      </>,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Payments" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 4, name: "Team" })).toBeInTheDocument();
  });

  it("CardHeading renders a heading in the same style as TitledCard", () => {
    render(
      <>
        <CardHeading title="Team" actions={[{ label: "Invite" }]} />
        <TitledCard title="Payments" />
      </>,
    );
    const a = screen.getByRole("heading", { level: 2, name: "Team" });
    const b = screen.getByRole("heading", { level: 2, name: "Payments" });
    expect(a.className).toBe(b.className);
  });
});

/* ------------------------------------------------------------------ */
/* Account menu, RadioCards, status dots, Callout actions               */
/* ------------------------------------------------------------------ */

describe("account menu text", () => {
  it("a DropdownMenuLabel shows rich content (name and email) as typed", () => {
    render(
      <DropdownMenu open>
        <DropdownMenuTrigger>Account</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            <p>Ana Pérez</p>
            <p>ana@shop.pe</p>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    const label = screen.getByText("ana@shop.pe").parentElement!;
    expect(label).toHaveClass("[&_*]:normal-case", "[&_*]:tracking-normal");
  });

  it("AccountMenuHeader never inherits an uppercase transform", () => {
    render(<AccountMenuHeader name="Ana Pérez" email="ana@shop.pe" />);
    expect(
      screen.getByText("ana@shop.pe").closest("[data-slot='account-menu-header']"),
    ).toHaveClass("normal-case", "tracking-normal");
  });
});

describe("RadioCards focus", () => {
  it("draws focus as a detached halo, distinct from the checked edge ring", () => {
    render(
      <RadioCards
        aria-label="Plan"
        value="basic"
        options={[
          { value: "basic", label: "Basic" },
          { value: "pro", label: "Pro" },
        ]}
      />,
    );
    const pro = screen.getByRole("radio", { name: /Pro/ });
    expect(pro).toHaveClass("focus-visible:ring-offset-2", "focus-visible:ring-offset-background");
    // Unchecked options don't look disabled.
    expect(screen.getByText("Pro")).toHaveClass("text-foreground");
  });
});

describe("StatusBadge dots", () => {
  it("use token colours mixed towards the foreground, no raw palette classes", () => {
    const { container } = render(
      <>
        {(["success", "info", "attention", "warning", "critical", "neutral"] as const).map((t) => (
          <StatusBadge key={t} tone={t} status={t} showDot />
        ))}
      </>,
    );
    const dots = container.querySelectorAll<HTMLElement>("[data-slot='status-badge-dot']");
    expect(dots).toHaveLength(6);
    for (const dot of Array.from(dots)) {
      expect(dot.className).not.toMatch(/bg-(blue|emerald|amber|orange)-\d/);
      expect(dot).toHaveClass("bg-(--status-dot)");
    }
    expect(dots[1]!.style.getPropertyValue("--status-dot")).toBe(
      "color-mix(in srgb, var(--categorical-blue) 62%, var(--foreground))",
    );
  });

  it("dotClassName still overrides the colour", () => {
    const { container } = render(
      <StatusBadge status="paid" showDot dotClassName="bg-foreground" />,
    );
    const dot = container.querySelector("[data-slot='status-badge-dot']")!;
    expect(dot).toHaveClass("bg-foreground");
    expect(dot).not.toHaveClass("bg-(--status-dot)");
  });
});

describe("Callout actions", () => {
  it("stretch only buttons on mobile, not badges", () => {
    const { container } = render(
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
    const actions = container.querySelector("[data-slot='callout-actions']")!;
    expect(actions).not.toHaveClass("max-sm:items-stretch");
    expect(actions).toHaveClass("max-sm:items-start", "max-sm:[&>[data-slot=button]]:self-stretch");
  });
});

/* ------------------------------------------------------------------ */
/* CommandPalette                                                       */
/* ------------------------------------------------------------------ */

describe("CommandPalette layout", () => {
  it("puts the close button in the search row after the esc hint (no overlap)", () => {
    render(<CommandPalette open onClose={() => {}} items={[{ label: "Orders", href: "/o" }]} />);
    const input = screen.getByRole("combobox");
    const row = input.parentElement!;
    const close = screen.getByRole("button", { name: "Close" });
    const esc = row.querySelector("[data-slot='command-palette-esc']")!;
    expect(row).toContainElement(close);
    expect(esc.compareDocumentPosition(close) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(close).not.toHaveClass("absolute");
    // Only one close button (the dialog's corner button is off).
    expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(1);
  });

  it("is anchored to the top on desktop and keeps a fixed results height on mobile", () => {
    render(<CommandPalette open onClose={() => {}} items={[]} />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("lg:top-[12dvh]", "lg:translate-y-0");
    expect(dialog).not.toHaveClass("lg:top-1/2", "lg:-translate-y-1/2");
    expect(dialog.querySelector("[data-slot='command-palette-results']")).toHaveClass(
      "max-lg:h-[min(55dvh,24rem)]",
    );
  });
});

describe("CommandDialog layout", () => {
  it("is top-anchored and reserves room for the close button in the input row", () => {
    render(
      <CommandDialog open>
        <CommandInput placeholder="Search" />
      </CommandDialog>,
    );
    expect(screen.getByRole("dialog")).toHaveClass(
      "lg:top-[12dvh]",
      "[&_[data-slot=command-input-wrapper]]:pe-12",
    );
  });
});

describe("CommandPalette async groups", () => {
  it("reports the query and renders app-fetched groups, unfiltered, after static items", () => {
    const onQueryChange = vi.fn();
    const onNavigate = vi.fn();
    const { rerender } = render(
      <CommandPalette
        open
        onClose={() => {}}
        onNavigate={onNavigate}
        items={[{ label: "Orders", href: "/orders", category: "Pages" }]}
        onQueryChange={onQueryChange}
        groups={[{ id: "orders", label: "Orders", items: [], loading: true }]}
      />,
    );
    expect(onQueryChange).toHaveBeenCalledWith("");
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "#1001" } });
    expect(onQueryChange).toHaveBeenLastCalledWith("#1001");

    // Loading: a loading row under the heading, busy listbox, polite announcement.
    expect(screen.getByRole("listbox")).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("status")).toHaveTextContent("Loading…");
    expect(screen.getByRole("group", { name: "Orders" })).toHaveTextContent("Loading…");

    rerender(
      <CommandPalette
        open
        onClose={() => {}}
        onNavigate={onNavigate}
        items={[{ label: "Orders", href: "/orders", category: "Pages" }]}
        onQueryChange={onQueryChange}
        groups={[
          {
            id: "orders",
            label: "Orders",
            items: [{ id: "o1", label: "Order 1001", href: "/orders/1001" }],
          },
          { id: "customers", label: "Customers", items: [], emptyText: "No customers" },
          { id: "products", label: "Products", items: [] },
        ]}
      />,
    );
    expect(screen.getByRole("listbox")).not.toHaveAttribute("aria-busy");
    // "#1001" matches no static item, but the fetched order still shows.
    expect(screen.getAllByRole("option")).toHaveLength(1);
    expect(screen.getByRole("group", { name: "Customers" })).toHaveTextContent("No customers");
    expect(screen.queryByRole("group", { name: "Products" })).toBeNull();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onNavigate).toHaveBeenCalledWith("/orders/1001");
  });

  it("labels are localizable", () => {
    render(
      <CommandPalette
        open
        onClose={() => {}}
        items={[]}
        closeLabel="Cerrar"
        labels={{ loading: "Cargando…", escapeHint: "esc" }}
        groups={[{ id: "p", label: "Productos", items: [], loading: true }]}
      />,
    );
    expect(screen.getByRole("button", { name: "Cerrar" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Productos" })).toHaveTextContent("Cargando…");
  });
});

/* ------------------------------------------------------------------ */
/* ContextualSaveBar                                                    */
/* ------------------------------------------------------------------ */

describe("ContextualSaveBar in fixed mode", () => {
  it("replaces the app top bar by default: top 0, header height", () => {
    render(<ContextualSaveBar open onSave={() => {}} />);
    const bar = screen.getByRole("region", { name: "Unsaved changes" });
    expect(bar).toHaveClass(
      "sm:top-[var(--hilum-save-bar-top,0px)]",
      "sm:min-h-[var(--hilum-header-height,0px)]",
    );
    expect(bar.className).not.toContain("var(--hilum-save-bar-top,var(--hilum-header-height");
    expect(bar.style.getPropertyValue("--hilum-save-bar-top")).toBe("");
  });

  it("keeps offsetTop as an explicit override", () => {
    render(<ContextualSaveBar open onSave={() => {}} offsetTop="4rem" />);
    const bar = screen.getByRole("region", { name: "Unsaved changes" });
    expect(bar.style.getPropertyValue("--hilum-save-bar-top")).toBe("4rem");
  });
});
