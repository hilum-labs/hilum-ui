import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Badge } from "@hilum/ui";

import CardHeadingSimple from "@/components/application-ui/headings/card-heading-simple";
import cardHeadingSimpleSource from "@/components/application-ui/headings/card-heading-simple?raw";
import CardHeadingWithAction from "@/components/application-ui/headings/card-heading-with-action";
import cardHeadingWithActionSource from "@/components/application-ui/headings/card-heading-with-action?raw";
import CardHeadingWithDescription from "@/components/application-ui/headings/card-heading-with-description";
import cardHeadingWithDescriptionSource from "@/components/application-ui/headings/card-heading-with-description?raw";
import CardHeadingWithAvatarActions from "@/components/application-ui/headings/card-heading-with-avatar-actions";
import cardHeadingWithAvatarActionsSource from "@/components/application-ui/headings/card-heading-with-avatar-actions?raw";
import CardHeadingWithDescriptionAndAction from "@/components/application-ui/headings/card-heading-with-description-and-action";
import cardHeadingWithDescriptionAndActionSource from "@/components/application-ui/headings/card-heading-with-description-and-action?raw";

import PageHeadingWithActions from "@/components/application-ui/headings/page-heading-with-actions";
import pageHeadingWithActionsSource from "@/components/application-ui/headings/page-heading-with-actions?raw";
import PageHeadingWithActionsAndBreadcrumbs from "@/components/application-ui/headings/page-heading-with-actions-and-breadcrumbs";
import pageHeadingWithActionsAndBreadcrumbsSource from "@/components/application-ui/headings/page-heading-with-actions-and-breadcrumbs?raw";
import PageHeadingWithAvatarActions from "@/components/application-ui/headings/page-heading-with-avatar-actions";
import pageHeadingWithAvatarActionsSource from "@/components/application-ui/headings/page-heading-with-avatar-actions?raw";
import PageHeadingWithBanner from "@/components/application-ui/headings/page-heading-with-banner";
import pageHeadingWithBannerSource from "@/components/application-ui/headings/page-heading-with-banner?raw";
import PageHeadingWithMetaActions from "@/components/application-ui/headings/page-heading-with-meta-actions";
import pageHeadingWithMetaActionsSource from "@/components/application-ui/headings/page-heading-with-meta-actions?raw";
import PageHeadingDarkWithActions from "@/components/application-ui/headings/page-heading-dark-with-actions";
import pageHeadingDarkWithActionsSource from "@/components/application-ui/headings/page-heading-dark-with-actions?raw";

import SectionHeadingSimple from "@/components/application-ui/headings/section-heading-simple";
import sectionHeadingSimpleSource from "@/components/application-ui/headings/section-heading-simple?raw";
import SectionHeadingWithAction from "@/components/application-ui/headings/section-heading-with-action";
import sectionHeadingWithActionSource from "@/components/application-ui/headings/section-heading-with-action?raw";
import SectionHeadingWithDescription from "@/components/application-ui/headings/section-heading-with-description";
import sectionHeadingWithDescriptionSource from "@/components/application-ui/headings/section-heading-with-description?raw";
import SectionHeadingWithBadgeDropdown from "@/components/application-ui/headings/section-heading-with-badge-dropdown";
import sectionHeadingWithBadgeDropdownSource from "@/components/application-ui/headings/section-heading-with-badge-dropdown?raw";
import SectionHeadingWithTabs from "@/components/application-ui/headings/section-heading-with-tabs";
import sectionHeadingWithTabsSource from "@/components/application-ui/headings/section-heading-with-tabs?raw";
import SectionHeadingWithInlineTabs from "@/components/application-ui/headings/section-heading-with-inline-tabs";
import sectionHeadingWithInlineTabsSource from "@/components/application-ui/headings/section-heading-with-inline-tabs?raw";

import { PreviewBlock } from "@/components/catalog/preview-block";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function HeadingsPage() {
  return (
    <div className="min-h-screen bg-ground-50">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <p className="caption mb-2 text-ground-400">
            Design System / Application UI / Headings
          </p>
          <h1 className="display mb-2 text-ground-900">Headings</h1>
          <p className="body mb-4 text-ground-500">
            Card headings, page headings, and section headings with actions, avatars,
            and metadata.
          </p>
          <Badge variant="outline">Layout · 17 variants</Badge>
        </div>

      <PageDocs path="/application-ui/headings/" />
        <div className="mb-10 h-px bg-ground-100" />

        <div className="space-y-10">
          <section>
            <SectionHeading label="Card Headings" />
            <div className="space-y-4">
              <PreviewBlock title="Simple" description="A basic card header with a single title." code={cardHeadingSimpleSource} previewClassName="p-0">
                <CardHeadingSimple />
              </PreviewBlock>
              <PreviewBlock title="With action" description="Places a compact action in the card header." code={cardHeadingWithActionSource} previewClassName="p-0">
                <CardHeadingWithAction />
              </PreviewBlock>
              <PreviewBlock title="With description" description="Adds supporting context below the card title." code={cardHeadingWithDescriptionSource} previewClassName="p-0">
                <CardHeadingWithDescription />
              </PreviewBlock>
              <PreviewBlock title="With avatar and actions" description="Useful for owner cards and profile detail panels." code={cardHeadingWithAvatarActionsSource} previewClassName="p-0">
                <CardHeadingWithAvatarActions />
              </PreviewBlock>
              <PreviewBlock title="With description and action" description="Balances metadata and a primary save action." code={cardHeadingWithDescriptionAndActionSource} previewClassName="p-0">
                <CardHeadingWithDescriptionAndAction />
              </PreviewBlock>
            </div>
          </section>

          <section>
            <SectionHeading label="Page Headings" />
            <div className="space-y-4">
              <PreviewBlock title="With actions" description="Standard page header with primary and secondary actions." code={pageHeadingWithActionsSource} previewClassName="p-0">
                <PageHeadingWithActions />
              </PreviewBlock>
              <PreviewBlock title="With actions and breadcrumbs" description="Adds navigation breadcrumbs above the page title." code={pageHeadingWithActionsAndBreadcrumbsSource} previewClassName="p-0">
                <PageHeadingWithActionsAndBreadcrumbs />
              </PreviewBlock>
              <PreviewBlock title="With avatar and actions" description="Includes an avatar for user or entity context." code={pageHeadingWithAvatarActionsSource} previewClassName="p-0">
                <PageHeadingWithAvatarActions />
              </PreviewBlock>
              <PreviewBlock title="With banner" description="Full-width color banner behind the page heading." code={pageHeadingWithBannerSource} previewClassName="p-0">
                <PageHeadingWithBanner />
              </PreviewBlock>
              <PreviewBlock title="With meta and actions" description="Adds metadata rows below the page title." code={pageHeadingWithMetaActionsSource} previewClassName="p-0">
                <PageHeadingWithMetaActions />
              </PreviewBlock>
              <PreviewBlock title="Dark with actions" description="Dark background variant for high-contrast page headers." code={pageHeadingDarkWithActionsSource} previewClassName="p-0">
                <PageHeadingDarkWithActions />
              </PreviewBlock>
            </div>
          </section>

          <section>
            <SectionHeading label="Section Headings" />
            <div className="space-y-4">
              <PreviewBlock title="Simple" description="Minimal section label." code={sectionHeadingSimpleSource} previewClassName="p-0">
                <SectionHeadingSimple />
              </PreviewBlock>
              <PreviewBlock title="With action" description="Adds a CTA to the right of the section heading." code={sectionHeadingWithActionSource} previewClassName="p-0">
                <SectionHeadingWithAction />
              </PreviewBlock>
              <PreviewBlock title="With description" description="Adds a descriptive line below the section title." code={sectionHeadingWithDescriptionSource} previewClassName="p-0">
                <SectionHeadingWithDescription />
              </PreviewBlock>
              <PreviewBlock title="With badge and dropdown" description="Adds status badge and overflow menu." code={sectionHeadingWithBadgeDropdownSource} previewClassName="p-0">
                <SectionHeadingWithBadgeDropdown />
              </PreviewBlock>
              <PreviewBlock title="With tabs" description="Tabs embedded into the section heading." code={sectionHeadingWithTabsSource} previewClassName="p-0">
                <SectionHeadingWithTabs />
              </PreviewBlock>
              <PreviewBlock title="With inline tabs" description="Keeps the title and tabs on a single row." code={sectionHeadingWithInlineTabsSource} previewClassName="p-0">
                <SectionHeadingWithInlineTabs />
              </PreviewBlock>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/application-ui/headings/")({
  head: () => createCatalogPageHead("/application-ui/headings/"),
  component: HeadingsPage,
});
