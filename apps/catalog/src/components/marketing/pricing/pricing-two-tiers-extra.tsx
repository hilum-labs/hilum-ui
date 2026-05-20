
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

export default function PricingTwoTiersExtra() {
  const mainTiers = [
    {
      name: "Free",
      price: "$0",
      description: "A lightweight way to publish a small number of launch pages and test the workflow.",
      buttonVariant: "outline" as const,
      cta: "Create free workspace",
      features: ["One project", "Basic components", "Community support"],
    },
    {
      name: "Pro",
      price: "$89",
      description: "For teams that need shared ownership, approval flow, and richer reporting.",
      buttonVariant: "default" as const,
      cta: "Start Pro trial",
      features: ["Unlimited projects", "Approval routing", "Performance dashboards"],
    },
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">Simple conversion path</Badge>
          <h3 className="heading text-ground-900">Two main choices, with enterprise sales support beneath</h3>
          <p className="body mt-3 text-ground-500">
            Keep self-serve decisions fast while still making room for larger buyers who need custom procurement and security review.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {mainTiers.map((tier) => (
            <article key={tier.name} className="rounded-[2rem] border border-ground-100 bg-white p-8 shadow-natural">
              <h4 className="subheading text-ground-900">{tier.name}</h4>
              <div className="mt-6 flex items-end gap-2">
                <p className="text-5xl font-semibold tracking-tight text-ground-900">{tier.price}</p>
                <p className="body pb-1 text-ground-400">{tier.name === "Free" ? "" : "/mo"}</p>
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
                {tier.cta}
              </Button>
            </article>
          ))}
        </div>
        <div className="mt-6 rounded-[2rem] border border-ground-100 bg-ground-50 p-8 shadow-natural">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <h4 className="subheading text-ground-900">Enterprise</h4>
                <Badge variant="outline">Custom</Badge>
              </div>
              <p className="body mt-3 text-ground-500">
                Tailored pricing for organizations that need procurement support, advanced governance, and global rollout controls.
              </p>
            </div>
            <Button variant="brand">
              Contact sales
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
