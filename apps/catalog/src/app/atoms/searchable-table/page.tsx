import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Button, SearchableTable, StatusBadge, type SearchableTableColumn } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

type Campaign = {
  id: number;
  name: string;
  owner: string;
  status: string;
  revenue: number;
};

const campaigns: Campaign[] = [
  { id: 1, name: "Spring launch", owner: "Sofia", status: "active", revenue: 48200 },
  { id: 2, name: "Partner webinar", owner: "Marcus", status: "scheduled", revenue: 17300 },
  { id: 3, name: "Enterprise nurture", owner: "Priya", status: "draft", revenue: 22100 },
  { id: 4, name: "Win-back sequence", owner: "Diego", status: "paused", revenue: 9200 },
];

const columns: SearchableTableColumn<Campaign>[] = [
  { key: "name", label: "Campaign", sortable: true },
  { key: "owner", label: "Owner", sortable: true },
  {
    key: "status",
    label: "Status",
    render: (campaign) => <StatusBadge status={campaign.status} showDot />,
  },
  {
    key: "revenue",
    label: "Revenue",
    sortable: true,
    render: (campaign) => `$${campaign.revenue.toLocaleString()}`,
  },
];

const CODE = {
  table: `import { SearchableTable, StatusBadge, type SearchableTableColumn } from "@hilum/ui"

const columns: SearchableTableColumn<Campaign>[] = [
  { key: "name", label: "Campaign", sortable: true },
  { key: "owner", label: "Owner", sortable: true },
  {
    key: "status",
    label: "Status",
    render: (campaign) => <StatusBadge status={campaign.status} showDot />,
  },
]

<SearchableTable
  data={campaigns}
  columns={columns}
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
/>`,

  filters: `<SearchableTable
  data={campaigns}
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
        { value: "active", label: "Active" },
      ],
    },
  }}
  pagination={{ currentPage: page, onPageChange: setPage, pageSize: 3 }}
/>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function SearchableTablePage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredSearchTerm, setFilteredSearchTerm] = React.useState("");
  const [status, setStatus] = React.useState("all");
  const [page, setPage] = React.useState(1);

  const filteredCampaigns =
    status === "all" ? campaigns : campaigns.filter((campaign) => campaign.status === status);

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
          <span className="font-semibold text-ground-900">Searchable Table</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Searchable Table</h1>
        <p className="body max-w-lg text-ground-500">
          Responsive table with search, filters, sorting, mobile cards, and pagination.
        </p>
      </div>

      <PageDocs path="/atoms/searchable-table/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Search" />
          <PreviewBlock
            title="Searchable rows"
            description="Client-side search scans primitive values across each row."
            code={CODE.table}
            previewClassName="flex-col items-stretch"
          >
            <SearchableTable
              data={campaigns}
              columns={columns}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              actions={() => (
                <Button size="sm" variant="outline">
                  Open
                </Button>
              )}
            />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Filters" />
          <PreviewBlock
            title="Filters and pagination"
            description="Scope rows with select filters, then page through the remaining results."
            code={CODE.filters}
            previewClassName="flex-col items-stretch"
          >
            <SearchableTable
              data={filteredCampaigns}
              columns={columns}
              searchTerm={filteredSearchTerm}
              onSearchChange={setFilteredSearchTerm}
              filters={{
                status: {
                  value: status,
                  onChange: (value) => {
                    setStatus(value);
                    setPage(1);
                  },
                  placeholder: "Status",
                  options: [
                    { value: "all", label: "All statuses" },
                    { value: "active", label: "Active" },
                    { value: "scheduled", label: "Scheduled" },
                    { value: "draft", label: "Draft" },
                  ],
                },
              }}
              pagination={{ currentPage: page, onPageChange: setPage, pageSize: 3 }}
            />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/searchable-table/")({
  head: () => createCatalogPageHead("/atoms/searchable-table/"),
  component: SearchableTablePage,
});
