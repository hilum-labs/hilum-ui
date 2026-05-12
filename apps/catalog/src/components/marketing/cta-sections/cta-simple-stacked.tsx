import { Button } from "@hilum/ui";

export default function CTASimpleStacked() {
  return (
    <section className="w-full bg-white px-6 py-24 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="heading text-taupe-900">
          Run every launch with confidence.
        </h2>
        <h2 className="heading mt-2 text-brand-primary">
          Give your team one clear next step.
        </h2>
        <p className="body mx-auto mt-5 max-w-2xl text-taupe-500">
          Turn scattered launch prep into a repeatable workflow with templates,
          approvals, and a single source of truth for status.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button size="lg">Book a walkthrough</Button>
          <Button variant="outline" size="lg">
            See customer stories
          </Button>
        </div>
      </div>
    </section>
  );
}
