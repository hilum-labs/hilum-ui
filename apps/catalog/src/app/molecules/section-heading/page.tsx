import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { SectionHeading } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { SectionHeading } from "@hilum/ui"

<SectionHeading title="Job Postings" />`,

  withAction: `import { SectionHeading } from "@hilum/ui"

<SectionHeading
  title="Job Postings"
  actions={[{ label: "Create new job" }]}
/>`,

  withDescription: `import { SectionHeading } from "@hilum/ui"

<SectionHeading
  title="Team members"
  description="Manage who has access to this project."
  actions={[
    { label: "Export", variant: "outline" },
    { label: "Invite", variant: "default" },
  ]}
/>`,

  noBorder: `import { SectionHeading } from "@hilum/ui"

<SectionHeading
  title="Recent activity"
  border={false}
/>`,
};

function SectionHdg({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function SectionHeadingPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Section Heading</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Section Heading</h1>
        <p className="body max-w-md text-ground-400">
          A content section header with optional description and action buttons. Used above lists, tables, and card grids.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Button</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">

        <div>
          <SectionHdg label="Section Heading · Basic" />
          <PreviewBlock title="Default" description="Title only with divider" code={CODE.basic}>
            <div className="w-full max-w-lg">
              <SectionHeading title="Job Postings" />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHdg label="Section Heading · With action" />
          <PreviewBlock title="Single action" description="Primary CTA on the right" code={CODE.withAction}>
            <div className="w-full max-w-lg">
              <SectionHeading
                title="Job Postings"
                actions={[{ label: "Create new job" }]}
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHdg label="Section Heading · With description" />
          <PreviewBlock title="Title + description + actions" description="Full composition" code={CODE.withDescription}>
            <div className="w-full max-w-lg">
              <SectionHeading
                title="Team members"
                description="Manage who has access to this project."
                actions={[
                  { label: "Export", variant: "outline" },
                  { label: "Invite member", variant: "default" },
                ]}
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHdg label="Section Heading · No border" />
          <PreviewBlock title="borderless" description="Without the bottom divider" code={CODE.noBorder}>
            <div className="w-full max-w-lg">
              <SectionHeading
                title="Recent activity"
                border={false}
                actions={[{ label: "View all", variant: "ghost" }]}
              />
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/section-heading/")({
  head: () => createCatalogPageHead("/molecules/section-heading/"),
  component: SectionHeadingPage,
});
