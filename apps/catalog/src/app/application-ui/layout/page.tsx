import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

import PanelBasic from "@/components/application-ui/layout/panel-basic";
import panelBasicSource from "@/components/application-ui/layout/panel-basic?raw";
import PanelWithHeader from "@/components/application-ui/layout/panel-with-header";
import panelWithHeaderSource from "@/components/application-ui/layout/panel-with-header?raw";
import PanelWithHeaderAndFooter from "@/components/application-ui/layout/panel-with-header-and-footer";
import panelWithHeaderAndFooterSource from "@/components/application-ui/layout/panel-with-header-and-footer?raw";
import PanelWithGroundBody from "@/components/application-ui/layout/panel-with-ground-body";
import panelWithGroundBodySource from "@/components/application-ui/layout/panel-with-ground-body?raw";
import PanelWell from "@/components/application-ui/layout/panel-well";
import panelWellSource from "@/components/application-ui/layout/panel-well?raw";

import MediaObjectBasic from "@/components/application-ui/layout/media-object-basic";
import mediaObjectBasicSource from "@/components/application-ui/layout/media-object-basic?raw";
import MediaObjectCentered from "@/components/application-ui/layout/media-object-centered";
import mediaObjectCenteredSource from "@/components/application-ui/layout/media-object-centered?raw";
import MediaObjectRight from "@/components/application-ui/layout/media-object-right";
import mediaObjectRightSource from "@/components/application-ui/layout/media-object-right?raw";
import MediaObjectNested from "@/components/application-ui/layout/media-object-nested";
import mediaObjectNestedSource from "@/components/application-ui/layout/media-object-nested?raw";

import DividerSimple from "@/components/application-ui/layout/divider-simple";
import dividerSimpleSource from "@/components/application-ui/layout/divider-simple?raw";
import DividerWithLabel from "@/components/application-ui/layout/divider-with-label";
import dividerWithLabelSource from "@/components/application-ui/layout/divider-with-label?raw";
import DividerWithTitle from "@/components/application-ui/layout/divider-with-title";
import dividerWithTitleSource from "@/components/application-ui/layout/divider-with-title?raw";
import DividerWithButton from "@/components/application-ui/layout/divider-with-button";
import dividerWithButtonSource from "@/components/application-ui/layout/divider-with-button?raw";
import DividerWithToolbar from "@/components/application-ui/layout/divider-with-toolbar";
import dividerWithToolbarSource from "@/components/application-ui/layout/divider-with-toolbar?raw";

import ContainerConstrained from "@/components/application-ui/layout/container-constrained";
import containerConstrainedSource from "@/components/application-ui/layout/container-constrained?raw";
import ContainerNarrow from "@/components/application-ui/layout/container-narrow";
import containerNarrowSource from "@/components/application-ui/layout/container-narrow?raw";
import ContainerFullWidthOnMobile from "@/components/application-ui/layout/container-full-width-on-mobile";
import containerFullWidthOnMobileSource from "@/components/application-ui/layout/container-full-width-on-mobile?raw";

import ListContainerSimple from "@/components/application-ui/layout/list-container-simple";
import listContainerSimpleSource from "@/components/application-ui/layout/list-container-simple?raw";
import ListContainerCard from "@/components/application-ui/layout/list-container-card";
import listContainerCardSource from "@/components/application-ui/layout/list-container-card?raw";
import ListContainerSeparateCards from "@/components/application-ui/layout/list-container-separate-cards";
import listContainerSeparateCardsSource from "@/components/application-ui/layout/list-container-separate-cards?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function LayoutPage() {
  return (
    <div className="min-h-screen bg-ground-50">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <p className="caption mb-2 text-ground-400">
            Design System / Application UI / Layout
          </p>
          <h1 className="display mb-2 text-ground-900">Layout</h1>
          <p className="body mb-4 text-ground-500">
            Panels, media objects, dividers, containers, and list containers.
          </p>
          <Badge variant="outline">Layout · 17 variants</Badge>
        </div>
        <div className="mb-10 h-px bg-ground-100" />

        <div className="space-y-10">
          <section>
            <SectionHeading label="Panels" />
            <div className="grid gap-4 xl:grid-cols-2">
              <PreviewBlock title="Basic card" description="A standard panel for grouping related content." code={panelBasicSource} previewClassName="p-6">
                <PanelBasic />
              </PreviewBlock>
              <PreviewBlock title="With header" description="Uses a separated header row above the body." code={panelWithHeaderSource} previewClassName="p-6">
                <PanelWithHeader />
              </PreviewBlock>
              <PreviewBlock title="With header and footer" description="Common for confirmation or approval flows." code={panelWithHeaderAndFooterSource} previewClassName="p-6">
                <PanelWithHeaderAndFooter />
              </PreviewBlock>
              <PreviewBlock title="With ground body" description="Creates hierarchy by tinting the body region." code={panelWithGroundBodySource} previewClassName="p-6">
                <PanelWithGroundBody />
              </PreviewBlock>
              <PreviewBlock title="Well" description="An inset panel for secondary or supporting content." code={panelWellSource} previewClassName="p-6">
                <PanelWell />
              </PreviewBlock>
            </div>
          </section>

          <section>
            <SectionHeading label="Media Objects" />
            <div className="grid gap-4 xl:grid-cols-2">
              <PreviewBlock title="Basic" description="Media left, content right." code={mediaObjectBasicSource} previewClassName="p-0">
                <MediaObjectBasic />
              </PreviewBlock>
              <PreviewBlock title="Aligned to center" description="Centers avatar and text vertically." code={mediaObjectCenteredSource} previewClassName="p-0">
                <MediaObjectCentered />
              </PreviewBlock>
              <PreviewBlock title="Media on right" description="Swaps the emphasis by moving media to the end." code={mediaObjectRightSource} previewClassName="p-0">
                <MediaObjectRight />
              </PreviewBlock>
              <PreviewBlock title="Nested" description="Media objects can be nested for hierarchy." code={mediaObjectNestedSource} previewClassName="p-0">
                <MediaObjectNested />
              </PreviewBlock>
            </div>
          </section>

          <section>
            <SectionHeading label="Dividers" />
            <div className="grid gap-4 xl:grid-cols-2">
              <PreviewBlock title="Simple" description="Separates two adjacent content regions." code={dividerSimpleSource} previewClassName="p-0">
                <DividerSimple />
              </PreviewBlock>
              <PreviewBlock title="With label" description="Useful for auth flows and alternative paths." code={dividerWithLabelSource} previewClassName="p-0">
                <DividerWithLabel />
              </PreviewBlock>
              <PreviewBlock title="With title" description="Elevates a divider into a section transition." code={dividerWithTitleSource} previewClassName="p-0">
                <DividerWithTitle />
              </PreviewBlock>
              <PreviewBlock title="With button" description="Places an action directly inside the divider." code={dividerWithButtonSource} previewClassName="p-0">
                <DividerWithButton />
              </PreviewBlock>
              <PreviewBlock title="With toolbar" description="Combines count, controls, and a content boundary." code={dividerWithToolbarSource} previewClassName="p-0" className="xl:col-span-2">
                <DividerWithToolbar />
              </PreviewBlock>
            </div>
          </section>

          <section>
            <SectionHeading label="Containers" />
            <div className="grid gap-4 xl:grid-cols-2">
              <PreviewBlock title="Constrained with padded content" description="The standard full-page content wrapper." code={containerConstrainedSource} previewClassName="p-0">
                <ContainerConstrained />
              </PreviewBlock>
              <PreviewBlock title="Narrow constrained" description="A focused single-column container." code={containerNarrowSource} previewClassName="p-0">
                <ContainerNarrow />
              </PreviewBlock>
              <PreviewBlock title="Full width on mobile" description="Edge-to-edge on small screens, padded on larger ones." code={containerFullWidthOnMobileSource} previewClassName="p-0">
                <ContainerFullWidthOnMobile />
              </PreviewBlock>
            </div>
          </section>

          <section>
            <SectionHeading label="List Containers" />
            <div className="grid gap-4 xl:grid-cols-2">
              <PreviewBlock title="Simple with dividers" description="A straightforward vertical list." code={listContainerSimpleSource} previewClassName="p-6">
                <ListContainerSimple />
              </PreviewBlock>
              <PreviewBlock title="Card with dividers" description="A list inside a bordered panel." code={listContainerCardSource} previewClassName="p-6">
                <ListContainerCard />
              </PreviewBlock>
              <PreviewBlock title="Separate cards" description="Each row stands alone as its own container." code={listContainerSeparateCardsSource} previewClassName="p-6">
                <ListContainerSeparateCards />
              </PreviewBlock>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/application-ui/layout/")({
  head: () => createCatalogPageHead("/application-ui/layout/"),
  component: LayoutPage,
});
