
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

export default function PricingSingleWithDetails() {
  const features = [
    "Unlimited landing pages and campaign sections",
    "Reusable design system blocks and tokens",
    "Collaborator permissions and approval flow",
    "Launch analytics and conversion reporting",
    "Audience segmentation and localization support",
    "Priority support during launch windows",
  ];

  return (
    <section className="w-full bg-ground-50 px-8 py-16 md:px-12">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-ground-100 bg-white p-8 shadow-natural md:p-10">
        <div className="text-center">
          <Badge variant="brand" className="mb-4">One clear plan</Badge>
          <h3 className="heading text-ground-900">Everything growing teams need for predictable launches</h3>
          <div className="mt-6 flex items-end justify-center gap-2">
            <p className="text-6xl font-semibold tracking-tight text-ground-900">$149</p>
            <p className="body pb-2 text-ground-400">/mo</p>
          </div>
          <p className="body mt-3 text-ground-500">
            One price for the complete workflow, from planning and approvals to publishing and reporting.
          </p>
          <Button className="mt-6">
            Start 14-day trial
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
        <div className="my-8 h-px bg-ground-100" />
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <div key={feature} className="flex items-start gap-3 rounded-2xl bg-ground-50 px-4 py-4">
              <Check className="mt-0.5 size-4 text-brand-primary" />
              <p className="body text-ground-600">{feature}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
