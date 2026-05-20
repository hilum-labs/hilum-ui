import { Star } from "lucide-react";
import { Button } from "@hilum/ui";

function MockupWindow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`aspect-video w-full rounded-2xl bg-ground-900 shadow-elevated ring-1 ring-ground-800 ${className}`.trim()}
    >
      <div className="flex gap-1.5 p-4">
        <div className="size-2.5 rounded-full bg-ground-700" />
        <div className="size-2.5 rounded-full bg-ground-700" />
        <div className="size-2.5 rounded-full bg-ground-700" />
      </div>
    </div>
  );
}

export default function HeroSplitWithScreenshot() {
  return (
    <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
        <div className="max-w-xl">
          <p className="label uppercase tracking-[0.24em] text-brand-primary">
            Product launches, unified
          </p>
          <h1 className="display mt-5 text-ground-900">
            The planning layer for every product launch.
          </h1>
          <p className="body mt-5 text-ground-500">
            Align go-to-market owners, track readiness across workstreams, and
            keep every stakeholder working from the same launch plan.
          </p>

          <form className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your work email"
              className="h-11 flex-1 rounded-md border border-ground-200 bg-white px-3 body text-ground-900 outline-none placeholder:text-ground-400 focus:border-ground-300"
            />
            <Button size="lg" className="sm:px-5">
              Get access
            </Button>
          </form>

          <div className="mt-6 flex flex-col gap-3 text-ground-500 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1 text-brand-primary">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
            <p className="body">
              Rated 4.9 out of 5 by growth, brand, and product teams.
            </p>
          </div>
        </div>

        <div>
          <MockupWindow className="lg:aspect-[1.08/1]" />
        </div>
      </div>
    </section>
  );
}
