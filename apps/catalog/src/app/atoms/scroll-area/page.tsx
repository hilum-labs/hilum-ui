
import { ScrollArea } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  scrollArea: `import { ScrollArea } from "@hilum/ui"

<ScrollArea className="h-48 w-64 rounded-xl border border-taupe-100 p-4">
  {items.map((item) => (
    <div key={item} className="py-2 text-sm border-b border-taupe-100 last:border-0">
      {item}
    </div>
  ))}
</ScrollArea>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function ScrollAreaPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Scroll Area</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Scroll Area</h1>
        <p className="body max-w-lg text-taupe-500">
          Scrollable container with a styled custom scrollbar.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Scroll Area" />

        <PreviewBlock
          title="Default"
          description="Custom scrollbar with consistent taupe styling"
          code={CODE.scrollArea}
        >
          <ScrollArea className="h-44 w-64 rounded-xl border border-taupe-100 p-4">
            {["Instant speech", "Audiobook creation", "Image & Video dubbing", "ElevenAgents", "Music generation", "Dubbed video", "Voice cloning", "Sound effects", "Voice isolator", "Speech to text"].map((item) => (
              <div key={item} className="border-b border-taupe-100 py-2.5 text-sm text-taupe-700 last:border-0">
                {item}
              </div>
            ))}
          </ScrollArea>
        </PreviewBlock>
      </div>
    </div>
  );
}
