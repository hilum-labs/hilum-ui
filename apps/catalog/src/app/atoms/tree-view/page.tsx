import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { useState } from "react";
import { Folder, FileText } from "lucide-react";
import { TreeView, type TreeNode } from "@hilum/ui";

const CATEGORIES: TreeNode[] = [
  {
    id: "apparel",
    label: "Apparel",
    icon: <Folder />,
    children: [
      { id: "shirts", label: "Shirts", icon: <FileText /> },
      { id: "pants", label: "Pants", icon: <FileText /> },
      {
        id: "outerwear",
        label: "Outerwear",
        icon: <Folder />,
        children: [
          { id: "jackets", label: "Jackets", icon: <FileText /> },
          { id: "coats", label: "Coats", icon: <FileText /> },
        ],
      },
    ],
  },
  {
    id: "home",
    label: "Home & garden",
    icon: <Folder />,
    children: [
      { id: "kitchen", label: "Kitchen", icon: <FileText /> },
      { id: "decor", label: "Decor", icon: <FileText /> },
    ],
  },
  { id: "gift-cards", label: "Gift cards", icon: <FileText /> },
];

const SINGLE_CODE = `import { TreeView, type TreeNode } from "@hilum/ui"

const [selected, setSelected] = useState<string[]>(["shirts"])

<TreeView
  aria-label="Product categories"
  items={categories}
  defaultExpanded={["apparel"]}
  selected={selected}
  onSelectedChange={setSelected}
  onAction={(node) => navigate(\`/collections/\${node.id}\`)}
/>`;

function SingleDemo() {
  const [selected, setSelected] = useState<string[]>(["shirts"]);
  return (
    <div className="w-full max-w-sm">
      <TreeView
        aria-label="Product categories"
        items={CATEGORIES}
        defaultExpanded={["apparel"]}
        selected={selected}
        onSelectedChange={setSelected}
      />
      <p className="caption mt-3 text-muted-foreground">
        Selected: {selected.join(", ") || "none"}
      </p>
    </div>
  );
}

const CHECKBOX_CODE = `<TreeView
  aria-label="Sales channels"
  items={categories}
  checkboxes                 // multiple selection; parents show a mixed state
  defaultExpanded={["apparel", "outerwear"]}
  onSelectedChange={setChecked}
/>`;

function CheckboxDemo() {
  const [checked, setChecked] = useState<string[]>(["jackets"]);
  return (
    <div className="w-full max-w-sm">
      <TreeView
        aria-label="Categories to publish"
        items={CATEGORIES}
        checkboxes
        defaultExpanded={["apparel", "outerwear"]}
        selected={checked}
        onSelectedChange={setChecked}
      />
      <p className="caption mt-3 text-muted-foreground">{checked.length} checked</p>
    </div>
  );
}

const LAZY_CODE = `<TreeView
  aria-label="Folders"
  items={[{ id: "root", label: "Media library", hasChildren: true }]}
  loadChildren={async (node) => fetchFolders(node.id)}   // called once per node
/>`;

function LazyDemo() {
  return (
    <div className="w-full max-w-sm">
      <TreeView
        aria-label="Folders"
        items={[{ id: "root", label: "Media library", icon: <Folder />, hasChildren: true }]}
        loadChildren={(node) =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve(
                  ["Banners", "Products", "Campaigns"].map((name) => ({
                    id: `${node.id}/${name}`,
                    label: name,
                    icon: <Folder />,
                    hasChildren: true,
                  })),
                ),
              700,
            ),
          )
        }
      />
    </div>
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

function TreeViewPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-foreground">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Tree View</span>
        </div>
        <h1 className="display mb-2 text-foreground">Tree View</h1>
        <p className="body max-w-lg text-muted-foreground">
          Hierarchical list following the WAI-ARIA tree pattern: arrow keys, Home/End, typeahead, *
          to expand siblings, single or multiple selection, tri-state checkboxes and lazily loaded
          children.
        </p>
      </div>

      <PageDocs path="/atoms/tree-view/" />

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Single selection" />
          <PreviewBlock
            title="Product categories"
            description="Arrow keys move, Right/Left expand and collapse, Enter/Space select, type to jump."
            code={SINGLE_CODE}
            previewClassName="flex-col items-stretch"
          >
            <SingleDemo />
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Checkboxes" />
          <PreviewBlock
            title="Tri-state multi-select"
            description="Checking a parent checks its descendants; partially checked parents are mixed."
            code={CHECKBOX_CODE}
            previewClassName="flex-col items-stretch"
          >
            <CheckboxDemo />
          </PreviewBlock>
        </section>
        <section>
          <SectionHeading label="Lazy children" />
          <PreviewBlock
            title="Load on expand"
            description="Nodes with hasChildren call loadChildren the first time they open."
            code={LAZY_CODE}
            previewClassName="flex-col items-stretch"
          >
            <LazyDemo />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/tree-view/")({
  head: () => createCatalogPageHead("/atoms/tree-view/"),
  component: TreeViewPage,
});
