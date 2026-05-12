
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@hilum/ui";
import { Badge } from "@hilum/ui";

export default function PricingSingleFeatureList() {
  const features = [
    "Unlimited stakeholders and reviewers",
    "Detailed launch history and audit trails",
    "Experiment reporting and attribution views",
    "Custom roles for product, marketing, and legal",
    "Localization workflows and translation status",
    "Dedicated onboarding specialist",
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto max-w-5xl rounded-[2rem] border border-taupe-100 bg-white p-8 shadow-natural md:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Badge variant="secondary" className="mb-4">Single plan</Badge>
            <h3 className="heading text-taupe-900">Keep pricing simple while reinforcing value</h3>
            <div className="mt-6 flex items-end gap-2">
              <p className="text-6xl font-semibold tracking-tight text-taupe-900">$199</p>
              <p className="body pb-2 text-taupe-400">/mo</p>
            </div>
            <p className="body mt-4 text-taupe-500">
              Designed for teams that want one complete platform instead of piecing together approvals, content, and reporting tools.
            </p>
          </div>
          <div className="space-y-4">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 rounded-2xl bg-taupe-50 px-4 py-4">
                <Check className="mt-0.5 size-4 text-brand-primary" />
                <p className="body text-taupe-600">{feature}</p>
              </div>
            ))}
          </div>
        </div>
        <Button className="mt-8 w-full" size="lg">
          Start your workspace
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </section>
  );
}
