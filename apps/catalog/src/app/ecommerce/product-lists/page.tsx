
import { PreviewBlock } from "@/components/catalog/preview-block";
import { Badge } from "@hilum/ui";
import Simple from "@/components/ecommerce/product-lists/simple";
import simpleSource from "@/components/ecommerce/product-lists/simple?raw";
import BorderGrid from "@/components/ecommerce/product-lists/border-grid";
import borderGridSource from "@/components/ecommerce/product-lists/border-grid?raw";
import ColorSwatches from "@/components/ecommerce/product-lists/color-swatches";
import colorSwatchesSource from "@/components/ecommerce/product-lists/color-swatches?raw";
import CtaLink from "@/components/ecommerce/product-lists/cta-link";
import ctaLinkSource from "@/components/ecommerce/product-lists/cta-link?raw";
import ImageOverlay from "@/components/ecommerce/product-lists/image-overlay";
import imageOverlaySource from "@/components/ecommerce/product-lists/image-overlay?raw";
import InlinePrice from "@/components/ecommerce/product-lists/inline-price";
import inlinePriceSource from "@/components/ecommerce/product-lists/inline-price?raw";
import SupportingText from "@/components/ecommerce/product-lists/supporting-text";
import supportingTextSource from "@/components/ecommerce/product-lists/supporting-text?raw";
import TallImages from "@/components/ecommerce/product-lists/tall-images";
import tallImagesSource from "@/components/ecommerce/product-lists/tall-images?raw";
import FullDetails from "@/components/ecommerce/product-lists/full-details";
import fullDetailsSource from "@/components/ecommerce/product-lists/full-details?raw";
import InlinePriceCta from "@/components/ecommerce/product-lists/inline-price-cta";
import inlinePriceCtaSource from "@/components/ecommerce/product-lists/inline-price-cta?raw";
import TallImagesCta from "@/components/ecommerce/product-lists/tall-images-cta";
import tallImagesCtaSource from "@/components/ecommerce/product-lists/tall-images-cta?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function ProductListsPage() {
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
            <span className="font-semibold text-ground-900">Product Lists</span>
          </div>
          <h1 className="display text-ground-900">Product Lists</h1>
          <p className="body mt-3 text-ground-500">
            Product grids and lists with images, ratings, color swatches, and CTAs.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          Product · 11 variants
        </Badge>
      </div>

      <SectionHeading label="Variant 1" />
      <PreviewBlock
        title="Simple"
        description="A clean four-column product grid with name and price only."
        code={simpleSource}
        previewClassName="p-0"
      >
        <Simple />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 2" />
      <PreviewBlock
        title="With Border Grid"
        description="Banded grid cells with star ratings and review counts."
        code={borderGridSource}
        previewClassName="p-0"
      >
        <BorderGrid />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 3" />
      <PreviewBlock
        title="With Color Swatches"
        description="Swipeable cards on small screens with selectable color swatches."
        code={colorSwatchesSource}
        previewClassName="p-0"
      >
        <ColorSwatches />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 4" />
      <PreviewBlock
        title="With CTA Link"
        description="A wide product grid finished with a collection-level text link."
        code={ctaLinkSource}
        previewClassName="p-0"
      >
        <CtaLink />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 5" />
      <PreviewBlock
        title="With Image Overlay & Add Button"
        description="Image-first cards with a gradient overlay and persistent purchase action."
        code={imageOverlaySource}
        previewClassName="p-0"
      >
        <ImageOverlay />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 6" />
      <PreviewBlock
        title="With Inline Price"
        description="A minimal list layout with the product title and price aligned on one row."
        code={inlinePriceSource}
        previewClassName="p-0"
      >
        <InlinePrice />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 7" />
      <PreviewBlock
        title="With Supporting Text"
        description="Detailed product cards with a short line of context under each name."
        code={supportingTextSource}
        previewClassName="p-0"
      >
        <SupportingText />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 8" />
      <PreviewBlock
        title="With Tall Images"
        description="Portrait-oriented imagery that gives the collection a more editorial feel."
        code={tallImagesSource}
        previewClassName="p-0"
      >
        <TallImages />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 9" />
      <PreviewBlock
        title="Card With Full Details"
        description="Structured cards with options, price, and richer product metadata."
        code={fullDetailsSource}
        previewClassName="p-0"
      >
        <FullDetails />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 10" />
      <PreviewBlock
        title="With Inline Price And CTA Link"
        description="A compact list that pairs inline pricing with a text action."
        code={inlinePriceCtaSource}
        previewClassName="p-0"
      >
        <InlinePriceCta />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 11" />
      <PreviewBlock
        title="With Tall Images And CTA Link"
        description="Portrait imagery with a direct text CTA under each product."
        code={tallImagesCtaSource}
        previewClassName="p-0"
      >
        <TallImagesCta />
      </PreviewBlock>
    </div>
  );
}
