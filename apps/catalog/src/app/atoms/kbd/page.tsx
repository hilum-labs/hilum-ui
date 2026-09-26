import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Kbd } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  kbd: `import { Kbd } from "@hilum/ui"

<Kbd>⌘</Kbd>
<Kbd>⌘K</Kbd>
<Kbd>⇧⌘P</Kbd>
<span className="flex items-center gap-1 text-sm text-muted-foreground">
  Save <Kbd>⌘</Kbd><Kbd>S</Kbd>
</span>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function KbdPage() {
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
          <span className="font-semibold text-foreground">Kbd</span>
        </div>
        <h1 className="display mb-2 text-foreground">Kbd</h1>
        <p className="body max-w-lg text-muted-foreground">
          Keyboard shortcut display using monospaced styling.
        </p>
      </div>

      <PageDocs path="/atoms/kbd/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Kbd" />

        <PreviewBlock
          title="Keyboard shortcuts"
          description="Inline keyboard key display"
          code={CODE.kbd}
        >
          <div className="flex items-center gap-3">
            <Kbd>⌘</Kbd>
            <Kbd>⌘K</Kbd>
            <Kbd>⇧⌘P</Kbd>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              Save <Kbd>⌘</Kbd>
              <Kbd>S</Kbd>
            </span>
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              Undo <Kbd>⌘</Kbd>
              <Kbd>Z</Kbd>
            </span>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/kbd/")({
  head: () => createCatalogPageHead("/atoms/kbd/"),
  component: KbdPage,
});
