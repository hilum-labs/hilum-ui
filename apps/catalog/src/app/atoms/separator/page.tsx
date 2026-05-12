
import { Separator } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  separatorOrientations: `import { Separator } from "@hilum/ui"

{/* Horizontal */}
<Separator />

{/* Vertical */}
<Separator orientation="vertical" className="h-5" />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function SeparatorPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Separator</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Separator</h1>
        <p className="body max-w-lg text-taupe-500">
          Visual divider between sections, horizontal or vertical.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Separator" />

        <PreviewBlock
          title="Orientations"
          description="Horizontal and vertical dividers"
          code={CODE.separatorOrientations}
        >
          <div className="flex w-full max-w-xs flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-xs text-taupe-500">Above</p>
              <Separator />
              <p className="text-xs text-taupe-500">Below</p>
            </div>
            <div className="flex h-8 items-center gap-4">
              <p className="text-xs text-taupe-500">Left</p>
              <Separator orientation="vertical" />
              <p className="text-xs text-taupe-500">Right</p>
            </div>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}
