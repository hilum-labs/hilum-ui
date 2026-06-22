import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

import SidebarFilters from "@/components/ecommerce/category-filters/sidebar-filters";
import sidebarFiltersSource from "@/components/ecommerce/category-filters/sidebar-filters.tsx?raw";

import CenteredDropdowns from "@/components/ecommerce/category-filters/centered-dropdowns";
import centeredDropdownsSource from "@/components/ecommerce/category-filters/centered-dropdowns.tsx?raw";

import DropdownProductFilters from "@/components/ecommerce/category-filters/dropdown-product-filters";
import dropdownProductFiltersSource from "@/components/ecommerce/category-filters/dropdown-product-filters.tsx?raw";

import ExpandableFilterPanel from "@/components/ecommerce/category-filters/expandable-filter-panel";
import expandableFilterPanelSource from "@/components/ecommerce/category-filters/expandable-filter-panel.tsx?raw";

import InlineActionsSidebar from "@/components/ecommerce/category-filters/inline-actions-sidebar";
import inlineActionsSidebarSource from "@/components/ecommerce/category-filters/inline-actions-sidebar.tsx?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function CategoryFiltersPage() {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-10">
          <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
            <a href="/" className="hover:text-ground-700">
              Design System
            </a>
            <span>/</span>
            <a href="/ecommerce" className="hover:text-ground-700">
              Ecommerce
            </a>
            <span>/</span>
            <span className="font-semibold text-ground-900">Category Filters</span>
          </div>
          <div className="mb-4 flex items-center gap-3">
            <Badge variant="secondary">Browsing · 5 variants</Badge>
          </div>
          <h1 className="display mb-2 text-ground-900">Category Filters</h1>
          <p className="body max-w-2xl text-ground-400">
            Sidebar and dropdown filter panels for browsing product categories.
          </p>
        </div>

        <PageDocs path="/ecommerce/category-filters/" />

        <div className="space-y-8">
          <SectionHeading label="Sidebar Filters" />
          <PreviewBlock
            title="Sidebar Filters"
            description="Expandable groups with real checkbox and swatch interactions."
            code={sidebarFiltersSource}
            previewClassName="p-0"
          >
            <SidebarFilters />
          </PreviewBlock>

          <SectionHeading label="Centered Text and Dropdown Filters" />
          <PreviewBlock
            title="Centered Text and Dropdown Filters"
            description="Centered intro copy with pill-style dropdown controls."
            code={centeredDropdownsSource}
            previewClassName="p-0"
          >
            <CenteredDropdowns />
          </PreviewBlock>

          <SectionHeading label="Dropdown Product Filters" />
          <PreviewBlock
            title="Dropdown Product Filters"
            description="A toolbar pattern with multiple dropdowns and a sort select."
            code={dropdownProductFiltersSource}
            previewClassName="p-0"
          >
            <DropdownProductFilters />
          </PreviewBlock>

          <SectionHeading label="Expandable Filter Panel" />
          <PreviewBlock
            title="Expandable Filter Panel"
            description="A full-width filter drawer pattern with a slide open treatment."
            code={expandableFilterPanelSource}
            previewClassName="p-0"
          >
            <ExpandableFilterPanel />
          </PreviewBlock>

          <SectionHeading label="Inline Actions and Expandable Sidebar" />
          <PreviewBlock
            title="Inline Actions and Expandable Sidebar"
            description="Sort controls, subcategory navigation, and expandable filters."
            code={inlineActionsSidebarSource}
            previewClassName="p-0"
          >
            <InlineActionsSidebar />
          </PreviewBlock>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/ecommerce/category-filters/")({
  head: () => createCatalogPageHead("/ecommerce/category-filters/"),
  component: CategoryFiltersPage,
});
