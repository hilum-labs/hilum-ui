import { afterEach, describe, it, expect, vi } from "vitest";
import * as React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../select";
import { Field } from "../field";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { NativeSelect } from "../native-select";
import { InputNumber } from "../input-number";
import { Switch } from "../switch";
import { Checkbox } from "../checkbox";
import { CheckboxCard } from "../checkbox-card";
import { Combobox } from "../combobox";
import { DatePicker, DateRangePicker } from "../date-picker";
import { DateTimePicker } from "../date-time-picker";
import { TimePicker } from "../time-picker";
import { ColorInput } from "../color-input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../input-otp";
import { Steps, type Step } from "../steps";
import { DataTable, type ColumnDef } from "../data-table";
import { ResourceCell } from "../resource-item";

const tick = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

/* ------------------------------------------------------------------ */
/* Select inside a <form>                                               */
/* ------------------------------------------------------------------ */

describe("Select inside a form", () => {
  function Brand({
    value,
    options,
    onValueChange,
    name,
  }: {
    value: string;
    options: string[];
    onValueChange: (value: string) => void;
    name?: string;
  }) {
    return (
      <form aria-label="Product">
        <Select value={value} onValueChange={onValueChange} {...(name ? { name } : {})}>
          <SelectTrigger aria-label="Brand" />
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </form>
    );
  }

  it("does not emit an empty value when the controlled value changes after mount", async () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Brand value="" options={[]} onValueChange={onValueChange} />);
    // Data loads: the value and its options arrive together.
    rerender(<Brand value="acme" options={["acme", "globex"]} onValueChange={onValueChange} />);
    await tick();
    rerender(<Brand value="globex" options={["acme", "globex"]} onValueChange={onValueChange} />);
    await tick();
    // A value whose option isn't loaded yet.
    rerender(<Brand value="initech" options={["acme", "globex"]} onValueChange={onValueChange} />);
    await tick();
    expect(onValueChange).not.toHaveBeenCalledWith("");
    expect(screen.getByRole("combobox", { name: "Brand" })).toHaveTextContent("");
  });

  it("still reports values chosen through the native select (autofill)", async () => {
    const onValueChange = vi.fn();
    render(
      <Brand
        value="acme"
        name="brand"
        options={["acme", "globex"]}
        onValueChange={onValueChange}
      />,
    );
    await tick();
    const native = document.querySelector("select[name=brand]") as HTMLSelectElement;
    fireEvent.change(native, { target: { value: "globex" } });
    expect(onValueChange).toHaveBeenCalledWith("globex");
  });

  it("works uncontrolled", async () => {
    const onValueChange = vi.fn();
    render(
      <form aria-label="Plan">
        <Select defaultValue="pro" onValueChange={onValueChange}>
          <SelectTrigger aria-label="Plan" />
          <SelectContent>
            <SelectItem value="pro">Pro</SelectItem>
          </SelectContent>
        </Select>
      </form>,
    );
    await tick();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveTextContent("Pro");
  });
});

/* ------------------------------------------------------------------ */
/* Field label follows a control's own id                               */
/* ------------------------------------------------------------------ */

function labelFor(text: string) {
  return screen.getByText(text).closest("label");
}

describe("Field label and a control's own id", () => {
  it("links the label to controls that set their own id", () => {
    render(
      <React.StrictMode>
        <Field label="Email">
          <Input id="email" />
        </Field>
        <Field label="Bio">
          <Textarea id="bio" />
        </Field>
        <Field label="Plan">
          <Select value="pro" onValueChange={() => {}}>
            <SelectTrigger id="plan" />
            <SelectContent>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Country">
          <NativeSelect id="country">
            <option value="pe">Peru</option>
          </NativeSelect>
        </Field>
        <Field label="Quantity">
          <InputNumber id="quantity" value={1} onChange={() => {}} />
        </Field>
      </React.StrictMode>,
    );
    expect(labelFor("Email")).toHaveAttribute("for", "email");
    expect(labelFor("Bio")).toHaveAttribute("for", "bio");
    expect(labelFor("Plan")).toHaveAttribute("for", "plan");
    expect(labelFor("Country")).toHaveAttribute("for", "country");
    expect(labelFor("Quantity")).toHaveAttribute("for", "quantity");
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute("id", "email");
    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveAttribute("id", "plan");
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toHaveAttribute("id", "quantity");
  });

  it("follows the control that replaces the one that owned the label", async () => {
    function Swap({ ready }: { ready: boolean }) {
      return (
        <Field label="Name" hint="As shown on invoices">
          {ready ? null : <Input placeholder="Loading" readOnly />}
          {ready ? <Input id="name" /> : null}
        </Field>
      );
    }
    const { rerender } = render(<Swap ready={false} />);
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAttribute("placeholder", "Loading");
    rerender(<Swap ready />);
    await tick();
    expect(labelFor("Name")).toHaveAttribute("for", "name");
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveAccessibleDescription(
      "As shown on invoices",
    );
  });

  it("follows a control whose id changes and a Select that replaces an Input", async () => {
    function Editable({ editing, id }: { editing: boolean; id: string }) {
      return (
        <Field label="Status">
          {editing ? (
            <Select value="active" onValueChange={() => {}}>
              <SelectTrigger id={`${id}-select`} />
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input id={id} readOnly value="Active" />
          )}
        </Field>
      );
    }
    const { rerender } = render(<Editable editing={false} id="status" />);
    expect(labelFor("Status")).toHaveAttribute("for", "status");
    rerender(<Editable editing={false} id="state" />);
    expect(labelFor("Status")).toHaveAttribute("for", "state");
    rerender(<Editable editing id="state" />);
    await tick();
    expect(labelFor("Status")).toHaveAttribute("for", "state-select");
    expect(screen.getByRole("combobox", { name: "Status" })).toBeInTheDocument();
  });

  it("keeps the first control as the label target when several are mounted", () => {
    render(
      <Field label="Price range">
        <Input placeholder="Min" />
        <Input id="max" placeholder="Max" />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Price range" })).toHaveAttribute(
      "placeholder",
      "Min",
    );
    expect(screen.getByPlaceholderText("Max")).toHaveAttribute("id", "max");
  });

  it("an explicit htmlFor still wins", () => {
    render(
      <Field label="Handle" htmlFor="handle">
        <Input id="handle" />
      </Field>,
    );
    expect(labelFor("Handle")).toHaveAttribute("for", "handle");
    expect(labelFor("Handle")).toHaveAttribute("id", "handle-label");
  });
});

/* ------------------------------------------------------------------ */
/* Field auto-wiring for more controls                                  */
/* ------------------------------------------------------------------ */

describe("Field wires more controls", () => {
  it("Switch and Checkbox take the label, hint, error, required and disabled state", () => {
    render(
      <>
        <Field label="Charge tax" hint="Applies to this product" required>
          <Switch />
        </Field>
        <Field label="Accept the terms" error="Accept to continue" disabled>
          <Checkbox />
        </Field>
      </>,
    );
    const toggle = screen.getByRole("switch", { name: "Charge tax" });
    expect(toggle).toHaveAccessibleDescription("Applies to this product");
    expect(toggle).toHaveAttribute("aria-required", "true");
    expect(toggle).not.toBeDisabled();
    const box = screen.getByRole("checkbox", { name: "Accept the terms" });
    expect(box).toHaveAccessibleDescription("Accept to continue");
    expect(box).toHaveAttribute("aria-invalid", "true");
    expect(box).toBeDisabled();
  });

  it("a Switch's own label and id win", () => {
    render(
      <Field label="Notifications">
        <Switch id="email-me" label="Email me" />
      </Field>,
    );
    const toggle = screen.getByRole("switch", { name: "Email me" });
    expect(toggle).toHaveAttribute("id", "email-me");
    expect(labelFor("Notifications")).toHaveAttribute("for", "email-me");
  });

  it("CheckboxCard keeps its own label inside a Field", () => {
    render(
      <Field label="Channels">
        <CheckboxCard label="Online store" />
      </Field>,
    );
    expect(screen.getByRole("checkbox", { name: "Online store" })).toBeInTheDocument();
  });

  it("Combobox takes the field wiring", () => {
    render(
      <Field label="Vendor" error="Pick a vendor" required>
        <Combobox options={[{ value: "acme", label: "Acme" }]} />
      </Field>,
    );
    const input = screen.getByRole("combobox", { name: "Vendor" });
    expect(input).toHaveAccessibleDescription("Pick a vendor");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("DatePicker and DateRangePicker triggers take the field wiring", () => {
    render(
      <>
        <Field label="Publish date" hint="Store time zone" disabled>
          <DatePicker />
        </Field>
        <Field label="Report range" error="Pick a range">
          <DateRangePicker presets={[]} />
        </Field>
      </>,
    );
    const date = screen.getByRole("button", { name: "Publish date" });
    expect(date).toHaveAccessibleDescription("Store time zone");
    expect(date).toBeDisabled();
    expect(date).not.toHaveAttribute("aria-required");
    const range = screen.getByRole("button", { name: "Report range" });
    expect(range).toHaveAttribute("aria-invalid", "true");
    expect(range).toHaveAccessibleDescription("Pick a range");
  });

  it("TimePicker, DateTimePicker and ColorInput are groups named by the label", () => {
    render(
      <>
        <Field label="Opens at" hint="Local time" required>
          <TimePicker />
        </Field>
        <Field label="Starts" error="Pick a start" disabled>
          <DateTimePicker />
        </Field>
        <Field label="Brand colour" error="Use a hex colour">
          <ColorInput value="#c100f1" onChange={() => {}} />
        </Field>
      </>,
    );
    const time = screen.getByRole("group", { name: "Opens at" });
    expect(time).toHaveAccessibleDescription("Local time");
    expect(labelFor("Opens at")).not.toHaveAttribute("for");
    expect(screen.getAllByRole("spinbutton", { name: "Hour" })[0]).toHaveAttribute(
      "aria-required",
      "true",
    );

    const starts = screen.getByRole("group", { name: "Starts" });
    expect(starts).toHaveAccessibleDescription("Pick a start");
    const dateHalf = screen.getByRole("button", { name: "Date" });
    expect(dateHalf).toHaveAttribute("aria-invalid", "true");
    expect(dateHalf).toBeDisabled();
    expect(dateHalf).toHaveAccessibleDescription("Pick a start");

    const colour = screen.getByRole("group", { name: "Brand colour" });
    expect(colour).toHaveAttribute("data-invalid");
    const hex = screen.getByRole("textbox", { name: "Hex colour" });
    expect(hex).toHaveAttribute("aria-invalid", "true");
    expect(hex).toHaveAccessibleDescription("Use a hex colour");
  });

  it("InputOTP takes the field wiring", () => {
    render(
      <Field label="Verification code" error="Code expired">
        <InputOTP maxLength={4}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Verification code" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Code expired");
  });
});

/* ------------------------------------------------------------------ */
/* Steps                                                                */
/* ------------------------------------------------------------------ */

const SEVEN_STEPS: Step[] = [
  { name: "Store details", status: "complete" },
  { name: "Add your first product with photos and variants", status: "complete" },
  { name: "Payments", status: "current" },
  { name: "Shipping zones and delivery rates", status: "upcoming" },
  { name: "Taxes", status: "upcoming" },
  { name: "Custom domain", status: "upcoming" },
  { name: "Launch", status: "upcoming" },
];

describe("Steps", () => {
  it("circles lay out one equal column per step, top-aligned", () => {
    render(<Steps steps={SEVEN_STEPS} />);
    const list = screen.getByRole("navigation", { name: "Progress" }).querySelector("ol")!;
    expect(list).toHaveClass("grid", "items-start");
    expect(list.style.gridTemplateColumns).toBe("repeat(7, minmax(0, 1fr))");
    expect(list.querySelectorAll("[data-slot=steps-connector]")).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Payments" })).toHaveAttribute("aria-current", "step");
  });

  it("bullets name every dot on its link and keep upcoming dots visible", () => {
    render(<Steps steps={SEVEN_STEPS} variant="bullets" />);
    expect(screen.getByText("Step 3 of 7")).toBeInTheDocument();
    const current = screen.getByRole("link", { name: "Payments: current step" });
    expect(current).toHaveAttribute("aria-current", "step");
    const upcoming = screen.getByRole("link", { name: "Launch: upcoming" });
    const dot = upcoming.querySelector("[data-slot=steps-dot]")!;
    expect(dot).toHaveClass("border-muted-foreground");
    expect(dot).not.toHaveClass("bg-muted");
    expect(screen.getAllByRole("link", { name: /: completed$/ })).toHaveLength(2);
  });
});

/* ------------------------------------------------------------------ */
/* DataTable: mobile cards and cell typography                          */
/* ------------------------------------------------------------------ */

interface Order {
  id: string;
  number: string;
  customer: string;
  total: string;
  status: string;
}

const ORDERS: Order[] = [
  { id: "1", number: "#1001", customer: "Ana", total: "$20.00", status: "Paid" },
  { id: "2", number: "#1002", customer: "Luis", total: "$35.00", status: "Pending" },
];

const ORDER_COLUMNS: ColumnDef<Order>[] = [
  {
    id: "order",
    header: "Order",
    cell: ({ row }) => (
      <ResourceCell title={row.original.number} subtitle={row.original.customer} />
    ),
  },
  { id: "total", header: "Total", cell: ({ row }) => row.original.total },
  { id: "status", header: "Status", cell: ({ row }) => row.original.status },
  {
    id: "actions",
    header: () => null,
    cell: ({ row }) => <button type="button">Edit {row.original.number}</button>,
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

describe("DataTable mobileLayout=cards", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders stacked cards on a phone, with the primary column as the title", () => {
    mockViewport(true);
    render(
      <DataTable
        columns={ORDER_COLUMNS}
        data={ORDERS}
        getRowId={(row) => row.id}
        mobileLayout="cards"
        showPagination={false}
      />,
    );
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
    const cards = document.querySelectorAll("[data-slot=data-table-card]");
    expect(cards).toHaveLength(2);
    const first = cards[0] as HTMLElement;
    expect(first.querySelector("[data-slot=data-table-card-title]")).toHaveTextContent("#1001Ana");
    const terms = Array.from(first.querySelectorAll("dt")).map((dt) => dt.textContent);
    expect(terms).toEqual(["Total", "Status"]);
    expect(first.querySelector("dd")).toHaveTextContent("$20.00");
    // The unlabelled actions column renders at the end of the card.
    expect(first).toContainElement(screen.getByRole("button", { name: "Edit #1001" }));
  });

  it("keeps the table on wide screens", () => {
    mockViewport(false);
    render(<DataTable columns={ORDER_COLUMNS} data={ORDERS} mobileLayout="cards" />);
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(document.querySelector("[data-slot=data-table-card]")).toBeNull();
  });

  it("keeps selection, bulk actions and row clicks, and honours mobileColumns", () => {
    mockViewport(true);
    const onRowClick = vi.fn();
    const onAction = vi.fn();
    render(
      <DataTable
        columns={ORDER_COLUMNS}
        data={ORDERS}
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.number}
        mobileLayout="cards"
        mobileColumns={["status"]}
        onRowClick={onRowClick}
        bulkActions={[{ label: "Archive", onAction }]}
      />,
    );
    const card = document.querySelector("[data-slot=data-table-card]") as HTMLElement;
    expect(Array.from(card.querySelectorAll("dt")).map((dt) => dt.textContent)).toEqual(["Status"]);
    fireEvent.click(card);
    expect(onRowClick).toHaveBeenCalledWith(ORDERS[0]);
    fireEvent.keyDown(card, { key: "Enter" });
    expect(onRowClick).toHaveBeenCalledTimes(2);
    fireEvent.click(screen.getByRole("checkbox", { name: "Select #1002" }));
    expect(onRowClick).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("group", { name: "Bulk actions" })).toHaveTextContent("1 selected");
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows on this page" }));
    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ selectedRowIds: expect.arrayContaining(["1", "2"]) }),
    );
  });

  it("shows skeleton cards while loading and the empty state", () => {
    mockViewport(true);
    const { rerender } = render(
      <DataTable columns={ORDER_COLUMNS} data={[]} mobileLayout="cards" loading />,
    );
    expect(
      document.querySelectorAll("[data-slot=data-table-card-skeleton]").length,
    ).toBeGreaterThan(0);
    rerender(
      <DataTable
        columns={ORDER_COLUMNS}
        data={[]}
        mobileLayout="cards"
        emptyState={<p>No orders yet</p>}
      />,
    );
    expect(screen.getByText("No orders yet")).toBeInTheDocument();
  });
});

describe("DataTable cell typography", () => {
  it("body cells use text-sm, the ResourceCell title size", () => {
    render(<DataTable columns={ORDER_COLUMNS} data={ORDERS} />);
    const body = screen.getAllByRole("rowgroup")[1]!;
    expect(body).toHaveClass("text-sm");
  });
});
