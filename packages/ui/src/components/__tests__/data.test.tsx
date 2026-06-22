import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable, createColumnHelper } from "../data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
  TableCaption,
} from "../table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";
import { ScrollArea } from "../scroll-area";
import { AspectRatio } from "../aspect-ratio";

/* ------------------------------------------------------------------ */
/* DataTable                                                            */
/* ------------------------------------------------------------------ */

interface Person {
  name: string;
  email: string;
}

const colHelper = createColumnHelper<Person>();
const dtColumns = [
  colHelper.accessor("name", { header: "Name" }),
  colHelper.accessor("email", { header: "Email", enableSorting: false }),
];
const dtData: Person[] = [
  { name: "Alice", email: "alice@example.com" },
  { name: "Bob", email: "bob@example.com" },
];

describe("DataTable", () => {
  it("renders column headers", () => {
    render(<DataTable columns={dtColumns} data={dtData} showPagination={false} />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
  });

  it("renders data rows", () => {
    render(<DataTable columns={dtColumns} data={dtData} showPagination={false} />);
    expect(screen.getByRole("cell", { name: "Alice" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Bob" })).toBeInTheDocument();
  });

  it("sortable column header has aria-sort='none' initially", () => {
    render(<DataTable columns={dtColumns} data={dtData} showPagination={false} />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toHaveAttribute("aria-sort", "none");
  });

  it("non-sortable column has no aria-sort attribute", () => {
    render(<DataTable columns={dtColumns} data={dtData} showPagination={false} />);
    expect(screen.getByRole("columnheader", { name: "Email" })).not.toHaveAttribute("aria-sort");
  });

  it("shows no-results row when data is empty", () => {
    render(<DataTable columns={dtColumns} data={[]} showPagination={false} />);
    expect(screen.getByText("No results.")).toBeInTheDocument();
  });

  it("renders search input when searchKey is provided", () => {
    render(
      <DataTable
        columns={dtColumns}
        data={dtData}
        searchKey="name"
        searchPlaceholder="Search people..."
        showPagination={false}
      />,
    );
    expect(screen.getByPlaceholderText("Search people...")).toBeInTheDocument();
  });

  it("renders pagination buttons by default", () => {
    render(<DataTable columns={dtColumns} data={dtData} />);
    expect(screen.getByRole("button", { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Table                                                                */
/* ------------------------------------------------------------------ */

describe("Table", () => {
  function TestTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>alice@example.com</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>1 user</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    );
  }

  it("renders a table element", () => {
    render(<TestTable />);
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<TestTable />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
  });

  it("renders data cells", () => {
    render(<TestTable />);
    expect(screen.getByRole("cell", { name: "Alice" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "alice@example.com" })).toBeInTheDocument();
  });

  it("renders caption when provided", () => {
    render(
      <Table>
        <TableCaption>Users list</TableCaption>
        <TableBody>
          <TableRow>
            <TableCell>Cell</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByText("Users list")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* Pagination                                                           */
/* ------------------------------------------------------------------ */

describe("Pagination", () => {
  it("renders navigation", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByRole("navigation", { name: /pagination/i })).toBeInTheDocument();
  });

  it("renders previous and next links", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="/prev" />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="/next" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByRole("link", { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /next/i })).toBeInTheDocument();
  });

  it("marks active link with aria-current", () => {
    render(
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              3
            </PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>,
    );
    expect(screen.getByRole("link", { name: "3" })).toHaveAttribute("aria-current", "page");
  });
});

/* ------------------------------------------------------------------ */
/* ScrollArea                                                           */
/* ------------------------------------------------------------------ */

describe("ScrollArea", () => {
  it("renders children", () => {
    render(
      <ScrollArea style={{ height: 100 }}>
        <p>Scrollable content</p>
      </ScrollArea>,
    );
    expect(screen.getByText("Scrollable content")).toBeInTheDocument();
  });
});

/* ------------------------------------------------------------------ */
/* AspectRatio                                                          */
/* ------------------------------------------------------------------ */

describe("AspectRatio", () => {
  it("renders children", () => {
    render(
      <AspectRatio ratio={16 / 9}>
        <img alt="hero" src="" />
      </AspectRatio>,
    );
    expect(screen.getByAltText("hero")).toBeInTheDocument();
  });
});
