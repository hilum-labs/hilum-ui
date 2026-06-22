import { PanelsTopLeft, TrendingUp, Users, Zap } from "lucide-react";

function MetricCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof PanelsTopLeft;
  value: string;
  label: string;
}) {
  return (
    <article className="rounded-2xl border border-ground-800 bg-ground-950 p-6 text-left shadow-lg">
      <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 text-brand-secondary">
        <Icon className="size-5" />
      </div>
      <p className="heading mt-5 text-white">{value}</p>
      <p className="body mt-2 text-ground-400">{label}</p>
    </article>
  );
}

export default function HeaderWithOverlappingCards() {
  return (
    <section className="w-full bg-ground-900 px-8 py-16 text-white">
      <div className="mx-auto max-w-5xl text-center">
        <p className="caption text-ground-400">System performance</p>
        <h2 className="display mt-4 text-white">Measure the impact of a unified interface layer</h2>
        <p className="body mx-auto mt-5 max-w-2xl text-ground-300">
          Show the business case for better design system coverage with a banner that transitions
          directly into the proof points below.
        </p>
        <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:translate-y-12">
          <MetricCard
            icon={PanelsTopLeft}
            value="180+"
            label="Components documented across product and marketing"
          />
          <MetricCard
            icon={TrendingUp}
            value="38%"
            label="Faster page assembly after standardizing content blocks"
          />
          <MetricCard
            icon={Users}
            value="24 teams"
            label="Shipping from one shared set of foundations"
          />
        </div>
        <div className="mt-16 flex justify-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/5 text-brand-secondary ring-1 ring-inset ring-white/[0.035]">
            <Zap className="size-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
