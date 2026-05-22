import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import StatsSimple from "@/components/application-ui/data-display/stats-simple";
import statsSimpleSource from "@/components/application-ui/data-display/stats-simple?raw";
import StatsIcons from "@/components/application-ui/data-display/stats-icons";
import statsIconsSource from "@/components/application-ui/data-display/stats-icons?raw";
import StatsSharedBorders from "@/components/application-ui/data-display/stats-shared-borders";
import statsSharedBordersSource from "@/components/application-ui/data-display/stats-shared-borders?raw";
import DescriptionListLeftAligned from "@/components/application-ui/data-display/description-list-left-aligned";
import descriptionListLeftAlignedSource from "@/components/application-ui/data-display/description-list-left-aligned?raw";
import DescriptionListCard from "@/components/application-ui/data-display/description-list-card";
import descriptionListCardSource from "@/components/application-ui/data-display/description-list-card?raw";
import DescriptionListTwoColumn from "@/components/application-ui/data-display/description-list-two-column";
import descriptionListTwoColumnSource from "@/components/application-ui/data-display/description-list-two-column?raw";
import DescriptionListStriped from "@/components/application-ui/data-display/description-list-striped";
import descriptionListStripedSource from "@/components/application-ui/data-display/description-list-striped?raw";
import CalendarMonth from "@/components/application-ui/data-display/calendar-month";
import calendarMonthSource from "@/components/application-ui/data-display/calendar-month?raw";
import CalendarSmallWithMeetings from "@/components/application-ui/data-display/calendar-small-with-meetings";
import calendarSmallWithMeetingsSource from "@/components/application-ui/data-display/calendar-small-with-meetings?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function DataDisplayPage() {
  return (
    <div className="min-h-screen bg-ground-50">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <p className="caption mb-2 text-ground-400">
            Design System / Application UI / Data Display
          </p>
          <h1 className="display mb-2 text-ground-900">Data Display</h1>
          <p className="body mb-4 text-ground-500">
            Stats cards, description lists, and calendar views.
          </p>
          <Badge variant="outline">Data · 16 variants</Badge>
        </div>
        <div className="mb-10 h-px bg-ground-100" />

        <div className="space-y-10">
          <section>
            <SectionHeading label="Stats" />
            <div className="space-y-4">
              <PreviewBlock
                title="Simple"
                description="Standalone metrics with directional change."
                code={statsSimpleSource}
                previewClassName="p-6"
              >
                <StatsSimple />
              </PreviewBlock>

              <PreviewBlock
                title="With brand icon"
                description="Adds branded icon treatments for scanability."
                code={statsIconsSource}
                previewClassName="p-6"
              >
                <StatsIcons />
              </PreviewBlock>

              <PreviewBlock
                title="With shared borders"
                description="Connected cards with a single outer container."
                code={statsSharedBordersSource}
                previewClassName="p-6"
              >
                <StatsSharedBorders />
              </PreviewBlock>
            </div>
          </section>

          <section>
            <SectionHeading label="Description Lists" />
            <div className="space-y-4">
              <PreviewBlock
                title="Left aligned"
                description="A simple two-column definition layout."
                code={descriptionListLeftAlignedSource}
                previewClassName="p-6"
              >
                <DescriptionListLeftAligned />
              </PreviewBlock>

              <PreviewBlock
                title="Left aligned in card"
                description="Adds a card shell and strong row dividers."
                code={descriptionListCardSource}
                previewClassName="p-6"
              >
                <DescriptionListCard />
              </PreviewBlock>

              <PreviewBlock
                title="Two column in card"
                description="A denser detail card with paired fields."
                code={descriptionListTwoColumnSource}
                previewClassName="p-6"
              >
                <DescriptionListTwoColumn />
              </PreviewBlock>

              <PreviewBlock
                title="Left aligned striped"
                description="Alternating row fills for easier scanning."
                code={descriptionListStripedSource}
                previewClassName="p-6"
              >
                <DescriptionListStriped />
              </PreviewBlock>
            </div>
          </section>

          <section>
            <SectionHeading label="Calendars" />
            <div className="space-y-4">
              <PreviewBlock
                title="Month view"
                description="January 2022 with event markers and a linked agenda."
                code={calendarMonthSource}
                previewClassName="p-6"
              >
                <CalendarMonth />
              </PreviewBlock>

              <PreviewBlock
                title="Small with meetings"
                description="Compact calendar alongside today's schedule."
                code={calendarSmallWithMeetingsSource}
                previewClassName="p-6"
              >
                <CalendarSmallWithMeetings />
              </PreviewBlock>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/application-ui/data-display/")({
  head: () => createCatalogPageHead("/application-ui/data-display/"),
  component: DataDisplayPage,
});
