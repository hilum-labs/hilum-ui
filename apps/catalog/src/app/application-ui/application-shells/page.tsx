
import { PreviewBlock } from "@/components/catalog/preview-block";
import LightSidebarShell from "@/components/application-ui/application-shells/light-sidebar-shell";
import lightSidebarShellSource from "@/components/application-ui/application-shells/light-sidebar-shell?raw";
import DarkSidebarShell from "@/components/application-ui/application-shells/dark-sidebar-shell";
import darkSidebarShellSource from "@/components/application-ui/application-shells/dark-sidebar-shell?raw";
import BrandSidebarShell from "@/components/application-ui/application-shells/brand-sidebar-shell";
import brandSidebarShellSource from "@/components/application-ui/application-shells/brand-sidebar-shell?raw";
import LightStackedShell from "@/components/application-ui/application-shells/light-stacked-shell";
import lightStackedShellSource from "@/components/application-ui/application-shells/light-stacked-shell?raw";
import DarkStackedShell from "@/components/application-ui/application-shells/dark-stacked-shell";
import darkStackedShellSource from "@/components/application-ui/application-shells/dark-stacked-shell?raw";
import BrandOverlapShell from "@/components/application-ui/application-shells/brand-overlap-shell";
import brandOverlapShellSource from "@/components/application-ui/application-shells/brand-overlap-shell?raw";
import FullWidthThreeColumnShell from "@/components/application-ui/application-shells/full-width-three-column-shell";
import fullWidthThreeColumnShellSource from "@/components/application-ui/application-shells/full-width-three-column-shell?raw";
import ConstrainedThreeColumnShell from "@/components/application-ui/application-shells/constrained-three-column-shell";
import constrainedThreeColumnShellSource from "@/components/application-ui/application-shells/constrained-three-column-shell?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function ApplicationShellsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">
            Design System
          </a>
          <span>/</span>
          <a href="/application-ui" className="hover:text-taupe-700">
            Application UI
          </a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Application Shells</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Application Shells</h1>
        <p className="body max-w-2xl text-taupe-400">
          Full-page app layout shells with sidebars, stacked headers, and multi-column arrangements.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <p className="caption text-taupe-400">Layout</p>
          <div className="h-3 w-px bg-taupe-100" />
          <p className="caption text-taupe-400">24 variants</p>
        </div>
      </div>

      <section className="mb-10">
        <SectionHeading label="Sidebar shells" />
        <div className="space-y-6">
          <PreviewBlock
            title="Light sidebar"
            description="White navigation rail with a light content canvas and mobile sidebar overlay."
            code={lightSidebarShellSource}
            previewClassName="p-0"
          >
            <LightSidebarShell />
          </PreviewBlock>
          <PreviewBlock
            title="Dark sidebar"
            description="Dark navigation rail with a bright content surface for heavier operational interfaces."
            code={darkSidebarShellSource}
            previewClassName="p-0"
          >
            <DarkSidebarShell />
          </PreviewBlock>
          <PreviewBlock
            title="Brand sidebar"
            description="A brand-forward navigation frame with a clean, neutral work area."
            code={brandSidebarShellSource}
            previewClassName="p-0"
          >
            <BrandSidebarShell />
          </PreviewBlock>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading label="Stacked shells" />
        <div className="space-y-6">
          <PreviewBlock
            title="Light nav with bottom border"
            description="Horizontal navigation with a soft border and a taupe content canvas."
            code={lightStackedShellSource}
            previewClassName="p-0"
          >
            <LightStackedShell />
          </PreviewBlock>
          <PreviewBlock
            title="Dark nav"
            description="A high-contrast top bar paired with a quiet white page body."
            code={darkStackedShellSource}
            previewClassName="p-0"
          >
            <DarkStackedShell />
          </PreviewBlock>
          <PreviewBlock
            title="Brand nav with overlap"
            description="Brand-colored navigation with an overlapping content card for key dashboards."
            code={brandOverlapShellSource}
            previewClassName="p-0"
          >
            <BrandOverlapShell />
          </PreviewBlock>
        </div>
      </section>

      <section>
        <SectionHeading label="Multi-column shells" />
        <div className="space-y-6">
          <PreviewBlock
            title="Full width three column"
            description="Icon navigation, primary workspace, and a persistent context panel."
            code={fullWidthThreeColumnShellSource}
            previewClassName="p-0"
          >
            <FullWidthThreeColumnShell />
          </PreviewBlock>
          <PreviewBlock
            title="Constrained three column"
            description="A centered multi-column shell for wide-screen editorial and planning tools."
            code={constrainedThreeColumnShellSource}
            previewClassName="p-0"
          >
            <ConstrainedThreeColumnShell />
          </PreviewBlock>
        </div>
      </section>
    </div>
  );
}
