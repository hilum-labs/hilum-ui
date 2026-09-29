/**
 * Accessibility smoke tests for the second Hilum Shop parity release: Field
 * auto-wiring for every form control, and the components added for it.
 * Same approach as ui.a11y.test.tsx: realistic, labelled usage checked with
 * axe-core.
 */
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render } from "@testing-library/react";
import { axe } from "../axe";

import { Field } from "../../packages/ui/src/components/field";
import { Switch } from "../../packages/ui/src/components/switch";
import { Checkbox } from "../../packages/ui/src/components/checkbox";
import { Combobox } from "../../packages/ui/src/components/combobox";
import { DatePicker, DateRangePicker } from "../../packages/ui/src/components/date-picker";
import { DateTimePicker } from "../../packages/ui/src/components/date-time-picker";
import { TimePicker } from "../../packages/ui/src/components/time-picker";
import { ColorInput } from "../../packages/ui/src/components/color-input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../packages/ui/src/components/input-otp";
import { Tag, TagInput } from "../../packages/ui/src/components/tag-input";
import { MultiCombobox } from "../../packages/ui/src/components/multi-combobox";
import { ResourcePicker } from "../../packages/ui/src/components/resource-picker";
import { DataTable } from "../../packages/ui/src/components/data-table";
import { ResourceCell } from "../../packages/ui/src/components/resource-item";
import { Steps } from "../../packages/ui/src/components/steps";

async function expectAccessible(ui: React.ReactElement) {
  render(ui);
  expect(await axe(document.body)).toHaveNoAxeViolations();
}

describe("a11y: shop parity 2", () => {
  it("Field-wired controls with hints, errors and required", async () => {
    await expectAccessible(
      <form aria-label="Product settings">
        <Field label="Charge tax" hint="Applies to this product" required>
          <Switch />
        </Field>
        <Field label="Accept the terms" error="Accept to continue">
          <Checkbox />
        </Field>
        <Field label="Vendor" error="Pick a vendor" required>
          <Combobox options={[{ value: "acme", label: "Acme" }]} />
        </Field>
        <Field label="Publish date" hint="Store time zone" required>
          <DatePicker />
        </Field>
        <Field label="Report range">
          <DateRangePicker presets={[]} />
        </Field>
        <Field label="Opens at" hint="Local time" required>
          <TimePicker />
        </Field>
        <Field label="Starts" error="Pick a start" required>
          <DateTimePicker />
        </Field>
        <Field label="Brand colour" error="Use a hex colour" required>
          <ColorInput value="#c100f1" onChange={() => {}} />
        </Field>
        <Field label="Verification code" error="Code expired">
          <InputOTP maxLength={4}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </Field>
      </form>,
    );
  });

  it("TagInput with tags, suggestions open and an error, and Tag", async () => {
    render(
      <div>
        <Field label="Tags" hint="Press Enter to add" error="Add a tag">
          <TagInput defaultValue={["summer", "sale"]} suggestions={["gift", "new"]} />
        </Field>
        <Tag onRemove={() => {}}>VIP</Tag>
      </div>,
    );
    const input = document.querySelector("[data-slot=tag-input] input") as HTMLInputElement;
    fireEvent.focus(input);
    expect(document.querySelector("[role=listbox]")).not.toBeNull();
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("MultiCombobox open with chips, and with an empty result", async () => {
    render(
      <div>
        <Field label="Collections" error="Pick one" required>
          <MultiCombobox
            options={[
              { value: "summer", label: "Summer", description: "12 products" },
              { value: "sale", label: "Sale" },
            ]}
            defaultValue={["summer"]}
            clearable
          />
        </Field>
        <MultiCombobox aria-label="Countries" options={[]} loading />
      </div>,
    );
    for (const input of document.querySelectorAll("[data-slot=multi-combobox] input")) {
      fireEvent.focus(input);
    }
    expect(document.querySelectorAll("[role=listbox]")).toHaveLength(1);
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("ResourcePicker, multiple and single", async () => {
    const items = [
      { id: "p1", title: "Ceramic mug", subtitle: "12 in stock", thumbnail: null, meta: "$20" },
      { id: "p2", title: "Tea towel", subtitle: "4 in stock", disabled: true },
    ];
    const { unmount } = render(
      <ResourcePicker
        open
        onOpenChange={() => {}}
        title="Add products"
        items={items}
        initialSelectedIds={["p1"]}
        hasMore
        onLoadMore={() => {}}
        onSelect={() => {}}
      />,
    );
    expect(await axe(document.body)).toHaveNoAxeViolations();
    unmount();
    render(
      <ResourcePicker
        open
        onOpenChange={() => {}}
        title="Choose a collection"
        description="Products are added to the collection you choose."
        items={items}
        multiple={false}
        onSelect={() => {}}
      />,
    );
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("DataTable as stacked cards with selection", async () => {
    const spy = vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          addEventListener: () => {},
          removeEventListener: () => {},
        }) as unknown as MediaQueryList,
    );
    await expectAccessible(
      <DataTable
        columns={[
          {
            id: "order",
            header: "Order",
            cell: ({ row }) => (
              <ResourceCell title={row.original.number} subtitle={row.original.customer} />
            ),
          },
          { id: "total", header: "Total", cell: ({ row }) => row.original.total },
        ]}
        data={[
          { id: "1", number: "#1001", customer: "Ana", total: "$20.00" },
          { id: "2", number: "#1002", customer: "Luis", total: "$35.00" },
        ]}
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.number}
        enableRowSelection
        onRowClick={() => {}}
        mobileLayout="cards"
      />,
    );
    spy.mockRestore();
  });

  it("Steps circles and bullets", async () => {
    const steps = [
      { name: "Details", status: "complete" as const },
      { name: "Payments", status: "current" as const },
      { name: "Launch", status: "upcoming" as const },
    ];
    await expectAccessible(
      <div>
        <Steps steps={steps} />
        <Steps steps={steps} variant="bullets" labels={{ progress: "Setup progress" }} />
      </div>,
    );
  });
});
