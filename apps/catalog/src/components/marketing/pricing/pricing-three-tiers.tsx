
import { Check } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

export default function PricingThreeTiers() {
  const tiers = [
    {
      name: "Starter",
      price: "$29",
      note: "For teams shipping their first repeatable launches.",
      buttonVariant: "secondary" as const,
      cta: "Start with Starter",
      features: ["Unlimited pages", "Shared component library", "Basic analytics", "Email support"],
    },
    {
      name: "Growth",
      price: "$99",
      note: "For revenue teams managing multiple launches every month.",
      buttonVariant: "default" as const,
      cta: "Choose Growth",
      featured: true,
      features: ["Everything in Starter", "Advanced permissions", "Approval workflows", "Custom reporting"],
    },
    {
      name: "Enterprise",
      price: "$249",
      note: "For companies needing security, governance, and scale.",
      buttonVariant: "outline" as const,
      cta: "Talk to sales",
      features: ["Everything in Growth", "SSO + SCIM", "Audit logs", "Priority onboarding"],
    },
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h3 className="heading text-ground-900">Choose the plan that matches your launch volume</h3>
          <p className="body mt-3 text-ground-500">
            Flexible pricing for teams moving from simple publishing to coordinated, high-stakes go-to-market execution.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <article key={tier.name} className="rounded-[2rem] border border-ground-100 bg-white p-8 shadow-natural">
              <div className="flex items-center justify-between">
                <h4 className="subheading text-ground-900">{tier.name}</h4>
                {tier.featured && <Badge variant="brand">Most popular</Badge>}
              </div>
              <div className="mt-6 flex items-end gap-2">
                <p className="text-5xl font-semibold tracking-tight text-ground-900">{tier.price}</p>
                <p className="body pb-1 text-ground-400">/mo</p>
              </div>
              <p className="body mt-3 text-ground-500">{tier.note}</p>
              <Button variant={tier.buttonVariant} className="mt-6 w-full">
                {tier.cta}
              </Button>
              <div className="mt-6 space-y-3 border-t border-ground-100 pt-6">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 text-brand-primary" />
                    <p className="body text-ground-600">{feature}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
