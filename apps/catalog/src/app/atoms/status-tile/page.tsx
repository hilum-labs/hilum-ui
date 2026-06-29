import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";

import { MonitorSmartphone } from "@hilum/ui/icons";
import { StatusTile, StatusTileGrid } from "@hilum/ui";

const CODE = {
  serviceHealth: `import { StatusTile, StatusTileGrid } from "@hilum/ui";
import { MonitorSmartphone } from "@hilum/ui/icons";

<StatusTileGrid>
  <StatusTile
    title="Catalog"
    status="healthy"
    icon={MonitorSmartphone}
    description="operational"
    meta={<p className="caption truncate">https://catalog.internal/health</p>}
  />
  <StatusTile title="Checkout" status="degraded" description="carrier rates delayed" />
  <StatusTile title="Renderer" status="critical" description="origin checks failing" />
</StatusTileGrid>`,
  fourColumns: `<StatusTileGrid columns={4}>
  <StatusTile title="Catalog" status="healthy" description="operational" />
  <StatusTile title="Commerce" status="healthy" description="operational" />
  <StatusTile title="Identity" status="healthy" description="operational" />
  <StatusTile title="Renderer" status="degraded" description="slower than expected" />
</StatusTileGrid>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function StatusTilePage() {
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
          <span className="font-semibold text-ground-900">Status Tile</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Status Tile</h1>
        <p className="body max-w-lg text-ground-500">
          Compact status tiles for service health, operational states, and dense responsive panels.
        </p>
      </div>

      <PageDocs path="/atoms/status-tile/" />

      <div className="flex flex-col gap-6">
        <SectionHeading label="Status Tile" />

        <PreviewBlock
          title="Service health"
          description="Service status tiles collapse into divided rows on small screens"
          code={CODE.serviceHealth}
          previewClassName="flex-col items-stretch p-4 sm:p-6"
        >
          <StatusTileGrid>
            <StatusTile
              title="Catalog"
              status="healthy"
              icon={MonitorSmartphone}
              description="operational"
              meta={<p className="caption truncate">https://catalog.internal/health</p>}
            />
            <StatusTile title="Checkout" status="degraded" description="carrier rates delayed" />
            <StatusTile title="Renderer" status="critical" description="origin checks failing" />
          </StatusTileGrid>
        </PreviewBlock>

        <PreviewBlock
          title="Four columns"
          description="Compact status grids for platform monitoring and readiness views"
          code={CODE.fourColumns}
          previewClassName="flex-col items-stretch p-4 sm:p-6"
        >
          <StatusTileGrid columns={4}>
            <StatusTile title="Catalog" status="healthy" description="operational" />
            <StatusTile title="Commerce" status="healthy" description="operational" />
            <StatusTile title="Identity" status="healthy" description="operational" />
            <StatusTile title="Renderer" status="degraded" description="slower than expected" />
          </StatusTileGrid>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/status-tile/")({
  head: () => createCatalogPageHead("/atoms/status-tile/"),
  component: StatusTilePage,
});
