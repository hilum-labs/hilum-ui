import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
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

/* ------------------------------------------------------------------ */
/*  Component registry                                                  */
/* ------------------------------------------------------------------ */

type MoleculeEntry = {
  name: string;
  slug: string;
  description: string;
  atoms: string;
};

const MOLECULES: MoleculeEntry[] = [
  {
    name: "Field",
    slug: "field",
    description: "A labeled form control. Composes Label, Input or Textarea, and optional hint or error text.",
    atoms: "Label · Input · Textarea",
  },
  {
    name: "Input Group",
    slug: "input-group",
    description: "An input with leading or trailing text addons and icons. Extends Input with contextual decoration.",
    atoms: "Input",
  },
  {
    name: "Stat Card",
    slug: "stat-card",
    description: "A metric display card. Composes a label, a large value, an optional trend indicator, and an optional icon.",
    atoms: "Card · Badge · Icon",
  },
  {
    name: "Empty State",
    slug: "empty-state",
    description: "A placeholder for empty lists, zero-data views, and no-results scenarios.",
    atoms: "Button · Icon",
  },
  {
    name: "Description List",
    slug: "description-list",
    description: "Key–value pairs for displaying structured details. Common in profile pages and settings panels.",
    atoms: "Badge · Button",
  },
  {
    name: "Section Heading",
    slug: "section-heading",
    description: "A section header with optional description and action buttons. Used above lists and tables.",
    atoms: "Button",
  },
  {
    name: "Page Heading",
    slug: "page-heading",
    description: "A full page header with breadcrumb navigation, title, metadata, and action buttons.",
    atoms: "Button · Badge · Breadcrumb",
  },
  {
    name: "Activity Feed",
    slug: "activity-feed",
    description: "A vertical timeline of events with icons, rich content, and timestamps.",
    atoms: "Icon",
  },
  {
    name: "Stacked List",
    slug: "stacked-list",
    description: "A vertically stacked list of rows with consistent padding and optional hover behavior.",
    atoms: "Badge · Avatar",
  },
  {
    name: "Action Panel",
    slug: "action-panel",
    description: "A bordered card that communicates a single focused action. Common in settings pages.",
    atoms: "Button · Card",
  },
  {
    name: "Notification",
    slug: "notification",
    description: "A toast-style notification panel with success, error, warning, and info variants.",
    atoms: "Icon · Button",
  },
  {
    name: "Radio Cards",
    slug: "radio-card",
    description: "Card-style single selection. Each option is a bordered card that highlights when selected.",
    atoms: "Radio Group · Card",
  },
  {
    name: "Card Heading",
    slug: "card-heading",
    description: "A header row for cards and panels. Combines title, description, leading slot, and trailing actions.",
    atoms: "Card · Avatar · Button · Dropdown Menu",
  },
  {
    name: "Media Object",
    slug: "media-object",
    description: "A layout primitive pairing a fixed media element with a flexible text block.",
    atoms: "Avatar · Icon",
  },
  {
    name: "Grid List",
    slug: "grid-list",
    description: "A responsive grid of cards. Supports simple content, accent-strip, and custom contact layouts.",
    atoms: "Card · Badge · Avatar",
  },
  {
    name: "Command Palette",
    slug: "command-palette",
    description: "A modal search dialog for navigating and executing commands quickly. Grouped by category.",
    atoms: "Dialog · Input · Icon · Kbd",
  },
];

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

function MoleculesPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Molecules</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Molecules</h1>
        <p className="body max-w-md text-ground-400">
          Composed components built from atoms. Each molecule combines
          primitives into a reusable, purpose-built pattern.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">{MOLECULES.length} components</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Built on Atoms</p>
        </div>
      </div>

      <PageDocs path="/molecules/" />

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {MOLECULES.map((molecule) => (
          <Card
            key={molecule.slug}
            className="shadow-natural flex flex-col justify-between transition-shadow hover:shadow-elevated"
          >
            <CardHeader className="pb-2">
              <div className="mb-2">
                <Badge variant="secondary" className="caption-xs">
                  Molecule
                </Badge>
              </div>
              <CardTitle className="subheading text-ground-900">
                {molecule.name}
              </CardTitle>
              <CardDescription className="caption leading-relaxed text-ground-400">
                {molecule.description}
              </CardDescription>
            </CardHeader>
            <div className="px-5 pb-3">
              <p className="caption text-ground-300">{molecule.atoms}</p>
            </div>
            <CardFooter className="pt-0">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="h-auto px-0 py-0 text-ground-500 hover:text-ground-900 hover:bg-transparent"
              >
                <a href={`/molecules/${molecule.slug}`}>View component →</a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/")({
  head: () => createCatalogPageHead("/molecules/"),
  component: MoleculesPage,
});
