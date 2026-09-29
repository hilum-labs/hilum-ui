import { afterEach, describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { DataTable, type ColumnDef } from "../data-table";

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
