import { ArrowRight, Check } from "lucide-react";
import { Button } from "@hilum/ui";

export default function HeroDarkWithIllustration() {
  return (
    <section className="w-full bg-taupe-900 px-6 py-24 text-white sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="max-w-xl">
          <p className="label uppercase tracking-[0.24em] text-brand-secondary">
            Operating cadence for ambitious teams
          </p>
          <h1 className="display mt-5 text-white">
            A calmer way to run work across every team.
          </h1>
          <p className="body mt-5 text-taupe-400">
            Balance priorities, share updates automatically, and keep delivery
            moving even when plans shift mid-quarter.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              Start trial
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="brand" size="lg" className="shadow-none">
              See product tour
            </Button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-taupe-800 bg-taupe-950 p-6 shadow-elevated">
          <div className="grid gap-4">
            <div className="rounded-2xl border border-taupe-800 bg-taupe-900/80 p-5">
              <p className="caption text-taupe-400">Workflow health</p>
              <div className="mt-4 flex items-end justify-between">
                <p className="heading text-white">Stable</p>
                <span className="rounded-full bg-brand-secondary px-3 py-1 label text-taupe-950">
                  14 blockers cleared
                </span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Weekly planning ritual",
                "Automated owner reminders",
                "Cross-team status digests",
                "Board-level reporting",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-taupe-800 bg-taupe-900/70 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-brand-primary">
                      <Check className="size-3.5 text-white" />
                    </div>
                    <p className="body text-taupe-200">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
