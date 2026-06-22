import { BarChart2, Layers, Shield, Zap } from "lucide-react";
import { Badge } from "@hilum/ui";

export default function FeatureGridOnBrand() {
  const features = [
    "Usage analytics that tie product behavior to pipeline outcomes.",
    "Role-based approvals that keep launches compliant without slowing them down.",
    "Structured content layers for campaigns, docs, and lifecycle messaging.",
    "Audit history for every update across assets, regions, and contributors.",
    "Reusable messaging modules shared by marketing, product, and success.",
    "Experiment tracking that pairs creative changes with measurable results.",
    "Global release calendars with team ownership and deadline visibility.",
    "Automated syncs that keep connected systems aligned after every publish.",
  ];

  return (
    <section className="w-full bg-ground-900 px-8 py-16 text-white md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <Badge variant="brand" className="mb-4">
            Built for scale
          </Badge>
          <h3 className="heading text-white">One system for every product story you ship</h3>
          <p className="body mt-3 text-ground-300">
            Consolidate planning, proof, and publishing into a branded workflow designed for teams
            operating across multiple markets.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <article key={feature} className="rounded-3xl p-6 ring-1 ring-inset ring-white/[0.035]">
              <div className="mb-4 flex size-10 items-center justify-center rounded-2xl bg-white/10 text-brand-secondary">
                {index % 4 === 0 && <Zap className="size-5" />}
                {index % 4 === 1 && <Shield className="size-5" />}
                {index % 4 === 2 && <Layers className="size-5" />}
                {index % 4 === 3 && <BarChart2 className="size-5" />}
              </div>
              <p className="body text-ground-100">{feature}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
