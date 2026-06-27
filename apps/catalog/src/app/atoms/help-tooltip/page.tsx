import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { HelpTooltip, Input, Label } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  inline: `import { HelpTooltip, Label, Input } from "@hilum/ui"

<div className="grid gap-2">
  <Label htmlFor="slug">
    Public slug
    <HelpTooltip text="This value is used in the public URL. Keep it short and stable." />
  </Label>
  <Input id="slug" defaultValue="summer-drop" />
</div>`,

  learnMore: `<HelpTooltip
  placement="right"
  text="Redirects preserve old links when a published URL changes."
  learnMoreUrl="https://ui.hilum.dev/theming"
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

function HelpTooltipPage() {
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
          <span className="font-semibold text-ground-900">Help Tooltip</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Help Tooltip</h1>
        <p className="body max-w-lg text-ground-500">
          Inline help trigger with tooltip content and optional learn-more link.
        </p>
      </div>

      <PageDocs path="/atoms/help-tooltip/" />

      <div className="flex flex-col gap-8">
        <section>
          <SectionHeading label="Inline Help" />
          <PreviewBlock
            title="Label help"
            description="Adds contextual help without forcing helper text into the layout."
            code={CODE.inline}
            previewClassName="flex-col items-stretch"
          >
            <div className="grid w-full max-w-sm gap-2">
              <Label htmlFor="slug">
                Public slug
                <HelpTooltip text="This value is used in the public URL. Keep it short and stable." />
              </Label>
              <Input id="slug" defaultValue="summer-drop" />
            </div>
          </PreviewBlock>
        </section>

        <section>
          <SectionHeading label="Learn More" />
          <PreviewBlock
            title="With link"
            description="Use the learn-more link for policies or concepts that need longer explanation."
            code={CODE.learnMore}
          >
            <span className="body inline-flex items-center text-ground-700">
              Redirect behavior
              <HelpTooltip
                placement="right"
                text="Redirects preserve old links when a published URL changes."
                learnMoreUrl="https://ui.hilum.dev/theming"
              />
            </span>
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/help-tooltip/")({
  head: () => createCatalogPageHead("/atoms/help-tooltip/"),
  component: HelpTooltipPage,
});
