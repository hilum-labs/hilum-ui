import { render } from "@testing-library/react";
import { page } from "vitest/browser";
import { DataTable, Field, FormLayout, InputNumber, type ColumnDef } from "@hilum/ui";

afterEach(async () => {
  await page.viewport(1280, 800);
});

/* ------------------------------------------------------------------ */
/* DataTable cards by container width                                   */
/* ------------------------------------------------------------------ */

describe("DataTable mobileLayout=cards in a narrow container (real browser)", () => {
  interface Row {
    id: string;
    name: string;
    price: string;
  }
  const data: Row[] = [
    { id: "1", name: "Linen shirt", price: "S/ 120.00" },
    { id: "2", name: "Canvas tote", price: "S/ 45.00" },
  ];
  const columns: ColumnDef<Row>[] = [
    { id: "name", header: "Product", cell: ({ row }) => row.original.name },
    {
      id: "price",
      header: "Price",
      meta: { label: "Price" },
      cell: ({ row }) => row.original.price,
    },
  ];

  it("switches to cards inside a narrow column on a wide screen, and back when it widens", async () => {
    const { container, rerender } = render(
      <div className="grid grid-cols-[360px_1fr] gap-4">
        <div data-testid="column">
          <DataTable columns={columns} data={data} mobileLayout="cards" />
        </div>
        <div />
      </div>,
    );
    expect(container.querySelector("table")).toBeNull();
    expect(container.querySelectorAll("[data-slot=data-table-card]")).toHaveLength(2);
    rerender(
      <div className="grid grid-cols-[900px_1fr] gap-4">
        <div data-testid="column">
          <DataTable columns={columns} data={data} mobileLayout="cards" />
        </div>
        <div />
      </div>,
    );
    await expect.poll(() => container.querySelector("table")).not.toBeNull();
  });

  it("follows the viewport with mobileBreakpointBasis=viewport", () => {
    const { container } = render(
      <div style={{ width: 360 }}>
        <DataTable
          columns={columns}
          data={data}
          mobileLayout="cards"
          mobileBreakpointBasis="viewport"
        />
      </div>,
    );
    expect(container.querySelector("table")).not.toBeNull();
  });
});

/* ------------------------------------------------------------------ */
/* InputNumber in a two-column row on a phone                           */
/* ------------------------------------------------------------------ */

describe("InputNumber in a two-column form row (real browser)", () => {
  it("fits its column on a 360px phone", async () => {
    await page.viewport(360, 800);
    const { container } = render(
      <div className="p-4">
        <FormLayout>
          <FormLayout.Group condensed>
            <Field label="Weight">
              <InputNumber value={1.5} precision={1} unit="kg" onChange={() => {}} />
            </Field>
            <Field label="Stock">
              <InputNumber value={120} onChange={() => {}} />
            </Field>
          </FormLayout.Group>
        </FormLayout>
      </div>,
    );
    const fields = [...container.querySelectorAll<HTMLElement>("[data-slot=field]")];
    const numbers = [...container.querySelectorAll<HTMLElement>("[data-slot=input-number]")];
    expect(numbers).toHaveLength(2);
    // Side by side, each within its own column.
    expect(numbers[0]!.getBoundingClientRect().top).toBe(numbers[1]!.getBoundingClientRect().top);
    numbers.forEach((number, index) => {
      const field = fields[index]!.getBoundingClientRect();
      const rect = number.getBoundingClientRect();
      expect(rect.right).toBeLessThanOrEqual(field.right + 0.5);
      expect(Math.round(rect.width)).toBe(Math.round(field.width));
    });
    expect(numbers[1]!.getBoundingClientRect().right).toBeLessThanOrEqual(360 - 16 + 0.5);
  });
});
