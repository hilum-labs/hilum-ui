
import { PreviewBlock } from "@/components/catalog/preview-block";

import ContactSimpleTwoColumn from "@/components/marketing/contact-sections/contact-simple-two-column";
import contactSimpleTwoColumnSource from "@/components/marketing/contact-sections/contact-simple-two-column?raw";

import ContactSimpleFourColumn from "@/components/marketing/contact-sections/contact-simple-four-column";
import contactSimpleFourColumnSource from "@/components/marketing/contact-sections/contact-simple-four-column?raw";

import ContactCentered from "@/components/marketing/contact-sections/contact-centered";
import contactCenteredSource from "@/components/marketing/contact-sections/contact-centered?raw";

import ContactSideBySideGrid from "@/components/marketing/contact-sections/contact-side-by-side-grid";
import contactSideBySideGridSource from "@/components/marketing/contact-sections/contact-side-by-side-grid?raw";

import ContactSplitTwoTone from "@/components/marketing/contact-sections/contact-split-two-tone";
import contactSplitTwoToneSource from "@/components/marketing/contact-sections/contact-split-two-tone?raw";

import ContactSplitWithImage from "@/components/marketing/contact-sections/contact-split-with-image";
import contactSplitWithImageSource from "@/components/marketing/contact-sections/contact-split-with-image?raw";

import ContactSplitBrandPanel from "@/components/marketing/contact-sections/contact-split-brand-panel";
import contactSplitBrandPanelSource from "@/components/marketing/contact-sections/contact-split-brand-panel?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function ContactSectionsPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10 max-w-2xl">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/marketing" className="hover:text-taupe-700">
            Marketing
          </a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Contact Sections</span>
        </div>
        <h1 className="display text-taupe-900">Contact Sections</h1>
        <p className="body mt-3 text-taupe-500">
          Contact layouts spanning compact forms, split-screen inquiries, and multi-channel support patterns.
        </p>
      </div>

      <SectionHeading label="Variant 1" />
      <PreviewBlock
        title="Simple Two Column"
        description="Core contact content on the left and a lead capture form on the right."
        code={contactSimpleTwoColumnSource}
        previewClassName="block p-0"
      >
        <ContactSimpleTwoColumn />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 2" />
      <PreviewBlock
        title="Simple Four Column"
        description="A row of high-signal contact method cards."
        code={contactSimpleFourColumnSource}
        previewClassName="block p-0"
      >
        <ContactSimpleFourColumn />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 3" />
      <PreviewBlock
        title="Centered"
        description="Centered form pattern for cleaner contact pages."
        code={contactCenteredSource}
        previewClassName="block p-0"
      >
        <ContactCentered />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 4" />
      <PreviewBlock
        title="Side By Side Grid"
        description="Informational panel paired with a broader inquiry form."
        code={contactSideBySideGridSource}
        previewClassName="block p-0"
      >
        <ContactSideBySideGrid />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 5" />
      <PreviewBlock
        title="Split Two Tone"
        description="Dark information panel alongside a bright form surface."
        code={contactSplitTwoToneSource}
        previewClassName="block p-0"
      >
        <ContactSplitTwoTone />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 6" />
      <PreviewBlock
        title="Split With Image"
        description="Large media placeholder on the left with a structured form on the right."
        code={contactSplitWithImageSource}
        previewClassName="block p-0"
      >
        <ContactSplitWithImage />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 7" />
      <PreviewBlock
        title="Split Brand Panel"
        description="Strong orange value proposition panel next to a white lead form."
        code={contactSplitBrandPanelSource}
        previewClassName="block p-0"
      >
        <ContactSplitBrandPanel />
      </PreviewBlock>
    </div>
  );
}
