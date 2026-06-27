import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { MoreHorizontal } from "lucide-react";
import { Button, MediaAssetCard } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const IMAGE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%23c100f1'/%3E%3Cstop offset='1' stop-color='%23fff5bf'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23g)'/%3E%3Ccircle cx='305' cy='94' r='54' fill='white' fill-opacity='.55'/%3E%3Cpath d='M55 315 168 180l75 88 38-44 68 91z' fill='white' fill-opacity='.8'/%3E%3C/svg%3E";

const CODE = {
  grid: `import { MediaAssetCard } from "@hilum/ui"

<MediaAssetCard
  name="campaign-cover.png"
  src={coverImage}
  meta="PNG - 1.2 MB"
  details="Used by the summer campaign landing page."
  selected
/>`,

  list: `<MediaAssetCard
  orientation="list"
  mediaType="file"
  name="brand-guidelines.pdf"
  meta="PDF - 842 KB"
  actions={<Button size="icon" variant="ghost">...</Button>}
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

function MediaAssetCardPage() {
  const [selected, setSelected] = React.useState(true);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Media Asset Card</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Media Asset Card</h1>
        <p className="body max-w-lg text-ground-500">
          Selectable media or file card with grid, list, and responsive orientations.
        </p>
      </div>

      <PageDocs path="/molecules/media-asset-card/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Grid" />
          <PreviewBlock
            title="Image asset"
            description="Use grid orientation for libraries, pickers, and asset browsing."
            code={CODE.grid}
          >
            <div className="w-72">
              <MediaAssetCard
                orientation="grid"
                name="campaign-cover.png"
                src={IMAGE_SRC}
                meta="PNG - 1.2 MB"
                details="Used by the summer campaign landing page."
                selected={selected}
                onSelect={() => setSelected((current) => !current)}
              />
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="List" />
          <PreviewBlock
            title="File row"
            description="Use list orientation inside compact media panels and upload summaries."
            code={CODE.list}
            previewClassName="flex-col items-stretch"
          >
            <div className="w-full max-w-xl">
              <MediaAssetCard
                orientation="list"
                mediaType="file"
                name="brand-guidelines.pdf"
                meta="PDF - 842 KB"
                details="Shared with all storefront editors."
                actions={
                  <Button size="icon" variant="ghost" aria-label="Asset actions">
                    <MoreHorizontal className="size-4" aria-hidden="true" />
                  </Button>
                }
              />
            </div>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/media-asset-card/")({
  head: () => createCatalogPageHead("/molecules/media-asset-card/"),
  component: MediaAssetCardPage,
});
