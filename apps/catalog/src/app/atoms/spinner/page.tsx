import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { Button } from "@hilum/ui";
import { Spinner } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  spinnerSizes: `import { Spinner } from "@hilum/ui"

<div className="flex items-center gap-4">
  <Spinner size="xs" />
  <Spinner size="sm" />
  <Spinner />
  <Spinner size="lg" />
  <Spinner size="xl" />
</div>`,

  spinnerColors: `import { Spinner } from "@hilum/ui"

<div className="flex items-center gap-6">
  <Spinner className="text-ground-400" />
  <Spinner className="text-brand-primary" />
  <Spinner className="text-red-500" />
  <Spinner className="text-green-500" />
</div>`,

  spinnerButton: `import { Button } from "@hilum/ui"
import { Spinner } from "@hilum/ui"

<Button disabled>
  <Spinner size="sm" className="text-white" />
  Saving...
</Button>

<Button variant="outline" disabled>
  <Spinner size="sm" />
  Loading...
</Button>`,

  spinnerLoader: `import { Spinner } from "@hilum/ui"

<div className="flex flex-col items-center gap-3 py-8">
  <Spinner size="lg" className="text-brand-primary" />
  <p className="caption text-ground-400">Loading data...</p>
</div>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function SpinnerPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Spinner</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Spinner</h1>
        <p className="body max-w-lg text-ground-500">
          Animated loading indicator for async operations and pending states.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Spinner" />

        <PreviewBlock
          title="Sizes"
          description="xs · sm · default · lg · xl"
          code={CODE.spinnerSizes}
        >
          <div className="flex items-center gap-4">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner />
            <Spinner size="lg" />
            <Spinner size="xl" />
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="Colors"
          description="Control color with text-* classes"
          code={CODE.spinnerColors}
        >
          <div className="flex items-center gap-6">
            <Spinner className="text-ground-400" />
            <Spinner className="text-brand-primary" />
            <Spinner className="text-red-500" />
            <Spinner className="text-green-500" />
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="In a button"
          description="Loading state with spinner and text"
          code={CODE.spinnerButton}
        >
          <div className="flex items-center gap-4">
            <Button disabled>
              <Spinner size="sm" className="text-white" />
              Saving...
            </Button>
            <Button variant="outline" disabled>
              <Spinner size="sm" />
              Loading...
            </Button>
          </div>
        </PreviewBlock>

        <PreviewBlock
          title="As page loader"
          description="Centered spinner with label"
          code={CODE.spinnerLoader}
        >
          <div className="flex flex-col items-center gap-3 py-8">
            <Spinner size="lg" className="text-brand-primary" />
            <p className="caption text-ground-400">Loading data...</p>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/spinner/")({
  head: () => createCatalogPageHead("/atoms/spinner/"),
  component: SpinnerPage,
});
