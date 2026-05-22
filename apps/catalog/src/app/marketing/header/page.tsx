import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import HeaderSimpleCentered from "@/components/marketing/header/header-simple-centered";
import headerSimpleCenteredSource from "@/components/marketing/header/header-simple-centered?raw";
import HeaderSimpleWithSelectMenu from "@/components/marketing/header/header-simple-with-select-menu";
import headerSimpleWithSelectMenuSource from "@/components/marketing/header/header-simple-with-select-menu?raw";
import HeaderSimpleWithSelectMenuDark from "@/components/marketing/header/header-simple-with-select-menu-dark";
import headerSimpleWithSelectMenuDarkSource from "@/components/marketing/header/header-simple-with-select-menu-dark?raw";
import HeaderBrandedWithBackground from "@/components/marketing/header/header-branded-with-background";
import headerBrandedWithBackgroundSource from "@/components/marketing/header/header-branded-with-background?raw";
import HeaderWithOverlappingCards from "@/components/marketing/header/header-with-overlapping-cards";
import headerWithOverlappingCardsSource from "@/components/marketing/header/header-with-overlapping-cards?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function HeaderPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10 max-w-2xl">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/marketing" className="hover:text-ground-700">
            Marketing
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Headers</span>
        </div>
        <h1 className="display text-ground-900">Headers</h1>
        <p className="body mt-3 text-ground-500">
          Page-banner patterns for category pages, campaign launches, and product sections with layered visual treatments.
        </p>
      </div>

      <PageDocs path="/marketing/header/" />

      <SectionHeading label="Variant 1" />
      <PreviewBlock
        title="Simple Centered"
        description="Centered breadcrumb, headline, and supporting copy."
        code={headerSimpleCenteredSource}
        previewClassName="block p-0"
      >
        <HeaderSimpleCentered />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 2" />
      <PreviewBlock
        title="Simple With Select Menu"
        description="Centered page header with interactive filter tabs."
        code={headerSimpleWithSelectMenuSource}
        previewClassName="block p-0"
      >
        <HeaderSimpleWithSelectMenu />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 3" />
      <PreviewBlock
        title="Simple With Select Menu Dark"
        description="Dark header with lime-active filter tabs."
        code={headerSimpleWithSelectMenuDarkSource}
        previewClassName="block p-0"
      >
        <HeaderSimpleWithSelectMenuDark />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 4" />
      <PreviewBlock
        title="Branded With Background Image"
        description="Orange campaign header with decorative grid texture and dual CTAs."
        code={headerBrandedWithBackgroundSource}
        previewClassName="block p-0"
      >
        <HeaderBrandedWithBackground />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 5" />
      <PreviewBlock
        title="With Background Image And Overlapping Cards"
        description="Dark hero banner with metric cards overlapping from below."
        code={headerWithOverlappingCardsSource}
        previewClassName="block p-0"
      >
        <HeaderWithOverlappingCards />
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/marketing/header/")({
  head: () => createCatalogPageHead("/marketing/header/"),
  component: HeaderPage,
});
