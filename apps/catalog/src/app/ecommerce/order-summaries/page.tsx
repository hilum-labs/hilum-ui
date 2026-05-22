import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import OrderSummaryFullDetails from "@/components/ecommerce/order-summaries/order-summary-full-details";
import orderSummaryFullDetailsSource from "@/components/ecommerce/order-summaries/order-summary-full-details?raw";
import OrderSummaryProgressBars from "@/components/ecommerce/order-summaries/order-summary-progress-bars";
import orderSummaryProgressBarsSource from "@/components/ecommerce/order-summaries/order-summary-progress-bars?raw";
import OrderSummaryLargeImages from "@/components/ecommerce/order-summaries/order-summary-large-images";
import orderSummaryLargeImagesSource from "@/components/ecommerce/order-summaries/order-summary-large-images?raw";
import OrderSummarySplitImage from "@/components/ecommerce/order-summaries/order-summary-split-image";
import orderSummarySplitImageSource from "@/components/ecommerce/order-summaries/order-summary-split-image?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function OrderSummariesPage() {
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
          <span className="font-semibold text-ground-900">Order Summaries</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Order Summaries</h1>
        <p className="body max-w-2xl text-ground-500">
          Order confirmation pages with progress tracking and detailed breakdowns.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Account</p>
          <div className="h-3 w-px bg-ground-100" />
          <Badge variant="outline">Account · 4 variants</Badge>
        </div>
      </div>

      <PageDocs path="/ecommerce/order-summaries/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Variant 1" />
          <PreviewBlock
            title="Simple with full details"
            description="A complete confirmation page with hero copy, purchased items, addresses, and totals."
            code={orderSummaryFullDetailsSource}
            previewClassName="p-0"
          >
            <OrderSummaryFullDetails />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 2" />
          <PreviewBlock
            title="With progress bars"
            description="A tracked order state with horizontal progress steps and order item detail below."
            code={orderSummaryProgressBarsSource}
            previewClassName="p-0"
          >
            <OrderSummaryProgressBars />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 3" />
          <PreviewBlock
            title="With large images and progress bars"
            description="Large product imagery paired with the same tracked progress experience."
            code={orderSummaryLargeImagesSource}
            previewClassName="p-0"
          >
            <OrderSummaryLargeImages />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 4" />
          <PreviewBlock
            title="With split image"
            description="A split confirmation layout with large imagery on the left and details on the right."
            code={orderSummarySplitImageSource}
            previewClassName="p-0"
          >
            <OrderSummarySplitImage />
          </PreviewBlock>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/ecommerce/order-summaries/")({
  head: () => createCatalogPageHead("/ecommerce/order-summaries/"),
  component: OrderSummariesPage,
});
