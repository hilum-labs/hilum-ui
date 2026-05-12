
import { Kbd } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  kbd: `import { Kbd } from "@hilum/ui"

<Kbd>⌘</Kbd>
<Kbd>⌘K</Kbd>
<Kbd>⇧⌘P</Kbd>
<span className="flex items-center gap-1 text-sm text-taupe-600">
  Save <Kbd>⌘</Kbd><Kbd>S</Kbd>
</span>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function KbdPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Kbd</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Kbd</h1>
        <p className="body max-w-lg text-taupe-500">
          Keyboard shortcut display using monospaced styling.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Kbd" />

        <PreviewBlock
          title="Keyboard shortcuts"
          description="Inline keyboard key display"
          code={CODE.kbd}
        >
          <div className="flex items-center gap-3">
            <Kbd>⌘</Kbd>
            <Kbd>⌘K</Kbd>
            <Kbd>⇧⌘P</Kbd>
            <span className="flex items-center gap-1 text-sm text-taupe-600">
              Save <Kbd>⌘</Kbd><Kbd>S</Kbd>
            </span>
            <span className="flex items-center gap-1 text-sm text-taupe-600">
              Undo <Kbd>⌘</Kbd><Kbd>Z</Kbd>
            </span>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}
