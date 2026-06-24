import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { useState } from "react";
import {
  DataTable,
  SearchableTable,
  createColumnHelper,
  type ColumnDef,
  type SearchableTableColumn,
} from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

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

const ALL_COLUMNS: ColumnDef<Transaction, any>[] = [
  helper.accessor("id", {
    header: "ID",
    cell: (info) => <span className="font-mono caption text-ground-400">{info.getValue()}</span>,
  }),
  helper.accessor("company", {
    header: "Company",
    cell: (info) => <span className="font-medium text-ground-900">{info.getValue()}</span>,
  }),
  helper.accessor("type", {
    header: "Type",
    cell: (info) => <span className="text-ground-500">{info.getValue()}</span>,
  }),
  helper.accessor("amount", {
    header: "Amount",
    cell: (info) => <span className="font-medium text-ground-900">{info.getValue()}</span>,
  }),
  helper.accessor("date", {
    header: "Date",
    cell: (info) => <span className="text-ground-500">{info.getValue()}</span>,
  }),
  helper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as Transaction["status"];
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  }),
];

const SIMPLE_COLUMNS: ColumnDef<Transaction, any>[] = [
  helper.accessor("company", {
    header: "Company",
    cell: (info) => <span className="font-medium text-ground-900">{info.getValue()}</span>,
  }),
  helper.accessor("amount", {
    header: "Amount",
    cell: (info) => <span className="font-medium text-ground-900">{info.getValue()}</span>,
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
      <span className="font-medium text-ground-900">{transaction.company}</span>
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
      <span className="font-medium tabular-nums text-ground-900">{transaction.amount}</span>
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

const CODE = {
  withSearch: `import { DataTable, createColumnHelper, type ColumnDef } from "@hilum/ui"
import { Badge } from "@hilum/ui"

type Transaction = {
  id: string; company: string; type: string
  amount: string; date: string; status: "Paid" | "Pending" | "Overdue"
}

const helper = createColumnHelper<Transaction>()

const columns: ColumnDef<Transaction>[] = [
  helper.accessor("id", {
    header: "ID",
    cell: (info) => <span className="font-mono caption text-ground-400">{info.getValue()}</span>,
  }),
  helper.accessor("company", {
    header: "Company",
    cell: (info) => <span className="font-medium text-ground-900">{info.getValue()}</span>,
  }),
  helper.accessor("type", {
    header: "Type",
    cell: (info) => <span className="text-ground-500">{info.getValue()}</span>,
  }),
  helper.accessor("amount", {
    header: "Amount",
    cell: (info) => <span className="font-medium text-ground-900">{info.getValue()}</span>,
  }),
  helper.accessor("date", {
    header: "Date",
    cell: (info) => <span className="text-ground-500">{info.getValue()}</span>,
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

const columns: ColumnDef<Transaction>[] = [
  helper.accessor("company", {
    header: "Company",
    cell: (info) => <span className="font-medium text-ground-900">{info.getValue()}</span>,
  }),
  helper.accessor("amount", {
    header: "Amount",
    cell: (info) => <span className="font-medium text-ground-900">{info.getValue()}</span>,
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
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function SearchableTableDemo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const rows = status === "all" ? DATA : DATA.filter((transaction) => transaction.status === status);

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
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Data Table</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Data Table</h1>
        <p className="body max-w-lg text-ground-500">
          A generic, sortable, filterable, and paginated data table built on @tanstack/react-table
          v8. Define typed columns once and pass any data.
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
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/data-table/")({
  head: () => createCatalogPageHead("/atoms/data-table/"),
  component: DataTablePage,
});
