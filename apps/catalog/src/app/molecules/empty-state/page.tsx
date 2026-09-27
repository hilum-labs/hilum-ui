import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { FileX, Inbox, Search, Users, FolderOpen } from "lucide-react";
import { EmptyState } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { Package } from "lucide-react";

const CODE = {
  basic: `import { EmptyState } from "@hilum/ui"
import { Inbox } from "lucide-react"

<EmptyState
  icon={<Inbox size={20} />}
  title="No messages yet"
  description="When you receive messages, they'll appear here."
/>`,

  action: `import { EmptyState } from "@hilum/ui"
import { Users } from "lucide-react"

<EmptyState
  icon={<Users size={20} />}
  title="No team members"
  description="Invite people to collaborate on this project."
  action={{ label: "Invite members", href: "/invite" }}
/>`,

  noIcon: `import { EmptyState } from "@hilum/ui"

<EmptyState
  title="Nothing here yet"
  description="Add your first item to get started."
  action={{ label: "Add item" }}
/>`,

  search: `import { EmptyState } from "@hilum/ui"
import { Search } from "lucide-react"

<EmptyState
  icon={<Search size={20} />}
  title="No results found"
  description={'Nothing matched "design tokens". Try a different search.'}
/>`,

  inContext: `import { EmptyState } from "@hilum/ui"
import { FolderOpen } from "lucide-react"

// Inside a bordered container
<div className="rounded-xl border border-border">
  <EmptyState
    icon={<FolderOpen size={20} />}
    title="This folder is empty"
    description="Upload files or create a new document to get started."
    action={{ label: "Upload files" }}
  />
</div>`,
};

const CTA_CODE = `import { EmptyState } from "@hilum/ui"

// First-run empty states always get a primary action.
<EmptyState
  variant="card"
  icon={<Package size={16} />}
  title="Add your first product"
  description="Products you add appear here and in your online store."
  action={{ label: "Add product", href: "/products/new" }}
  secondaryAction={{ label: "Import CSV", onClick: openImport }}
/>

// Router links: pass an element.
<EmptyState title="No discounts" action={<Button asChild><Link to="/discounts/new">Create discount</Link></Button>} />`;


function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function EmptyStatePage() {
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
          <span className="body font-semibold text-foreground">Empty State</span>
        </div>
        <h1 className="display mb-2 text-foreground">Empty State</h1>
        <p className="body max-w-md text-muted-foreground">
          A placeholder for empty lists, zero-data views, and no-results scenarios. Composes an
          icon, heading, description, and optional CTA.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-5">
          <p className="caption text-muted-foreground">Molecule</p>
          <div className="h-3 w-px bg-border" />
          <p className="caption text-muted-foreground">Button · Icon</p>
        </div>
      </div>

      <PageDocs path="/molecules/empty-state/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Empty State · Basic" />
          <PreviewBlock
            title="Icon + description"
            description="The standard form"
            code={CODE.basic}
          >
            <div className="w-full max-w-sm">
              <EmptyState
                icon={<Inbox size={20} />}
                title="No messages yet"
                description="When you receive messages, they'll appear here."
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Empty State · With action" />
          <PreviewBlock
            title="CTA button"
            description="Guides users to the next step"
            code={CODE.action}
          >
            <div className="w-full max-w-sm">
              <EmptyState
                icon={<Users size={20} />}
                title="No team members"
                description="Invite people to collaborate on this project."
                action={{ label: "Invite members", href: "#" }}
              />
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Empty State · Variants" />
          <div className="flex flex-col gap-3">
            <PreviewBlock title="No icon" description="Text-only, minimal" code={CODE.noIcon}>
              <div className="w-full max-w-sm">
                <EmptyState
                  title="Nothing here yet"
                  description="Add your first item to get started."
                  action={{ label: "Add item" }}
                />
              </div>
            </PreviewBlock>
            <PreviewBlock
              title="Search · no results"
              description="For filtered/search empty states"
              code={CODE.search}
            >
              <div className="w-full max-w-sm">
                <EmptyState
                  icon={<Search size={20} />}
                  title="No results found"
                  description='Nothing matched "design tokens". Try a different search.'
                />
              </div>
            </PreviewBlock>
          </div>
        </div>

        <div>
          <SectionHeading label="Empty State · In context" />
          <PreviewBlock
            title="Inside a container"
            description="Dropped into a bordered panel or table"
            code={CODE.inContext}
          >
            <div className="w-full max-w-sm">
              <div className="rounded-xl border border-border">
                <EmptyState
                  icon={<FolderOpen size={20} />}
                  title="This folder is empty"
                  description="Upload files or create a new document to get started."
                  action={{ label: "Upload files" }}
                />
              </div>
            </div>
          </PreviewBlock>
        </div>
        <section className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="label text-muted-foreground">Primary + secondary actions</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
          <PreviewBlock
            title="First-run empty state"
            description="Every first-run state needs a CTA; filtered-empty states offer Clear filters."
            code={CTA_CODE}
          >
            <div className="w-full max-w-lg">
              <EmptyState
                variant="card"
                icon={<Package size={16} />}
                title="Add your first product"
                description="Products you add appear here and in your online store."
                action={{ label: "Add product", href: "#" }}
                secondaryAction={{ label: "Import CSV", href: "#" }}
              />
            </div>
          </PreviewBlock>
        </section>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/empty-state/")({
  head: () => createCatalogPageHead("/molecules/empty-state/"),
  component: EmptyStatePage,
});
