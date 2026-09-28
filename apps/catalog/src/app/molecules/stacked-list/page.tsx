import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { ChevronRight } from "lucide-react";
import { StackedList, StackedListItem } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { StackedList, StackedListItem } from "@hilum/ui"

<StackedList>
  <StackedListItem href="#">
    <p className="body font-medium text-foreground">Ricardo Cooper</p>
    <p className="caption text-muted-foreground">Backend Developer</p>
  </StackedListItem>
  <StackedListItem href="#">
    <p className="body font-medium text-foreground">Kristen Ramos</p>
    <p className="caption text-muted-foreground">Product Manager</p>
  </StackedListItem>
</StackedList>`,

  withAvatar: `import { StackedList, StackedListItem } from "@hilum/ui"

<StackedList>
  {people.map((person) => (
    <StackedListItem key={person.email} href="#">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white body font-medium">
          {person.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="body font-semibold text-foreground truncate">{person.name}</p>
          <p className="caption text-muted-foreground truncate">{person.email}</p>
        </div>
        <ChevronRight size={14} className="shrink-0 text-muted-foreground/70" />
      </div>
    </StackedListItem>
  ))}
</StackedList>`,

  twoColumn: `import { StackedList, StackedListItem } from "@hilum/ui"

<StackedList>
  {applications.map((app) => (
    <StackedListItem key={app.id} href="#">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="body font-semibold text-foreground">{app.name}</p>
          <p className="caption text-muted-foreground">{app.stage}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{app.date}</Badge>
          <ChevronRight size={14} className="text-muted-foreground/70" />
        </div>
      </div>
    </StackedListItem>
  ))}
</StackedList>`,
};

const PEOPLE = [
  {
    name: "Ricardo Cooper",
    email: "ricardo.cooper@example.com",
    initials: "RC",
    stage: "Completed phone screening",
    date: "Jan 7",
  },
  {
    name: "Kristen Ramos",
    email: "kristen.ramos@example.com",
    initials: "KR",
    stage: "Interview scheduled",
    date: "Jan 9",
  },
  {
    name: "Ted Fox",
    email: "ted.fox@example.com",
    initials: "TF",
    stage: "Offer sent",
    date: "Jan 12",
  },
];

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function StackedListPage() {
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
          <span className="body font-semibold text-foreground">Stacked List</span>
        </div>
        <h1 className="display mb-2 text-foreground">Stacked List</h1>
        <p className="body max-w-md text-muted-foreground">
          A vertically stacked list of rows, each with consistent padding and optional hover/link
          behavior. The composition of StackedList and StackedListItem.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-5">
          <p className="caption text-muted-foreground">Molecule</p>
          <div className="h-3 w-px bg-border" />
          <p className="caption text-muted-foreground">Badge · Avatar</p>
        </div>
      </div>

      <PageDocs path="/molecules/stacked-list/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Stacked List · Basic" />
          <PreviewBlock
            title="Simple rows"
            description="Name and description per row"
            code={CODE.basic}
            previewClassName="items-start"
          >
            <div className="w-full max-w-sm">
              <StackedList>
                {PEOPLE.map((p) => (
                  <StackedListItem key={p.email} href="#">
                    <p className="body font-medium text-foreground">{p.name}</p>
                    <p className="caption text-muted-foreground">{p.email}</p>
                  </StackedListItem>
                ))}
              </StackedList>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Stacked List · With avatar" />
          <PreviewBlock
            title="Avatar + name + email"
            description="Each row has an inline avatar and meta"
            code={CODE.withAvatar}
            previewClassName="items-start"
          >
            <div className="w-full max-w-sm">
              <StackedList>
                {PEOPLE.map((p) => (
                  <StackedListItem key={p.email} href="#">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white body font-medium">
                        {p.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="body font-semibold text-foreground truncate">{p.name}</p>
                        <p className="caption text-muted-foreground truncate">{p.email}</p>
                      </div>
                      <ChevronRight size={14} className="shrink-0 text-muted-foreground/70" />
                    </div>
                  </StackedListItem>
                ))}
              </StackedList>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Stacked List · Two column" />
          <PreviewBlock
            title="Content + meta on right"
            description="Dates, badges, or statuses on the right side"
            code={CODE.twoColumn}
            previewClassName="items-start"
          >
            <div className="w-full max-w-sm">
              <StackedList>
                {PEOPLE.map((p) => (
                  <StackedListItem key={p.email} href="#">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="body font-semibold text-foreground truncate">{p.name}</p>
                        <p className="caption text-muted-foreground">{p.stage}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant="secondary">{p.date}</Badge>
                        <ChevronRight size={14} className="text-muted-foreground/70" />
                      </div>
                    </div>
                  </StackedListItem>
                ))}
              </StackedList>
            </div>
          </PreviewBlock>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/stacked-list/")({
  head: () => createCatalogPageHead("/molecules/stacked-list/"),
  component: StackedListPage,
});
