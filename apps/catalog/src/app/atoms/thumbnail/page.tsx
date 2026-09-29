import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Package } from "lucide-react";
import { ResourceItem, Thumbnail } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><rect width="160" height="120" fill="#f5f5f5"/><circle cx="80" cy="60" r="34" fill="#c100f1"/><rect x="62" y="30" width="36" height="12" rx="6" fill="#fff5bf"/></svg>`,
  );

const CODE = {
  sizes: `import { Thumbnail } from "@hilum/ui"

<Thumbnail src={product.image} alt={product.title} size="xs" />
<Thumbnail src={product.image} alt={product.title} size="sm" />
<Thumbnail src={product.image} alt={product.title} />          {/* md, 40px */}
<Thumbnail src={product.image} alt={product.title} size="lg" />`,
  placeholder: `<Thumbnail src={null} alt="Gift card" />
<Thumbnail alt="Bundle" placeholderIcon={Package} />
<Thumbnail src={logo} alt="Logo" fit="contain" size="lg" />`,
  list: `<ResourceItem
  title="Ceramic mug"
  subtitle="12 in stock"
  media={<Thumbnail src={image} alt="" size="sm" />}
/>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ThumbnailPage() {
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
          <span className="font-semibold text-foreground">Thumbnail</span>
        </div>
        <h1 className="display mb-2 text-foreground">Thumbnail</h1>
        <p className="body max-w-lg text-muted-foreground">
          Square product or resource image with sizes, object fit, border, and a neutral placeholder
          when there is no image.
        </p>
      </div>

      <PageDocs path="/atoms/thumbnail/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Sizes" />
          <PreviewBlock
            title="xs, sm, md and lg"
            description="24, 32, 40 and 80px, matching SkeletonThumbnail so loading rows swap in without a shift."
            code={CODE.sizes}
          >
            <div className="flex items-end gap-4">
              <Thumbnail src={IMAGE} alt="Ceramic mug" size="xs" />
              <Thumbnail src={IMAGE} alt="Ceramic mug" size="sm" />
              <Thumbnail src={IMAGE} alt="Ceramic mug" />
              <Thumbnail src={IMAGE} alt="Ceramic mug" size="lg" />
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Placeholder and fit" />
          <PreviewBlock
            title="No image"
            description="A neutral placeholder icon shows when there is no image or it fails to load."
            code={CODE.placeholder}
          >
            <div className="flex items-end gap-4">
              <Thumbnail src={null} alt="Gift card" />
              <Thumbnail alt="Bundle" placeholderIcon={Package} />
              <Thumbnail src={IMAGE} alt="Logo" fit="contain" size="lg" />
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="In a list" />
          <PreviewBlock
            title="Resource row"
            description="Pass an empty alt when the row title already names the item."
            code={CODE.list}
            previewClassName="flex-col items-stretch"
          >
            <ul className="w-full max-w-md">
              <ResourceItem
                title="Ceramic mug"
                subtitle="12 in stock"
                media={<Thumbnail src={IMAGE} alt="" size="sm" />}
              />
            </ul>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/thumbnail/")({
  head: () => createCatalogPageHead("/atoms/thumbnail/"),
  component: ThumbnailPage,
});
