import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Calendar, MapPin, Briefcase } from "lucide-react";
import { PageHeading } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { PageHeading } from "@hilum/ui"

<PageHeading title="Back End Developer" />`,

  withBreadcrumbs: `import { PageHeading } from "@hilum/ui"

<PageHeading
  title="Back End Developer"
  breadcrumbs={[
    { label: "Jobs", href: "/jobs" },
    { label: "Engineering", href: "/jobs/engineering" },
    { label: "Back End Developer" },
  ]}
  actions={[
    { label: "Edit", variant: "outline" },
    { label: "Publish", primary: true },
  ]}
/>`,

  withMeta: `import { PageHeading } from "@hilum/ui"
import { Calendar, MapPin, Briefcase } from "lucide-react"

<PageHeading
  title="Back End Developer"
  badge="New"
  description="We're hiring a backend engineer to join our platform team."
  breadcrumbs={[{ label: "Jobs", href: "/jobs" }, { label: "Back End Developer" }]}
  meta={[
    { icon: <Briefcase size={13} />, text: "Full-time" },
    { icon: <MapPin size={13} />, text: "Remote" },
    { icon: <Calendar size={13} />, text: "Closes Jan 20" },
  ]}
  actions={[
    { label: "Share", variant: "outline" },
    { label: "Apply now", primary: true },
  ]}
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

function PageHeadingPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Page Heading</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Page Heading</h1>
        <p className="body max-w-md text-ground-400">
          A full page header with breadcrumb navigation, title, optional description and metadata, and action buttons.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Button · Badge · Breadcrumb</p>
        </div>
      </div>

      <PageDocs path="/molecules/page-heading/" />

      <div className="flex flex-col gap-10">

        <div>
          <SectionHeading label="Page Heading · Basic" />
          <PreviewBlock title="Title only" description="Minimal form with just a title" code={CODE.basic}>
            <div className="w-full max-w-2xl">
              <PageHeading title="Back End Developer" />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Page Heading · With breadcrumbs" />
          <PreviewBlock title="Breadcrumbs + actions" description="Location trail and page-level CTAs" code={CODE.withBreadcrumbs}>
            <div className="w-full max-w-2xl">
              <PageHeading
                title="Back End Developer"
                breadcrumbs={[
                  { label: "Jobs", href: "#" },
                  { label: "Engineering", href: "#" },
                  { label: "Back End Developer" },
                ]}
                actions={[
                  { label: "Edit", variant: "outline" },
                  { label: "Publish", primary: true },
                ]}
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Page Heading · Full" />
          <PreviewBlock title="With meta, badge & description" description="Full composition" code={CODE.withMeta} previewClassName="items-start">
            <div className="w-full max-w-2xl">
              <PageHeading
                title="Back End Developer"
                badge="New"
                description="We're looking for a backend engineer to help build and scale our core platform."
                breadcrumbs={[
                  { label: "Jobs", href: "#" },
                  { label: "Back End Developer" },
                ]}
                meta={[
                  { icon: <Briefcase size={13} />, text: "Full-time" },
                  { icon: <MapPin size={13} />, text: "Remote" },
                  { icon: <Calendar size={13} />, text: "Closes Jan 20" },
                ]}
                actions={[
                  { label: "Share", variant: "outline" },
                  { label: "Apply now", primary: true },
                ]}
              />
            </div>
          </PreviewBlock>
        </div>

      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/page-heading/")({
  head: () => createCatalogPageHead("/molecules/page-heading/"),
  component: PageHeadingPage,
});
