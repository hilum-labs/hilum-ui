import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { RichTextEditor } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  editor: `import { RichTextEditor } from "@hilum/ui"

const [html, setHtml] = React.useState("<h2>Launch notes</h2><p>Draft the release summary.</p>")

<RichTextEditor
  value={html}
  onChange={setHtml}
  placeholder="Write the update..."
  minHeight={220}
/>`,

  compact: `<RichTextEditor
  value={html}
  onChange={setHtml}
  minHeight={140}
  aria-label="Product description"
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

function RichTextEditorPage() {
  const [html, setHtml] = React.useState(
    "<h2>Launch notes</h2><p>Draft the release summary, include the customer impact, and link the migration guide.</p>",
  );
  const [compactHtml, setCompactHtml] = React.useState(
    "<p>Describe the product in one paragraph.</p>",
  );

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Rich Text Editor</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Rich Text Editor</h1>
        <p className="body max-w-lg text-ground-500">
          Toolbar-driven content editor for formatted HTML input.
        </p>
      </div>

      <PageDocs path="/atoms/rich-text-editor/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Editor" />
          <PreviewBlock
            title="Content editor"
            description="Controlled HTML value with formatting, lists, links, images, and horizontal rules."
            code={CODE.editor}
            previewClassName="flex-col items-stretch"
          >
            <RichTextEditor
              value={html}
              onChange={setHtml}
              placeholder="Write the update..."
              minHeight={220}
            />
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Compact" />
          <PreviewBlock
            title="Short form field"
            description="Use a smaller minimum height for descriptions and editorial metadata."
            code={CODE.compact}
            previewClassName="flex-col items-stretch"
          >
            <RichTextEditor
              value={compactHtml}
              onChange={setCompactHtml}
              minHeight={140}
              aria-label="Product description"
            />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/rich-text-editor/")({
  head: () => createCatalogPageHead("/atoms/rich-text-editor/"),
  component: RichTextEditorPage,
});
