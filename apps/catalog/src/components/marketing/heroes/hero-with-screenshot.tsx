import { ArrowRight } from "lucide-react";
import { Button } from "@hilum/ui";

const LOGOS = ["Northstar", "Kinetic", "Fable", "Openfield", "Relay", "Union"];

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

function LogoCloud() {
  return (
    <div className="mt-8 border-y border-ground-100 bg-ground-50 px-6 py-4">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-ground-300">
        {LOGOS.map((logo) => (
          <span key={logo} className="subheading font-semibold">
            {logo}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HeroWithScreenshot() {
  return (
    <section className="w-full bg-white px-6 py-20 sm:px-10 lg:px-14">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label uppercase tracking-[0.24em] text-ground-400">
            Built for launches with moving parts
          </p>
          <h1 className="display mt-6 text-ground-900">
            Launch campaigns without the spreadsheet chaos.
          </h1>
          <p className="body mt-5 text-ground-500">
            Keep briefs, approvals, creative reviews, and reporting in one
            workspace that leadership and delivery teams can trust.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg">
              Start free
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg">
              Talk to sales
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <MockupWindow />
        </div>
      </div>

      <LogoCloud />
    </section>
  );
}
