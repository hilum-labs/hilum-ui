import { BarChart2, Globe, Layers, RefreshCw, Shield, Zap } from "lucide-react";
import { Badge } from "@hilum/ui";

export default function FeatureGridOffsetIcons() {
  const features = [
    {
      icon: Zap,
      name: "Smart briefs",
      description: "Kick off every project with pre-filled goals, channels, owners, and success criteria.",
    },
    {
      icon: BarChart2,
      name: "Forecasting",
      description: "See launch impact before campaigns go live with benchmarks tied to historical performance.",
    },
    {
      icon: Globe,
      name: "Regional visibility",
      description: "Surface blockers, approvals, and publication status across every country rollout.",
    },
    {
      icon: Shield,
      name: "Compliance checks",
      description: "Catch missing approvals and policy violations before launch windows are at risk.",
    },
    {
      icon: Layers,
      name: "Shared building blocks",
      description: "Reuse the same approved modules across product pages, emails, and campaign landers.",
    },
    {
      icon: RefreshCw,
      name: "Operational cadence",
      description: "Create a predictable launch rhythm with reminders, recurring reviews, and version history.",
    },
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Badge variant="outline" className="mb-4">Launch operations</Badge>
          <h3 className="heading text-taupe-900">Operational clarity for every launch</h3>
          <p className="body mt-3 text-taupe-500">
            Turn scattered checklists and one-off spreadsheets into a reliable operating system for your entire launch calendar.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.name} className="relative rounded-3xl bg-taupe-50 p-6 pt-10">
                <div className="absolute -top-4 left-6 flex size-12 items-center justify-center rounded-2xl bg-white text-brand-primary shadow-natural">
                  <Icon className="size-5" />
                </div>
                <h4 className="subheading text-taupe-900">{feature.name}</h4>
                <p className="body mt-2 text-taupe-500">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
