import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useEffect, useState } from "react";
import {
  DataTable,
  ResourceCell,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  SearchableTable,
  createColumnHelper,
  type ColumnDef,
  type SearchableTableColumn,
} from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { EmptyState } from "@hilum/ui";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Transaction = {
  id: string;
  company: string;
  type: "Invoice" | "Credit" | "Refund";
  amount: string;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
};

const DATA: Transaction[] = [
  {
    id: "TXN-8821",
    company: "Acme Corp",
    type: "Invoice",
    amount: "$4,200",
    date: "Apr 1, 2026",
    status: "Paid",
  },
  {
    id: "TXN-8820",
    company: "Globex Inc.",
    type: "Invoice",
    amount: "$1,900",
    date: "Mar 28, 2026",
    status: "Pending",
  },
  {
    id: "TXN-8819",
    company: "Initech LLC",
    type: "Refund",
    amount: "$320",
    date: "Mar 22, 2026",
    status: "Paid",
  },
  {
    id: "TXN-8818",
    company: "Umbrella Corp",
    type: "Invoice",
    amount: "$8,750",
    date: "Mar 15, 2026",
    status: "Overdue",
  },
  {
    id: "TXN-8817",
    company: "Soylent Corp",
    type: "Invoice",
    amount: "$2,100",
    date: "Mar 10, 2026",
    status: "Paid",
  },
  {
    id: "TXN-8816",
    company: "Acme Corp",
    type: "Credit",
    amount: "$500",
    date: "Mar 5, 2026",
    status: "Paid",
  },
  {
    id: "TXN-8815",
    company: "Initech LLC",
    type: "Invoice",
    amount: "$3,400",
    date: "Feb 28, 2026",
    status: "Pending",
  },
  {
    id: "TXN-8814",
    company: "Umbrella Corp",
    type: "Invoice",
    amount: "$1,200",
    date: "Feb 20, 2026",
    status: "Overdue",
  },
  {
    id: "TXN-8813",
    company: "Globex Inc.",
    type: "Invoice",
    amount: "$5,600",
    date: "Feb 15, 2026",
    status: "Paid",
  },
  {
    id: "TXN-8812",
    company: "Soylent Corp",
    type: "Refund",
    amount: "$750",
    date: "Feb 10, 2026",
    status: "Paid",
  },
  {
    id: "TXN-8811",
    company: "Acme Corp",
    type: "Invoice",
    amount: "$2,900",
    date: "Feb 5, 2026",
    status: "Pending",
  },
  {
    id: "TXN-8810",
    company: "Initech LLC",
    type: "Credit",
    amount: "$180",
    date: "Jan 31, 2026",
    status: "Paid",
  },
];

const statusVariant: Record<Transaction["status"], "success" | "warning" | "destructive"> = {
  Paid: "success",
  Pending: "warning",
  Overdue: "destructive",
};

/* ------------------------------------------------------------------ */
/*  Column definitions                                                 */
/* ------------------------------------------------------------------ */

const helper = createColumnHelper<Transaction>();

const ALL_COLUMNS = [
  helper.accessor("id", {
    header: "ID",
    cell: (info) => (
      <span className="font-mono caption text-muted-foreground">{info.getValue()}</span>
    ),
  }),
  helper.accessor("company", {
    header: "Company",
    cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("type", {
    header: "Type",
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("amount", {
    header: "Amount",
    cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("date", {
    header: "Date",
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as Transaction["status"];
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  }),
];

const SIMPLE_COLUMNS = [
  helper.accessor("company", {
    header: "Company",
    cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("amount", {
    header: "Amount",
    cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as Transaction["status"];
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  }),
  helper.display({
    id: "actions",
    header: "Actions",
    cell: () => (
      <Button variant="ghost" size="sm">
        View
      </Button>
    ),
  }),
];

const SEARCHABLE_COLUMNS: SearchableTableColumn<Transaction>[] = [
  {
    key: "company",
    label: "Company",
    sortable: true,
    render: (transaction) => (
      <span className="font-medium text-foreground">{transaction.company}</span>
    ),
  },
  {
    key: "type",
    label: "Type",
    sortable: true,
  },
  {
    key: "amount",
    label: "Amount",
    sortAccessor: (transaction) => Number(transaction.amount.replace(/[$,]/g, "")),
    render: (transaction) => (
      <span className="font-medium tabular-nums text-foreground">{transaction.amount}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (transaction) => (
      <Badge variant={statusVariant[transaction.status]}>{transaction.status}</Badge>
    ),
  },
];

/* ------------------------------------------------------------------ */
/*  Code snippets                                                      */
/* ------------------------------------------------------------------ */

const EMPTY_TABLE_CODE = `import { DataTable, EmptyState } from "@hilum/ui"

<DataTable
  columns={columns}
  data={orders}
  itemLabel="order"                         // "1 order" · "12 orders"
  onRowClick={(order) => navigate(\`/orders/\${order.id}\`)}
  emptyState={<EmptyState title="No orders yet" action={{ label: "Create order", href: "/orders/new" }} />}
/>`;

type EmptyRow = { id: string; name: string };
const EMPTY_COLUMNS: ColumnDef<EmptyRow>[] = [{ accessorKey: "name", header: "Order" }];

const CODE = {
  withSearch: `import { DataTable, createColumnHelper } from "@hilum/ui"
import { Badge } from "@hilum/ui"

type Transaction = {
  id: string; company: string; type: string
  amount: string; date: string; status: "Paid" | "Pending" | "Overdue"
}

const helper = createColumnHelper<Transaction>()

const columns = [
  helper.accessor("id", {
    header: "ID",
    cell: (info) => <span className="font-mono caption text-muted-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("company", {
    header: "Company",
    cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("type", {
    header: "Type",
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("amount", {
    header: "Amount",
    cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("date", {
    header: "Date",
    cell: (info) => <span className="text-muted-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => <Badge variant={statusVariant[info.getValue()]}>{info.getValue()}</Badge>,
  }),
]

<DataTable
  columns={columns}
  data={data}
  searchKey="company"
  searchPlaceholder="Search company..."
  pageSize={5}
/>`,

  withoutSearch: `<DataTable
  columns={columns}
  data={data}
  pageSize={5}
/>`,

  customColumns: `const helper = createColumnHelper<Transaction>()

const columns = [
  helper.accessor("company", {
    header: "Company",
    cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("amount", {
    header: "Amount",
    cell: (info) => <span className="font-medium text-foreground">{info.getValue()}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => <Badge variant={statusVariant[info.getValue()]}>{info.getValue()}</Badge>,
  }),
  helper.display({
    id: "actions",
    header: "Actions",
    cell: () => <Button variant="ghost" size="sm">View</Button>,
  }),
]

<DataTable columns={columns} data={data} pageSize={5} />`,

  searchable: `import { SearchableTable, type SearchableTableColumn } from "@hilum/ui"

const columns: SearchableTableColumn<Transaction>[] = [
  { key: "company", label: "Company", sortable: true },
  { key: "type", label: "Type", sortable: true },
  { key: "amount", label: "Amount", sortAccessor: row => Number(row.amount.replace(/[$,]/g, "")) },
  { key: "status", label: "Status", render: row => <Badge>{row.status}</Badge> },
]



function Example() {
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("all")
  const rows = status === "all" ? data : data.filter(row => row.status === status)

  return (
    <SearchableTable
      data={rows}
      columns={columns}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      filters={{
        status: {
          value: status,
          onChange: setStatus,
          placeholder: "Status",
          options: [
            { value: "all", label: "All statuses" },
            { value: "Paid", label: "Paid" },
            { value: "Pending", label: "Pending" },
            { value: "Overdue", label: "Overdue" },
          ],
        },
      }}
    />
  )
}`,
};

/* ------------------------------------------------------------------ */
/*  Admin demos: selection, bulk actions, server mode, virtualization  */
/* ------------------------------------------------------------------ */

const ADMIN_CODE = `<DataTable
  columns={columns}
  data={orders}
  getRowId={(order) => order.id}
  getRowLabel={(order) => order.id}          // "Select TXN-8821"
  promotedBulkActions={[{ label: "Mark paid", onAction: ({ selectedRowIds }) => markPaid(selectedRowIds) }]}
  bulkActions={[{ label: "Delete", destructive: true, onAction: ({ selectedRows }) => remove(selectedRows) }]}
  enableColumnVisibility
  enableColumnResizing
  columnPinning={{ left: ["id"] }}
  stickyHeader
  maxHeight={360}
  onRowClick={(order) => navigate(\`/orders/\${order.id}\`)}
/>`;

function AdminTableDemo() {
  const [selection, setSelection] = useState<RowSelectionState>({});
  const [log, setLog] = useState("Shift-click checkboxes to select a range.");
  return (
    <div className="flex w-full flex-col gap-3">
      <DataTable
        columns={ALL_COLUMNS}
        data={DATA}
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.id}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        promotedBulkActions={[
          {
            label: "Mark paid",
            onAction: ({ selectedRowIds }) => setLog(`Mark paid: ${selectedRowIds.join(", ")}`),
          },
        ]}
        bulkActions={[
          {
            label: "Export CSV",
            onAction: ({ selectedCount }) => setLog(`Export ${selectedCount} rows`),
          },
          {
            label: "Delete",
            destructive: true,
            onAction: ({ selectedRowIds, clearSelection }) => {
              setLog(`Delete ${selectedRowIds.join(", ")}`);
              clearSelection();
            },
          },
        ]}
        enableColumnVisibility
        enableColumnResizing
        columnPinning={{ left: ["id"] }}
        stickyHeader
        maxHeight={360}
        pageSize={8}
        itemLabel="transaction"
        onRowClick={(row) => setLog(`Open ${row.id}`)}
      />
      <p className="caption text-muted-foreground" aria-live="polite">
        {log}
      </p>
    </div>
  );
}

const SERVER_CODE = `const [sorting, setSorting] = useState<SortingState>([])
const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 })
const { rows, total, isLoading } = useOrders({ sorting, pagination })

<DataTable
  columns={columns}
  data={rows}
  getRowId={(order) => order.id}
  manualSorting
  manualPagination
  rowCount={total}
  sorting={sorting}
  onSortingChange={setSorting}
  pagination={pagination}
  onPaginationChange={setPagination}
  loading={isLoading}
  enableRowSelection
  totalCount={total}                        // enables "Select all 1,204"
  onSelectAllMatching={(all) => setAllMatching(all)}
  labels={{ pageOf: (page, count) => \`Página \${page} de \${count}\` }}
/>`;

const SERVER_TOTAL = 1204;
const SERVER_ROWS: Transaction[] = Array.from({ length: SERVER_TOTAL }, (_, index) => {
  const base = DATA[index % DATA.length]!;
  return { ...base, id: `TXN-${String(10000 + index)}` };
});

function ServerTableDemo() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Transaction[]>(SERVER_ROWS.slice(0, 10));

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const sorted = [...SERVER_ROWS];
      const rule = sorting[0];
      if (rule) {
        const key = rule.id as keyof Transaction;
        sorted.sort(
          (a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0) * (rule.desc ? -1 : 1),
        );
      }
      const start = pagination.pageIndex * pagination.pageSize;
      setRows(sorted.slice(start, start + pagination.pageSize));
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [sorting, pagination]);

  return (
    <div className="w-full">
      <DataTable
        columns={ALL_COLUMNS}
        data={rows}
        getRowId={(row) => row.id}
        manualSorting
        manualPagination
        rowCount={SERVER_TOTAL}
        sorting={sorting}
        onSortingChange={setSorting}
        pagination={pagination}
        onPaginationChange={setPagination}
        loading={loading}
        enableRowSelection
        totalCount={SERVER_TOTAL}
        onSelectAllMatching={() => {}}
        itemLabel="transaction"
      />
    </div>
  );
}

const VIRTUAL_CODE = `<DataTable
  columns={columns}
  data={tenThousandRows}
  virtualize={{ estimateRowHeight: 41, height: 420 }}
  stickyHeader
/>`;

const VIRTUAL_ROWS: Transaction[] = Array.from({ length: 10000 }, (_, index) => {
  const base = DATA[index % DATA.length]!;
  return { ...base, id: `TXN-${String(index + 1).padStart(5, "0")}` };
});

function VirtualTableDemo() {
  return (
    <div className="w-full">
      <DataTable
        columns={ALL_COLUMNS}
        data={VIRTUAL_ROWS}
        virtualize={{ estimateRowHeight: 41, height: 420 }}
        stickyHeader
        itemLabel="transaction"
      />
    </div>
  );
}

const CARDS_CODE = `<DataTable
  columns={columns}             // first column: a ResourceCell
  data={orders}
  getRowId={(row) => row.id}
  enableRowSelection
  onRowClick={(row) => navigate(\`/orders/\${row.id}\`)}
  mobileLayout="cards"          // when the table is narrower than 640px
  mobileColumns={["amount", "status", "date"]}
/>

// Card labels come from a string header, or meta.label (typed) when the
// header is a component:
{ id: "amount", header: () => <AmountHeader />, meta: { label: "Amount" }, cell: … }

// mobileBreakpoint="md" (768px) or a number of px; mobileBreakpointBasis="viewport"
// compares with the window width instead of the table's own width.`;

const CARD_COLUMNS: ColumnDef<Transaction>[] = [
  {
    id: "transaction",
    header: "Transaction",
    cell: ({ row }) => <ResourceCell title={row.original.company} subtitle={row.original.id} />,
  },
  {
    id: "amount",
    header: () => <span className="block text-end">Amount</span>,
    meta: { label: "Amount" },
    cell: ({ row }) => <span className="block text-end tabular-nums">{row.original.amount}</span>,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
    ),
  },
  { id: "date", header: "Date", cell: ({ row }) => row.original.date },
];

function CardsTableDemo() {
  const [selection, setSelection] = useState<RowSelectionState>({});
  return (
    <div className="w-full">
      <DataTable
        columns={CARD_COLUMNS}
        data={DATA.slice(0, 5)}
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.company}
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        enableRowSelection
        onRowClick={() => {}}
        mobileLayout="cards"
        showPagination={false}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SearchableTableDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const rows =
    status === "all" ? DATA : DATA.filter((transaction) => transaction.status === status);

  return (
    <SearchableTable
      data={rows}
      columns={SEARCHABLE_COLUMNS}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Search transactions..."
      filters={{
        status: {
          value: status,
          onChange: setStatus,
          placeholder: "Status",
          options: [
            { value: "all", label: "All statuses" },
            { value: "Paid", label: "Paid" },
            { value: "Pending", label: "Pending" },
            { value: "Overdue", label: "Overdue" },
          ],
        },
      }}
      actions={(transaction) => (
        <Button variant="ghost" size="sm">
          View {transaction.id}
        </Button>
      )}
    />
  );
}

function DataTablePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-foreground">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Data Table</span>
        </div>
        <h1 className="display mb-2 text-foreground">Data Table</h1>
        <p className="body max-w-lg text-muted-foreground">
          A generic, sortable, filterable, and paginated data table built on @tanstack/react-table
          v8 — with row selection, bulk actions, server-side mode, column visibility, pinning,
          resizing and virtualization for admin screens.
        </p>
      </div>

      <PageDocs path="/atoms/data-table/" />

      <div className="flex flex-col gap-12">
        {/* Default with search */}
        <section>
          <SectionHeading label="With search" />
          <PreviewBlock
            title="Search and sort"
            description="Filter rows by company name, click column headers to sort"
            code={CODE.withSearch}
            previewClassName="flex-col items-stretch"
          >
            <DataTable
              columns={ALL_COLUMNS}
              data={DATA}
              searchKey="company"
              searchPlaceholder="Search company..."
              pageSize={5}
            />
          </PreviewBlock>
        </section>

        {/* Without search */}
        <section>
          <SectionHeading label="Without search" />
          <PreviewBlock
            title="Sort and paginate"
            description="All sorting and pagination controls, without the search input"
            code={CODE.withoutSearch}
            previewClassName="flex-col items-stretch"
          >
            <DataTable columns={ALL_COLUMNS} data={DATA} pageSize={5} />
          </PreviewBlock>
        </section>

        {/* Custom columns */}
        <section>
          <SectionHeading label="Custom columns" />
          <PreviewBlock
            title="Simplified view with actions"
            description="Four-column layout with a ghost action button per row"
            code={CODE.customColumns}
            previewClassName="flex-col items-stretch"
          >
            <DataTable columns={SIMPLE_COLUMNS} data={DATA} pageSize={5} />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Searchable table" />
          <PreviewBlock
            title="Controlled search, filters, and mobile rows"
            description="App-style table with controlled search/filter state and stacked mobile rows"
            code={CODE.searchable}
            previewClassName="flex-col items-stretch"
          >
            <SearchableTableDemo />
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Selection and bulk actions" />
          <PreviewBlock
            title="Admin table"
            description="Checkbox column with select-all and shift-click ranges, promoted and overflow bulk actions, column visibility, resizing, a pinned ID column and a sticky header."
            code={ADMIN_CODE}
            previewClassName="flex-col items-stretch"
          >
            <AdminTableDemo />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Server-side data" />
          <PreviewBlock
            title="Manual sorting and pagination"
            description="Controlled sorting/pagination with skeleton rows while loading and select-all-matching across 1,204 rows."
            code={SERVER_CODE}
            previewClassName="flex-col items-stretch"
          >
            <ServerTableDemo />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Phones: stacked cards" />
          <PreviewBlock
            title="Mobile layout: cards"
            description="When the table is narrower than 640px (on a phone, or in a narrow column, card or dialog) each row becomes a card: the first column (a ResourceCell) is the title and the other columns are label / value rows labelled by their string header or meta.label. Selection, bulk actions and row clicks keep working. The second preview is the same table in a 360px column. Body cells are 14px, the size of the ResourceCell title: primary title (medium) › values (regular) › secondary lines (12px, muted)."
            code={CARDS_CODE}
            previewClassName="flex-col items-stretch"
          >
            <CardsTableDemo />
            <div className="w-full max-w-[360px]">
              <CardsTableDemo />
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Virtualized" />
          <PreviewBlock
            title="10,000 rows"
            description="Only visible rows are rendered; pagination is replaced by a scroll viewport."
            code={VIRTUAL_CODE}
            previewClassName="flex-col items-stretch"
          >
            <VirtualTableDemo />
          </PreviewBlock>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Empty state and row clicks</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock
            title="Actionable empty table"
            description="Custom empty state with a CTA, pluralized counts and clickable rows."
            code={EMPTY_TABLE_CODE}
          >
            <div className="w-full">
              <DataTable
                columns={EMPTY_COLUMNS}
                data={[]}
                itemLabel="order"
                emptyState={
                  <EmptyState
                    title="No orders yet"
                    action={{ label: "Create order", href: "#" }}
                    size="sm"
                  />
                }
              />
            </div>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/data-table/")({
  head: () => createCatalogPageHead("/atoms/data-table/"),
  component: DataTablePage,
});
