import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { useState } from "react";
import { SortableList, SortableItem, SortableHandle, Badge } from "@hilum/ui";

type MenuLink = { id: string; label: string; url: string };

const INITIAL: MenuLink[] = [
  { id: "home", label: "Home", url: "/" },
  { id: "catalog", label: "Catalog", url: "/collections/all" },
  { id: "sale", label: "Sale", url: "/collections/sale" },
  { id: "about", label: "About us", url: "/pages/about" },
  { id: "contact", label: "Contact", url: "/pages/contact" },
];

const LIST_CODE = `import { SortableList, SortableItem, SortableHandle } from "@hilum/ui"

<SortableList
  aria-label="Main menu"
  items={links}
  getItemId={(link) => link.id}
  getItemLabel={(link) => link.label}   // used in announcements
  onReorder={setLinks}
>
  {(link) => (
    <SortableItem id={link.id} handle>
      <SortableHandle />
      <span className="flex-1">{link.label}</span>
      <span className="caption text-muted-foreground">{link.url}</span>
    </SortableItem>
  )}
</SortableList>`;

function ListDemo() {
  const [links, setLinks] = useState(INITIAL);
  return (
    <div className="w-full max-w-md">
      <SortableList
        aria-label="Main menu"
        items={links}
        getItemId={(link) => link.id}
        getItemLabel={(link) => link.label}
        onReorder={setLinks}
      >
        {(link) => (
          <SortableItem id={link.id} handle>
            <SortableHandle />
            <span className="body flex-1 text-foreground">{link.label}</span>
            <span className="caption text-muted-foreground">{link.url}</span>
          </SortableItem>
        )}
      </SortableList>
    </div>
  );
}

const HORIZONTAL_CODE = `<SortableList
  orientation="horizontal"
  items={tags}
  getItemId={(tag) => tag}
  onReorder={setTags}
>
  {(tag) => <SortableItem id={tag}>{tag}</SortableItem>}   // whole item is the drag target
</SortableList>`;

function HorizontalDemo() {
  const [tags, setTags] = useState(["Summer", "Linen", "Bestseller", "New", "Eco"]);
  return (
    <SortableList
      aria-label="Tag priority"
      orientation="horizontal"
      items={tags}
      getItemId={(tag) => tag}
      onReorder={setTags}
    >
      {(tag, index) => (
        <SortableItem id={tag} className="py-1.5">
          <Badge variant="outline">{index + 1}</Badge>
          <span className="body-sm">{tag}</span>
        </SortableItem>
      )}
    </SortableList>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SortablePage() {
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
          <span className="font-semibold text-foreground">Sortable</span>
        </div>
        <h1 className="display mb-2 text-foreground">Sortable</h1>
        <p className="body max-w-lg text-muted-foreground">
          Drag-and-drop reordering on dnd-kit with pointer, touch and keyboard support. Screen
          readers hear localized pick-up, move and drop announcements.
        </p>
      </div>

      <PageDocs path="/molecules/sortable/" />

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Vertical list with handles" />
          <PreviewBlock
            title="Navigation menu"
            description="Drag the grip, or focus it and press Space, then arrow keys, then Space to drop."
            code={LIST_CODE}
            previewClassName="flex-col items-stretch"
          >
            <ListDemo />
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Horizontal" />
          <PreviewBlock
            title="Tag priority"
            description="Without handle, the whole item is the drag target."
            code={HORIZONTAL_CODE}
            previewClassName="flex-col items-stretch"
          >
            <HorizontalDemo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/sortable/")({
  head: () => createCatalogPageHead("/molecules/sortable/"),
  component: SortablePage,
});
