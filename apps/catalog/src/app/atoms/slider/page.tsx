
import { Slider } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  slider: `import { Slider } from "@hilum/ui"

<div className="flex flex-col gap-2">
  <div className="flex justify-between text-xs text-taupe-400">
    <span>Slower</span>
    <span>Faster</span>
  </div>
  <Slider defaultValue={[50]} max={100} step={1} />
</div>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function SliderPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Slider</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Slider</h1>
        <p className="body max-w-lg text-taupe-500">
          Range input for selecting a numeric value.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Slider" />

        <PreviewBlock
          title="Default"
          description="Range input with taupe thumb and track"
          code={CODE.slider}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-xs">
            <div className="mb-2 flex justify-between text-xs text-taupe-400">
              <span>Slower</span>
              <span className="font-medium text-taupe-700">Speed</span>
              <span>Faster</span>
            </div>
            <Slider defaultValue={[50]} max={100} step={1} />
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}
