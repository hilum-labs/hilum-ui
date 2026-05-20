
import { PreviewBlock } from "@/components/catalog/preview-block";

import CTASimpleCentered from "@/components/marketing/cta-sections/cta-simple-centered";
import ctaSimpleCenteredSource from "@/components/marketing/cta-sections/cta-simple-centered?raw";

import CTASimpleStacked from "@/components/marketing/cta-sections/cta-simple-stacked";
import ctaSimpleStackedSource from "@/components/marketing/cta-sections/cta-simple-stacked?raw";

import CTASimpleJustified from "@/components/marketing/cta-sections/cta-simple-justified";
import ctaSimpleJustifiedSource from "@/components/marketing/cta-sections/cta-simple-justified?raw";

import CTASimpleJustifiedLightBrand from "@/components/marketing/cta-sections/cta-simple-justified-light-brand";
import ctaSimpleJustifiedLightBrandSource from "@/components/marketing/cta-sections/cta-simple-justified-light-brand?raw";

import CTASimpleCenterBranded from "@/components/marketing/cta-sections/cta-simple-center-branded";
import ctaSimpleCenterBrandedSource from "@/components/marketing/cta-sections/cta-simple-center-branded?raw";

import CTABrandPanelOverlapping from "@/components/marketing/cta-sections/cta-brand-panel-overlapping";
import ctaBrandPanelOverlappingSource from "@/components/marketing/cta-sections/cta-brand-panel-overlapping?raw";

import CTASplitWithImage from "@/components/marketing/cta-sections/cta-split-with-image";
import ctaSplitWithImageSource from "@/components/marketing/cta-sections/cta-split-with-image?raw";

import CTABrandPanelWithScreenshot from "@/components/marketing/cta-sections/cta-brand-panel-with-screenshot";
import ctaBrandPanelWithScreenshotSource from "@/components/marketing/cta-sections/cta-brand-panel-with-screenshot?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function CTASectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/marketing" className="hover:text-ground-700">
            Marketing
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">CTA Sections</span>
        </div>
        <h1 className="display mb-2 text-ground-900">CTA Sections</h1>
        <p className="body max-w-lg text-ground-500">
          Call-to-action sections to convert visitors into customers.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Conversion</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">8 variants</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="CTA 1" />
          <PreviewBlock
            title="Simple centered"
            description="Centered heading, subtext, and button pair"
            code={ctaSimpleCenteredSource}
            previewClassName="p-0"
          >
            <CTASimpleCentered />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="CTA 2" />
          <PreviewBlock
            title="Simple stacked"
            description="Two-line headline with stacked actions"
            code={ctaSimpleStackedSource}
            previewClassName="p-0"
          >
            <CTASimpleStacked />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="CTA 3" />
          <PreviewBlock
            title="Simple justified"
            description="Split content with stacked actions on the right"
            code={ctaSimpleJustifiedSource}
            previewClassName="p-0"
          >
            <CTASimpleJustified />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="CTA 4" />
          <PreviewBlock
            title="Justified light brand"
            description="Yellow-tinted split CTA with strong primary action"
            code={ctaSimpleJustifiedLightBrandSource}
            previewClassName="p-0"
          >
            <CTASimpleJustifiedLightBrand />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="CTA 5" />
          <PreviewBlock
            title="Centered branded"
            description="Brand orange background with white call-to-action buttons"
            code={ctaSimpleCenterBrandedSource}
            previewClassName="p-0"
          >
            <CTASimpleCenterBranded />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="CTA 6" />
          <PreviewBlock
            title="Brand panel overlapping"
            description="Dark content panel with overlapping mockup treatment"
            code={ctaBrandPanelOverlappingSource}
            previewClassName="p-0"
          >
            <CTABrandPanelOverlapping />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="CTA 7" />
          <PreviewBlock
            title="Split with image"
            description="Full-bleed visual area with content and CTA on the right"
            code={ctaSplitWithImageSource}
            previewClassName="p-0"
          >
            <CTASplitWithImage />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="CTA 8" />
          <PreviewBlock
            title="Brand panel with screenshot"
            description="Dark panel with actions and a richer app preview"
            code={ctaBrandPanelWithScreenshotSource}
            previewClassName="p-0"
          >
            <CTABrandPanelWithScreenshot />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
