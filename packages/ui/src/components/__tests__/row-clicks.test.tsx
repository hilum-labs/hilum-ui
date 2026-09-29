import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTable, type ColumnDef } from "../data-table";
import { ConfirmDialog } from "../alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "../dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { ResourceItem } from "../resource-item";
import { StackedList, StackedListItem } from "../stacked-list";

/* React bubbles synthetic events through portals, so a click inside a Dialog,
 * ConfirmDialog or menu opened from a clickable row used to reach the row's
 * onClick too (e.g. confirming "Delete" also opened the product). */

interface Product {
  id: string;
  name: string;
}

const PRODUCTS: Product[] = [{ id: "1", name: "Linen shirt" }];

/** A row's "…" menu → Delete → ConfirmDialog, all portalled out of the row. */
function RowActions({ product, onDelete }: { product: Product; onDelete: () => void }) {
  const [confirming, setConfirming] = React.useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" aria-label={`Actions for ${product.name}`}>
            …
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setConfirming(true)}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Delete ${product.name}?`}
        description="This can't be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={onDelete}
      />
    </>
  );
}

function columns(onDelete: () => void): ColumnDef<Product>[] {
  return [
    { id: "name", header: "Product", cell: ({ row }) => row.original.name },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => <RowActions product={row.original} onDelete={onDelete} />,
    },
  ];
}

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

describe("DataTable onRowClick ignores clicks inside portals", () => {
  afterEach(() => vi.restoreAllMocks());

  it.each([
    ["table rows", undefined],
    ["mobile cards", "cards"],
  ] as const)("%s: menu item and ConfirmDialog button", async (_, mobileLayout) => {
    if (mobileLayout) mockViewport(true);
    const user = userEvent.setup();
    const onRowClick = vi.fn();
    const onDelete = vi.fn();
    render(
      <DataTable
        columns={columns(onDelete)}
        data={PRODUCTS}
        onRowClick={onRowClick}
        {...(mobileLayout && { mobileLayout, mobileBreakpointBasis: "viewport" as const })}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Actions for Linen shirt" }));
    await user.click(await screen.findByRole("menuitem", { name: "Delete" }));
    const dialog = await screen.findByRole("alertdialog");
    // Non-interactive content in the dialog doesn't open the row either.
    await user.click(screen.getByText("This can't be undone."));
    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(dialog).not.toBeInTheDocument();
    expect(onRowClick).not.toHaveBeenCalled();

    // The row itself still opens.
    await user.click(screen.getByText("Linen shirt"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(PRODUCTS[0]);
  });

  it("Enter and Space on a focused row still call onRowClick", () => {
    const onRowClick = vi.fn();
    render(<DataTable columns={columns(vi.fn())} data={PRODUCTS} onRowClick={onRowClick} />);
    const row = screen.getByText("Linen shirt").closest("tr")!;
    row.focus();
    expect(row).toHaveFocus();
    fireEvent.keyDown(row, { key: "Enter" });
    fireEvent.keyDown(row, { key: " " });
    expect(onRowClick).toHaveBeenCalledTimes(2);
    // Keys on the row's own controls don't.
    fireEvent.keyDown(screen.getByRole("button", { name: "Actions for Linen shirt" }), {
      key: "Enter",
    });
    expect(onRowClick).toHaveBeenCalledTimes(2);
  });

  it("still ignores in-row buttons and data-row-click-ignore", () => {
    const onRowClick = vi.fn();
    render(
      <DataTable
        columns={[
          { id: "name", header: "Product", cell: ({ row }) => row.original.name },
          {
            id: "note",
            header: "Note",
            cell: () => <span data-row-click-ignore>Copy SKU</span>,
          },
        ]}
        data={PRODUCTS}
        onRowClick={onRowClick}
      />,
    );
    fireEvent.click(screen.getByText("Copy SKU"));
    expect(onRowClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Linen shirt"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });

  it("a table inside an ignored ancestor still has clickable rows", () => {
    const onRowClick = vi.fn();
    render(
      <div data-row-click-ignore>
        <DataTable columns={columns(vi.fn())} data={PRODUCTS} onRowClick={onRowClick} />
      </div>,
    );
    fireEvent.click(screen.getByText("Linen shirt"));
    expect(onRowClick).toHaveBeenCalledTimes(1);
  });
});

/** A controlled Dialog rendered inside the item (portalled to body). */
function ItemWithDialog() {
  return (
    <Dialog open>
      <DialogContent>
        <DialogTitle>Archive order?</DialogTitle>
        <DialogDescription>Archived orders stay searchable.</DialogDescription>
        <button type="button">Archive</button>
      </DialogContent>
    </Dialog>
  );
}

describe("clickable list rows ignore clicks inside portals", () => {
  it("StackedListItem", () => {
    const onClick = vi.fn();
    render(
      <StackedList>
        <StackedListItem onClick={onClick}>
          Order #1001
          <ItemWithDialog />
        </StackedListItem>
      </StackedList>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    fireEvent.click(screen.getByText("Archived orders stay searchable."));
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Order #1001"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("ResourceItem", () => {
    const onClick = vi.fn();
    render(
      <StackedList>
        <ResourceItem
          title="Order #1001"
          trailing={
            <>
              S/ 120.00
              <ItemWithDialog />
            </>
          }
          onClick={onClick}
        />
      </StackedList>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Archive" }));
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Order #1001"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
