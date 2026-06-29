import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Button, MediaAssetCard, MediaAssetGrid, MediaAssetGridItem } from "@hilum/ui";
import { MoreHorizontal } from "lucide-react";
import { PreviewBlock } from "@/components/catalog/preview-block";

const IMAGE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop stop-color='%23c100f1'/%3E%3Cstop offset='1' stop-color='%23fff5bf'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='400' fill='url(%23g)'/%3E%3Ccircle cx='305' cy='94' r='54' fill='white' fill-opacity='.55'/%3E%3Cpath d='M55 315 168 180l75 88 38-44 68 91z' fill='white' fill-opacity='.8'/%3E%3C/svg%3E";

const ASSETS = [
  { name: "campaign-cover.png", meta: "PNG - 1.2 MB", src: IMAGE_SRC, mediaType: "image" as const },
  { name: "lookbook.jpg", meta: "JPG - 840 KB", src: IMAGE_SRC, mediaType: "image" as const },
  { name: "brand-guidelines.pdf", meta: "PDF - 420 KB", mediaType: "file" as const },
  { name: "product-feed.csv", meta: "CSV - 18 KB", mediaType: "file" as const },
];

const CODE = `import { MediaAssetCard, MediaAssetGrid, MediaAssetGridItem } from "@hilum/ui"

<MediaAssetGrid columns={4}>
  {assets.map((asset) => (
    <MediaAssetGridItem key={asset.name}>
      <MediaAssetCard
        name={asset.name}
        src={asset.src}
        mediaType={asset.mediaType}
        meta={asset.meta}
        actions={<Button size="icon-sm" variant="ghost">...</Button>}
      />
    </MediaAssetGridItem>
  ))}
</MediaAssetGrid>`;

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function MediaAssetGridPage() {
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
          <span className="font-semibold text-ground-900">Media Asset Grid</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Media Asset Grid</h1>
        <p className="body max-w-lg text-ground-500">
          Responsive media asset container that keeps compact divided rows on mobile and switches
          to a grid on larger screens.
        </p>
      </div>

      <PageDocs path="/molecules/media-asset-grid/" />

      <section>
        <SectionHeading label="Responsive" />
        <PreviewBlock
          title="Media library"
          description="Use with MediaAssetCard for asset libraries, media pickers, and product image managers."
          code={CODE}
          previewClassName="items-stretch"
        >
          <div className="w-full">
            <MediaAssetGrid columns={4}>
              {ASSETS.map((asset) => (
                <MediaAssetGridItem key={asset.name}>
                  <MediaAssetCard
                    name={asset.name}
                    src={asset.src ?? null}
                    mediaType={asset.mediaType}
                    meta={asset.meta}
                    actions={
                      <Button size="icon-sm" variant="ghost" aria-label={`Actions for ${asset.name}`}>
                        <MoreHorizontal className="size-4" aria-hidden="true" />
                      </Button>
                    }
                  />
                </MediaAssetGridItem>
              ))}
            </MediaAssetGrid>
          </div>
        </PreviewBlock>
      </section>
    </div>
  );
}

export const Route = createFileRoute("/molecules/media-asset-grid/")({
  head: () => createCatalogPageHead("/molecules/media-asset-grid/"),
  component: MediaAssetGridPage,
});
