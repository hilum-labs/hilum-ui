import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Button, DateRangePicker, FilterBar, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, pluralize, type DateRange } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = `import { FilterBar, Select, DateRangePicker, Button } from "@hilum/ui"

<FilterBar
  search={{ value: query, onValueChange: setQuery, placeholder: "Search merchants" }}
  active={Boolean(query || status || range)}
  onClear={() => { setQuery(""); setStatus(""); setRange(undefined) }}
  actions={<Button variant="outline" size="sm">Export</Button>}
  summary={pluralize(total, "merchant")}
>
  <Select value={status} onValueChange={setStatus}>…</Select>
  <DateRangePicker value={range} onChange={setRange} fullWidth={false} />
</FilterBar>`;

function Demo() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();
  return (
    <div className="w-full">
      <FilterBar
        search={{ value: query, onValueChange: setQuery, placeholder: "Search merchants" }}
        active={Boolean(query || status || range)}
        onClear={() => {
          setQuery("");
          setStatus("");
          setRange(undefined);
        }}
        actions={
          <Button variant="outline" size="sm">
            Export
          </Button>
        }
        summary={pluralize(24, "merchant")}
      >
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <DateRangePicker value={range} onChange={setRange} fullWidth={false} />
      </FilterBar>
    </div>
  );
}

function FilterBarPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-foreground">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Filter Bar</span>
        </div>
        <h1 className="display mb-2 text-foreground">Filter Bar</h1>
        <p className="body max-w-lg text-muted-foreground">
          List toolbar with search, filters, a clear action and trailing actions. Stacks on mobile with a horizontally scrolling filter row.
        </p>
      </div>

      <PageDocs path="/molecules/filter-bar/" />

      <div className="flex flex-col gap-8">
        <section>
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Filter Bar</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock title="Merchants toolbar" description="Clear appears only while a filter or search is active." code={CODE}>
            <Demo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/filter-bar/")({
  head: () => createCatalogPageHead("/molecules/filter-bar/"),
  component: FilterBarPage,
});
