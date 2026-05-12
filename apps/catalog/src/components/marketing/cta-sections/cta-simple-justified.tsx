import { Button } from "@hilum/ui";

export default function CTASimpleJustified() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10 lg:px-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="heading text-taupe-900">
            Turn launch prep into a repeatable system.
          </h2>
          <p className="body mt-4 text-taupe-500">
            Standardize how teams brief, review, and deliver so high-stakes
            work feels coordinated instead of improvised.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 lg:w-auto">
          <Button size="lg" className="w-full lg:w-auto">
            Start a trial
          </Button>
          <Button variant="outline" size="lg" className="w-full lg:w-auto">
            Request pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
