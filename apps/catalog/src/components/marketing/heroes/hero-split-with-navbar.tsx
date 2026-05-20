import { ChevronRight } from "lucide-react";
import { Button } from "@hilum/ui";

export default function HeroSplitWithNavbar() {
  return (
    <section className="w-full bg-white">
      <div className="border-b border-ground-100 px-6 sm:px-10 lg:px-14">
        <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-ground-900 text-white">
              <span className="subheading text-white">L</span>
            </div>
            <span className="subheading text-ground-900">Lattice OS</span>
          </div>
          <div className="hidden items-center gap-6 body text-ground-500 md:flex">
            <a href="#" className="transition-colors hover:text-ground-900">
              Platform
            </a>
            <a href="#" className="transition-colors hover:text-ground-900">
              Customers
            </a>
            <a href="#" className="transition-colors hover:text-ground-900">
              Pricing
            </a>
            <a href="#" className="transition-colors hover:text-ground-900">
              Resources
            </a>
          </div>
          <Button variant="outline" className="border-ground-200">
            Sign in
          </Button>
        </div>
      </div>

      <div className="px-6 py-12 sm:px-10 lg:px-14 lg:py-14">
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-ground-100 lg:grid-cols-2">
          <div className="bg-white px-8 py-12 sm:px-10 lg:px-12 lg:py-16">
            <p className="label uppercase tracking-[0.24em] text-ground-400">
              Workflow infrastructure
            </p>
            <h1 className="display mt-5 text-ground-900">
              Own the handoff from strategy to launch.
            </h1>
            <p className="body mt-5 max-w-lg text-ground-500">
              Keep briefs, deliverables, dependencies, and final sign-off in one
              system so nothing falls out of sight when a date gets tight.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg">
                Tour the platform
                <ChevronRight className="size-4" />
              </Button>
              <Button variant="outline" size="lg">
                Talk to a strategist
              </Button>
            </div>
          </div>

          <div className="flex min-h-[320px] flex-col justify-between bg-brand-primary p-8 text-white sm:p-10 lg:p-12">
            <div className="space-y-3">
              <p className="label uppercase tracking-[0.24em] text-white/70">
                This week in motion
              </p>
              <div className="rounded-2xl bg-white/12 p-5 backdrop-blur">
                <p className="caption text-white/70">Launch readiness</p>
                <p className="heading mt-2 text-white">92%</p>
                <p className="body mt-2 text-white/80">
                  Creative signed off, field enablement staged, regional
                  localization on track.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Automated approvals",
                "Live task tracking",
                "Executive visibility",
                "Reusable launch templates",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3"
                >
                  <p className="body text-white">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
