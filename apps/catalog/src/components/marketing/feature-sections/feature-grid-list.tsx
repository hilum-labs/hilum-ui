import { BarChart2, Globe, Layers, RefreshCw, Shield, Zap } from "lucide-react";
import { Badge } from "@hilum/ui";

export default function FeatureGridList() {
  const features = [
    {
      icon: Zap,
      name: "Rapid publishing",
      description: "Ship new stories and product updates in minutes.",
    },
    {
      icon: Globe,
      name: "Localization controls",
      description: "Coordinate regional launches from one shared base.",
    },
    {
      icon: Shield,
      name: "Governed collaboration",
      description: "Protect brand and compliance at every approval step.",
    },
    {
      icon: BarChart2,
      name: "Attribution signals",
      description: "See which launches contribute to pipeline faster.",
    },
    {
      icon: Layers,
      name: "Reusable sections",
      description: "Compose pages from a maintained catalog of proven blocks.",
    },
    {
      icon: RefreshCw,
      name: "Always up to date",
      description: "Sync campaign updates across every live touchpoint.",
    },
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.95fr_1.35fr]">
        <div className="rounded-[2rem] bg-ground-900 p-8 text-white shadow-elevated">
          <Badge variant="brand" className="mb-6">Control tower</Badge>
          <h3 className="heading text-white">Launch a clearer story across every channel</h3>
          <p className="body mt-3 text-ground-300">
            Manage content, approval flow, and performance signals in one operating layer designed for high-velocity teams.
          </p>
          <div className="mt-10 rounded-[1.5rem] bg-white/5 p-6 ring-1 ring-inset ring-white/[0.035]">
            <p className="caption text-ground-400">Average launch prep time</p>
            <p className="mt-3 text-6xl font-semibold tracking-tight text-brand-secondary">3.2x</p>
            <p className="body mt-3 text-ground-300">faster than teams managing work across docs, tickets, and ad hoc review threads.</p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.name} className="rounded-[1.5rem] border border-ground-100 bg-ground-50 p-5">
                <div className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-white text-brand-primary shadow-natural">
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
