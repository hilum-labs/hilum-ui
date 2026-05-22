import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import { Badge } from "@hilum/ui";

import SplitWithImageVariant from "@/components/ecommerce/product-overviews/split-with-image-variant";
import splitWithImageVariantSource from "@/components/ecommerce/product-overviews/split-with-image-variant?raw";

import GalleryVariant from "@/components/ecommerce/product-overviews/gallery-variant";
import galleryVariantSource from "@/components/ecommerce/product-overviews/gallery-variant?raw";

import ImageGridVariant from "@/components/ecommerce/product-overviews/image-grid-variant";
import imageGridVariantSource from "@/components/ecommerce/product-overviews/image-grid-variant?raw";

import TabsVariant from "@/components/ecommerce/product-overviews/tabs-variant";
import tabsVariantSource from "@/components/ecommerce/product-overviews/tabs-variant?raw";

import TieredImagesVariant from "@/components/ecommerce/product-overviews/tiered-images-variant";
import tieredImagesVariantSource from "@/components/ecommerce/product-overviews/tiered-images-variant?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function ProductOverviewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10 flex flex-col gap-5 border-b border-ground-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
            <a href="#" className="hover:text-ground-700">
              Design System
            </a>
            <span>/</span>
            <a href="#" className="hover:text-ground-700">
              Ecommerce
            </a>
            <span>/</span>
            <span className="font-semibold text-ground-900">Product Overviews</span>
          </div>
          <h1 className="display text-ground-900">Product Overviews</h1>
          <p className="body mt-3 text-ground-500">
            Detailed product pages with image galleries, color/size selectors, and tabbed details.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Product · 5 variants
        </Badge>
      </div>

      <PageDocs path="/ecommerce/product-overviews/" />

      <SectionHeading label="Variant 1" />
      <PreviewBlock
        title="Split With Image"
        description="A balanced two-column overview with selectors, description, and a large product image."
        code={splitWithImageVariantSource}
        previewClassName="p-0"
      >
        <SplitWithImageVariant />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 2" />
      <PreviewBlock
        title="With Image Gallery"
        description="Thumbnail-driven gallery with an expandable description panel."
        code={galleryVariantSource}
        previewClassName="p-0"
      >
        <GalleryVariant />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 3" />
      <PreviewBlock
        title="With Image Grid"
        description="A four-image grid above product selectors and specifications."
        code={imageGridVariantSource}
        previewClassName="p-0"
      >
        <ImageGridVariant />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 4" />
      <PreviewBlock
        title="With Tabs"
        description="Tabbed product details that switch between narrative, reviews, and shipping information."
        code={tabsVariantSource}
        previewClassName="p-0"
      >
        <TabsVariant />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 5" />
      <PreviewBlock
        title="With Tiered Images"
        description="A tiered media arrangement that pairs large hero photography with compact secondary shots."
        code={tieredImagesVariantSource}
        previewClassName="p-0"
      >
        <TieredImagesVariant />
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/ecommerce/product-overviews/")({
  head: () => createCatalogPageHead("/ecommerce/product-overviews/"),
  component: ProductOverviewsPage,
});
