import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import FlyoutSimple from "@/components/marketing/flyout-menus/flyout-simple";
import flyoutSimpleSource from "@/components/marketing/flyout-menus/flyout-simple?raw";
import FlyoutStackedFooterActions from "@/components/marketing/flyout-menus/flyout-stacked-footer-actions";
import flyoutStackedFooterActionsSource from "@/components/marketing/flyout-menus/flyout-stacked-footer-actions?raw";
import FlyoutStackedFooterList from "@/components/marketing/flyout-menus/flyout-stacked-footer-list";
import flyoutStackedFooterListSource from "@/components/marketing/flyout-menus/flyout-stacked-footer-list?raw";
import FlyoutTwoColumnSolidIcons from "@/components/marketing/flyout-menus/flyout-two-column-solid-icons";
import flyoutTwoColumnSolidIconsSource from "@/components/marketing/flyout-menus/flyout-two-column-solid-icons?raw";
import FlyoutFullWidth from "@/components/marketing/flyout-menus/flyout-full-width";
import flyoutFullWidthSource from "@/components/marketing/flyout-menus/flyout-full-width?raw";
import FlyoutFullWidthTwoColumns from "@/components/marketing/flyout-menus/flyout-full-width-two-columns";
import flyoutFullWidthTwoColumnsSource from "@/components/marketing/flyout-menus/flyout-full-width-two-columns?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function FlyoutMenusPage() {
  return (
    <div className="space-y-10 p-8">
      <div className="space-y-3">
        <h1 className="heading text-ground-900">Flyout Menus</h1>
        <p className="body text-ground-500">
          Click-driven dropdown patterns for product navigation, editorial callouts, and full-width discovery menus.
        </p>
      </div>

      <PageDocs path="/marketing/flyout-menus/" />

      <div>
        <SectionHeading label="Simple" />
        <PreviewBlock
          title="Simple"
          description="A compact dropdown with four core destinations."
          code={flyoutSimpleSource}
          previewClassName="p-0"
        >
          <FlyoutSimple />
        </PreviewBlock>
      </div>

      <div>
        <SectionHeading label="Stacked with Footer Actions" />
        <PreviewBlock
          title="Stacked with Footer Actions"
          description="Stacked links with two quick actions in the footer."
          code={flyoutStackedFooterActionsSource}
          previewClassName="p-0"
        >
          <FlyoutStackedFooterActions />
        </PreviewBlock>
      </div>

      <div>
        <SectionHeading label="Stacked with Footer List" />
        <PreviewBlock
          title="Stacked with Footer List"
          description="Primary items up top with a denser utility list in a tonal footer."
          code={flyoutStackedFooterListSource}
          previewClassName="p-0"
        >
          <FlyoutStackedFooterList />
        </PreviewBlock>
      </div>

      <div>
        <SectionHeading label="Two Column with Solid Icons" />
        <PreviewBlock
          title="Two Column with Solid Icons"
          description="A wider grid for feature-heavy product menus."
          code={flyoutTwoColumnSolidIconsSource}
          previewClassName="p-0"
        >
          <FlyoutTwoColumnSolidIcons />
        </PreviewBlock>
      </div>

      <div>
        <SectionHeading label="Full Width" />
        <PreviewBlock
          title="Full Width"
          description="A full-width flyout pairing main navigation with recent editorial content."
          code={flyoutFullWidthSource}
          previewClassName="p-0"
        >
          <FlyoutFullWidth />
        </PreviewBlock>
      </div>

      <div>
        <SectionHeading label="Full Width Two Columns" />
        <PreviewBlock
          title="Full Width Two Columns"
          description="A balanced two-column panel for products and resources."
          code={flyoutFullWidthTwoColumnsSource}
          previewClassName="p-0"
        >
          <FlyoutFullWidthTwoColumns />
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/marketing/flyout-menus/")({
  head: () => createCatalogPageHead("/marketing/flyout-menus/"),
  component: FlyoutMenusPage,
});
