import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";


import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

import SplitCheckout from "@/components/ecommerce/checkout-forms/split-checkout";
import splitCheckoutSource from "@/components/ecommerce/checkout-forms/split-checkout.tsx?raw";

import SidebarCheckout from "@/components/ecommerce/checkout-forms/sidebar-checkout";
import sidebarCheckoutSource from "@/components/ecommerce/checkout-forms/sidebar-checkout.tsx?raw";

import SingleStepCheckout from "@/components/ecommerce/checkout-forms/single-step-checkout";
import singleStepCheckoutSource from "@/components/ecommerce/checkout-forms/single-step-checkout.tsx?raw";

import MultiStepCheckout from "@/components/ecommerce/checkout-forms/multi-step-checkout";
import multiStepCheckoutSource from "@/components/ecommerce/checkout-forms/multi-step-checkout.tsx?raw";

import MobileOverlayCheckout from "@/components/ecommerce/checkout-forms/mobile-overlay-checkout";
import mobileOverlayCheckoutSource from "@/components/ecommerce/checkout-forms/mobile-overlay-checkout.tsx?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function CheckoutFormsPage() {
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
          <span className="font-semibold text-ground-900">Checkout Forms</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Checkout Forms</h1>
        <p className="body max-w-2xl text-ground-500">
          Single-step and multi-step checkout forms with order summary layouts.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Checkout</p>
          <div className="h-3 w-px bg-ground-100" />
          <Badge variant="outline">Checkout · 5 variants</Badge>
        </div>
      </div>

      <PageDocs path="/ecommerce/checkout-forms/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Variant 1" />
          <PreviewBlock
            title="Split with order summary"
            description="A 60/40 checkout split with the form on the left and a sticky summary card on the right."
            code={splitCheckoutSource}
            previewClassName="p-0"
          >
            <SplitCheckout />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 2" />
          <PreviewBlock
            title="With order summary sidebar"
            description="A full-height summary rail paired with a generous checkout form layout."
            code={sidebarCheckoutSource}
            previewClassName="p-0"
          >
            <SidebarCheckout />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 3" />
          <PreviewBlock
            title="Single step with order summary"
            description="A wide single-step form with the order summary inlined before the final submit action."
            code={singleStepCheckoutSource}
            previewClassName="p-0"
          >
            <SingleStepCheckout />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 4" />
          <PreviewBlock
            title="Multi step"
            description="A three-step checkout with contact, shipping, and payment screens."
            code={multiStepCheckoutSource}
            previewClassName="p-0"
          >
            <MultiStepCheckout />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 5" />
          <PreviewBlock
            title="With mobile order summary overlay"
            description="A checkout form with a toggle that reveals the order summary above the form content."
            code={mobileOverlayCheckoutSource}
            previewClassName="p-0"
          >
            <MobileOverlayCheckout />
          </PreviewBlock>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/ecommerce/checkout-forms/")({
  head: () => createCatalogPageHead("/ecommerce/checkout-forms/"),
  component: CheckoutFormsPage,
});
