import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

import SimpleIconGrid from "@/components/ecommerce/incentives/simple-icon-grid";
import simpleIconGridSource from "@/components/ecommerce/incentives/simple-icon-grid?raw";

import DetailedIconGrid from "@/components/ecommerce/incentives/detailed-icon-grid";
import detailedIconGridSource from "@/components/ecommerce/incentives/detailed-icon-grid?raw";

import CenteredCustomerService from "@/components/ecommerce/incentives/centered-customer-service";
import centeredCustomerServiceSource from "@/components/ecommerce/incentives/centered-customer-service?raw";

import LeftAlignedHeaderGrid from "@/components/ecommerce/incentives/left-aligned-header-grid";
import leftAlignedHeaderGridSource from "@/components/ecommerce/incentives/left-aligned-header-grid?raw";

import HeadingAboveGridDividers from "@/components/ecommerce/incentives/heading-above-grid-dividers";
import headingAboveGridDividersSource from "@/components/ecommerce/incentives/heading-above-grid-dividers?raw";

import SplitHeaderHighlights from "@/components/ecommerce/incentives/split-header-highlights";
import splitHeaderHighlightsSource from "@/components/ecommerce/incentives/split-header-highlights?raw";

import FourUpIconRow from "@/components/ecommerce/incentives/four-up-icon-row";
import fourUpIconRowSource from "@/components/ecommerce/incentives/four-up-icon-row?raw";

import LargeTwoByTwoCards from "@/components/ecommerce/incentives/large-two-by-two-cards";
import largeTwoByTwoCardsSource from "@/components/ecommerce/incentives/large-two-by-two-cards?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function IncentivesPage() {
  return (
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
          <span className="body font-semibold text-ground-900">Incentives</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Incentives</h1>
        <p className="body max-w-2xl text-ground-400">
          Shipping, returns, and warranty highlights with icons and descriptive text.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <Badge variant="secondary">Marketing · 8 variants</Badge>
        </div>
      </div>

      <PageDocs path="/ecommerce/incentives/" />

      <div className="space-y-10">
        <div>
          <SectionHeading label="Incentives · 3 column with icons" />
          <PreviewBlock
            title="Simple icon grid"
            description="Three short trust points with minimal supporting copy."
            code={simpleIconGridSource}
            previewClassName="p-0"
          >
            <SimpleIconGrid />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Incentives · 3 column with icons and supporting text" />
          <PreviewBlock
            title="Detailed icon grid"
            description="Longer descriptive copy and more card framing for each message."
            code={detailedIconGridSource}
            previewClassName="p-0"
          >
            <DetailedIconGrid />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Incentives · 3 column with illustrations and centered text" />
          <PreviewBlock
            title="Centered customer service section"
            description="Centered headline with elevated icon containers."
            code={centeredCustomerServiceSource}
            previewClassName="p-0"
          >
            <CenteredCustomerService />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Incentives · 3 column with illustrations and header" />
          <PreviewBlock
            title="Left-aligned header with grid"
            description="Introductory copy on the left and a compact incentive grid on the right."
            code={leftAlignedHeaderGridSource}
            previewClassName="p-0"
          >
            <LeftAlignedHeaderGrid />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Incentives · 3 column with illustrations and heading" />
          <PreviewBlock
            title="Heading above grid with dividers"
            description="Top heading and vertical separators between dense messages."
            code={headingAboveGridDividersSource}
            previewClassName="p-0"
          >
            <HeadingAboveGridDividers />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Incentives · 3 column with split header" />
          <PreviewBlock
            title="Split header and highlights"
            description="Message-led header with CTA and compact three-column highlights."
            code={splitHeaderHighlightsSource}
            previewClassName="p-0"
          >
            <SplitHeaderHighlights />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Incentives · 4 column with illustrations" />
          <PreviewBlock
            title="Four-up icon row"
            description="Expanded set including a gift wrapping service highlight."
            code={fourUpIconRowSource}
            previewClassName="p-0"
          >
            <FourUpIconRow />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Incentives · 2x2 grid with illustrations" />
          <PreviewBlock
            title="Large 2x2 incentive cards"
            description="Broader cards for more explanatory language and stronger visual weight."
            code={largeTwoByTwoCardsSource}
            previewClassName="p-0"
          >
            <LargeTwoByTwoCards />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/ecommerce/incentives/")({
  head: () => createCatalogPageHead("/ecommerce/incentives/"),
  component: IncentivesPage,
});
