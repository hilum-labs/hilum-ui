
import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

export default function PricingFourTiersToggle() {
  const [annual, setAnnual] = useState(false);

  const tiers = [
    {
      name: "Hobby",
      monthly: "$0",
      annual: "$0",
      description: "For solo builders validating a new idea.",
      features: ["1 workspace", "Community support"],
    },
    {
      name: "Starter",
      monthly: "$24",
      annual: "$19",
      description: "For small teams ready to launch consistently.",
      features: ["3 collaborators", "Unlimited pages"],
    },
    {
      name: "Growth",
      monthly: "$79",
      annual: "$63",
      description: "For revenue teams coordinating campaigns and releases.",
      features: ["Approval workflows", "Custom dashboards"],
      featured: true,
    },
    {
      name: "Scale",
      monthly: "$179",
      annual: "$149",
      description: "For organizations operating globally with governance needs.",
      features: ["SSO", "Priority onboarding"],
    },
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-4">Usage-based flexibility</Badge>
          <h3 className="heading text-ground-900">Offer monthly or annual pricing without changing the layout</h3>
          <p className="body mt-3 max-w-2xl text-ground-500">
            Give buyers a clean toggle that rewards longer commitments while keeping every plan easy to compare.
          </p>
          <div className="mt-6 inline-flex rounded-full bg-ground-100 p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={[
                "rounded-full px-4 py-2 caption transition-colors",
                annual ? "text-ground-500" : "bg-white text-ground-900 shadow-natural",
              ].join(" ")}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={[
                "rounded-full px-4 py-2 caption transition-colors",
                annual ? "bg-white text-ground-900 shadow-natural" : "text-ground-500",
              ].join(" ")}
            >
              Annual
            </button>
          </div>
          <p className="caption mt-3 text-ground-400">{annual ? "Billed yearly, save up to 20%" : "Switch to annual to save up to 20%"}</p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {tiers.map((tier) => {
            const price = annual ? tier.annual : tier.monthly;
            return (
              <article
                key={tier.name}
                className={[
                  "rounded-[1.75rem] border bg-white p-7",
                  tier.featured ? "border-brand-primary shadow-elevated" : "border-ground-100 shadow-natural",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <h4 className="subheading text-ground-900">{tier.name}</h4>
                  {tier.featured && <Badge variant="brand">Most popular</Badge>}
                </div>
                <div className="mt-6 flex items-end gap-2">
                  <p className="text-4xl font-semibold tracking-tight text-ground-900">{price}</p>
                  <p className="body pb-1 text-ground-400">{tier.name === "Hobby" ? "" : annual ? "/mo billed yearly" : "/mo"}</p>
                </div>
                <p className="body mt-3 min-h-12 text-ground-500">{tier.description}</p>
                <div className="mt-6 space-y-3">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="mt-0.5 size-4 text-brand-primary" />
                      <p className="body text-ground-600">{feature}</p>
                    </div>
                  ))}
                </div>
                <Button variant={tier.featured ? "default" : "outline"} className="mt-6 w-full">
                  {tier.name === "Hobby" ? "Start free" : `Choose ${tier.name}`}
                </Button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
