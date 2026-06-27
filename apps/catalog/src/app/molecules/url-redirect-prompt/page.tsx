import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Field, Input, UrlRedirectPrompt } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  prompt: `import { UrlRedirectPrompt } from "@hilum/ui"

<UrlRedirectPrompt
  originalHandle="linen-shirt"
  nextHandle={handle}
  pathPrefix="products"
  checked={createRedirect}
  onCheckedChange={setCreateRedirect}
/>`,

  unchanged: `<UrlRedirectPrompt
  originalHandle="linen-shirt"
  nextHandle="linen-shirt"
  pathPrefix="products"
  checked={createRedirect}
  onCheckedChange={setCreateRedirect}
/>
// Renders null because the handle did not change.`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function UrlRedirectPromptPage() {
  const [handle, setHandle] = React.useState("linen-shirt-v2");
  const [createRedirect, setCreateRedirect] = React.useState(true);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">
            Molecules
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">URL Redirect Prompt</span>
        </div>
        <h1 className="display mb-2 text-ground-900">URL Redirect Prompt</h1>
        <p className="body max-w-lg text-ground-500">
          Redirect recommendation callout shown when an editable URL handle changes.
        </p>
      </div>

      <PageDocs path="/molecules/url-redirect-prompt/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Changed Handle" />
          <PreviewBlock
            title="Redirect recommendation"
            description="Renders only when both handles are present and the public path changed."
            code={CODE.prompt}
            previewClassName="flex-col items-stretch"
          >
            <div className="grid w-full gap-4">
              <Field label="Product handle" htmlFor="handle">
                <Input
                  id="handle"
                  value={handle}
                  onChange={(event) => setHandle(event.target.value)}
                />
              </Field>
              <UrlRedirectPrompt
                originalHandle="linen-shirt"
                nextHandle={handle}
                pathPrefix="products"
                checked={createRedirect}
                onCheckedChange={setCreateRedirect}
              />
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="No Change" />
          <PreviewBlock
            title="No prompt"
            description="The component intentionally renders nothing when the URL handle is unchanged."
            code={CODE.unchanged}
            previewClassName="flex-col items-stretch"
          >
            <div className="rounded-xl border border-dashed border-ground-200 bg-ground-50 px-4 py-6 text-center">
              <UrlRedirectPrompt
                originalHandle="linen-shirt"
                nextHandle="linen-shirt"
                pathPrefix="products"
                checked={createRedirect}
                onCheckedChange={setCreateRedirect}
              />
              <p className="caption text-ground-400">No redirect prompt is rendered.</p>
            </div>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/molecules/url-redirect-prompt/")({
  head: () => createCatalogPageHead("/molecules/url-redirect-prompt/"),
  component: UrlRedirectPromptPage,
});
