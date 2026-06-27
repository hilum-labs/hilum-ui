import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";
import {
  getComponentEntriesBySection,
  groupComponentEntries,
  type ComponentRegistryEntry,
} from "@/lib/component-registry";

/* ------------------------------------------------------------------ */
/*  Component registry                                                  */
/* ------------------------------------------------------------------ */

const GROUPS = groupComponentEntries(getComponentEntriesBySection("atoms"));

const CATEGORY_LABEL: Record<ComponentRegistryEntry["category"], string> = {
  primitive: "Primitive",
  form: "Form",
  overlay: "Overlay",
  layout: "Layout",
  feedback: "Feedback",
  data: "Data",
};

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

function AtomsPage() {
  const totalComponents = GROUPS.reduce((acc, g) => acc + g.components.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Atoms</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Atoms</h1>
        <p className="body max-w-md text-ground-400">
          The smallest functional units of the design system. These primitives are the foundation
          for all molecules and blocks.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">{totalComponents} components</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Based on shadcn/ui · Radix UI</p>
        </div>
      </div>

      <PageDocs path="/atoms/" />

      {/* Groups */}
      <div className="flex flex-col gap-12">
        {GROUPS.map((group) => (
          <section key={group.label}>
            {/* Section heading */}
            <div className="mb-6 flex items-center gap-3">
              <h2 className="label text-ground-400">{group.label}</h2>
              <div className="h-px flex-1 bg-ground-100" />
            </div>

            {/* Component grid */}
            <div className="grid grid-cols-3 gap-4">
              {group.components.map((component) => (
                <Card
                  key={component.slug}
                  className="shadow-natural flex flex-col justify-between transition-shadow hover:shadow-elevated"
                >
                  <CardHeader className="pb-2">
                    <div className="mb-2">
                      <Badge variant="secondary" className="caption-xs">
                        {CATEGORY_LABEL[component.category]}
                      </Badge>
                    </div>
                    <CardTitle className="subheading text-ground-900">{component.name}</CardTitle>
                    <CardDescription className="caption leading-relaxed text-ground-400">
                      {component.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 py-0 text-ground-500 hover:text-ground-900 hover:bg-transparent"
                    >
                      <a href={`/atoms/${component.slug}`}>View component →</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom spacer */}
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/")({
  head: () => createCatalogPageHead("/atoms/"),
  component: AtomsPage,
});
