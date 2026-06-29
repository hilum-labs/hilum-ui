import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Badge, badgeColors, type BadgeColor } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const allColors = Object.keys(badgeColors) as BadgeColor[];

const CODE = {
  solid: `import { Badge } from "@hilum/ui"

<Badge color="violet">Fiction</Badge>
<Badge color="amber">Science</Badge>
<Badge color="green">Philosophy</Badge>
<Badge color="blue">History</Badge>
<Badge color="rose">Poetry</Badge>`,
  dot: `import { Badge } from "@hilum/ui"

<Badge variant="dot" color="violet">Fiction</Badge>
<Badge variant="dot" color="amber">Science</Badge>
<Badge variant="dot" color="green">Philosophy</Badge>
<Badge variant="dot" color="blue">History</Badge>
<Badge variant="dot" color="rose">Poetry</Badge>`,
  sizes: `import { Badge } from "@hilum/ui"

<Badge size="sm" color="blue">Small</Badge>
<Badge size="md" color="blue">Medium</Badge>
<Badge size="lg" color="blue">Large</Badge>`,
  colors: `import { Badge } from "@hilum/ui"

<Badge color="gray">Gray</Badge>
<Badge color="red">Red</Badge>
<Badge color="blue">Blue</Badge>
<Badge color="green">Green</Badge>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function BadgePage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Badge</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Badge</h1>
        <p className="body max-w-lg text-ground-500">
          Compact labels for status, categories, and metadata.
        </p>
      </div>

      <PageDocs path="/atoms/badge/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Badge" />

        <PreviewBlock title="Solid" description="Tinted color labels" code={CODE.solid}>
          <Badge color="violet">Fiction</Badge>
          <Badge color="amber">Science</Badge>
          <Badge color="green">Philosophy</Badge>
          <Badge color="blue">History</Badge>
          <Badge color="rose">Poetry</Badge>
        </PreviewBlock>

        <PreviewBlock
          title="Dot"
          description="Outline labels with color indicators"
          code={CODE.dot}
        >
          <Badge variant="dot" color="violet">
            Fiction
          </Badge>
          <Badge variant="dot" color="amber">
            Science
          </Badge>
          <Badge variant="dot" color="green">
            Philosophy
          </Badge>
          <Badge variant="dot" color="blue">
            History
          </Badge>
          <Badge variant="dot" color="rose">
            Poetry
          </Badge>
        </PreviewBlock>

        <PreviewBlock title="Sizes" description="sm · md · lg" code={CODE.sizes}>
          <Badge size="sm" color="blue">
            Small
          </Badge>
          <Badge size="md" color="blue">
            Medium
          </Badge>
          <Badge size="lg" color="blue">
            Large
          </Badge>
        </PreviewBlock>

        <PreviewBlock
          title="Colors"
          description="Available Fluid color palette"
          code={CODE.colors}
          previewClassName="items-start"
        >
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {allColors.map((color) => (
                <Badge key={color} color={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {allColors.map((color) => (
                <Badge key={color} variant="dot" color={color}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </Badge>
              ))}
            </div>
          </div>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/badge/")({
  head: () => createCatalogPageHead("/atoms/badge/"),
  component: BadgePage,
});
