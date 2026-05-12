
import { Label } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  labelVariants: `import { Label } from "@hilum/ui"

<Label>Full name</Label>
<Label>
  Email <span className="text-red-500">*</span>
</Label>
<Label className="text-taupe-400">Optional field</Label>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function LabelPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Label</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Label</h1>
        <p className="body max-w-lg text-taupe-500">
          Accessible form label that associates with its control.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Label" />

        <PreviewBlock
          title="Default"
          description="Form labels with variations"
          code={CODE.labelVariants}
        >
          <div className="flex flex-col gap-2">
            <Label>Full name</Label>
            <Label>
              Email <span className="text-red-500">*</span>
            </Label>
            <Label className="text-taupe-400">Optional field</Label>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}
