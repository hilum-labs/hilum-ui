import { createFileRoute } from "@tanstack/react-router";
import { ThinkingSteps } from "@hilum/ui";
import { PageDocs } from "@/components/catalog/page-docs";
import { PreviewBlock } from "@/components/catalog/preview-block";
import { createCatalogPageHead } from "@/lib/seo";

const CODE = `import { ThinkingSteps } from "@hilum/ui"

<ThinkingSteps
  steps={[
    { label: "Read request", status: "complete" },
    { label: "Apply changes", status: "current" },
    { label: "Verify build", status: "pending" },
  ]}
/>`;

function ThinkingStepsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Thinking Steps</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Reasoning progress list with complete, current, and pending step states.
      </p>
      <PageDocs path="/molecules/thinking-steps/" />
      <PreviewBlock title="Default" description="Reasoning progress list" code={CODE}>
        <div className="w-full max-w-sm">
          <ThinkingSteps
            steps={[
              { label: "Read request", status: "complete" },
              { label: "Apply changes", status: "current" },
              { label: "Verify build", status: "pending" },
            ]}
          />
        </div>
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/molecules/thinking-steps/")({
  head: () => createCatalogPageHead("/molecules/thinking-steps/"),
  component: ThinkingStepsPage,
});
