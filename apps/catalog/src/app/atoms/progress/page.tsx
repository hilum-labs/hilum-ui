
import { Progress } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  progress: `import { Progress } from "@hilum/ui"

<Progress value={65} />`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function ProgressPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Progress</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Progress</h1>
        <p className="body max-w-lg text-taupe-500">
          Visual indicator of completion or loading progress.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Progress" />

        <PreviewBlock
          title="Default"
          description="Linear progress indicator"
          code={CODE.progress}
          previewClassName="flex-col items-stretch"
        >
          <div className="w-full max-w-sm space-y-3">
            <div className="flex justify-between text-xs text-taupe-400 mb-1">
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
