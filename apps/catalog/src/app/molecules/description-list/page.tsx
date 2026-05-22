import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { DescriptionList } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { DescriptionList } from "@hilum/ui"

<DescriptionList
  title="Applicant Information"
  description="Personal details and application."
  items={[
    { term: "Full name", details: "Margot Foster" },
    { term: "Role", details: "Backend Developer" },
    { term: "Email", details: "margot@example.com" },
    { term: "Salary", details: "$120,000" },
  ]}
/>`,

  withAction: `import { DescriptionList } from "@hilum/ui"
import { Button } from "@hilum/ui"
import { Badge } from "@hilum/ui"

<DescriptionList
  items={[
    { term: "Status", details: <Badge variant="secondary">Active</Badge> },
    { term: "Plan", details: "Pro", action: <Button size="sm" variant="outline">Upgrade</Button> },
    { term: "Members", details: "12 / 50" },
  ]}
/>`,

  twoColumn: `import { DescriptionList } from "@hilum/ui"

<DescriptionList
  items={items}
  columns={2}
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

function DescriptionListPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Description List</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Description List</h1>
        <p className="body max-w-md text-ground-400">
          Key–value pairs for displaying structured details. Common in profile pages, settings panels, and data cards.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Badge · Button</p>
        </div>
      </div>

      <PageDocs path="/molecules/description-list/" />

      <div className="flex flex-col gap-10">

        <div>
          <SectionHeading label="Description List · Basic" />
          <PreviewBlock title="Default" description="Term-detail pairs with a header" code={CODE.basic}>
            <div className="w-full max-w-lg">
              <DescriptionList
                title="Applicant Information"
                description="Personal details and application."
                items={[
                  { term: "Full name", details: "Margot Foster" },
                  { term: "Role", details: "Backend Developer" },
                  { term: "Email", details: "margot@example.com" },
                  { term: "Salary", details: "$120,000" },
                ]}
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Description List · With actions" />
          <PreviewBlock title="Inline actions" description="Each row can carry an action" code={CODE.withAction}>
            <div className="w-full max-w-lg">
              <DescriptionList
                items={[
                  { term: "Status", details: <Badge variant="secondary">Active</Badge> },
                  {
                    term: "Plan",
                    details: "Pro · $49/mo",
                    action: <Button size="sm" variant="outline">Upgrade</Button>,
                  },
                  { term: "Members", details: "12 / 50" },
                  { term: "Storage", details: "8.4 GB / 100 GB" },
                ]}
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Description List · Two columns" />
          <PreviewBlock title="2-column layout" description="For wide panels with many fields" code={CODE.twoColumn}>
            <div className="w-full max-w-2xl">
              <DescriptionList
                columns={2}
                items={[
                  { term: "First name", details: "Margot" },
                  { term: "Last name", details: "Foster" },
                  { term: "Email", details: "margot@example.com" },
                  { term: "Phone", details: "+1 555 012 4567" },
                  { term: "Location", details: "San Francisco, CA" },
                  { term: "Department", details: "Engineering" },
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

export const Route = createFileRoute("/molecules/description-list/")({
  head: () => createCatalogPageHead("/molecules/description-list/"),
  component: DescriptionListPage,
});
