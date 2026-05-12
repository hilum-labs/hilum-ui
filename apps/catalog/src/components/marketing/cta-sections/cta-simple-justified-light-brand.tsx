import { ChevronRight } from "lucide-react";
import { Button } from "@hilum/ui";

export default function CTASimpleJustifiedLightBrand() {
  return (
    <section className="w-full bg-brand-secondary/30 px-6 py-16 sm:px-10 lg:px-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="heading text-taupe-900">
            Make the next launch your cleanest one yet.
          </h2>
          <p className="body mt-4 text-taupe-600">
            Bring briefs, reviews, decisions, and approvals into a single
            rhythm that every stakeholder can follow.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 lg:w-auto">
          <Button size="lg" className="w-full lg:w-auto">
            See the workflow
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="outline" size="lg" className="w-full lg:w-auto">
            Talk to an expert
          </Button>
        </div>
      </div>
    </section>
  );
}
