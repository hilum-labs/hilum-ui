import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import {
  List,
  LayoutGrid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bookmark,
  Star,
  Heart,
} from "lucide-react";
import { ButtonGroup, ButtonGroupItem } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { ButtonGroup, ButtonGroupItem } from "@hilum/ui"

<ButtonGroup>
  <ButtonGroupItem>Years</ButtonGroupItem>
  <ButtonGroupItem active>Months</ButtonGroupItem>
  <ButtonGroupItem>Days</ButtonGroupItem>
</ButtonGroup>`,

  icons: `import { ButtonGroup, ButtonGroupItem } from "@hilum/ui"
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react"

<ButtonGroup>
  <ButtonGroupItem>
    <AlignLeft size={14} /> Left
  </ButtonGroupItem>
  <ButtonGroupItem active>
    <AlignCenter size={14} /> Center
  </ButtonGroupItem>
  <ButtonGroupItem>
    <AlignRight size={14} /> Right
  </ButtonGroupItem>
</ButtonGroup>`,

  iconsOnly: `import { ButtonGroup, ButtonGroupItem } from "@hilum/ui"
import { List, LayoutGrid } from "lucide-react"

<ButtonGroup>
  <ButtonGroupItem active aria-label="List view">
    <List size={14} />
  </ButtonGroupItem>
  <ButtonGroupItem aria-label="Grid view">
    <LayoutGrid size={14} />
  </ButtonGroupItem>
</ButtonGroup>`,

  withStat: `import { ButtonGroup, ButtonGroupItem } from "@hilum/ui"
import { Bookmark } from "lucide-react"

<ButtonGroup>
  <ButtonGroupItem>
    <Bookmark size={14} /> Save
  </ButtonGroupItem>
  <ButtonGroupItem className="px-2.5 caption text-ground-400">
    12k
  </ButtonGroupItem>
</ButtonGroup>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function ButtonGroupPage() {
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
          <span className="body font-semibold text-ground-900">Button Group</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Button Group</h1>
        <p className="body max-w-md text-ground-400">
          Multiple related actions or view toggles presented as a unified control. Items share
          borders and appear as a single component.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Atom</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Button</p>
        </div>
      </div>

      <PageDocs path="/atoms/button-group/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Button Group · Basic" />
          <PreviewBlock
            title="Text items"
            description="Grouped text buttons with one active"
            code={CODE.basic}
          >
            <ButtonGroup>
              <ButtonGroupItem>Years</ButtonGroupItem>
              <ButtonGroupItem active>Months</ButtonGroupItem>
              <ButtonGroupItem>Days</ButtonGroupItem>
            </ButtonGroup>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Button Group · With Icons" />
          <PreviewBlock
            title="Icon + label"
            description="Each item has an icon and text"
            code={CODE.icons}
          >
            <ButtonGroup>
              <ButtonGroupItem>
                <AlignLeft size={14} /> Left
              </ButtonGroupItem>
              <ButtonGroupItem active>
                <AlignCenter size={14} /> Center
              </ButtonGroupItem>
              <ButtonGroupItem>
                <AlignRight size={14} /> Right
              </ButtonGroupItem>
            </ButtonGroup>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Button Group · Variants" />
          <div className="flex flex-col gap-3">
            <PreviewBlock
              title="Icons only"
              description="Compact icon-only toggle (e.g. list vs grid)"
              code={CODE.iconsOnly}
            >
              <ButtonGroup>
                <ButtonGroupItem active aria-label="List view">
                  <List size={14} />
                </ButtonGroupItem>
                <ButtonGroupItem aria-label="Grid view">
                  <LayoutGrid size={14} />
                </ButtonGroupItem>
              </ButtonGroup>
            </PreviewBlock>
            <PreviewBlock
              title="With stat"
              description="Action button paired with a counter"
              code={CODE.withStat}
            >
              <div className="flex items-center gap-4">
                <ButtonGroup>
                  <ButtonGroupItem>
                    <Bookmark size={14} /> Save
                  </ButtonGroupItem>
                  <ButtonGroupItem className="px-2.5 caption text-ground-400">12k</ButtonGroupItem>
                </ButtonGroup>
                <ButtonGroup>
                  <ButtonGroupItem active>
                    <Star size={14} /> Star
                  </ButtonGroupItem>
                  <ButtonGroupItem className="px-2.5 caption text-ground-400">847</ButtonGroupItem>
                </ButtonGroup>
                <ButtonGroup>
                  <ButtonGroupItem>
                    <Heart size={14} /> Like
                  </ButtonGroupItem>
                  <ButtonGroupItem className="px-2.5 caption text-ground-400">2.1k</ButtonGroupItem>
                </ButtonGroup>
              </div>
            </PreviewBlock>
          </div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/button-group/")({
  head: () => createCatalogPageHead("/atoms/button-group/"),
  component: ButtonGroupPage,
});
