import { createFileRoute } from "@tanstack/react-router";
import { ThinkingIndicator } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { ThinkingIndicator } from "@hilum/ui"

<ThinkingIndicator label="Thinking" />`;

function ThinkingIndicatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Thinking Indicator</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Compact animated status indicator for pending assistant or system work.
      </p>
      <PageDocs path="/atoms/thinking-indicator/" />
      <PreviewBlock title="Default" description="Animated pending status" code={CODE}>
        <ThinkingIndicator label="Thinking" />
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/atoms/thinking-indicator/")({
  head: () => createCatalogPageHead("/atoms/thinking-indicator/"),
  component: ThinkingIndicatorPage,
});
