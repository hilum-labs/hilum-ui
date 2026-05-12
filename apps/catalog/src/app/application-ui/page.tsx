import { Link } from "react-router-dom";
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
    name: "Application Shells",
    slug: "application-shells",
    description: "Full-page app layout shells — sidebar, stacked, and multi-column arrangements.",
    variants: 24,
    category: "Layout",
  },
  {
    name: "Forms",
    slug: "forms",
    description: "Input groups, radio groups, select menus, checkboxes, toggles, form layouts, and sign-in forms.",
    variants: 74,
    category: "Input",
  },
  {
    name: "Navigation",
    slug: "navigation",
    description: "Navbars, sidebar nav, tabs, steps, breadcrumbs, command palettes, and pagination.",
    variants: 56,
    category: "Navigation",
  },
  {
    name: "Lists",
    slug: "lists",
    description: "Tables, stacked lists, grid lists, and activity feeds.",
    variants: 34,
    category: "Data",
  },
  {
    name: "Overlays",
    slug: "overlays",
    description: "Modals, notifications, and slide-over panels.",
    variants: 24,
    category: "Overlay",
  },
  {
    name: "Data Display",
    slug: "data-display",
    description: "Calendars, stats cards, and description lists.",
    variants: 16,
    category: "Data",
  },
  {
    name: "Headings",
    slug: "headings",
    description: "Card headings, page headings, and section headings with actions and metadata.",
    variants: 27,
    category: "Layout",
  },
  {
    name: "Layout",
    slug: "layout",
    description: "Panels, media objects, dividers, containers, and list containers.",
    variants: 39,
    category: "Layout",
  },
  {
    name: "Elements",
    slug: "elements",
    description: "Avatars, badges, button groups, buttons, and dropdown menus.",
    variants: 35,
    category: "UI",
  },
  {
    name: "Feedback",
    slug: "feedback",
    description: "Alert banners and empty state placeholders.",
    variants: 12,
    category: "Feedback",
  },
  {
    name: "Page Examples",
    slug: "page-examples",
    description: "Complete page layouts — home screens, detail views, and settings screens.",
    variants: 16,
    category: "Pages",
  },
];

const TOTAL_VARIANTS = SECTIONS.reduce((acc, s) => acc + s.variants, 0);

export default function ApplicationUIPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Application UI</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Application UI</h1>
        <p className="body max-w-md text-taupe-400">
          Interface patterns for web applications. Shells, forms, navigation, data lists, overlays, and full-page layouts — adapted to the brand.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-taupe-100 pt-5">
          <p className="caption text-taupe-400">{SECTIONS.length} section types</p>
          <div className="h-3 w-px bg-taupe-100" />
          <p className="caption text-taupe-400">{TOTAL_VARIANTS} variants total</p>
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
                <span className="caption-xs text-taupe-400">{section.variants} variants</span>
              </div>
              <CardTitle className="subheading text-taupe-900">{section.name}</CardTitle>
              <CardDescription className="caption leading-relaxed text-taupe-400">
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-auto px-0 py-0 text-taupe-500 hover:text-taupe-900 hover:bg-transparent"
              >
                <Link to={`/application-ui/${section.slug}`}>View section →</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="h-16" />
    </div>
  );
}
