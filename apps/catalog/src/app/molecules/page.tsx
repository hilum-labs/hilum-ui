import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Link } from "@tanstack/react-router";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { getComponentEntriesBySection } from "@/lib/component-registry";

/* ------------------------------------------------------------------ */
/*  Component registry                                                  */
/* ------------------------------------------------------------------ */

const MOLECULES = getComponentEntriesBySection("molecules");

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

function MoleculesPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Molecules</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Molecules</h1>
        <p className="body max-w-md text-ground-400">
          Composed components built from atoms. Each molecule combines primitives into a reusable,
          purpose-built pattern.
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
              <CardTitle className="subheading text-ground-900">{molecule.name}</CardTitle>
              <CardDescription className="caption leading-relaxed text-ground-400">
                {molecule.description}
              </CardDescription>
            </CardHeader>
            <div className="px-5 pb-3">
              <p className="caption text-ground-300">{molecule.composedFrom}</p>
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
