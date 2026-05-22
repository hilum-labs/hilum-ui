import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { Link } from "@tanstack/react-router";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

type SectionEntry = {
  name: string;
  slug: string;
  description: string;
  variants: number;
  category: string;
};

const SECTIONS: SectionEntry[] = [
  {
    name: "Heroes",
    slug: "heroes",
    description: "Full-width hero sections with headlines, CTAs, screenshots, and sign-up forms.",
    variants: 9,
    category: "Page Intro",
  },
  {
    name: "Feature Sections",
    slug: "feature-sections",
    description: "Showcase product features with icons, images, and alternating layouts.",
    variants: 10,
    category: "Content",
  },
  {
    name: "CTA Sections",
    slug: "cta-sections",
    description: "Calls-to-action with bold headlines, brand backgrounds, and button groups.",
    variants: 8,
    category: "Conversion",
  },
  {
    name: "Pricing",
    slug: "pricing",
    description: "Pricing tables with tiers, feature lists, toggles, and comparison grids.",
    variants: 9,
    category: "Conversion",
  },
  {
    name: "Testimonials",
    slug: "testimonials",
    description: "Customer quotes with avatars, company logos, and branded backgrounds.",
    variants: 5,
    category: "Social Proof",
  },
  {
    name: "FAQ Sections",
    slug: "faq-sections",
    description: "Frequently asked questions in accordion, two-column, and grid layouts.",
    variants: 9,
    category: "Support",
  },
  {
    name: "Stats Sections",
    slug: "stats-sections",
    description: "Key metrics and numbers in card, brand, and image-backed layouts.",
    variants: 4,
    category: "Social Proof",
  },
  {
    name: "Logo Clouds",
    slug: "logo-clouds",
    description: "Partner and customer logo grids with headings and brand backgrounds.",
    variants: 5,
    category: "Social Proof",
  },
  {
    name: "Newsletter",
    slug: "newsletter-sections",
    description: "Email capture sections with descriptions, branded cards, and dark variants.",
    variants: 6,
    category: "Conversion",
  },
  {
    name: "Content Sections",
    slug: "content-sections",
    description: "Long-form content blocks with split images, testimonials, and stats.",
    variants: 6,
    category: "Content",
  },
  {
    name: "Blog Sections",
    slug: "blog-sections",
    description: "Article grids with thumbnails, badges, authors, and newsletter sign-up.",
    variants: 3,
    category: "Content",
  },
  {
    name: "Contact Sections",
    slug: "contact-sections",
    description: "Contact forms with two-tone splits, brand panels, and multi-column layouts.",
    variants: 7,
    category: "Support",
  },
  {
    name: "Team Sections",
    slug: "team-sections",
    description: "Team member grids with photos, bios, and social links.",
    variants: 8,
    category: "Content",
  },
  {
    name: "Footers",
    slug: "footers",
    description: "Site footers with multi-column nav, newsletter, social links, and dark variants.",
    variants: 7,
    category: "Navigation",
  },
  {
    name: "Headers",
    slug: "header",
    description: "Page headers with background images, overlapping cards, and select menus.",
    variants: 5,
    category: "Page Intro",
  },
  {
    name: "Banners",
    slug: "banners",
    description: "Announcement banners at the top or bottom — dismissible, sticky, and floating variants.",
    variants: 4,
    category: "Elements",
  },
  {
    name: "Flyout Menus",
    slug: "flyout-menus",
    description: "Dropdown nav menus with icon grids, columns, and footer action rows.",
    variants: 6,
    category: "Elements",
  },
  {
    name: "Nav Headers",
    slug: "nav-headers",
    description: "Full site navigation headers with logo, links, flyouts, and mobile drawers.",
    variants: 5,
    category: "Navigation",
  },
  {
    name: "404 Pages",
    slug: "404-pages",
    description: "Not-found pages with simple layouts, popular links, images, and full nav.",
    variants: 6,
    category: "Feedback",
  },
];

const TOTAL_VARIANTS = SECTIONS.reduce((acc, s) => acc + s.variants, 0);

function MarketingPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Marketing</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Marketing</h1>
        <p className="body max-w-md text-ground-400">
          Website sections for landing pages. Drop-in heroes, feature grids, pricing tables, testimonials, and more — all adapted to the brand.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">{SECTIONS.length} section types</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">{TOTAL_VARIANTS} variants total</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {SECTIONS.map((section) => (
          <Card
            key={section.slug}
            className="shadow-natural flex flex-col justify-between transition-shadow hover:shadow-elevated"
          >
            <CardHeader className="pb-2">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary" className="caption-xs">
                  {section.category}
                </Badge>
                <span className="caption-xs text-ground-400">{section.variants} variants</span>
              </div>
              <CardTitle className="subheading text-ground-900">{section.name}</CardTitle>
              <CardDescription className="caption leading-relaxed text-ground-400">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-auto px-0 py-0 text-ground-500 hover:text-ground-900 hover:bg-transparent"
              >
                <a href={`/marketing/${section.slug}`}>View section →</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/marketing/")({
  head: () => createCatalogPageHead("/marketing/"),
  component: MarketingPage,
});
