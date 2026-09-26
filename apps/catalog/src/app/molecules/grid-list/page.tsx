import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { MoreHorizontal, Mail, Phone } from "lucide-react";
import { GridList, GridListCard, GridListAccentCard } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const PROJECTS = [
  { name: "Graph API", initials: "GA", members: 16, accentClass: "bg-brand-primary", href: "#" },
  {
    name: "Component Design",
    initials: "CD",
    members: 12,
    accentClass: "bg-brand-secondary text-ground-900",
    href: "#",
  },
  {
    name: "Templates",
    initials: "T",
    members: 16,
    accentClass: "bg-brand-secondary text-ground-900",
    href: "#",
  },
  { name: "React Components", initials: "RC", members: 8, accentClass: "bg-ground-900", href: "#" },
];

const CARDS = [
  {
    title: "Graph API",
    description: "REST and GraphQL endpoints for the platform.",
    meta: "Last updated 2 days ago",
    href: "#",
  },
  {
    title: "iOS App",
    description: "Native mobile experience built with SwiftUI.",
    meta: "Last updated 1 week ago",
    href: "#",
  },
  {
    title: "Marketing Site",
    description: "Landing pages and campaign infrastructure.",
    meta: "Last updated yesterday",
    href: "#",
  },
  {
    title: "Design System",
    description: "Reusable UI components and design tokens.",
    meta: "Last updated today",
    href: "#",
  },
  {
    title: "Analytics",
    description: "Event tracking and dashboard reporting.",
    meta: "Last updated 3 days ago",
    href: "#",
  },
  {
    title: "Auth Service",
    description: "OAuth 2.0 and SSO integration layer.",
    meta: "Last updated 5 days ago",
    href: "#",
  },
];

const PEOPLE = [
  {
    name: "Jane Cooper",
    role: "Paradigm Representative",
    email: "jane@example.com",
    phone: "+1-202-555-0170",
    initials: "JC",
    color: "bg-brand-primary",
  },
  {
    name: "Cody Fisher",
    role: "Product Coordinator",
    email: "cody@example.com",
    phone: "+1-202-555-0118",
    initials: "CF",
    color: "bg-brand-secondary",
  },
  {
    name: "Esther Howard",
    role: "Forward Response Developer",
    email: "esther@example.com",
    phone: "+1-202-555-0139",
    initials: "EH",
    color: "bg-brand-secondary",
  },
  {
    name: "Jenny Wilson",
    role: "UX Designer",
    email: "jenny@example.com",
    phone: "+1-202-555-0148",
    initials: "JW",
    color: "bg-ground-900",
  },
];

const CODE = {
  simple: `import { GridList, GridListCard } from "@hilum/ui"

<GridList columns={3}>
  {projects.map((p) => (
    <GridListCard
      key={p.title}
      title={p.title}
      description={p.description}
      meta={p.meta}
      href={p.href}
    />
  ))}
</GridList>`,

  accent: `import { GridList, GridListAccentCard } from "@hilum/ui"

<GridList columns={4}>
  {projects.map((p) => (
    <GridListAccentCard
      key={p.name}
      title={p.name}
      meta={\`\${p.members} members\`}
      initials={p.initials}
      accentClass={p.accentClass}
      href={p.href}
    />
  ))}
</GridList>`,

  contact: `// Contact cards with action buttons
<GridList columns={2}>
  {people.map((p) => (
    <li key={p.email} className="relative ...">
      ...
    </li>
  ))}
</GridList>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function GridListPage() {
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
          <span className="body font-semibold text-foreground">Grid List</span>
        </div>
        <h1 className="display mb-2 text-foreground">Grid List</h1>
        <p className="body max-w-md text-muted-foreground">
          A responsive grid of cards. Supports simple content cards, accent-strip cards with
          initials, and custom contact card layouts.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-5">
          <p className="caption text-muted-foreground">Molecule</p>
          <div className="h-3 w-px bg-border" />
          <p className="caption text-muted-foreground">Card · Badge · Avatar</p>
        </div>
      </div>

      <PageDocs path="/molecules/grid-list/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Grid List · Simple cards" />
          <PreviewBlock
            title="3-column cards"
            description="Title, description, and meta"
            code={CODE.simple}
            previewClassName="items-start"
          >
            <div className="w-full">
              <GridList columns={3}>
                {CARDS.map((c) => (
                  <GridListCard
                    key={c.title}
                    title={c.title}
                    description={c.description}
                    meta={c.meta}
                    href={c.href}
                  />
                ))}
              </GridList>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Grid List · Accent cards" />
          <PreviewBlock
            title="Colored accent strip"
            description="Initials + title + member count"
            code={CODE.accent}
            previewClassName="items-start"
          >
            <div className="w-full">
              <GridList columns={4}>
                {PROJECTS.map((p) => (
                  <GridListAccentCard
                    key={p.name}
                    title={p.name}
                    meta={`${p.members} members`}
                    initials={p.initials}
                    accentClass={p.accentClass}
                    href={p.href}
                    trailing={
                      <Button variant="ghost" size="sm" className="size-7 p-0 text-muted-foreground">
                        <MoreHorizontal size={14} />
                      </Button>
                    }
                  />
                ))}
              </GridList>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Grid List · Contact cards" />
          <PreviewBlock
            title="People cards with actions"
            description="Photo, role, and contact buttons"
            code={CODE.contact}
            previewClassName="items-start"
          >
            <div className="w-full">
              <GridList columns={2}>
                {PEOPLE.map((p) => (
                  <li
                    key={p.email}
                    className="col-span-1 flex flex-col divide-y divide-border rounded-xl border border-border bg-background shadow-natural overflow-hidden"
                  >
                    <div className="flex flex-1 flex-col items-center p-6 text-center gap-2">
                      <div
                        className={`flex size-16 items-center justify-center rounded-full heading font-semibold text-white ${p.color}`}
                      >
                        {p.initials}
                      </div>
                      <p className="body font-semibold text-foreground">{p.name}</p>
                      <p className="caption text-muted-foreground">{p.role}</p>
                    </div>
                    <div className="flex divide-x divide-border">
                      <a
                        href={`mailto:${p.email}`}
                        className="flex flex-1 items-center justify-center gap-1.5 py-3 body text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Mail size={14} /> Email
                      </a>
                      <a
                        href={`tel:${p.phone}`}
                        className="flex flex-1 items-center justify-center gap-1.5 py-3 body text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Phone size={14} /> Call
                      </a>
                    </div>
                  </li>
                ))}
              </GridList>
            </div>
          </PreviewBlock>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/grid-list/")({
  head: () => createCatalogPageHead("/molecules/grid-list/"),
  component: GridListPage,
});
