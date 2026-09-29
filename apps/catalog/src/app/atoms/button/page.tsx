import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import * as React from "react";
import { ArrowRight, ChevronDown, Loader, Plus, Search } from "lucide-react";
import { Button, DensityProvider, ShapeProvider } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  buttonVariants: `import { Button } from "@hilum/ui"

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="ghost">Ghost</Button>
`,

  buttonSizes: `import { Button } from "@hilum/ui"
import { Plus } from "lucide-react"

<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="icon-sm"><Plus /></Button>
<Button size="icon"><Plus /></Button>
<Button size="icon-lg"><Plus /></Button>`,

  buttonRadius: `import { Button, ShapeProvider } from "@hilum/ui"

{/* rounded is the default */}
<Button>Rounded</Button>

<ShapeProvider defaultShape="pill">
  <Button>Pill</Button>
</ShapeProvider>`,

  buttonIcons: `import { Button } from "@hilum/ui"
import { ArrowRight, Plus, Search } from "lucide-react"

<Button leadingIcon={Plus}>Create</Button>
<Button variant="secondary" trailingIcon={ArrowRight}>Next</Button>
<Button variant="tertiary" leadingIcon={Search} trailingIcon={ArrowRight}>
  Search
</Button>`,

  buttonStates: `import { Button } from "@hilum/ui"
import { Loader } from "lucide-react"

<Button loading>Loading</Button>
<Button variant="secondary" loading leadingIcon={Loader}>Saving</Button>
<Button disabled>Disabled</Button>
`,

  buttonTile: `import { Button, DensityProvider } from "@hilum/ui"

// Pressable preset tiles: quiet fills; the pressed one is a ringed background
// tile. Tiles are content-sized, so pass h-auto (and compact:h-auto).
const [preset, setPreset] = React.useState("classic")

<DensityProvider density="compact">
  <div className="grid w-64 grid-cols-3 gap-1.5">
    {["classic", "modern", "playful"].map((name) => (
      <Button
        key={name}
        variant="tile"
        aria-pressed={preset === name}
        onClick={() => setPreset(name)}
        className="h-auto flex-col py-3 capitalize compact:h-auto"
      >
        {name}
      </Button>
    ))}
  </div>
</DensityProvider>`,

  buttonField: `import { Button, DensityProvider } from "@hilum/ui"
import { ChevronDown } from "lucide-react"

// A button that reads as a field, e.g. a font-family picker trigger.
<Button variant="field" trailingIcon={ChevronDown} className="w-56">
  Inter
</Button>

<DensityProvider density="compact">
  <Button variant="field" trailingIcon={ChevronDown} className="w-56">
    Inter
  </Button>
</DensityProvider>`,
};

const PRESETS = ["classic", "modern", "playful"] as const;

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-muted-foreground">{label}</h2>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function ButtonPage() {
  const [preset, setPreset] = React.useState<string>("classic");
  const [compactPreset, setCompactPreset] = React.useState<string>("modern");

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-muted-foreground">
          <a href="/" className="hover:text-foreground">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-foreground">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-foreground">Button</span>
        </div>
        <h1 className="display mb-2 text-foreground">Button</h1>
        <p className="body max-w-lg text-muted-foreground">
          Triggers actions. Supports multiple variants, sizes, and icon compositions.
        </p>
      </div>

      <PageDocs path="/atoms/button/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Button" />

        <PreviewBlock title="Variants" description="Fluid visual styles" code={CODE.buttonVariants}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tertiary">Tertiary</Button>
          <Button variant="ghost">Ghost</Button>
        </PreviewBlock>

        <PreviewBlock title="Sizes" description="sm · md · lg · icon sizes" code={CODE.buttonSizes}>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon-sm">
            <Plus />
          </Button>
          <Button size="icon">
            <Plus />
          </Button>
          <Button size="icon-lg">
            <Plus />
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="Radius modes"
          description="Rounded by default, pill via ShapeProvider"
          code={CODE.buttonRadius}
        >
          <Button>Rounded</Button>
          <ShapeProvider defaultShape="pill">
            <Button>Pill</Button>
          </ShapeProvider>
        </PreviewBlock>

        <PreviewBlock
          title="With icons"
          description="Leading and trailing icon slots"
          code={CODE.buttonIcons}
        >
          <Button leadingIcon={Plus}>Create</Button>
          <Button variant="secondary" trailingIcon={ArrowRight}>
            Next
          </Button>
          <Button variant="tertiary" leadingIcon={Search} trailingIcon={ArrowRight}>
            Search
          </Button>
        </PreviewBlock>

        <PreviewBlock
          title="Loading & Disabled"
          description="Built-in loading state"
          code={CODE.buttonStates}
        >
          <Button loading>Loading</Button>
          <Button variant="secondary" loading leadingIcon={Loader}>
            Saving
          </Button>
          <Button disabled>Disabled</Button>
        </PreviewBlock>

        <SectionHeading label="Editor chrome" />

        <PreviewBlock
          title="Tile"
          description="Pressable preset tiles: aria-pressed (or active) marks the chosen one"
          code={CODE.buttonTile}
          previewClassName="flex-col gap-6"
        >
          <div className="grid w-80 grid-cols-3 gap-2">
            {PRESETS.map((name) => (
              <Button
                key={name}
                variant="tile"
                aria-pressed={preset === name}
                onClick={() => setPreset(name)}
                className="h-auto flex-col py-4 capitalize compact:h-auto"
              >
                {name}
              </Button>
            ))}
          </div>
          <DensityProvider density="compact">
            <div className="grid w-64 grid-cols-3 gap-1.5">
              {PRESETS.map((name) => (
                <Button
                  key={name}
                  variant="tile"
                  aria-pressed={compactPreset === name}
                  onClick={() => setCompactPreset(name)}
                  className="h-auto flex-col py-3 capitalize compact:h-auto"
                >
                  {name}
                </Button>
              ))}
            </div>
          </DensityProvider>
        </PreviewBlock>

        <PreviewBlock
          title="Field"
          description="A trigger that reads as a field; filled 24px field under compact density"
          code={CODE.buttonField}
          previewClassName="flex-col gap-6"
        >
          <Button variant="field" trailingIcon={ChevronDown} className="w-56">
            Inter
          </Button>
          <DensityProvider density="compact">
            <Button variant="field" trailingIcon={ChevronDown} className="w-56">
              Inter
            </Button>
          </DensityProvider>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/button/")({
  head: () => createCatalogPageHead("/atoms/button/"),
  component: ButtonPage,
});
