import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import AlertWithDescription from "@/components/application-ui/feedback/alert-with-description";
import alertWithDescriptionSource from "@/components/application-ui/feedback/alert-with-description?raw";
import AlertAccentBorder from "@/components/application-ui/feedback/alert-accent-border";
import alertAccentBorderSource from "@/components/application-ui/feedback/alert-accent-border?raw";
import AlertDismissible from "@/components/application-ui/feedback/alert-dismissible";
import alertDismissibleSource from "@/components/application-ui/feedback/alert-dismissible?raw";
import AlertWithActions from "@/components/application-ui/feedback/alert-with-actions";
import alertWithActionsSource from "@/components/application-ui/feedback/alert-with-actions?raw";
import AlertWithLink from "@/components/application-ui/feedback/alert-with-link";
import alertWithLinkSource from "@/components/application-ui/feedback/alert-with-link?raw";
import AlertWithList from "@/components/application-ui/feedback/alert-with-list";
import alertWithListSource from "@/components/application-ui/feedback/alert-with-list?raw";
import EmptyStateSimple from "@/components/application-ui/feedback/empty-state-simple";
import emptyStateSimpleSource from "@/components/application-ui/feedback/empty-state-simple?raw";
import EmptyStateDashed from "@/components/application-ui/feedback/empty-state-dashed";
import emptyStateDashedSource from "@/components/application-ui/feedback/empty-state-dashed?raw";
import EmptyStateRecommendations from "@/components/application-ui/feedback/empty-state-recommendations";
import emptyStateRecommendationsSource from "@/components/application-ui/feedback/empty-state-recommendations?raw";
import EmptyStateRecommendationGrid from "@/components/application-ui/feedback/empty-state-recommendation-grid";
import emptyStateRecommendationGridSource from "@/components/application-ui/feedback/empty-state-recommendation-grid?raw";
import EmptyStateStartingPoints from "@/components/application-ui/feedback/empty-state-starting-points";
import emptyStateStartingPointsSource from "@/components/application-ui/feedback/empty-state-starting-points?raw";
import EmptyStateTemplates from "@/components/application-ui/feedback/empty-state-templates";
import emptyStateTemplatesSource from "@/components/application-ui/feedback/empty-state-templates?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function FeedbackPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/application-ui" className="hover:text-ground-700">
            Application UI
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Feedback</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Feedback</h1>
        <p className="body max-w-2xl text-ground-400">
          Alert banners and empty state placeholders for application UI.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Feedback · 12 variants</p>
        </div>
      </div>

      <PageDocs path="/application-ui/feedback/" />

      <div className="space-y-10">
        <section>
          <SectionHeading label="Alerts" />
          <div className="grid gap-4 xl:grid-cols-2">
            <PreviewBlock title="With description" code={alertWithDescriptionSource} previewClassName="p-0">
              <AlertWithDescription />
            </PreviewBlock>
            <PreviewBlock title="With accent border" code={alertAccentBorderSource} previewClassName="p-0">
              <AlertAccentBorder />
            </PreviewBlock>
            <PreviewBlock title="With dismiss button" code={alertDismissibleSource} previewClassName="p-0">
              <AlertDismissible />
            </PreviewBlock>
            <PreviewBlock title="With actions" code={alertWithActionsSource} previewClassName="p-0">
              <AlertWithActions />
            </PreviewBlock>
            <PreviewBlock title="With link on right" code={alertWithLinkSource} previewClassName="p-0">
              <AlertWithLink />
            </PreviewBlock>
            <PreviewBlock title="With list" code={alertWithListSource} previewClassName="p-0">
              <AlertWithList />
            </PreviewBlock>
          </div>
        </section>

        <section>
          <SectionHeading label="Empty states" />
          <div className="grid gap-4 xl:grid-cols-2">
            <PreviewBlock title="Simple" code={emptyStateSimpleSource} previewClassName="p-0">
              <EmptyStateSimple />
            </PreviewBlock>
            <PreviewBlock title="With dashed border" code={emptyStateDashedSource} previewClassName="p-0">
              <EmptyStateDashed />
            </PreviewBlock>
            <PreviewBlock
              title="With recommendations"
              code={emptyStateRecommendationsSource}
              previewClassName="p-0"
              className="xl:col-span-2"
            >
              <EmptyStateRecommendations />
            </PreviewBlock>
            <PreviewBlock
              title="With recommendations grid"
              code={emptyStateRecommendationGridSource}
              previewClassName="p-0"
              className="xl:col-span-2"
            >
              <EmptyStateRecommendationGrid />
            </PreviewBlock>
            <PreviewBlock
              title="With starting points"
              code={emptyStateStartingPointsSource}
              previewClassName="p-0"
            >
              <EmptyStateStartingPoints />
            </PreviewBlock>
            <PreviewBlock title="With templates" code={emptyStateTemplatesSource} previewClassName="p-0">
              <EmptyStateTemplates />
            </PreviewBlock>
          </div>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/application-ui/feedback/")({
  head: () => createCatalogPageHead("/application-ui/feedback/"),
  component: FeedbackPage,
});
