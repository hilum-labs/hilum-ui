import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Skeleton } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  skeletonLoading: `import { Skeleton } from "@hilum/ui"

<div className="flex items-center gap-3">
  <Skeleton className="size-10 rounded-full" />
  <div className="flex flex-col gap-2">
    <Skeleton className="h-3 w-32" />
    <Skeleton className="h-2.5 w-20" />
  </div>
</div>
<Skeleton className="mt-4 h-2 w-full" />
<Skeleton className="h-2 w-4/5" />
<Skeleton className="h-2 w-3/4" />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function SkeletonPage() {
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
          <span className="font-semibold text-ground-900">Skeleton</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Skeleton</h1>
        <p className="body max-w-lg text-ground-500">
          Loading placeholder that mimics content shape.
        </p>
      </div>

      <PageDocs path="/atoms/skeleton/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Skeleton" />

        <PreviewBlock
          title="Loading states"
          description="Animated placeholder while content loads"
          code={CODE.skeletonLoading}
          previewClassName="items-start"
        >
          <div className="flex w-72 flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-4/5" />
              <Skeleton className="h-2 w-3/4" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
              <Skeleton className="h-10 rounded-lg" />
            </div>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/skeleton/")({
  head: () => createCatalogPageHead("/atoms/skeleton/"),
  component: SkeletonPage,
});
