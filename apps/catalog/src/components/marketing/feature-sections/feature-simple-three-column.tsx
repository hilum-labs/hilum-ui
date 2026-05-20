import { BarChart2, Globe, Layers, RefreshCw, Shield, Zap } from "lucide-react";
import { Badge } from "@hilum/ui";

export default function FeatureSimpleThreeColumn() {
  const features = [
    {
      icon: Zap,
      name: "Faster launches",
      description: "Move from kickoff to production with reusable workflows, approvals, and handoff built into every project.",
    },
    {
      icon: Globe,
      name: "Global governance",
      description: "Keep teams aligned across regions with shared standards, local permissions, and multilingual publishing controls.",
    },
    {
      icon: Shield,
      name: "Enterprise security",
      description: "Protect customer data with granular access, audit trails, SSO support, and policy-based release management.",
    },
    {
      icon: BarChart2,
      name: "Revenue visibility",
      description: "Track activation, retention, and expansion in one operational dashboard instead of stitching together reports.",
    },
    {
      icon: Layers,
      name: "Composable foundation",
      description: "Mix modular content, logic, and design tokens without slowing teams down with brittle one-off pages.",
    },
    {
      icon: RefreshCw,
      name: "Continuous updates",
      description: "Roll out messaging, experiments, and pricing changes in minutes with a workflow your whole team can trust.",
    },
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">Platform overview</Badge>
          <h3 className="heading text-ground-900">Everything your team needs to ship with confidence</h3>
          <p className="body mt-3 text-ground-500">
            Bring product, design, marketing, and operations into one system that turns strategy into launch-ready work.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.name} className="rounded-2xl border border-ground-100 p-6 shadow-natural">
                <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary">
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
