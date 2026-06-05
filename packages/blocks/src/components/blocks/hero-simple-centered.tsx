import { Button } from "@hilum/ui";

export default function HeroSimpleCentered() {
  return (
    <section className="w-full bg-card px-6 py-24 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-4xl text-center">
        <p className="label uppercase tracking-[0.24em] text-muted-foreground">
          Revenue operations for modern teams
        </p>
        <h1 className="display mt-6 text-foreground">
          Run every launch with more <span className="text-brand-primary">clarity</span>.
        </h1>
        <p className="body mx-auto mt-5 max-w-2xl text-muted-foreground">
          Newlane gives product, marketing, and sales one operating layer for planning campaigns,
          aligning teams, and measuring impact without the spreadsheet churn.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto">
            Book a demo
          </Button>
          <Button variant="outline" size="lg" className="w-full border-border sm:w-auto">
            See pricing
          </Button>
        </div>
      </div>
    </section>
  );
}
