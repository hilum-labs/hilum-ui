import { ArrowRight } from "lucide-react";
import { Button } from "@hilum/ui";

export default function HeroWithAngledImage() {
  return (
    <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="flex items-center py-8 lg:py-12">
          <div className="max-w-xl">
            <p className="label uppercase tracking-[0.24em] text-brand-primary">
              New analytics workspace
            </p>
            <h1 className="display mt-5 text-ground-900">
              See momentum build before the quarter closes.
            </h1>
            <p className="body mt-5 text-ground-500">
              Track campaign lift, pipeline contribution, and team capacity in
              one view designed for leaders who need signal, not noise.
            </p>
            <Button size="lg" className="mt-8">
              Explore dashboards
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-tl-[2rem] rounded-br-[2rem] bg-ground-100 p-6">
          <div className="flex h-full min-h-[320px] items-end">
            <div className="w-full rounded-[1.5rem] bg-white p-6 shadow-elevated">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="caption text-ground-400">Weekly pipeline lift</p>
                    <p className="heading mt-1 text-ground-900">+18.4%</p>
                  </div>
                  <span className="rounded-full bg-brand-secondary px-3 py-1 label text-ground-900">
                    Ahead of target
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[48, 68, 76, 92].map((height) => (
                    <div
                      key={height}
                      className="rounded-full bg-brand-primary/15 p-2"
                    >
                      <div
                        className="w-full rounded-full bg-brand-primary"
                        style={{ height }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
