import { Check } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

export default function PricingThreeTiersEmphasized() {
  const tiers = [
    {
      name: "Starter",
      price: "$39",
      description: "Basic publishing and launch management for lean teams.",
      features: ["Three workspaces", "5 collaborators", "Shared blocks"],
      buttonVariant: "secondary" as const,
    },
    {
      name: "Growth",
      price: "$129",
      description: "Best for teams running launches across product, lifecycle, and paid channels.",
      features: ["Unlimited workspaces", "Approval paths", "Performance dashboards"],
      buttonVariant: "default" as const,
      featured: true,
    },
    {
      name: "Scale",
      price: "$299",
      description: "Advanced governance and service for organizations with complex rollout needs.",
      features: ["Security controls", "Data exports", "Dedicated success manager"],
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <section className="w-full bg-ground-50 px-8 py-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            Recommended pricing
          </Badge>
          <h3 className="heading text-ground-900">
            Highlight the plan you want most teams to choose
          </h3>
          <p className="body mt-3 text-ground-500">
            Use emphasis, hierarchy, and a stronger call to action to guide buyers toward the
            highest-fit tier.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3 lg:items-end">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={[
                "rounded-[2rem] border bg-white p-8",
                tier.featured
                  ? "border-brand-primary ring-2 ring-brand-primary shadow-elevated lg:-translate-y-3"
                  : "border-ground-100 shadow-natural",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <h4 className="subheading text-ground-900">{tier.name}</h4>
                {tier.featured && <Badge variant="brand">Most popular</Badge>}
              </div>
              <div className="mt-6 flex items-end gap-2">
                <p className="text-5xl font-semibold tracking-tight text-ground-900">
                  {tier.price}
                </p>
                <p className="body pb-1 text-ground-400">/mo</p>
              </div>
              <p className="body mt-3 text-ground-500">{tier.description}</p>
              <div className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 text-brand-primary" />
                    <p className="body text-ground-600">{feature}</p>
                  </div>
                ))}
              </div>
              <Button variant={tier.buttonVariant} className="mt-6 w-full">
                {tier.featured ? "Upgrade to Growth" : `Choose ${tier.name}`}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
