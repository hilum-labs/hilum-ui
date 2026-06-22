import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";

import GridWithRoundImages from "@/components/marketing/team-sections/grid-with-round-images";
import gridWithRoundImagesSource from "@/components/marketing/team-sections/grid-with-round-images?raw";

import GridWithLargeRoundImages from "@/components/marketing/team-sections/grid-with-large-round-images";
import gridWithLargeRoundImagesSource from "@/components/marketing/team-sections/grid-with-large-round-images?raw";

import WithSmallImages from "@/components/marketing/team-sections/with-small-images";
import withSmallImagesSource from "@/components/marketing/team-sections/with-small-images?raw";

import WithLargeImages from "@/components/marketing/team-sections/with-large-images";
import withLargeImagesSource from "@/components/marketing/team-sections/with-large-images?raw";

import WithImageAndShortParagraph from "@/components/marketing/team-sections/with-image-and-short-paragraph";
import withImageAndShortParagraphSource from "@/components/marketing/team-sections/with-image-and-short-paragraph?raw";

import WithVerticalImages from "@/components/marketing/team-sections/with-vertical-images";
import withVerticalImagesSource from "@/components/marketing/team-sections/with-vertical-images?raw";

import FullWidthWithVerticalImages from "@/components/marketing/team-sections/full-width-with-vertical-images";
import fullWidthWithVerticalImagesSource from "@/components/marketing/team-sections/full-width-with-vertical-images?raw";

import DarkVersionWithLargeImages from "@/components/marketing/team-sections/dark-version-with-large-images";
import darkVersionWithLargeImagesSource from "@/components/marketing/team-sections/dark-version-with-large-images?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function TeamSectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10 max-w-2xl">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/marketing" className="hover:text-ground-700">
            Marketing
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Team Sections</span>
        </div>
        <h1 className="display text-ground-900">Team Sections</h1>
        <p className="body mt-3 text-ground-500">
          Team presentation patterns ranging from compact grids to full-width editorial layouts and
          dark-profile treatments.
        </p>
      </div>

      <PageDocs path="/marketing/team-sections/" />

      <SectionHeading label="Variant 1" />
      <PreviewBlock
        title="Grid With Round Images"
        description="Classic three-column team grid with circular avatars."
        code={gridWithRoundImagesSource}
        previewClassName="block p-0"
      >
        <GridWithRoundImages />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 2" />
      <PreviewBlock
        title="Grid With Large Round Images"
        description="More editorial profile cards with expanded bio space."
        code={gridWithLargeRoundImagesSource}
        previewClassName="block p-0"
      >
        <GridWithLargeRoundImages />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 3" />
      <PreviewBlock
        title="With Small Images"
        description="Compact cards with small avatars and lightweight bios."
        code={withSmallImagesSource}
        previewClassName="block p-0"
      >
        <WithSmallImages />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 4" />
      <PreviewBlock
        title="With Large Images"
        description="Two-column portrait cards with tall image placeholders."
        code={withLargeImagesSource}
        previewClassName="block p-0"
      >
        <WithLargeImages />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 5" />
      <PreviewBlock
        title="With Image And Short Paragraph"
        description="Alternating full-width profile rows with image and narrative text."
        code={withImageAndShortParagraphSource}
        previewClassName="block p-0"
      >
        <WithImageAndShortParagraph />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 6" />
      <PreviewBlock
        title="With Vertical Images"
        description="Four-column grid using narrow portrait placeholders."
        code={withVerticalImagesSource}
        previewClassName="block p-0"
      >
        <WithVerticalImages />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 7" />
      <PreviewBlock
        title="Full Width With Vertical Images"
        description="Large three-column team presentation with tall portrait cards."
        code={fullWidthWithVerticalImagesSource}
        previewClassName="block p-0"
      >
        <FullWidthWithVerticalImages />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 8" />
      <PreviewBlock
        title="Dark Version With Large Images"
        description="Dark-background team grid with ringed avatars and elevated profile cards."
        code={darkVersionWithLargeImagesSource}
        previewClassName="block p-0"
      >
        <DarkVersionWithLargeImages />
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/marketing/team-sections/")({
  head: () => createCatalogPageHead("/marketing/team-sections/"),
  component: TeamSectionsPage,
});
