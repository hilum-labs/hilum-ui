import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { PreviewBlock } from "@/components/catalog/preview-block";
import PricingThreeTiers from "@/components/marketing/pricing/pricing-three-tiers";
import pricingThreeTiersSource from "@/components/marketing/pricing/pricing-three-tiers?raw";
import PricingThreeTiersEmphasized from "@/components/marketing/pricing/pricing-three-tiers-emphasized";
import pricingThreeTiersEmphasizedSource from "@/components/marketing/pricing/pricing-three-tiers-emphasized?raw";
import PricingFourTiersToggle from "@/components/marketing/pricing/pricing-four-tiers-toggle";
import pricingFourTiersToggleSource from "@/components/marketing/pricing/pricing-four-tiers-toggle?raw";
import PricingTwoTiersExtra from "@/components/marketing/pricing/pricing-two-tiers-extra";
import pricingTwoTiersExtraSource from "@/components/marketing/pricing/pricing-two-tiers-extra?raw";
import PricingSingleWithDetails from "@/components/marketing/pricing/pricing-single-with-details";
import pricingSingleWithDetailsSource from "@/components/marketing/pricing/pricing-single-with-details?raw";
import PricingSingleFeatureList from "@/components/marketing/pricing/pricing-single-feature-list";
import pricingSingleFeatureListSource from "@/components/marketing/pricing/pricing-single-feature-list?raw";
import PricingBrandComparison from "@/components/marketing/pricing/pricing-brand-comparison";
import pricingBrandComparisonSource from "@/components/marketing/pricing/pricing-brand-comparison?raw";
import PricingSplitBrandPanel from "@/components/marketing/pricing/pricing-split-brand-panel";
import pricingSplitBrandPanelSource from "@/components/marketing/pricing/pricing-split-brand-panel?raw";
import PricingComparisonTable from "@/components/marketing/pricing/pricing-comparison-table";
import pricingComparisonTableSource from "@/components/marketing/pricing/pricing-comparison-table?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/marketing" className="hover:text-ground-700">Marketing</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Pricing</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Pricing</h1>
        <p className="body max-w-2xl text-ground-500">
          Nine pricing section patterns covering straightforward tiers, single-plan layouts, split panels, and full comparison tables.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Pricing · Tiered Layouts" />
        <PreviewBlock
          title="Three tiers"
          description="Standard three-card pricing grid with a highlighted middle plan."
          code={pricingThreeTiersSource}
          previewClassName="p-0"
        >
          <PricingThreeTiers />
        </PreviewBlock>
        <PreviewBlock
          title="Three tiers with emphasized tier"
          description="Middle tier is elevated with ring, shadow, and stronger hierarchy."
          code={pricingThreeTiersEmphasizedSource}
          previewClassName="p-0"
        >
          <PricingThreeTiersEmphasized />
        </PreviewBlock>
        <PreviewBlock
          title="Four tiers with toggle"
          description="Monthly and annual pricing switch using local component state."
          code={pricingFourTiersToggleSource}
          previewClassName="p-0"
        >
          <PricingFourTiersToggle />
        </PreviewBlock>
        <PreviewBlock
          title="Two tiers with extra tier"
          description="Two self-serve plans with an enterprise CTA row below."
          code={pricingTwoTiersExtraSource}
          previewClassName="p-0"
        >
          <PricingTwoTiersExtra />
        </PreviewBlock>

        <SectionHeading label="Pricing · Single Plan" />
        <PreviewBlock
          title="Single price with details"
          description="Centered single-plan card with a two-column feature matrix."
          code={pricingSingleWithDetailsSource}
          previewClassName="p-0"
        >
          <PricingSingleWithDetails />
        </PreviewBlock>
        <PreviewBlock
          title="Single price with feature list"
          description="Split single-plan layout with the price on the left and checklist on the right."
          code={pricingSingleFeatureListSource}
          previewClassName="p-0"
        >
          <PricingSingleFeatureList />
        </PreviewBlock>

        <SectionHeading label="Pricing · Comparison" />
        <PreviewBlock
          title="Three tiers on brand and feature comparison"
          description="Dark pricing cards paired with a detailed feature comparison table."
          code={pricingBrandComparisonSource}
          previewClassName="p-0"
        >
          <PricingBrandComparison />
        </PreviewBlock>
        <PreviewBlock
          title="Split with brand panel"
          description="Orange pricing summary on the left, detailed feature explanation on the right."
          code={pricingSplitBrandPanelSource}
          previewClassName="p-0"
        >
          <PricingSplitBrandPanel />
        </PreviewBlock>
        <PreviewBlock
          title="With comparison table"
          description="Expanded table with feature categories and comparison icons."
          code={pricingComparisonTableSource}
          previewClassName="p-0"
        >
          <PricingComparisonTable />
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/marketing/pricing/")({
  head: () => createCatalogPageHead("/marketing/pricing/"),
  component: PricingPage,
});
