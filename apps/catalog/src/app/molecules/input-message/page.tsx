import { createFileRoute } from "@tanstack/react-router";
import { InputMessage } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { InputMessage } from "@hilum/ui"

<InputMessage value="" onValueChange={() => undefined} onSubmit={() => undefined} />`;

function InputMessagePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Input Message</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Auto-growing chat-style message composer with action slots and send affordance.
      </p>
      <PageDocs path="/molecules/input-message/" />
      <PreviewBlock title="Default" description="Message composer" code={CODE}>
        <div className="w-full max-w-xl">
          <InputMessage value="" onValueChange={() => undefined} onSubmit={() => undefined} />
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/molecules/input-message/")({
  head: () => createCatalogPageHead("/molecules/input-message/"),
  component: InputMessagePage,
});
