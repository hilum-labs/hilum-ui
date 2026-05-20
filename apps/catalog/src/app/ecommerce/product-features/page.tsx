
import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import AlternatingSections from "@/components/ecommerce/product-features/alternating-sections";
import alternatingSectionsSource from "@/components/ecommerce/product-features/alternating-sections?raw";
import FadingImage from "@/components/ecommerce/product-features/fading-image";
import fadingImageSource from "@/components/ecommerce/product-features/fading-image?raw";
import HeaderImagesDescriptions from "@/components/ecommerce/product-features/header-images-descriptions";
import headerImagesDescriptionsSource from "@/components/ecommerce/product-features/header-images-descriptions?raw";
import ImageGrid from "@/components/ecommerce/product-features/image-grid";
import imageGridSource from "@/components/ecommerce/product-features/image-grid?raw";
import SplitImage from "@/components/ecommerce/product-features/split-image";
import splitImageSource from "@/components/ecommerce/product-features/split-image?raw";
import SquareImages from "@/components/ecommerce/product-features/square-images";
import squareImagesSource from "@/components/ecommerce/product-features/square-images?raw";
import Tabs from "@/components/ecommerce/product-features/tabs";
import tabsSource from "@/components/ecommerce/product-features/tabs?raw";
import TieredImages from "@/components/ecommerce/product-features/tiered-images";
import tieredImagesSource from "@/components/ecommerce/product-features/tiered-images?raw";
import WideImages from "@/components/ecommerce/product-features/wide-images";
import wideImagesSource from "@/components/ecommerce/product-features/wide-images?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function ProductFeaturesPage() {
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
            <span className="font-semibold text-ground-900">Product Features</span>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <Badge variant="secondary">Product · 9 variants</Badge>
          </div>
          <h1 className="display mb-2 text-ground-900">Product Features</h1>
          <p className="body max-w-2xl text-ground-400">
            Showcase product specs and details with images, tabs, and alternating
            layouts.
          </p>
        </div>

        <div className="space-y-8">
          <SectionHeading label="Alternating Sections" />
          <PreviewBlock
            title="Alternating Sections"
            description="Three alternating rows pairing product photography with specs."
            code={alternatingSectionsSource}
            previewClassName="p-0"
          >
            <AlternatingSections />
          </PreviewBlock>

          <SectionHeading label="Fading Image" />
          <PreviewBlock
            title="Fading Image"
            description="A full-width image with a white fade into concise specs."
            code={fadingImageSource}
            previewClassName="p-0"
          >
            <FadingImage />
          </PreviewBlock>

          <SectionHeading label="Header, Images and Descriptions" />
          <PreviewBlock
            title="Header, Images and Descriptions"
            description="A gallery-led layout with editorial copy beneath the imagery."
            code={headerImagesDescriptionsSource}
            previewClassName="p-0"
          >
            <HeaderImagesDescriptions />
          </PreviewBlock>

          <SectionHeading label="Image Grid" />
          <PreviewBlock
            title="Image Grid"
            description="Specs on the left, a four-image matrix on the right."
            code={imageGridSource}
            previewClassName="p-0"
          >
            <ImageGrid />
          </PreviewBlock>

          <SectionHeading label="Split Image" />
          <PreviewBlock
            title="Split Image"
            description="A narrative feature list paired with stacked photography."
            code={splitImageSource}
            previewClassName="p-0"
          >
            <SplitImage />
          </PreviewBlock>

          <SectionHeading label="Square Images" />
          <PreviewBlock
            title="Square Images"
            description="A balanced spec column beside four equal image tiles."
            code={squareImagesSource}
            previewClassName="p-0"
          >
            <SquareImages />
          </PreviewBlock>

          <SectionHeading label="Tabs" />
          <PreviewBlock
            title="Tabs"
            description="A simple `useState` tab switcher for feature storytelling."
            code={tabsSource}
            previewClassName="p-0"
          >
            <Tabs />
          </PreviewBlock>

          <SectionHeading label="Tiered Images" />
          <PreviewBlock
            title="Tiered Images"
            description="A feature list with one dominant image and two supporting images."
            code={tieredImagesSource}
            previewClassName="p-0"
          >
            <TieredImages />
          </PreviewBlock>

          <SectionHeading label="Wide Images" />
          <PreviewBlock
            title="Wide Images"
            description="Alternating full-width photography with text overlays and summaries."
            code={wideImagesSource}
            previewClassName="p-0"
          >
            <WideImages />
          </PreviewBlock>
        </div>
      </div>
    </div>
  );
}
