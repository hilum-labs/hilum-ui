import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import DetailScreenPreview from "@/components/blocks/detail-screen/detail-screen-preview";
import detailScreenPreviewSource from "@/components/blocks/detail-screen/detail-screen-preview?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function DetailScreenPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/blocks" className="hover:text-ground-700">
            Blocks
          </a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Detail Screen</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Detail Screen</h1>
        <p className="body max-w-md text-ground-400">
          A full entity detail page combining a page heading, description list, team roster, contact
          info, and activity feed.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Block</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">
            Page Heading · Description List · Activity Feed · Avatar
          </p>
        </div>
      </div>

      <PageDocs path="/blocks/detail-screen/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Detail Screen · Person profile" />
          <PreviewBlock
            title="Person detail page"
            description="Page heading, details, team members, contact, and activity"
            code={detailScreenPreviewSource}
            previewClassName="items-start"
          >
            <DetailScreenPreview />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/blocks/detail-screen/")({
  head: () => createCatalogPageHead("/blocks/detail-screen/"),
  component: DetailScreenPage,
});
