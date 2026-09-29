/**
 * Accessibility smoke tests for the third Hilum Shop parity release: the
 * combobox lists in a popover layer, MultiCombobox chips for unknown values,
 * InputGroup inside a Field, InputNumber in a form row, DataTable cards in a
 * narrow container and the TimeSeriesChart / StatCard / progress changes.
 * Same approach as ui.a11y.test.tsx: realistic, labelled usage checked with
 * axe-core.
 */
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "../axe";

import { Field } from "../../packages/ui/src/components/field";
import { Combobox } from "../../packages/ui/src/components/combobox";
import { MultiCombobox } from "../../packages/ui/src/components/multi-combobox";
import { InputGroup } from "../../packages/ui/src/components/input-group";
import { InputNumber } from "../../packages/ui/src/components/input-number";
import { FormLayout } from "../../packages/ui/src/components/form-layout";
import { DataTable } from "../../packages/ui/src/components/data-table";
import { StatCard, StatCardGrid } from "../../packages/ui/src/components/stat-card";
import { Progress } from "../../packages/ui/src/components/progress";
import { UsageBar } from "../../packages/ui/src/components/usage-bar";

async function expectAccessible(ui: React.ReactElement) {
  render(ui);
  expect(await axe(document.body)).toHaveNoAxeViolations();
}

describe("a11y: shop parity 3", () => {
  it("MultiCombobox open in its popover layer, with known and unknown chips", async () => {
    render(
      <Field label="Collections" hint="Deleted collections show as unknown" required>
        <MultiCombobox
          options={[{ value: "summer", label: "Summer" }]}
          selectedOptions={[{ value: "sale", label: "Sale" }]}
          defaultValue={["summer", "sale", "gid://Collection/9"]}
          clearable
        />
      </Field>,
    );
    fireEvent.focus(screen.getByRole("combobox", { name: /Collections/ }));
    expect(screen.getByRole("listbox", { name: /Collections/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove Unknown item" })).toBeInTheDocument();
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("Combobox open in its popover layer", async () => {
    render(
      <Field label="Vendor">
        <Combobox options={[{ value: "acme", label: "Acme", description: "12 products" }]} />
      </Field>,
    );
    fireEvent.focus(screen.getByRole("combobox", { name: "Vendor" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(await axe(document.body)).toHaveNoAxeViolations();
  });

  it("InputGroup and InputNumber inside Fields", async () => {
    await expectAccessible(
      <form aria-label="Store details">
        <FormLayout>
          <Field label="Store address" error="That address is taken" required>
            <InputGroup leadingAddon="https://" trailingAddon=".hilum.shop" name="subdomain" />
          </Field>
          <FormLayout.Group condensed>
            <Field label="Weight" hint="In kilograms">
              <InputNumber value={1.5} precision={1} unit="kg" onChange={() => {}} />
            </Field>
            <Field label="Stock">
              <InputNumber value={120} onChange={() => {}} />
            </Field>
          </FormLayout.Group>
        </FormLayout>
      </form>,
    );
  });

  it("DataTable cards with meta.label, stat cards and progress tracks", async () => {
    const spy = vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          matches: true,
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    );
    await expectAccessible(
      <div>
        <StatCardGrid columns={2}>
          <StatCard label="TOTAL MERCHANTS" value="1,284" />
          <StatCard label="Gross merchandise volume" value={"S/ 1,234,567.89"} />
        </StatCardGrid>
        <Progress value={40} aria-label="3 of 7 tasks complete" />
        <UsageBar label="Products" value={30} max={100} />
        <DataTable<{ id: string; name: string; total: string }>
          columns={[
            { id: "name", header: "Product", cell: ({ row }) => row.original.name },
            {
              id: "total",
              header: () => <span aria-hidden="true">Σ</span>,
              meta: { label: "Total" },
              cell: ({ row }) => row.original.total,
            },
          ]}
          data={[{ id: "1", name: "Linen shirt", total: "S/ 120.00" }]}
          getRowId={(row) => row.id}
          mobileLayout="cards"
        />
      </div>,
    );
    spy.mockRestore();
  });
});
