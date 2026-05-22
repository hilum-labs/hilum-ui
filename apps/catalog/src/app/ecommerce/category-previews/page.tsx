import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";


import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

import ThreeColumn from "@/components/ecommerce/category-previews/three-column";
import threeColumnSource from "@/components/ecommerce/category-previews/three-column.tsx?raw";

import ThreeColumnDescription from "@/components/ecommerce/category-previews/three-column-description";
import threeColumnDescriptionSource from "@/components/ecommerce/category-previews/three-column-description.tsx?raw";

import OverlayPanel from "@/components/ecommerce/category-previews/overlay-panel";
import overlayPanelSource from "@/components/ecommerce/category-previews/overlay-panel.tsx?raw";

import ImageBackgrounds from "@/components/ecommerce/category-previews/image-backgrounds";
import imageBackgroundsSource from "@/components/ecommerce/category-previews/image-backgrounds.tsx?raw";

import ScrollingCards from "@/components/ecommerce/category-previews/scrolling-cards";
import scrollingCardsSource from "@/components/ecommerce/category-previews/scrolling-cards.tsx?raw";

import SplitImages from "@/components/ecommerce/category-previews/split-images";
import splitImagesSource from "@/components/ecommerce/category-previews/split-images.tsx?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function CategoryPreviewsPage() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
            <a href="/" className="hover:text-ground-700">
              Design System
            </a>
            <span>/</span>
            <a href="/ecommerce" className="hover:text-ground-700">
              Ecommerce
            </a>
            <span>/</span>
            <span className="font-semibold text-ground-900">Category Previews</span>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <Badge variant="secondary">Browsing · 6 variants</Badge>
          </div>
          <h1 className="display mb-2 text-ground-900">Category Previews</h1>
          <p className="body max-w-2xl text-ground-400">
            Category landing sections with image cards, scrolling carousels, and split
            layouts.
          </p>
        </div>

        <div className="space-y-8">
          <SectionHeading label="Three Column" />
          <PreviewBlock
            title="Three Column"
            description="Three clear entry points for a category landing page."
            code={threeColumnSource}
            previewClassName="p-0"
          >
            <ThreeColumn />
          </PreviewBlock>

          <SectionHeading label="Three Column with Description" />
          <PreviewBlock
            title="Three Column with Description"
            description="Collection cards with supporting copy below the imagery."
            code={threeColumnDescriptionSource}
            previewClassName="p-0"
          >
            <ThreeColumnDescription />
          </PreviewBlock>

          <SectionHeading label="Background Image with Detail Overlay" />
          <PreviewBlock
            title="Background Image with Detail Overlay"
            description="A split landing section with image-led storytelling and a CTA."
            code={overlayPanelSource}
            previewClassName="p-0"
          >
            <OverlayPanel />
          </PreviewBlock>

          <SectionHeading label="With Image Backgrounds" />
          <PreviewBlock
            title="With Image Backgrounds"
            description="Cards that use the photography itself as the background."
            code={imageBackgroundsSource}
            previewClassName="p-0"
          >
            <ImageBackgrounds />
          </PreviewBlock>

          <SectionHeading label="Scrolling Cards" />
          <PreviewBlock
            title="Scrolling Cards"
            description="A horizontal collection rail with click-to-highlight behavior."
            code={scrollingCardsSource}
            previewClassName="p-0"
          >
            <ScrollingCards />
          </PreviewBlock>

          <SectionHeading label="Split Images" />
          <PreviewBlock
            title="Split Images"
            description="A large lead image anchored beside two smaller supporting categories."
            code={splitImagesSource}
            previewClassName="p-0"
          >
            <SplitImages />
          </PreviewBlock>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/ecommerce/category-previews/")({
  head: () => createCatalogPageHead("/ecommerce/category-previews/"),
  component: CategoryPreviewsPage,
});
