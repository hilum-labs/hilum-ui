
import { Fragment } from "react";
import { Check, Minus, X } from "lucide-react";
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

export default function PricingComparisonTable() {
  const categories = [
    {
      name: "Publishing",
      rows: [
        { feature: "Reusable sections", starter: "check", growth: "check", enterprise: "check" },
        { feature: "Localization support", starter: "minus", growth: "check", enterprise: "check" },
        { feature: "Custom domains", starter: "check", growth: "check", enterprise: "check" },
      ],
    },
    {
      name: "Workflow",
      rows: [
        { feature: "Approval chains", starter: "x", growth: "check", enterprise: "check" },
        { feature: "Role-based access", starter: "minus", growth: "check", enterprise: "check" },
        { feature: "Audit history", starter: "x", growth: "minus", enterprise: "check" },
      ],
    },
    {
      name: "Support",
      rows: [
        { feature: "Email support", starter: "check", growth: "check", enterprise: "check" },
        { feature: "Priority support", starter: "x", growth: "minus", enterprise: "check" },
        { feature: "Dedicated onboarding", starter: "x", growth: "x", enterprise: "check" },
      ],
    },
  ] as const;

  return (
    <section className="w-full bg-ground-50 px-8 py-16 md:px-12">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-ground-100 bg-white shadow-natural">
        <div className="grid border-b border-ground-100 md:grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr]">
          <div className="px-6 py-6">
            <Badge variant="secondary" className="mb-4">Comparison table</Badge>
            <h3 className="heading text-ground-900">A large table for teams that compare every detail</h3>
            <p className="body mt-3 max-w-xl text-ground-500">
              Use structured categories and clear icon states to make deeper plan differences easy to scan.
            </p>
          </div>
          <div className="border-t border-ground-100 px-6 py-6 md:border-l md:border-t-0">
            <p className="subheading text-ground-900">Starter</p>
            <p className="body mt-2 text-ground-500">$39/mo</p>
          </div>
          <div className="border-t border-ground-100 px-6 py-6 md:border-l md:border-t-0">
            <div className="flex items-center gap-2">
              <p className="subheading text-ground-900">Growth</p>
              <Badge variant="brand">Popular</Badge>
            </div>
            <p className="body mt-2 text-ground-500">$119/mo</p>
          </div>
          <div className="border-t border-ground-100 px-6 py-6 md:border-l md:border-t-0">
            <p className="subheading text-ground-900">Enterprise</p>
            <p className="body mt-2 text-ground-500">Custom</p>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-ground-100 bg-ground-50">
              <th className="px-6 py-4 text-left subheading text-ground-900">Feature</th>
              <th className="px-6 py-4 text-center subheading text-ground-900">Starter</th>
              <th className="px-6 py-4 text-center subheading text-ground-900">Growth</th>
              <th className="px-6 py-4 text-center subheading text-ground-900">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <Fragment key={category.name}>
                <tr key={`${category.name}-header`} className="border-b border-ground-100 bg-white">
                  <td colSpan={4} className="px-6 py-4 label text-ground-400">
                    {category.name}
                  </td>
                </tr>
                {category.rows.map((row) => (
                  <tr key={row.feature} className="border-b border-ground-100 last:border-b-0">
                    <td className="px-6 py-4 body text-ground-700">{row.feature}</td>
                    <td className="px-6 py-4 text-center"><PricingStatus value={row.starter} /></td>
                    <td className="px-6 py-4 text-center"><PricingStatus value={row.growth} /></td>
                    <td className="px-6 py-4 text-center"><PricingStatus value={row.enterprise} /></td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
