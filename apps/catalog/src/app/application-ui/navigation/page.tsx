import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import NavbarSimple from "@/components/application-ui/navigation/navbar-simple";
import navbarSimpleSource from "@/components/application-ui/navigation/navbar-simple?raw";
import NavbarSimpleDark from "@/components/application-ui/navigation/navbar-simple-dark";
import navbarSimpleDarkSource from "@/components/application-ui/navigation/navbar-simple-dark?raw";
import NavbarWithSearch from "@/components/application-ui/navigation/navbar-with-search";
import navbarWithSearchSource from "@/components/application-ui/navigation/navbar-with-search?raw";
import NavbarDarkAction from "@/components/application-ui/navigation/navbar-dark-action";
import navbarDarkActionSource from "@/components/application-ui/navigation/navbar-dark-action?raw";
import TabsUnderline from "@/components/application-ui/navigation/tabs-underline";
import tabsUnderlineSource from "@/components/application-ui/navigation/tabs-underline?raw";
import TabsUnderlineBadges from "@/components/application-ui/navigation/tabs-underline-badges";
import tabsUnderlineBadgesSource from "@/components/application-ui/navigation/tabs-underline-badges?raw";
import TabsUnderlineIcons from "@/components/application-ui/navigation/tabs-underline-icons";
import tabsUnderlineIconsSource from "@/components/application-ui/navigation/tabs-underline-icons?raw";
import TabsPills from "@/components/application-ui/navigation/tabs-pills";
import tabsPillsSource from "@/components/application-ui/navigation/tabs-pills?raw";
import TabsFullWidth from "@/components/application-ui/navigation/tabs-full-width";
import tabsFullWidthSource from "@/components/application-ui/navigation/tabs-full-width?raw";
import SidebarSimple from "@/components/application-ui/navigation/sidebar-simple";
import sidebarSimpleSource from "@/components/application-ui/navigation/sidebar-simple?raw";
import SidebarBrand from "@/components/application-ui/navigation/sidebar-brand";
import sidebarBrandSource from "@/components/application-ui/navigation/sidebar-brand?raw";
import SidebarExpandable from "@/components/application-ui/navigation/sidebar-expandable";
import sidebarExpandableSource from "@/components/application-ui/navigation/sidebar-expandable?raw";
import StepsCircles from "@/components/application-ui/navigation/steps-circles";
import stepsCirclesSource from "@/components/application-ui/navigation/steps-circles?raw";
import StepsProgressBar from "@/components/application-ui/navigation/steps-progress-bar";
import stepsProgressBarSource from "@/components/application-ui/navigation/steps-progress-bar?raw";
import StepsPanels from "@/components/application-ui/navigation/steps-panels";
import stepsPanelsSource from "@/components/application-ui/navigation/steps-panels?raw";
import StepsBullets from "@/components/application-ui/navigation/steps-bullets";
import stepsBulletsSource from "@/components/application-ui/navigation/steps-bullets?raw";
import BreadcrumbSimple from "@/components/application-ui/navigation/breadcrumb-simple";
import breadcrumbSimpleSource from "@/components/application-ui/navigation/breadcrumb-simple?raw";
import BreadcrumbContained from "@/components/application-ui/navigation/breadcrumb-contained";
import breadcrumbContainedSource from "@/components/application-ui/navigation/breadcrumb-contained?raw";
import CommandPaletteSimple from "@/components/application-ui/navigation/command-palette-simple";
import commandPaletteSimpleSource from "@/components/application-ui/navigation/command-palette-simple?raw";
import CommandPaletteGroups from "@/components/application-ui/navigation/command-palette-groups";
import commandPaletteGroupsSource from "@/components/application-ui/navigation/command-palette-groups?raw";
import PaginationCentered from "@/components/application-ui/navigation/pagination-centered";
import paginationCenteredSource from "@/components/application-ui/navigation/pagination-centered?raw";
import PaginationCardFooter from "@/components/application-ui/navigation/pagination-card-footer";
import paginationCardFooterSource from "@/components/application-ui/navigation/pagination-card-footer?raw";
import VerticalNavigationSimple from "@/components/application-ui/navigation/vertical-navigation-simple";
import verticalNavigationSimpleSource from "@/components/application-ui/navigation/vertical-navigation-simple?raw";
import VerticalNavigationSecondary from "@/components/application-ui/navigation/vertical-navigation-secondary";
import verticalNavigationSecondarySource from "@/components/application-ui/navigation/vertical-navigation-secondary?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function NavigationPage() {
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
          <span className="font-semibold text-ground-900">Navigation</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Navigation</h1>
        <p className="body max-w-2xl text-ground-400">
          Navbars, sidebar navigation, tabs, steps, breadcrumbs, command palettes, and pagination.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Navigation · 56 variants</p>
        </div>
      </div>

      <PageDocs path="/application-ui/navigation/" />

      <div className="space-y-10">
        <section>
          <SectionHeading label="Navbars" />
          <div className="grid gap-4 xl:grid-cols-2">
            <PreviewBlock title="Simple" code={navbarSimpleSource} previewClassName="p-0">
              <NavbarSimple />
            </PreviewBlock>
            <PreviewBlock title="Simple dark" code={navbarSimpleDarkSource} previewClassName="p-0">
              <NavbarSimpleDark />
            </PreviewBlock>
            <PreviewBlock title="With search" code={navbarWithSearchSource} previewClassName="p-0">
              <NavbarWithSearch />
            </PreviewBlock>
            <PreviewBlock title="Dark with quick action" code={navbarDarkActionSource} previewClassName="p-0">
              <NavbarDarkAction />
            </PreviewBlock>
          </div>
        </section>

        <section>
          <SectionHeading label="Tabs" />
          <div className="grid gap-4 xl:grid-cols-2">
            <PreviewBlock title="Tabs with underline" code={tabsUnderlineSource} previewClassName="p-0">
              <TabsUnderline />
            </PreviewBlock>
            <PreviewBlock
              title="Tabs with underline and badges"
              code={tabsUnderlineBadgesSource}
              previewClassName="p-0"
            >
              <TabsUnderlineBadges />
            </PreviewBlock>
            <PreviewBlock
              title="Tabs with underline and icons"
              code={tabsUnderlineIconsSource}
              previewClassName="p-0"
            >
              <TabsUnderlineIcons />
            </PreviewBlock>
            <PreviewBlock title="Tabs in pills" code={tabsPillsSource} previewClassName="p-0">
              <TabsPills />
            </PreviewBlock>
            <PreviewBlock
              title="Full width tabs with underline"
              code={tabsFullWidthSource}
              previewClassName="p-0"
              className="xl:col-span-2"
            >
              <TabsFullWidth />
            </PreviewBlock>
          </div>
        </section>

        <section>
          <SectionHeading label="Sidebar navigation" />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <PreviewBlock
              title="Simple with icons and badges"
              code={sidebarSimpleSource}
              previewClassName="p-0"
            >
              <SidebarSimple />
            </PreviewBlock>
            <PreviewBlock title="Brand with icons" code={sidebarBrandSource} previewClassName="p-0">
              <SidebarBrand />
            </PreviewBlock>
            <PreviewBlock
              title="With expandable sections"
              code={sidebarExpandableSource}
              previewClassName="p-0"
            >
              <SidebarExpandable />
            </PreviewBlock>
          </div>
        </section>

        <section>
          <SectionHeading label="Steps" />
          <div className="grid gap-4 xl:grid-cols-2">
            <PreviewBlock title="Circles" code={stepsCirclesSource} previewClassName="p-0">
              <StepsCircles />
            </PreviewBlock>
            <PreviewBlock title="Progress bar" code={stepsProgressBarSource} previewClassName="p-0">
              <StepsProgressBar />
            </PreviewBlock>
            <PreviewBlock title="Panels" code={stepsPanelsSource} previewClassName="p-0">
              <StepsPanels />
            </PreviewBlock>
            <PreviewBlock title="Bullets" code={stepsBulletsSource} previewClassName="p-0">
              <StepsBullets />
            </PreviewBlock>
          </div>
        </section>

        <section>
          <SectionHeading label="Breadcrumbs" />
          <div className="grid gap-4 xl:grid-cols-2">
            <PreviewBlock title="Simple with slashes" code={breadcrumbSimpleSource} previewClassName="p-0">
              <BreadcrumbSimple />
            </PreviewBlock>
            <PreviewBlock title="Contained" code={breadcrumbContainedSource} previewClassName="p-0">
              <BreadcrumbContained />
            </PreviewBlock>
          </div>
        </section>

        <section>
          <SectionHeading label="Command palettes" />
          <div className="grid gap-4 xl:grid-cols-2">
            <PreviewBlock title="Simple" code={commandPaletteSimpleSource} previewClassName="p-0">
              <CommandPaletteSimple />
            </PreviewBlock>
            <PreviewBlock title="With groups" code={commandPaletteGroupsSource} previewClassName="p-0">
              <CommandPaletteGroups />
            </PreviewBlock>
          </div>
        </section>

        <section>
          <SectionHeading label="Pagination" />
          <div className="grid gap-4 xl:grid-cols-2">
            <PreviewBlock title="Centered page numbers" code={paginationCenteredSource} previewClassName="p-0">
              <PaginationCentered />
            </PreviewBlock>
            <PreviewBlock
              title="Card footer with page buttons"
              code={paginationCardFooterSource}
              previewClassName="p-0"
            >
              <PaginationCardFooter />
            </PreviewBlock>
          </div>
        </section>

        <section>
          <SectionHeading label="Vertical navigation" />
          <div className="grid gap-4 md:grid-cols-2">
            <PreviewBlock title="On gray" code={verticalNavigationSimpleSource} previewClassName="p-0">
              <VerticalNavigationSimple />
            </PreviewBlock>
            <PreviewBlock
              title="With secondary navigation"
              code={verticalNavigationSecondarySource}
              previewClassName="p-0"
            >
              <VerticalNavigationSecondary />
            </PreviewBlock>
          </div>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/application-ui/navigation/")({
  head: () => createCatalogPageHead("/application-ui/navigation/"),
  component: NavigationPage,
});
