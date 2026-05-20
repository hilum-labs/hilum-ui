
import { PreviewBlock } from "@/components/catalog/preview-block";
import { Badge } from "@hilum/ui";

import QuickViewSelectorsVariant from "@/components/ecommerce/product-quickviews/quick-view-selectors-variant";
import quickViewSelectorsVariantSource from "@/components/ecommerce/product-quickviews/quick-view-selectors-variant?raw";

import QuickViewDetailsLinkVariant from "@/components/ecommerce/product-quickviews/quick-view-details-link-variant";
import quickViewDetailsLinkVariantSource from "@/components/ecommerce/product-quickviews/quick-view-details-link-variant?raw";

import QuickViewDescriptionVariant from "@/components/ecommerce/product-quickviews/quick-view-description-variant";
import quickViewDescriptionVariantSource from "@/components/ecommerce/product-quickviews/quick-view-description-variant?raw";

import QuickViewLargeSizeVariant from "@/components/ecommerce/product-quickviews/quick-view-large-size-variant";
import quickViewLargeSizeVariantSource from "@/components/ecommerce/product-quickviews/quick-view-large-size-variant?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function ProductQuickviewsPage() {
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
            <span className="font-semibold text-ground-900">Product Quickviews</span>
          </div>
          <h1 className="display text-ground-900">Product Quickviews</h1>
          <p className="body mt-3 text-ground-500">
            Modal quick-view panels with color and size selectors.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Product · 4 variants
        </Badge>
      </div>

      <SectionHeading label="Variant 1" />
      <PreviewBlock
        title="With Color And Size Selector"
        description="The base inline quick-view with swatches, size pills, and a primary purchase action."
        code={quickViewSelectorsVariantSource}
        previewClassName="p-0"
      >
        <div className="w-full bg-ground-50 p-6">
          <QuickViewSelectorsVariant />
        </div>
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 2" />
      <PreviewBlock
        title="With Details Link"
        description="Adds a secondary path to the full product page alongside the purchase action."
        code={quickViewDetailsLinkVariantSource}
        previewClassName="p-0"
      >
        <div className="w-full bg-ground-50 p-6">
          <QuickViewDetailsLinkVariant />
        </div>
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 3" />
      <PreviewBlock
        title="With Color Selector And Description"
        description="A simplified quick-view focused on color choice and product narrative."
        code={quickViewDescriptionVariantSource}
        previewClassName="p-0"
      >
        <div className="w-full bg-ground-50 p-6">
          <QuickViewDescriptionVariant />
        </div>
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 4" />
      <PreviewBlock
        title="With Large Size Selector"
        description="Prominent size buttons for a more decisive sizing interaction."
        code={quickViewLargeSizeVariantSource}
        previewClassName="p-0"
      >
        <div className="w-full bg-ground-50 p-6">
          <QuickViewLargeSizeVariant />
        </div>
      </PreviewBlock>
    </div>
  );
}
