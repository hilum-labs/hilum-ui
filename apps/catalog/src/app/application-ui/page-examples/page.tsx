
import { PreviewBlock } from "@/components/catalog/preview-block";
import HomeScreenSidebar from "@/components/application-ui/page-examples/home-screen-sidebar";
import homeScreenSidebarSource from "@/components/application-ui/page-examples/home-screen-sidebar?raw";
import HomeScreenConstrained from "@/components/application-ui/page-examples/home-screen-constrained";
import homeScreenConstrainedSource from "@/components/application-ui/page-examples/home-screen-constrained?raw";
import ProjectDetailScreen from "@/components/application-ui/page-examples/project-detail-screen";
import projectDetailScreenSource from "@/components/application-ui/page-examples/project-detail-screen?raw";
import DirectoryScreen from "@/components/application-ui/page-examples/directory-screen";
import directoryScreenSource from "@/components/application-ui/page-examples/directory-screen?raw";
import SettingsSidebarScreen from "@/components/application-ui/page-examples/settings-sidebar-screen";
import settingsSidebarScreenSource from "@/components/application-ui/page-examples/settings-sidebar-screen?raw";
import CenteredSettingsScreen from "@/components/application-ui/page-examples/centered-settings-screen";
import centeredSettingsScreenSource from "@/components/application-ui/page-examples/centered-settings-screen?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function PageExamplesPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/application-ui" className="hover:text-ground-700">
            Application UI
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Page Examples</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Page Examples</h1>
        <p className="body max-w-2xl text-ground-400">
          Complete application page layouts — home dashboards, detail views, and settings screens.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Pages</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">16 variants</p>
        </div>
      </div>

      <section className="mb-10">
        <SectionHeading label="Home screens" />
        <div className="space-y-6">
          <PreviewBlock
            title="Card layout with sidebar"
            description="Dark application sidebar with dashboard stats, activity, and quick actions."
            code={homeScreenSidebarSource}
            previewClassName="p-0"
          >
            <HomeScreenSidebar />
          </PreviewBlock>
          <PreviewBlock
            title="Constrained grid layout"
            description="Stacked navigation with a centered, card-based overview page."
            code={homeScreenConstrainedSource}
            previewClassName="p-0"
          >
            <HomeScreenConstrained />
          </PreviewBlock>
        </div>
      </section>

      <section className="mb-10">
        <SectionHeading label="Detail screens" />
        <div className="space-y-6">
          <PreviewBlock
            title="Stacked card layout"
            description="Project detail page with stateful tabs, milestones, and supporting metadata."
            code={projectDetailScreenSource}
            previewClassName="p-0"
          >
            <ProjectDetailScreen />
          </PreviewBlock>
          <PreviewBlock
            title="Multi-column directory"
            description="Searchable people directory with a persistent detail pane and quick actions."
            code={directoryScreenSource}
            previewClassName="p-0"
          >
            <DirectoryScreen />
          </PreviewBlock>
        </div>
      </section>

      <section>
        <SectionHeading label="Settings screens" />
        <div className="space-y-6">
          <PreviewBlock
            title="With sidebar navigation and two-column form"
            description="Settings navigation paired with a structured form layout for profile fields."
            code={settingsSidebarScreenSource}
            previewClassName="p-0"
          >
            <SettingsSidebarScreen />
          </PreviewBlock>
          <PreviewBlock
            title="With breadcrumbs and centered form"
            description="Centered settings workflow with interactive toggles and a clear danger zone."
            code={centeredSettingsScreenSource}
            previewClassName="p-0"
          >
            <CenteredSettingsScreen />
          </PreviewBlock>
        </div>
      </section>
    </div>
  );
}
