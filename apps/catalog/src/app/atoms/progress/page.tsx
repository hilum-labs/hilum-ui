import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Progress } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  progress: `import { Progress } from "@hilum/ui"

<Progress value={65} />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function ProgressPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Progress</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Progress</h1>
        <p className="body max-w-lg text-ground-500">
          Visual indicator of completion or loading progress.
        </p>
      </div>

      <PageDocs path="/atoms/progress/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Progress" />

        <PreviewBlock
          title="Default"
          description="Linear progress indicator"
          code={CODE.progress}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-xs text-ground-400 mb-1">
              <span>Uploading voice samples...</span>
              <span>65%</span>
            </div>
            <Progress value={65} />
            <Progress value={30} />
            <Progress value={100} />
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/progress/")({
  head: () => createCatalogPageHead("/atoms/progress/"),
  component: ProgressPage,
});
