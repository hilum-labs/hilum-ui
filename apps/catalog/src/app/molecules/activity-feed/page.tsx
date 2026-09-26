import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { User, ThumbsUp, Check, MessageSquare, FileText, Tag } from "lucide-react";
import { ActivityFeed } from "@hilum/ui";
import type { FeedEvent } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const EVENTS: FeedEvent[] = [
  {
    id: 1,
    content: (
      <span>
        Applied to{" "}
        <a href="#" className="font-semibold text-foreground">
          Front End Developer
        </a>
      </span>
    ),
    date: "Sep 20",
    datetime: "2024-09-20",
    icon: <User size={14} />,
    iconBgClass: "bg-ground-200 text-ground-600",
  },
  {
    id: 2,
    content: (
      <span>
        Advanced to phone screening by{" "}
        <a href="#" className="font-semibold text-foreground">
          Bethany Blake
        </a>
      </span>
    ),
    date: "Sep 22",
    datetime: "2024-09-22",
    icon: <ThumbsUp size={14} />,
    iconBgClass: "bg-brand-secondary text-ground-900",
  },
  {
    id: 3,
    content: (
      <span>
        Phone screening completed with{" "}
        <a href="#" className="font-semibold text-foreground">
          Martha Gardner
        </a>
      </span>
    ),
    date: "Sep 28",
    datetime: "2024-09-28",
    icon: <Check size={14} />,
    iconBgClass: "bg-brand-secondary text-ground-900",
  },
  {
    id: 4,
    content: (
      <span>
        Comment left by{" "}
        <a href="#" className="font-semibold text-foreground">
          Tom Cook
        </a>{" "}
        — "Strong candidate, move forward."
      </span>
    ),
    date: "Sep 30",
    datetime: "2024-09-30",
    icon: <MessageSquare size={14} />,
    iconBgClass: "bg-ground-200 text-ground-600",
  },
  {
    id: 5,
    content: (
      <span>
        Offer letter sent by{" "}
        <a href="#" className="font-semibold text-foreground">
          HR Team
        </a>
      </span>
    ),
    date: "Oct 4",
    datetime: "2024-10-04",
    icon: <FileText size={14} />,
    iconBgClass: "bg-brand-primary text-white",
  },
];

const CODE = {
  basic: `import { ActivityFeed } from "@hilum/ui"
import type { FeedEvent } from "@hilum/ui"
import { User, Check } from "lucide-react"

const events: FeedEvent[] = [
  {
    id: 1,
    content: <span>Applied to <a className="font-semibold text-foreground">Front End Developer</a></span>,
    date: "Sep 20",
    icon: <User size={14} />,
    iconBgClass: "bg-ground-200 text-ground-600",
  },
  {
    id: 2,
    content: <span>Phone screening completed with <a className="font-semibold text-foreground">Martha</a></span>,
    date: "Sep 28",
    icon: <Check size={14} />,
    iconBgClass: "bg-brand-secondary text-ground-900",
  },
]

<ActivityFeed events={events} />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ActivityFeedPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-foreground">
            Molecules
          </a>
          <span>/</span>
          <span className="body font-semibold text-foreground">Activity Feed</span>
        </div>
        <h1 className="display mb-2 text-foreground">Activity Feed</h1>
        <p className="body max-w-md text-muted-foreground">
          A vertical timeline of events. Each item has an icon, rich content, and an optional
          timestamp. Common in audit logs, changelogs, and pipelines.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-5">
          <p className="caption text-muted-foreground">Molecule</p>
          <div className="h-3 w-px bg-border" />
          <p className="caption text-muted-foreground">Icon</p>
        </div>
      </div>

      <PageDocs path="/molecules/activity-feed/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Activity Feed · Basic" />
          <PreviewBlock
            title="Timeline with icons"
            description="Events with colored icon badges and timestamps"
            code={CODE.basic}
            previewClassName="items-start"
          >
            <div className="w-full max-w-md">
              <ActivityFeed events={EVENTS} />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Activity Feed · In context" />
          <PreviewBlock
            title="Inside a panel"
            description="Embedded in a bordered container"
            code={CODE.basic}
            previewClassName="items-start"
          >
            <div className="w-full max-w-md rounded-xl border border-border p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="body font-semibold text-foreground">Activity</p>
                <a href="#" className="caption text-muted-foreground hover:text-foreground">
                  View all
                </a>
              </div>
              <ActivityFeed events={EVENTS.slice(0, 3)} />
            </div>
          </PreviewBlock>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/activity-feed/")({
  head: () => createCatalogPageHead("/molecules/activity-feed/"),
  component: ActivityFeedPage,
});
