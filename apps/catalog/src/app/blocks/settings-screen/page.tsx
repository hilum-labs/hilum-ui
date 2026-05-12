
import { PreviewBlock } from "@/components/catalog/preview-block";
import SettingsPreview from "@/components/blocks/settings-screen/settings-preview";
import settingsPreviewSource from "@/components/blocks/settings-screen/settings-preview?raw";

function HeadingDivider({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function SettingsScreenPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/blocks" className="hover:text-taupe-700">Blocks</a>
          <span>/</span>
          <span className="body font-semibold text-taupe-900">Settings Screen</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Settings Screen</h1>
        <p className="body max-w-md text-taupe-400">
          A multi-section settings page with sidebar labels and right-column controls. Includes profile, notifications, password, and danger zone.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <p className="caption text-taupe-400">Block</p>
          <div className="h-3 w-px bg-taupe-100" />
          <p className="caption text-taupe-400">Page Heading · Section Heading · Field · Action Panel · Switch</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <HeadingDivider label="Settings Screen · Multi-section" />
          <PreviewBlock
            title="Profile, notifications, password, danger zone"
            description="3-column layout: label on left, controls on right"
            code={settingsPreviewSource}
            previewClassName="items-start"
          >
            <SettingsPreview />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
