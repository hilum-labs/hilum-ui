import { PreviewBlock } from "@/components/catalog/preview-block";

import FeatureSimpleThreeColumn from "@/components/marketing/feature-sections/feature-simple-three-column";
import featureSimpleThreeColumnSource from "@/components/marketing/feature-sections/feature-simple-three-column?raw";

import FeatureCentered2x2 from "@/components/marketing/feature-sections/feature-centered-2x2";
import featureCentered2x2Source from "@/components/marketing/feature-sections/feature-centered-2x2?raw";

import FeatureGridOffsetIcons from "@/components/marketing/feature-sections/feature-grid-offset-icons";
import featureGridOffsetIconsSource from "@/components/marketing/feature-sections/feature-grid-offset-icons?raw";

import FeatureGridOnBrand from "@/components/marketing/feature-sections/feature-grid-on-brand";
import featureGridOnBrandSource from "@/components/marketing/feature-sections/feature-grid-on-brand?raw";

import FeatureWithFeatureList from "@/components/marketing/feature-sections/feature-with-feature-list";
import featureWithFeatureListSource from "@/components/marketing/feature-sections/feature-with-feature-list?raw";

import FeatureAlternatingWithTestimonial from "@/components/marketing/feature-sections/feature-alternating-with-testimonial";
import featureAlternatingWithTestimonialSource from "@/components/marketing/feature-sections/feature-alternating-with-testimonial?raw";

import FeatureSideBySideImages from "@/components/marketing/feature-sections/feature-side-by-side-images";
import featureSideBySideImagesSource from "@/components/marketing/feature-sections/feature-side-by-side-images?raw";

import FeatureOffset2x2 from "@/components/marketing/feature-sections/feature-offset-2x2";
import featureOffset2x2Source from "@/components/marketing/feature-sections/feature-offset-2x2?raw";

import FeatureLargeScreenshot from "@/components/marketing/feature-sections/feature-large-screenshot";
import featureLargeScreenshotSource from "@/components/marketing/feature-sections/feature-large-screenshot?raw";

import FeatureGridList from "@/components/marketing/feature-sections/feature-grid-list";
import featureGridListSource from "@/components/marketing/feature-sections/feature-grid-list?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function FeatureSectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/marketing" className="hover:text-ground-700">Marketing</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Feature Sections</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Feature Sections</h1>
        <p className="body max-w-2xl text-ground-500">
          Ten marketing-ready feature section patterns spanning icon grids, split layouts, screenshots, and proof-led product storytelling.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Feature Sections · Icon Grids" />
        <PreviewBlock
          title="Simple three column"
          description="Centered intro with a 3-column grid of six feature cards."
          code={featureSimpleThreeColumnSource}
          previewClassName="p-0"
        >
          <FeatureSimpleThreeColumn />
        </PreviewBlock>
        <PreviewBlock
          title="Centered 2x2 grid"
          description="Four compact feature cards with circular icons and a centered heading."
          code={featureCentered2x2Source}
          previewClassName="p-0"
        >
          <FeatureCentered2x2 />
        </PreviewBlock>
        <PreviewBlock
          title="Grid with offset icons"
          description="Left-aligned section with icon badges overlapping each feature card."
          code={featureGridOffsetIconsSource}
          previewClassName="p-0"
        >
          <FeatureGridOffsetIcons />
        </PreviewBlock>
        <PreviewBlock
          title="4x2 grid on brand"
          description="Dark brand panel with eight bordered feature cards in a dense grid."
          code={featureGridOnBrandSource}
          previewClassName="p-0"
        >
          <FeatureGridOnBrand />
        </PreviewBlock>

        <SectionHeading label="Feature Sections · Split Layouts" />
        <PreviewBlock
          title="With feature list"
          description="Screenshot-style placeholder paired with a checklist and CTA."
          code={featureWithFeatureListSource}
          previewClassName="p-0"
        >
          <FeatureWithFeatureList />
        </PreviewBlock>
        <PreviewBlock
          title="Alternating with testimonial"
          description="Two alternating media/text rows followed by a customer quote strip."
          code={featureAlternatingWithTestimonialSource}
          previewClassName="p-0"
        >
          <FeatureAlternatingWithTestimonial />
        </PreviewBlock>
        <PreviewBlock
          title="Alternative side-by-side with images"
          description="Two parallel feature stories with large media blocks on top."
          code={featureSideBySideImagesSource}
          previewClassName="p-0"
        >
          <FeatureSideBySideImages />
        </PreviewBlock>
        <PreviewBlock
          title="Offset 2x2 grid"
          description="Asymmetric layout with a large left intro and a right-side 2x2 feature grid."
          code={featureOffset2x2Source}
          previewClassName="p-0"
        >
          <FeatureOffset2x2 />
        </PreviewBlock>

        <SectionHeading label="Feature Sections · Product Storytelling" />
        <PreviewBlock
          title="With large screenshot"
          description="Centered heading, large mock dashboard, and supporting three-column feature list."
          code={featureLargeScreenshotSource}
          previewClassName="p-0"
        >
          <FeatureLargeScreenshot />
        </PreviewBlock>
        <PreviewBlock
          title="With feature grid list"
          description="Product narrative panel with a prominent stat beside a 3x2 icon grid."
          code={featureGridListSource}
          previewClassName="p-0"
        >
          <FeatureGridList />
        </PreviewBlock>
      </div>
    </div>
  );
}
