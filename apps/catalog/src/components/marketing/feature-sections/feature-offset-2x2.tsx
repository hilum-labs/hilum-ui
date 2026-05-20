import { ArrowRight, BarChart2, Globe, Shield, Zap } from "lucide-react";
import { Button, Badge } from "@hilum/ui";

export default function FeatureOffset2x2() {
  const features = [
    {
      icon: Zap,
      name: "Intent scoring",
      description: "Prioritize the accounts most likely to convert with a live view of buying signals and team activity.",
    },
    {
      icon: Globe,
      name: "Market rollouts",
      description: "Launch tailored pages for every region without rebuilding the same campaign from scratch.",
    },
    {
      icon: Shield,
      name: "Review controls",
      description: "Route changes through the right reviewers based on content type, region, and compliance needs.",
    },
    {
      icon: BarChart2,
      name: "Performance loops",
      description: "Feed campaign results back into briefs so every new launch starts with sharper decisions.",
    },
  ];

  return (
    <section className="w-full bg-ground-50 px-8 py-16 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-1">
          <Badge variant="brand" className="mb-4">Strategy + execution</Badge>
          <h3 className="display text-ground-900">A flexible system for teams that need both speed and control</h3>
          <p className="body mt-4 max-w-sm text-ground-500">
            Pair strategic planning with reusable execution blocks so teams can ship consistent work without adding more process.
          </p>
          <div className="mt-6">
            <Button variant="outline">
              Talk to product team
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:col-span-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.name} className="rounded-[1.75rem] bg-white p-6 shadow-natural">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-secondary/25 text-ground-800">
                  <Icon className="size-5" />
                </div>
                <h4 className="subheading text-ground-900">{feature.name}</h4>
                <p className="body mt-2 text-ground-500">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
