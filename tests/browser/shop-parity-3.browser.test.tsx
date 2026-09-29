import { render } from "@testing-library/react";
import { page } from "vitest/browser";
import { DataTable, type ColumnDef } from "@hilum/ui";

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
