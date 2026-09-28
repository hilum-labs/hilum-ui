import { describe, it, expect, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import * as React from "react";
import { DataTable, type ColumnDef, type RowSelectionState } from "../data-table";
import { FilterBar } from "../filter-bar";
import { ResourceCell, ResourceItem } from "../resource-item";
import { EmptyState } from "../empty-state";
import { PaginationBar, PaginationNext, PaginationEllipsis } from "../pagination";
import { ContextualSaveBar } from "../contextual-save-bar";
import { ConfirmDialog } from "../alert-dialog";
import { SearchInput } from "../search-input";
import { LinkProvider, type LinkComponent } from "../../lib/link-context";
import { FormatProvider } from "../../lib/format";

/* ------------------------------------------------------------------ */
/* DataTable                                                            */
/* ------------------------------------------------------------------ */

type Order = { id: string; name: string; total: number };
const orders: Order[] = Array.from({ length: 25 }, (_, i) => ({
  id: `o${i + 1}`,
  name: `Order ${i + 1}`,
  total: i * 10,
}));
const orderColumns: ColumnDef<Order>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "total", header: "Total", meta: { label: "Total" } },
];

describe("DataTable selection", () => {
  it("selects rows, exposes header indeterminate state and shows the bulk bar", () => {
    const onBulk = vi.fn();
    const onSelection = vi.fn();
    render(
      <DataTable
        columns={orderColumns}
        data={orders.slice(0, 3)}
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.name}
        onRowSelectionChange={onSelection}
        promotedBulkActions={[{ label: "Archive", onAction: onBulk }]}
      />,
    );
    const header = screen.getByRole("checkbox", { name: "Select all rows on this page" });
    expect(header).toHaveAttribute("aria-checked", "false");
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Order 1" }));
    expect(onSelection).toHaveBeenLastCalledWith({ o1: true });
    expect(header).toHaveAttribute("aria-checked", "mixed");
    const bar = screen.getByRole("group", { name: "Bulk actions" });
    expect(within(bar).getByText("1 selected")).toBeInTheDocument();
    expect(screen.getByText("Order 1").closest("tr")).toHaveAttribute("aria-selected", "true");
    fireEvent.click(within(bar).getByRole("button", { name: "Archive" }));
    expect(onBulk).toHaveBeenCalledWith(
      expect.objectContaining({ selectedRowIds: ["o1"], selectedCount: 1 }),
    );
    fireEvent.click(within(bar).getByRole("button", { name: "Clear selection" }));
    expect(screen.queryByRole("group", { name: "Bulk actions" })).not.toBeInTheDocument();
  });

  it("supports shift-click range selection", () => {
    const onSelection = vi.fn();
    render(
      <DataTable
        columns={orderColumns}
        data={orders.slice(0, 5)}
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.name}
        enableRowSelection
        onRowSelectionChange={onSelection}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Order 1" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Order 4" }), { shiftKey: true });
    expect(onSelection).toHaveBeenLastCalledWith({ o1: true, o2: true, o3: true, o4: true });
  });

  it("offers select-all-matching across pages (client mode)", () => {
    render(
      <DataTable
        columns={orderColumns}
        data={orders}
        getRowId={(row) => row.id}
        enableRowSelection
        pageSize={10}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows on this page" }));
    expect(screen.getAllByText("10 selected").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Select all 25" }));
    expect(screen.getAllByText("25 selected").length).toBeGreaterThan(0);
  });

  it("offers select-all-matching in server mode via totalCount", () => {
    const onSelectAllMatching = vi.fn();
    render(
      <DataTable
        columns={orderColumns}
        data={orders.slice(0, 10)}
        getRowId={(row) => row.id}
        enableRowSelection
        manualPagination
        rowCount={1204}
        totalCount={1204}
        onSelectAllMatching={onSelectAllMatching}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Select all rows on this page" }));
    fireEvent.click(screen.getByRole("button", { name: "Select all 1,204" }));
    expect(onSelectAllMatching).toHaveBeenCalledWith(true);
    expect(screen.getAllByText("All 1,204 selected").length).toBeGreaterThan(0);
    // Deselecting a row drops the "all matching" state.
    fireEvent.click(screen.getAllByRole("checkbox", { name: "Select row" })[0]!);
    expect(onSelectAllMatching).toHaveBeenLastCalledWith(false);
  });

  it("controlled rowSelection is respected", () => {
    const selection: RowSelectionState = { o2: true };
    render(
      <DataTable
        columns={orderColumns}
        data={orders.slice(0, 3)}
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.name}
        enableRowSelection
        rowSelection={selection}
        onRowSelectionChange={() => {}}
      />,
    );
    expect(screen.getByRole("checkbox", { name: "Select Order 2" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Order 1" }));
    // Still controlled: parent didn't update.
    expect(screen.getByRole("checkbox", { name: "Select Order 1" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });
});

describe("DataTable server mode, loading and a11y", () => {
  it("delegates sorting and pagination in manual mode", () => {
    const onSortingChange = vi.fn();
    const onPaginationChange = vi.fn();
    render(
      <DataTable
        columns={orderColumns}
        data={orders.slice(0, 10)}
        manualSorting
        manualPagination
        rowCount={25}
        sorting={[]}
        onSortingChange={onSortingChange}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        onPaginationChange={onPaginationChange}
        itemLabel="order"
      />,
    );
    expect(screen.getByText("25 orders")).toBeInTheDocument();
    expect(screen.getByText("Page 1 of 3")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(onSortingChange).toHaveBeenCalledWith([{ id: "name", desc: false }]);
    // Manual sorting: rows keep server order.
    expect(screen.getAllByRole("row")[1]).toHaveTextContent("Order 1");
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(onPaginationChange).toHaveBeenCalledWith({ pageIndex: 1, pageSize: 10 });
  });

  it("renders skeleton rows and aria-busy while loading", () => {
    const { container } = render(
      <DataTable columns={orderColumns} data={[]} loading loadingRowCount={4} />,
    );
    expect(screen.getByRole("table")).toHaveAttribute("aria-busy", "true");
    expect(container.querySelectorAll("[data-slot='data-table-skeleton-row']")).toHaveLength(4);
    expect(screen.queryByText("No results.")).not.toBeInTheDocument();
  });

  it("uses localized labels", () => {
    render(
      <FormatProvider locale="de-DE">
        <DataTable
          columns={orderColumns}
          data={[]}
          labels={{
            noResults: "Keine Ergebnisse.",
            previous: "Zurück",
            next: "Weiter",
            pageOf: (page, count) => `Seite ${page} von ${count}`,
          }}
        />
      </FormatProvider>,
    );
    expect(screen.getByText("Keine Ergebnisse.")).toBeInTheDocument();
    expect(screen.getByText("Seite 1 von 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Zurück" })).toBeInTheDocument();
  });

  it("row click ignores checkboxes and links inside the row", () => {
    const onRowClick = vi.fn();
    const columns: ColumnDef<Order>[] = [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <a href="#x">{row.original.name}</a>,
      },
    ];
    render(
      <DataTable
        columns={columns}
        data={orders.slice(0, 1)}
        enableRowSelection
        getRowLabel={(row) => row.name}
        onRowClick={onRowClick}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox", { name: "Select Order 1" }));
    fireEvent.click(screen.getByRole("link", { name: "Order 1" }));
    expect(onRowClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("link", { name: "Order 1" }).closest("td")!);
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it("toggles column visibility and exposes aria-sort / sticky header", async () => {
    render(
      <DataTable
        columns={orderColumns}
        data={orders.slice(0, 2)}
        enableColumnVisibility
        defaultColumnVisibility={{ total: false }}
        stickyHeader
      />,
    );
    expect(screen.queryByRole("columnheader", { name: "Total" })).not.toBeInTheDocument();
    const nameHeader = screen.getByRole("columnheader", { name: "Name" });
    expect(nameHeader).toHaveAttribute("aria-sort", "none");
    expect(nameHeader.className).toContain("sticky");
    fireEvent.click(screen.getByRole("button", { name: "Name" }));
    expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
  });

  it("renders resize handles and pins columns with logical offsets", () => {
    render(
      <DataTable
        columns={orderColumns}
        data={orders.slice(0, 2)}
        enableColumnResizing
        columnPinning={{ left: ["name"] }}
      />,
    );
    const handle = screen.getByRole("separator", { name: "Resize Name column" });
    const before = Number(handle.getAttribute("aria-valuenow"));
    fireEvent.keyDown(handle, { key: "ArrowRight" });
    expect(Number(handle.getAttribute("aria-valuenow"))).toBe(before + 10);
    const pinned = screen.getByRole("columnheader", { name: /Name/ });
    expect(parseFloat(pinned.style.insetInlineStart)).toBe(0);
    expect(pinned.className).toContain("sticky");
  });

  it("virtualizes large datasets", () => {
    const many = Array.from({ length: 2000 }, (_, i) => ({
      id: `r${i}`,
      name: `Row ${i}`,
      total: i,
    }));
    render(
      <DataTable
        columns={orderColumns}
        data={many}
        virtualize={{ estimateRowHeight: 40, height: 400 }}
      />,
    );
    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeLessThan(100);
    expect(screen.getByRole("table")).toHaveAttribute("aria-rowcount", "2001");
    expect(screen.getByText("2,000 results")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* FilterBar                                                            */
/* ------------------------------------------------------------------ */

describe("FilterBar pills and views", () => {
  it("renders removable pills with clear all", () => {
    const onRemove = vi.fn();
    const onClearAll = vi.fn();
    render(
      <FilterBar
        appliedFilters={[
          { key: "status", label: "Status: Active", onRemove },
          { key: "tag", label: "Tag: VIP", onRemove: () => {} },
        ]}
        onClearAll={onClearAll}
      />,
    );
    const list = screen.getByRole("list", { name: "Applied filters" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Remove filter Status: Active" }));
    expect(onRemove).toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(onClearAll).toHaveBeenCalled();
  });

  it("saved views are a tablist with roving focus", () => {
    const onViewChange = vi.fn();
    const onSaveView = vi.fn();
    render(
      <FilterBar
        views={[
          { id: "all", label: "All" },
          { id: "open", label: "Open", count: 12 },
          { id: "closed", label: "Closed" },
        ]}
        selectedView="all"
        onViewChange={onViewChange}
        onSaveView={onSaveView}
      />,
    );
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveAttribute("tabindex", "0");
    expect(tabs[1]).toHaveAttribute("tabindex", "-1");
    tabs[0]!.focus();
    fireEvent.keyDown(tabs[0]!, { key: "ArrowRight" });
    expect(document.activeElement).toBe(tabs[1]);
    fireEvent.keyDown(tabs[1]!, { key: "End" });
    expect(document.activeElement).toBe(tabs[2]);
    fireEvent.click(tabs[1]!);
    expect(onViewChange).toHaveBeenCalledWith("open");
    fireEvent.click(screen.getByRole("button", { name: "Save view" }));
    expect(onSaveView).toHaveBeenCalled();
  });

  it("does not hard-code a negative margin; mobileBleed opts in", () => {
    const { container, rerender } = render(
      <FilterBar>
        <button type="button">Status</button>
      </FilterBar>,
    );
    const row = container.querySelector("[data-slot='filter-bar-filters']")!;
    expect(row.className).not.toContain("-mx-4");
    rerender(
      <FilterBar mobileBleed>
        <button type="button">Status</button>
      </FilterBar>,
    );
    expect(container.querySelector("[data-slot='filter-bar-filters']")!.className).toContain(
      "-mx-4",
    );
  });
});

/* ------------------------------------------------------------------ */
/* Links via LinkProvider                                               */
/* ------------------------------------------------------------------ */

describe("LinkProvider integration", () => {
  const RouterLink: LinkComponent = ({ href, children, ...rest }) => (
    <a href={href} data-router-link="" {...rest}>
      {children}
    </a>
  );

  it("ResourceCell, ResourceItem and EmptyState render router links", () => {
    render(
      <LinkProvider value={RouterLink}>
        <ResourceCell title="Linen shirt" href="/products/1" />
        <ul>
          <ResourceItem title="#1043" href="/orders/1043" />
        </ul>
        <EmptyState title="No products" action={{ label: "Add product", href: "/products/new" }} />
      </LinkProvider>,
    );
    expect(screen.getByRole("link", { name: "Linen shirt" })).toHaveAttribute("data-router-link");
    expect(screen.getByRole("link", { name: /#1043/ })).toHaveAttribute("data-router-link");
    expect(screen.getByRole("link", { name: "Add product" })).toHaveAttribute("data-router-link");
  });
});

/* ------------------------------------------------------------------ */
/* Pagination                                                           */
/* ------------------------------------------------------------------ */

describe("Pagination labels", () => {
  it("PaginationBar uses labels and locale-formatted numbers", () => {
    render(
      <FormatProvider locale="de-DE">
        <PaginationBar
          page={2}
          pageSize={1000}
          total={12500}
          itemLabel="Bestellung"
          itemLabelPlural="Bestellungen"
          onPageChange={() => {}}
          labels={{
            summary: ({ start, end, total, noun }) => `${start}–${end} von ${total} ${noun}`,
            previousPage: "Vorherige Seite",
            nextPage: "Nächste Seite",
            navigation: "Seitennavigation",
          }}
        />
      </FormatProvider>,
    );
    expect(screen.getByText("1.001–2.000 von 12.500 Bestellungen")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vorherige Seite" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Seitennavigation" })).toBeInTheDocument();
  });

  it("PaginationNext / Ellipsis accept labels", () => {
    render(
      <>
        <PaginationNext href="#" label="Weiter" aria-label="Zur nächsten Seite" />
        <PaginationEllipsis label="Weitere Seiten" />
      </>,
    );
    expect(screen.getByRole("link", { name: "Zur nächsten Seite" })).toHaveTextContent("Weiter");
    expect(screen.getByText("Weitere Seiten")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* ContextualSaveBar                                                    */
/* ------------------------------------------------------------------ */

describe("ContextualSaveBar hardening", () => {
  it("keeps a persistent live region and fills it when opened", () => {
    const { rerender } = render(<ContextualSaveBar open={false} onSave={() => {}} />);
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("");
    rerender(<ContextualSaveBar open onSave={() => {}} />);
    expect(screen.getByRole("status")).toBe(status);
    expect(status).toHaveTextContent("Unsaved changes");
  });

  it("only the most recently opened bar handles Ctrl+S", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(
      <>
        <ContextualSaveBar open onSave={first} />
        <ContextualSaveBar open={false} onSave={second} />
      </>,
    );
    rerender(
      <>
        <ContextualSaveBar open onSave={first} />
        <ContextualSaveBar open onSave={second} />
      </>,
    );
    fireEvent.keyDown(window, { key: "s", ctrlKey: true });
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    rerender(
      <>
        <ContextualSaveBar open onSave={first} />
        <ContextualSaveBar open={false} onSave={second} />
      </>,
    );
    fireEvent.keyDown(window, { key: "s", metaKey: true });
    expect(first).toHaveBeenCalledTimes(1);
  });

  it("applies offsetTop through a CSS variable", () => {
    render(<ContextualSaveBar open onSave={() => {}} offsetTop={56} />);
    const region = screen.getByRole("region", { name: "Unsaved changes" });
    expect(region.style.getPropertyValue("--hilum-save-bar-top")).toBe("56px");
  });
});

/* ------------------------------------------------------------------ */
/* ConfirmDialog / SearchInput                                          */
/* ------------------------------------------------------------------ */

describe("ConfirmDialog errors", () => {
  it("shows the rejection, calls onError and resets pending", async () => {
    let reject: (reason?: unknown) => void = () => {};
    const onError = vi.fn();
    render(
      <ConfirmDialog
        open
        title="Delete?"
        description="Gone for good."
        confirmLabel="Delete"
        onConfirm={() => new Promise((_, r) => (reject = r))}
        onError={onError}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("button", { name: "Delete" })).toBeDisabled();
    await act(async () => reject(new Error("Network down")));
    expect(onError).toHaveBeenCalledWith(expect.any(Error));
    expect(screen.getByRole("alert")).toHaveTextContent("Network down");
    expect(screen.getByRole("button", { name: "Delete" })).not.toBeDisabled();
  }, 20_000);

  it("supports a custom error renderer and sync throws", async () => {
    render(
      <ConfirmDialog
        open
        title="Delete?"
        description="Gone for good."
        confirmLabel="Delete"
        onConfirm={() => {
          throw new Error("boom");
        }}
        error={(error) => `Failed: ${(error as Error).message}`}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Failed: boom"));
  }, 20_000);
});

describe("SearchInput role", () => {
  it("relies on the implicit searchbox role", () => {
    render(<SearchInput value="" onValueChange={() => {}} placeholder="Search" />);
    const input = screen.getByRole("searchbox", { name: "Search" });
    expect(input).not.toHaveAttribute("role");
    expect(input).toHaveAttribute("type", "search");
  });
});

// Keep React referenced for JSX in older transforms.
void React;
