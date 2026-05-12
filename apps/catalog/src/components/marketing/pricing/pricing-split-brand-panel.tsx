
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

export default function PricingSplitBrandPanel() {
  const leftFeatures = [
    "Unlimited campaigns",
    "Approval workflows",
    "Conversion reporting",
    "Priority support",
  ];

  const rightFeatures = [
    "Reusable component library",
    "Granular collaborator roles",
    "Regional publishing controls",
    "Experiment tracking and attribution",
    "Audit logs and version history",
    "Dedicated onboarding guidance",
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] shadow-elevated lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-brand-primary px-8 py-10 text-white">
          <Badge variant="warning" className="mb-4">Best for teams</Badge>
          <h3 className="heading text-white">Growth</h3>
          <div className="mt-6 flex items-end gap-2">
            <p className="text-6xl font-semibold tracking-tight text-white">$149</p>
            <p className="body pb-2 text-white/80">/mo</p>
          </div>
          <p className="body mt-4 text-white/80">
            A strong default for teams scaling launch volume, approval complexity, and reporting needs.
          </p>
          <div className="mt-8 space-y-3">
            {leftFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="mt-0.5 size-4 text-white" />
                <p className="body text-white/90">{feature}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white px-8 py-10">
          <p className="label text-taupe-400">What's included</p>
          <h4 className="heading mt-3 text-taupe-900">Every capability needed to run coordinated launches</h4>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {rightFeatures.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-2xl bg-taupe-50 px-4 py-4">
                <Check className="mt-0.5 size-4 text-brand-primary" />
                <p className="body text-taupe-600">{feature}</p>
              </div>
            ))}
          </div>
          <Button className="mt-8">
            Start with Growth
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
