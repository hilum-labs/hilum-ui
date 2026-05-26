import { ArrowRight, Check } from "lucide-react";
import { Button, Badge } from "@hilum/ui";

export default function FeatureWithFeatureList() {
  const items = [
    "Account timelines that capture every key touchpoint in one view.",
    "Live health signals that show expansion and churn risk before revenue moves.",
    "Automatic enrichment from CRM, support, and product activity.",
    "Contextual notes that give every handoff the right account history.",
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="relative h-96 overflow-hidden rounded-[2rem] bg-ground-100 p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,77,1,0.12),_transparent_40%),linear-gradient(180deg,_rgba(255,255,255,0.65),_rgba(245,241,235,0.9))]" />
          <div className="relative flex h-full flex-col justify-between rounded-[1.5rem] bg-white/60 p-6 shadow-natural ring-1 ring-inset ring-white/[0.035] backdrop-blur">
            <div>
              <p className="label text-ground-400">Customer workspace</p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-natural">
                  <p className="caption text-ground-400">Renewal confidence</p>
                  <p className="subheading text-ground-900">92% on-track</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-natural">
                    <p className="caption text-ground-400">Product adoption</p>
                    <p className="subheading text-ground-900">68% MAU</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-natural">
                    <p className="caption text-ground-400">Open blockers</p>
                    <p className="subheading text-ground-900">3 items</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/70 px-4 py-3 ring-1 ring-inset ring-white/[0.035]">
              <p className="caption text-ground-400">Latest update</p>
              <p className="body mt-1 text-ground-700">Implementation completed ahead of schedule for APAC rollout.</p>
            </div>
          </div>
        </div>
        <div className="max-w-xl">
          <Badge variant="secondary" className="mb-4">Customer visibility</Badge>
          <h3 className="heading text-ground-900">See the entire customer story in one place</h3>
          <p className="body mt-3 text-ground-500">
            Unite product signals, lifecycle milestones, and account context so every team can act with the same source of truth.
          </p>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-0.5 flex size-5 items-center justify-center text-brand-primary">
                  <Check className="size-4" />
                </div>
                <p className="body text-ground-600">{item}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button variant="brand">
              Explore customer workspace
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
