import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { PreviewBlock } from "@/components/catalog/preview-block";
import FooterSimpleCentered from "@/components/marketing/footers/footer-simple-centered";
import footerSimpleCenteredSource from "@/components/marketing/footers/footer-simple-centered?raw";
import FooterSocialLinksOnly from "@/components/marketing/footers/footer-social-links-only";
import footerSocialLinksOnlySource from "@/components/marketing/footers/footer-social-links-only?raw";
import FooterFourColumnMission from "@/components/marketing/footers/footer-four-column-mission";
import footerFourColumnMissionSource from "@/components/marketing/footers/footer-four-column-mission?raw";
import FooterFourColumnNewsletter from "@/components/marketing/footers/footer-four-column-newsletter";
import footerFourColumnNewsletterSource from "@/components/marketing/footers/footer-four-column-newsletter?raw";
import FooterFourColumnNewsletterDark from "@/components/marketing/footers/footer-four-column-newsletter-dark";
import footerFourColumnNewsletterDarkSource from "@/components/marketing/footers/footer-four-column-newsletter-dark?raw";
import FooterFourColumnNewsletterLocale from "@/components/marketing/footers/footer-four-column-newsletter-locale";
import footerFourColumnNewsletterLocaleSource from "@/components/marketing/footers/footer-four-column-newsletter-locale?raw";
import FooterFourColumnDark from "@/components/marketing/footers/footer-four-column-dark";
import footerFourColumnDarkSource from "@/components/marketing/footers/footer-four-column-dark?raw";

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function FootersPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10 max-w-2xl">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/marketing" className="hover:text-ground-700">
            Marketing
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Footers</span>
        </div>
        <h1 className="display text-ground-900">Footers</h1>
        <p className="body mt-3 text-ground-500">
          Footer patterns for brand presence, structured navigation, email capture, and dark-site layouts.
        </p>
      </div>

      <PageDocs path="/marketing/footers/" />

      <SectionHeading label="Variant 1" />
      <PreviewBlock
        title="Simple Centered"
        description="Centered brand, navigation, social links, and copyright."
        code={footerSimpleCenteredSource}
        previewClassName="block p-0"
      >
        <FooterSimpleCentered />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 2" />
      <PreviewBlock
        title="Social Links Only"
        description="Minimal footer with brand and social buttons only."
        code={footerSocialLinksOnlySource}
        previewClassName="block p-0"
      >
        <FooterSocialLinksOnly />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 3" />
      <PreviewBlock
        title="Four Column With Company Mission"
        description="Mission statement plus structured product, company, and legal navigation."
        code={footerFourColumnMissionSource}
        previewClassName="block p-0"
      >
        <FooterFourColumnMission />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 4" />
      <PreviewBlock
        title="Four Column With Newsletter"
        description="Mission and nav columns with newsletter signup in the right rail."
        code={footerFourColumnNewsletterSource}
        previewClassName="block p-0"
      >
        <FooterFourColumnNewsletter />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 5" />
      <PreviewBlock
        title="Four Column With Newsletter Dark"
        description="Dark footer treatment with newsletter capture and muted navigation."
        code={footerFourColumnNewsletterDarkSource}
        previewClassName="block p-0"
      >
        <FooterFourColumnNewsletterDark />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 6" />
      <PreviewBlock
        title="Four Column With Newsletter And Localization"
        description="Newsletter footer with locale selector in the bottom bar."
        code={footerFourColumnNewsletterLocaleSource}
        previewClassName="block p-0"
      >
        <FooterFourColumnNewsletterLocale />
      </PreviewBlock>

      <div className="h-10" />

      <SectionHeading label="Variant 7" />
      <PreviewBlock
        title="Four Column Dark"
        description="Full dark footer with high contrast headings and active links."
        code={footerFourColumnDarkSource}
        previewClassName="block p-0"
      >
        <FooterFourColumnDark />
      </PreviewBlock>
    </div>
  );
}

export const Route = createFileRoute("/marketing/footers/")({
  head: () => createCatalogPageHead("/marketing/footers/"),
  component: FootersPage,
});
