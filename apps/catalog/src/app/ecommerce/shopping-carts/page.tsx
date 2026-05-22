import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import { Badge } from "@hilum/ui";

import SingleColumnCart from "@/components/ecommerce/shopping-carts/single-column-cart";
import singleColumnCartSource from "@/components/ecommerce/shopping-carts/single-column-cart?raw";

import TwoColumnCart from "@/components/ecommerce/shopping-carts/two-column-cart";
import twoColumnCartSource from "@/components/ecommerce/shopping-carts/two-column-cart?raw";

import ExtendedSummaryCart from "@/components/ecommerce/shopping-carts/extended-summary-cart";
import extendedSummaryCartSource from "@/components/ecommerce/shopping-carts/extended-summary-cart?raw";

import SlideOverCart from "@/components/ecommerce/shopping-carts/slide-over-cart";
import slideOverCartSource from "@/components/ecommerce/shopping-carts/slide-over-cart?raw";

import PopoverCart from "@/components/ecommerce/shopping-carts/popover-cart";
import popoverCartSource from "@/components/ecommerce/shopping-carts/popover-cart?raw";

import ModalCart from "@/components/ecommerce/shopping-carts/modal-cart";
import modalCartSource from "@/components/ecommerce/shopping-carts/modal-cart?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function ShoppingCartsPage() {
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
          <span className="font-semibold text-ground-900">Shopping Carts</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Shopping Carts</h1>
        <p className="body max-w-2xl text-ground-500">
          Cart layouts as modals, slide-overs, popovers, and full-page views.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Ecommerce</p>
          <div className="h-3 w-px bg-ground-100" />
          <Badge variant="outline">Checkout · 6 variants</Badge>
        </div>
      </div>

      <PageDocs path="/ecommerce/shopping-carts/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Variant 1" />
          <PreviewBlock
            title="Single column"
            description="A full-page cart with inline quantity controls and a checkout summary."
            code={singleColumnCartSource}
            previewClassName="p-0"
          >
            <SingleColumnCart />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 2" />
          <PreviewBlock
            title="Two column with quantity dropdown"
            description="A split cart layout with quantities adjusted in a dropdown and a sticky order summary."
            code={twoColumnCartSource}
            previewClassName="p-0"
          >
            <TwoColumnCart />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 3" />
          <PreviewBlock
            title="With extended summary"
            description="A detailed summary with a promo code field, discount line, shipping estimate, and full totals."
            code={extendedSummaryCartSource}
            previewClassName="p-0"
          >
            <ExtendedSummaryCart />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 4" />
          <PreviewBlock
            title="Slide-over panel"
            description="A simulated slide-over cart with removable items and a fixed summary footer."
            code={slideOverCartSource}
            previewClassName="p-0"
          >
            <SlideOverCart />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 5" />
          <PreviewBlock
            title="Popover"
            description="A compact cart popover with mini product cards and fast actions."
            code={popoverCartSource}
            previewClassName="p-0"
          >
            <PopoverCart />
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Variant 6" />
          <PreviewBlock
            title="Modal"
            description="A centered cart modal with a scrollable item area and a fixed action footer."
            code={modalCartSource}
            previewClassName="p-0"
          >
            <ModalCart />
          </PreviewBlock>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/ecommerce/shopping-carts/")({
  head: () => createCatalogPageHead("/ecommerce/shopping-carts/"),
  component: ShoppingCartsPage,
});
