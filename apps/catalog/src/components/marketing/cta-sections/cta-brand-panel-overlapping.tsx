import { ArrowRight } from "lucide-react";
import { Button } from "@hilum/ui";

function MockupWindow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`aspect-video w-full rounded-2xl bg-taupe-900 shadow-elevated ring-1 ring-taupe-800 ${className}`.trim()}
    >
      <div className="flex gap-1.5 p-4">
        <div className="size-2.5 rounded-full bg-taupe-700" />
        <div className="size-2.5 rounded-full bg-taupe-700" />
        <div className="size-2.5 rounded-full bg-taupe-700" />
      </div>
    </div>
  );
}

export default function CTABrandPanelOverlapping() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] shadow-elevated lg:grid-cols-2">
        <div className="flex flex-col justify-between bg-taupe-900 p-8 text-white sm:p-10 lg:p-12">
          <div>
            <p className="label uppercase tracking-[0.24em] text-taupe-400">
              Interactive demo
            </p>
            <h2 className="heading mt-4 text-white">
              Ready to give your launches a home base?
            </h2>
            <p className="body mt-4 text-taupe-300">
              See how high-output teams organize work, unblock reviews, and ship
              with more confidence.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              Book a demo
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/15 bg-transparent text-white shadow-none hover:bg-white/10"
            >
              View pricing
            </Button>
          </div>
        </div>

        <div className="relative bg-taupe-50 p-8 sm:p-10 lg:p-12">
          <div className="absolute inset-y-10 left-0 w-24 rounded-r-[2rem] bg-brand-primary" />
          <div className="relative ml-6 rounded-[1.75rem] bg-white p-4 shadow-natural sm:ml-12">
            <MockupWindow />
          </div>
        </div>
      </div>
    </section>
  );
}
