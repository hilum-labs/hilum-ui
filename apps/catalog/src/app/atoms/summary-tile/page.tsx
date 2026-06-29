import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";

import { SummaryTile, SummaryTileGrid } from "@hilum/ui";

const CODE = {
  default: `import { SummaryTile, SummaryTileGrid } from "@hilum/ui";

<SummaryTileGrid>
  <SummaryTile title="Revenue" value="$48.2k" description="+12% from last month" />
  <SummaryTile title="Active users" value="2,841" description="+5% this week" />
  <SummaryTile title="Conversion" value="18.4%" description="+2.1 points" />
</SummaryTileGrid>`,
  fourColumns: `<SummaryTileGrid columns={4}>
  <SummaryTile title="Tasks" value="128" description="24 due today" />
  <SummaryTile title="Queued" value="36" description="Ready to process" />
  <SummaryTile title="Errors" value="3" description="Needs attention" />
  <SummaryTile title="Health" value="99.9%" description="Last 30 days" />
</SummaryTileGrid>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function SummaryTilePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
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
          <span className="font-semibold text-ground-900">Summary Tile</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Summary Tile</h1>
        <p className="body max-w-lg text-ground-500">
          Compact metric tiles for dashboard summaries, status snapshots, and dense product panels.
        </p>
      </div>

      <PageDocs path="/atoms/summary-tile/" />

      <div className="flex flex-col gap-6">
        <SectionHeading label="Summary Tile" />

        <PreviewBlock
          title="Default"
          description="Three summary tiles that collapse into divided rows on small screens"
          code={CODE.default}
          previewClassName="flex-col items-stretch p-4 sm:p-6"
        >
          <SummaryTileGrid>
            <SummaryTile title="Revenue" value="$48.2k" description="+12% from last month" />
            <SummaryTile title="Active users" value="2,841" description="+5% this week" />
            <SummaryTile title="Conversion" value="18.4%" description="+2.1 points" />
          </SummaryTileGrid>
        </PreviewBlock>

        <PreviewBlock
          title="Four columns"
          description="Compact grid for operational summaries with more metrics"
          code={CODE.fourColumns}
          previewClassName="flex-col items-stretch p-4 sm:p-6"
        >
          <SummaryTileGrid columns={4}>
            <SummaryTile title="Tasks" value="128" description="24 due today" />
            <SummaryTile title="Queued" value="36" description="Ready to process" />
            <SummaryTile title="Errors" value="3" description="Needs attention" />
            <SummaryTile title="Health" value="99.9%" description="Last 30 days" />
          </SummaryTileGrid>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/summary-tile/")({
  head: () => createCatalogPageHead("/atoms/summary-tile/"),
  component: SummaryTilePage,
});
