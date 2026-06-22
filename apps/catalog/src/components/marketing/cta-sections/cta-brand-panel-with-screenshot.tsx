import { Check } from "lucide-react";
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

export default function CTABrandPanelWithScreenshot() {
  return (
    <section className="w-full bg-white px-6 py-16 sm:px-10 lg:px-14">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-ground-100 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="bg-ground-900 p-8 text-white sm:p-10 lg:p-12">
          <p className="label uppercase tracking-[0.24em] text-ground-400">Product tour</p>
          <h2 className="heading mt-4 text-white">
            See the platform that keeps launch work moving.
          </h2>
          <p className="body mt-4 text-ground-300">
            Bring planning, sign-off, and execution into the same workspace your teams actually want
            to use.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg">Start free</Button>
            <Button variant="brand" size="lg" className="shadow-none">
              View product tour
            </Button>
          </div>
          <div className="mt-8 space-y-3">
            {[
              "Launch templates for every motion",
              "Approvals tied to deliverables",
              "Real-time reporting for leadership",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-ground-200">
                <div className="flex size-6 items-center justify-center rounded-full bg-brand-primary">
                  <Check className="size-3.5 text-white" />
                </div>
                <p className="body">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-ground-50 p-8 sm:p-10 lg:p-12">
          <div className="rounded-[1.75rem] bg-white p-5 shadow-natural">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="caption text-ground-400">Quarterly launch board</p>
                <p className="subheading mt-1 text-ground-900">Live execution snapshot</p>
              </div>
              <span className="rounded-full bg-brand-secondary px-3 py-1 label text-ground-900">
                7 active launches
              </span>
            </div>
            <MockupWindow />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["On track", "18"],
                ["At risk", "3"],
                ["Blocked", "1"],
              ].map(([label, value], index) => {
                const background =
                  index === 0
                    ? "bg-brand-secondary"
                    : index === 1
                      ? "bg-brand-secondary"
                      : "bg-brand-primary";
                const textColor = index === 2 ? "text-white" : "text-ground-900";

                return (
                  <div key={label} className={`rounded-2xl p-4 ${background} ${textColor}`}>
                    <p className="caption opacity-80">{label}</p>
                    <p className="subheading mt-2">{value}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
