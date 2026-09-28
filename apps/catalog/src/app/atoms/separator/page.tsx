import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Separator } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  horizontal: `import { Separator } from "@hilum/ui"

<div>
  <p className="subheading text-foreground">Hilum UI</p>
  <p className="caption text-muted-foreground">An open-source design system.</p>
</div>
<Separator className="my-4" />
<p className="body text-muted-foreground">Components, tokens, and blocks.</p>`,

  vertical: `<div className="flex h-5 items-center gap-4">
  <span>Docs</span>
  <Separator orientation="vertical" />
  <span>Components</span>
  <Separator orientation="vertical" />
  <span>Blocks</span>
</div>`,

  semantic: `// Decorative by default (role="none"). Pass decorative={false}
// when the divider separates meaningful content groups.
<Separator decorative={false} />`,
};

function Heading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function SeparatorPage() {
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
          <span className="font-semibold text-foreground">Separator</span>
        </div>
        <h1 className="display mb-2 text-foreground">Separator</h1>
        <p className="body max-w-lg text-muted-foreground">
          Visual divider between sections, horizontal or vertical. Decorative by default, so
          assistive technology skips it unless it separates meaningful groups.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-border pt-5">
          <p className="caption text-muted-foreground">Atom</p>
          <div className="h-3 w-px bg-border" />
          <p className="caption text-muted-foreground">Primitives</p>
        </div>
      </div>

      <PageDocs path="/atoms/separator/" />

      <div className="flex flex-col gap-10">
        <div>
          <Heading label="Separator · Horizontal" />
          <PreviewBlock
            title="Horizontal divider"
            description="Full-width rule between stacked content"
            code={CODE.horizontal}
          >
            <div className="w-full max-w-sm">
              <div>
                <p className="subheading text-foreground">Hilum UI</p>
                <p className="caption text-muted-foreground">An open-source design system.</p>
              </div>
              <Separator className="my-4" />
              <p className="body text-muted-foreground">Components, tokens, and blocks.</p>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Separator · Vertical" />
          <PreviewBlock
            title="Vertical divider"
            description="Inline rule between items in a row; takes the height of its container"
            code={CODE.vertical}
          >
            <div className="flex h-5 items-center gap-4 body text-foreground">
              <span>Docs</span>
              <Separator orientation="vertical" />
              <span>Components</span>
              <Separator orientation="vertical" />
              <span>Blocks</span>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <Heading label="Separator · Semantic" />
          <PreviewBlock
            title="Non-decorative separator"
            description="Exposed to screen readers as role=separator when decorative is false"
            code={CODE.semantic}
          >
            <div className="w-full max-w-sm">
              <p className="body text-foreground">Account</p>
              <Separator decorative={false} className="my-3" />
              <p className="body text-foreground">Billing</p>
            </div>
          </PreviewBlock>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/separator/")({
  head: () => createCatalogPageHead("/atoms/separator/"),
  component: SeparatorPage,
});
