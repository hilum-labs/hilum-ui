import { createFileRoute } from "@tanstack/react-router";
import { InputCopy } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { InputCopy } from "@hilum/ui"

<InputCopy value="https://ui.hilum.dev/registry.json" />`;

function InputCopyPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Input Copy</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Read-only value field with integrated clipboard action and copied feedback.
      </p>
      <PageDocs path="/molecules/input-copy/" />
      <PreviewBlock title="Default" description="Copyable read-only input" code={CODE}>
        <div className="w-full max-w-md">
          <InputCopy value="https://ui.hilum.dev/registry.json" />
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/molecules/input-copy/")({
  head: () => createCatalogPageHead("/molecules/input-copy/"),
  component: InputCopyPage,
});
