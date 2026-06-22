import { Check, Minus, X } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

function PricingStatus({ value }: { value: "check" | "x" | "minus" }) {
  if (value === "check") {
    return <Check className="mx-auto size-4 text-brand-primary" />;
  }

  if (value === "x") {
    return <X className="mx-auto size-4 text-ground-300" />;
  }

  return <Minus className="mx-auto size-4 text-ground-300" />;
}

export default function PricingBrandComparison() {
  const tiers = [
    {
      name: "Starter",
      price: "$39",
      description: "For emerging teams",
    },
    {
      name: "Growth",
      price: "$119",
      description: "For multi-channel launches",
      featured: true,
    },
    {
      name: "Scale",
      price: "$289",
      description: "For governed global rollout",
    },
  ];

  const rows = [
    { label: "Reusable sections", starter: "check", growth: "check", scale: "check" },
    { label: "Approval workflows", starter: "minus", growth: "check", scale: "check" },
    { label: "Advanced analytics", starter: "x", growth: "check", scale: "check" },
    { label: "SSO and SCIM", starter: "x", growth: "minus", scale: "check" },
    { label: "Dedicated onboarding", starter: "x", growth: "minus", scale: "check" },
  ] as const;

  return (
    <section className="w-full bg-ground-900 px-8 py-16 text-white md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="brand" className="mb-4">
            Dark comparison
          </Badge>
          <h3 className="heading text-white">
            Pair pricing cards with a deeper feature comparison
          </h3>
          <p className="body mt-3 text-ground-300">
            Start with clear buying options, then let buyers scan the details that matter most
            before talking to sales.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className={[
                "rounded-[2rem] border p-7",
                tier.featured
                  ? "border-brand-primary bg-white/10 shadow-elevated"
                  : "border-ground-700 bg-white/5",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <h4 className="subheading text-white">{tier.name}</h4>
                {tier.featured && <Badge variant="brand">Most popular</Badge>}
              </div>
              <div className="mt-5 flex items-end gap-2">
                <p className="text-5xl font-semibold tracking-tight text-white">{tier.price}</p>
                <p className="body pb-1 text-ground-400">/mo</p>
              </div>
              <p className="body mt-3 text-ground-300">{tier.description}</p>
              <Button variant={tier.featured ? "brand" : "outline"} className="mt-6 w-full">
                {tier.featured ? "Choose Growth" : `Select ${tier.name}`}
              </Button>
            </article>
          ))}
        </div>
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-ground-700 bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-ground-100">
                <th className="px-6 py-4 text-left subheading text-ground-900">Feature</th>
                <th className="px-6 py-4 text-center subheading text-ground-900">Starter</th>
                <th className="px-6 py-4 text-center subheading text-ground-900">Growth</th>
                <th className="px-6 py-4 text-center subheading text-ground-900">Scale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ground-100">
              {rows.map((row) => (
                <tr key={row.label}>
                  <td className="px-6 py-4 body text-ground-700">{row.label}</td>
                  <td className="px-6 py-4 text-center">
                    <PricingStatus value={row.starter} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <PricingStatus value={row.growth} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <PricingStatus value={row.scale} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
