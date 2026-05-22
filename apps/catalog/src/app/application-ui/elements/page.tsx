import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { Badge } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";
import Avatars from "@/components/application-ui/elements/avatars";
import avatarsSource from "@/components/application-ui/elements/avatars?raw";
import Badges from "@/components/application-ui/elements/badges";
import badgesSource from "@/components/application-ui/elements/badges?raw";
import ButtonGroups from "@/components/application-ui/elements/button-groups";
import buttonGroupsSource from "@/components/application-ui/elements/button-groups?raw";
import Dropdowns from "@/components/application-ui/elements/dropdowns";
import dropdownsSource from "@/components/application-ui/elements/dropdowns?raw";
import Buttons from "@/components/application-ui/elements/buttons";
import buttonsSource from "@/components/application-ui/elements/buttons?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function ElementsPage() {
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
          <span className="font-semibold text-ground-900">Elements</span>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="display mb-2 text-ground-900">Elements</h1>
            <p className="body max-w-2xl text-ground-500">
              Avatars, badges, button groups, buttons, and dropdown menus.
            </p>
          </div>
          <Badge variant="secondary" className="self-start rounded-full px-3 py-1">
            UI · 36 variants
          </Badge>
        </div>
      </div>

      <PageDocs path="/application-ui/elements/" />

      <div className="space-y-10">
        {/* ── SECTION 1 — AVATARS ── */}
        <section>
          <SectionHeading label="SECTION 1 — AVATARS" />
          <PreviewBlock
            title="Avatars"
            description="5 variants"
            code={avatarsSource}
            previewClassName="p-0"
          >
            <Avatars />
          </PreviewBlock>
        </section>

        {/* ── SECTION 2 — BADGES ── */}
        <section>
          <SectionHeading label="SECTION 2 — BADGES" />
          <PreviewBlock
            title="Badges"
            description="5 variants"
            code={badgesSource}
            previewClassName="p-0"
          >
            <Badges />
          </PreviewBlock>
        </section>

        {/* ── SECTION 3 — BUTTON GROUPS ── */}
        <section>
          <SectionHeading label="SECTION 3 — BUTTON GROUPS" />
          <PreviewBlock
            title="Button Groups"
            description="4 variants"
            code={buttonGroupsSource}
            previewClassName="p-0"
          >
            <ButtonGroups />
          </PreviewBlock>
        </section>

        {/* ── SECTION 4 — DROPDOWNS ── */}
        <section>
          <SectionHeading label="SECTION 4 — DROPDOWNS" />
          <PreviewBlock
            title="Dropdowns"
            description="5 variants"
            code={dropdownsSource}
            previewClassName="p-0"
          >
            <Dropdowns />
          </PreviewBlock>
        </section>

        {/* ── SECTION 5 — BUTTONS ── */}
        <section>
          <SectionHeading label="SECTION 5 — BUTTONS" />
          <PreviewBlock
            title="Buttons"
            description="All variants"
            code={buttonsSource}
            previewClassName="p-0"
          >
            <Buttons />
          </PreviewBlock>
        </section>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/application-ui/elements/")({
  head: () => createCatalogPageHead("/application-ui/elements/"),
  component: ElementsPage,
});
