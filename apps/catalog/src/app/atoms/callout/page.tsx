import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Button, Callout } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  tones: `import { Callout } from "@hilum/ui"
import { AlertTriangle, CheckCircle2, Info } from "lucide-react"

<Callout
  tone="info"
  icon={<Info aria-hidden="true" />}
  title="Review recommended"
  description="This workflow has unsaved changes in two sections."
/>
<Callout
  tone="success"
  icon={<CheckCircle2 aria-hidden="true" />}
  title="Import complete"
  description="148 records were added to the workspace."
/>
<Callout
  tone="warning"
  icon={<AlertTriangle aria-hidden="true" />}
  title="Redirect required"
  description="The public URL changed. Create a redirect before publishing."
/>`,

  actions: `import { Button, Callout } from "@hilum/ui"
import { AlertTriangle } from "lucide-react"

<Callout
  tone="warning"
  icon={<AlertTriangle aria-hidden="true" />}
  title="Resolve duplicate slugs"
  description="Two products share the same public handle."
  actions={
    <>
      <Button size="sm">Review</Button>
      <Button size="sm" variant="outline">Dismiss</Button>
    </>
  }
/>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function CalloutPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Callout</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Callout</h1>
        <p className="body max-w-lg text-ground-500">
          Prominent status or guidance panel with icon, actions, and semantic tone.
        </p>
      </div>

      <PageDocs path="/atoms/callout/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Tones" />
          <PreviewBlock
            title="Semantic tones"
            description="Status, success, and warning panels with matching icon treatment."
            code={CODE.tones}
            previewClassName="flex-col items-stretch"
          >
            <div className="flex w-full max-w-xl flex-col gap-3">
              <Callout
                tone="info"
                icon={<Info aria-hidden="true" />}
                title="Review recommended"
                description="This workflow has unsaved changes in two sections."
              />
              <Callout
                tone="success"
                icon={<CheckCircle2 aria-hidden="true" />}
                title="Import complete"
                description="148 records were added to the workspace."
              />
              <Callout
                tone="warning"
                icon={<AlertTriangle aria-hidden="true" />}
                title="Redirect required"
                description="The public URL changed. Create a redirect before publishing."
              />
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Actions" />
          <PreviewBlock
            title="With actions"
            description="Use actions when the callout is recoverable or needs a decision."
            code={CODE.actions}
            previewClassName="flex-col items-stretch"
          >
            <Callout
              tone="warning"
              icon={<AlertTriangle aria-hidden="true" />}
              title="Resolve duplicate slugs"
              description="Two products share the same public handle."
              actions={
                <>
                  <Button size="sm">Review</Button>
                  <Button size="sm" variant="outline">
                    Dismiss
                  </Button>
                </>
              }
            />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/callout/")({
  head: () => createCatalogPageHead("/atoms/callout/"),
  component: CalloutPage,
});
