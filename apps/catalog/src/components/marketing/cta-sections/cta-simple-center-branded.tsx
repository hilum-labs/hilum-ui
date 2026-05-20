import { Button } from "@hilum/ui";

export default function CTASimpleCenterBranded() {
  return (
    <section className="w-full bg-brand-primary px-6 py-24 text-white sm:px-10 lg:px-14">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="heading text-white">
          One more launch without a system is one too many.
        </h2>
        <p className="body mt-4 text-white/80">
          Give every stakeholder one place to see what is ready, what is
          blocked, and what needs a decision before the date lands.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            className="w-full bg-white text-ground-900 hover:bg-ground-100 sm:w-auto"
          >
            Start free
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full border-white/30 bg-transparent text-white shadow-none hover:bg-white/10 sm:w-auto"
          >
            Talk to sales
          </Button>
        </div>
      </div>
    </section>
  );
}
