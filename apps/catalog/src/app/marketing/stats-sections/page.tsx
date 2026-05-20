
import { PreviewBlock } from "@/components/catalog/preview-block";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import StatsSectionCard from "@/components/marketing/stats-sections/stats-section-card";
import statsSectionCardSource from "@/components/marketing/stats-sections/stats-section-card?raw";
import StatsSectionBrand from "@/components/marketing/stats-sections/stats-section-brand";
import statsSectionBrandSource from "@/components/marketing/stats-sections/stats-section-brand?raw";
import StatsSectionSplit from "@/components/marketing/stats-sections/stats-section-split";
import statsSectionSplitSource from "@/components/marketing/stats-sections/stats-section-split?raw";
import StatsSectionGlow from "@/components/marketing/stats-sections/stats-section-glow";
import statsSectionGlowSource from "@/components/marketing/stats-sections/stats-section-glow?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className='mb-4 flex items-center gap-3'>
      <h2 className='label text-ground-400'>{label}</h2>
      <div className='h-px flex-1 bg-ground-100' />
    </div>
  );
}

export default function StatsSectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/marketing" className="hover:text-ground-700">
            Marketing
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Stats Sections</span>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Badge variant="secondary">Social Proof</Badge>
          <Badge variant="outline">4 variants</Badge>
          <Button asChild size="sm" variant="outline" className="rounded-full">
            <a href="/marketing">Browse all sections</a>
          </Button>
        </div>

        <h1 className="display mb-2 text-ground-900">Stats Sections</h1>
        <p className="body max-w-2xl text-ground-500">
          Metrics-driven sections for landing pages and campaign narratives. The
          set includes card-based, bold brand, split-layout, and atmospheric
          dark variants.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Stats Sections" />

        <PreviewBlock
          title="Simple in card"
          description="Centered intro with an elevated four-column metrics card"
          code={statsSectionCardSource}
          previewClassName="p-0 items-stretch"
        >
          <StatsSectionCard />
        </PreviewBlock>

        <PreviewBlock
          title="Simple on brand"
          description="High-contrast stat section on a brand-primary background"
          code={statsSectionBrandSource}
          previewClassName="p-0 items-stretch"
        >
          <StatsSectionBrand />
        </PreviewBlock>

        <PreviewBlock
          title="Split with image"
          description="Image placeholder on the left and a concise stat grid on the right"
          code={statsSectionSplitSource}
          previewClassName="p-0 items-stretch"
        >
          <StatsSectionSplit />
        </PreviewBlock>

        <PreviewBlock
          title="With fading background"
          description="Dark section with a centered radial glow and oversized stat treatment"
          code={statsSectionGlowSource}
          previewClassName="p-0 items-stretch"
        >
          <StatsSectionGlow />
        </PreviewBlock>
      </div>
    </div>
  );
}
