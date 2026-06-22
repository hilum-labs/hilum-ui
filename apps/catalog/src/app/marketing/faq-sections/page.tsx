import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

import TwoColumns from "@/components/marketing/faq-sections/two-columns";
import twoColumnsSource from "@/components/marketing/faq-sections/two-columns?raw";

import ThreeColumns from "@/components/marketing/faq-sections/three-columns";
import threeColumnsSource from "@/components/marketing/faq-sections/three-columns?raw";

import ThreeColumnsWithIntroduction from "@/components/marketing/faq-sections/three-columns-with-introduction";
import threeColumnsWithIntroductionSource from "@/components/marketing/faq-sections/three-columns-with-introduction?raw";

import CenteredAccordion from "@/components/marketing/faq-sections/centered-accordion";
import centeredAccordionSource from "@/components/marketing/faq-sections/centered-accordion?raw";

import SideBySide from "@/components/marketing/faq-sections/side-by-side";
import sideBySideSource from "@/components/marketing/faq-sections/side-by-side?raw";

import OffsetWithSupportingText from "@/components/marketing/faq-sections/offset-with-supporting-text";
import offsetWithSupportingTextSource from "@/components/marketing/faq-sections/offset-with-supporting-text?raw";

import TwoColumnsWithDescription from "@/components/marketing/faq-sections/two-columns-with-description";
import twoColumnsWithDescriptionSource from "@/components/marketing/faq-sections/two-columns-with-description?raw";

import TwoColumnsOnBrand from "@/components/marketing/faq-sections/two-columns-on-brand";
import twoColumnsOnBrandSource from "@/components/marketing/faq-sections/two-columns-on-brand?raw";

import TwoColumnsOnDark from "@/components/marketing/faq-sections/two-columns-on-dark";
import twoColumnsOnDarkSource from "@/components/marketing/faq-sections/two-columns-on-dark?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function FaqSectionsPage() {
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
          <span className="font-semibold text-ground-900">FAQ Sections</span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Support</Badge>
          <Badge variant="outline">9 variants</Badge>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <a href="/marketing">Browse all sections</a>
          </Button>
        </div>

        <h1 className="display mb-2 text-ground-900">FAQ Sections</h1>
        <p className="body max-w-2xl text-ground-500">
          Frequently asked question layouts for pricing pages, onboarding flows, and product
          marketing. The set covers static grids, editorial splits, and an interactive accordion.
        </p>
      </div>

      <PageDocs path="/marketing/faq-sections/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="FAQ Sections" />

        <PreviewBlock
          title="Two columns"
          description="Classic FAQ list in a balanced two-column definition grid"
          code={twoColumnsSource}
          previewClassName="p-0 items-stretch"
        >
          <TwoColumns />
        </PreviewBlock>

        <PreviewBlock
          title="Three columns"
          description="Card-based Q&A grid for dense support content"
          code={threeColumnsSource}
          previewClassName="p-0 items-stretch"
        >
          <ThreeColumns />
        </PreviewBlock>

        <PreviewBlock
          title="Three columns with introduction"
          description="Introductory copy in the left column with FAQs split to the right"
          code={threeColumnsWithIntroductionSource}
          previewClassName="p-0 items-stretch"
        >
          <ThreeColumnsWithIntroduction />
        </PreviewBlock>

        <PreviewBlock
          title="Centered accordion"
          description="Interactive disclosure list with rotating chevrons and smooth answer reveal"
          code={centeredAccordionSource}
          previewClassName="p-0 items-stretch"
        >
          <CenteredAccordion />
        </PreviewBlock>

        <PreviewBlock
          title="Side by side"
          description="Large left-side headline paired with stacked answers"
          code={sideBySideSource}
          previewClassName="p-0 items-stretch"
        >
          <SideBySide />
        </PreviewBlock>

        <PreviewBlock
          title="Offset with supporting text"
          description="Narrow intro column and a wider list for customer support detail"
          code={offsetWithSupportingTextSource}
          previewClassName="p-0 items-stretch"
        >
          <OffsetWithSupportingText />
        </PreviewBlock>

        <PreviewBlock
          title="Two columns with description"
          description="Centered heading and summary above a balanced FAQ grid"
          code={twoColumnsWithDescriptionSource}
          previewClassName="p-0 items-stretch"
        >
          <TwoColumnsWithDescription />
        </PreviewBlock>

        <PreviewBlock
          title="Two columns on brand"
          description="High-contrast FAQ section on a brand-primary surface"
          code={twoColumnsOnBrandSource}
          previewClassName="p-0 items-stretch"
        >
          <TwoColumnsOnBrand />
        </PreviewBlock>

        <PreviewBlock
          title="Two columns on dark"
          description="Dark-mode FAQ treatment with soft ground supporting text"
          code={twoColumnsOnDarkSource}
          previewClassName="p-0 items-stretch"
        >
          <TwoColumnsOnDark />
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/marketing/faq-sections/")({
  head: () => createCatalogPageHead("/marketing/faq-sections/"),
  component: FaqSectionsPage,
});
