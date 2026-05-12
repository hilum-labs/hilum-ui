
import { PreviewBlock } from "@/components/catalog/preview-block";
import StackedShell from "@/components/blocks/app-shell-stacked/stacked-shell";
import stackedShellSource from "@/components/blocks/app-shell-stacked/stacked-shell?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function AppShellStackedPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/blocks" className="hover:text-taupe-700">Blocks</a>
          <span>/</span>
          <span className="body font-semibold text-taupe-900">App Shell · Stacked</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">App Shell · Stacked</h1>
        <p className="body max-w-md text-taupe-400">
          A top-navigation shell with logo, nav links, notification bell, and a user menu. Collapses to a hamburger on mobile.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <p className="caption text-taupe-400">Block</p>
          <div className="h-3 w-px bg-taupe-100" />
          <p className="caption text-taupe-400">Avatar · Badge · Dropdown Menu · Button</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="App Shell · Stacked navigation" />
          <PreviewBlock
            title="Top navbar with user menu"
            description="Horizontal nav with responsive mobile collapse"
            code={stackedShellSource}
            previewClassName="p-0 bg-taupe-50"
          >
            <StackedShell />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}
