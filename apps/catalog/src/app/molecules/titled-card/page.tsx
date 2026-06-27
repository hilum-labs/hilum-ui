import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { BarChart3, Plus } from "lucide-react";
import { Button, StatusBadge, TitledCard } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  card: `import { Button, TitledCard } from "@hilum/ui"
import { BarChart3, Plus } from "lucide-react"

<TitledCard
  title="Campaign performance"
  subtitle="Live metrics from active acquisition campaigns."
  icon={BarChart3}
  actionButtons={<Button size="sm"><Plus /> New report</Button>}
>
  <div>Card content</div>
</TitledCard>`,

  simple: `<TitledCard title="Publishing checklist" subtitle="Required before launch.">
  <ul>
    <li>SEO metadata completed</li>
    <li>Redirects confirmed</li>
  </ul>
</TitledCard>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function TitledCardPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Titled Card</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Titled Card</h1>
        <p className="body max-w-lg text-ground-500">
          Responsive card wrapper with title, subtitle, actions, and mobile-flattened layout.
        </p>
      </div>

      <PageDocs path="/molecules/titled-card/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Panel" />
          <PreviewBlock
            title="Header with actions"
            description="Use when a panel needs a consistent title area and responsive action row."
            code={CODE.card}
            previewClassName="flex-col items-stretch"
          >
            <TitledCard
              title="Campaign performance"
              subtitle="Live metrics from active acquisition campaigns."
              icon={BarChart3}
              actionButtons={
                <Button size="sm">
                  <Plus className="size-4" aria-hidden="true" />
                  New report
                </Button>
              }
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="caption text-ground-400">Revenue</p>
                  <p className="heading text-ground-900">$84.2k</p>
                </div>
                <div>
                  <p className="caption text-ground-400">Conversion</p>
                  <p className="heading text-ground-900">7.8%</p>
                </div>
                <div>
                  <p className="caption text-ground-400">State</p>
                  <StatusBadge status="active" showDot />
                </div>
              </div>
            </TitledCard>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Simple" />
          <PreviewBlock
            title="Content card"
            description="When there are no actions, TitledCard uses the lighter CardHeading treatment."
            code={CODE.simple}
            previewClassName="flex-col items-stretch"
          >
            <TitledCard title="Publishing checklist" subtitle="Required before launch.">
              <ul className="body list-disc space-y-1 pl-5 text-ground-600">
                <li>SEO metadata completed</li>
                <li>Redirects confirmed</li>
                <li>Preview approved by the brand team</li>
              </ul>
            </TitledCard>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/titled-card/")({
  head: () => createCatalogPageHead("/molecules/titled-card/"),
  component: TitledCardPage,
});
