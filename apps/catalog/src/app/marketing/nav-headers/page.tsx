import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";

import { PreviewBlock } from "@/components/catalog/preview-block";
import HeaderSimpleLeft from "@/components/marketing/nav-headers/header-simple-left";
import headerSimpleLeftSource from "@/components/marketing/nav-headers/header-simple-left?raw";
import HeaderSimpleCentered from "@/components/marketing/nav-headers/header-simple-centered";
import headerSimpleCenteredSource from "@/components/marketing/nav-headers/header-simple-centered?raw";
import HeaderCenteredBordered from "@/components/marketing/nav-headers/header-centered-bordered";
import headerCenteredBorderedSource from "@/components/marketing/nav-headers/header-centered-bordered?raw";
import HeaderBrandedDark from "@/components/marketing/nav-headers/header-branded-dark";
import headerBrandedDarkSource from "@/components/marketing/nav-headers/header-branded-dark?raw";
import HeaderWithFlyout from "@/components/marketing/nav-headers/header-with-flyout";
import headerWithFlyoutSource from "@/components/marketing/nav-headers/header-with-flyout?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function NavHeadersPage() {
  return (
    <div className="space-y-10 p-8">
      <div className="space-y-3">
        <h1 className="heading text-ground-900">Nav Headers</h1>
        <p className="body text-ground-500">
          Marketing navigation patterns with responsive drawers, centered link layouts, and a full-width flyout.
        </p>
      </div>

      <div>
        <SectionHeading label="Simple Links on Left" />
        <PreviewBlock
          title="Simple Links on Left"
          description="Classic left-aligned navigation with actions on the right."
          code={headerSimpleLeftSource}
          previewClassName="p-0"
        >
          <HeaderSimpleLeft />
        </PreviewBlock>
      </div>

      <div>
        <SectionHeading label="Simple Links Centered" />
        <PreviewBlock
          title="Simple Links Centered"
          description="Logo left, centered links, and action buttons on the right."
          code={headerSimpleCenteredSource}
          previewClassName="p-0"
        >
          <HeaderSimpleCentered />
        </PreviewBlock>
      </div>

      <div>
        <SectionHeading label="Centered with Bottom Border" />
        <PreviewBlock
          title="Centered with Bottom Border"
          description="Two-row header with centered brand presence and a minimal link row."
          code={headerCenteredBorderedSource}
          previewClassName="p-0"
        >
          <HeaderCenteredBordered />
        </PreviewBlock>
      </div>

      <div>
        <SectionHeading label="Simple Branded Dark" />
        <PreviewBlock
          title="Simple Branded Dark"
          description="Dark branded navbar with lime actions and a matching mobile drawer."
          code={headerBrandedDarkSource}
          previewClassName="p-0"
        >
          <HeaderBrandedDark />
        </PreviewBlock>
      </div>

      <div>
        <SectionHeading label="With Full-Width Flyout" />
        <PreviewBlock
          title="With Full-Width Flyout"
          description="Primary navigation with a click-triggered full-width solutions panel."
          code={headerWithFlyoutSource}
          previewClassName="p-0"
        >
          <HeaderWithFlyout />
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/marketing/nav-headers/")({
  head: () => createCatalogPageHead("/marketing/nav-headers/"),
  component: NavHeadersPage,
});
