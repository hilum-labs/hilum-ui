import { Badge } from "@hilum/ui";

export default function FeatureLargeScreenshot() {
  const features = [
    {
      title: "Executive-ready reporting",
      description: "Turn live launch metrics into an update leadership can understand at a glance.",
    },
    {
      title: "Campaign-level drilldowns",
      description: "Move from a portfolio overview into channel, segment, and asset performance without switching tools.",
    },
    {
      title: "Shared decision history",
      description: "Keep commentary, approvals, and metric changes attached to the work they influenced.",
    },
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">Analytics workspace</Badge>
          <h3 className="heading text-taupe-900">See performance, approvals, and launch momentum in one view</h3>
          <p className="body mt-3 text-taupe-500">
            Replace fragmented reporting with a shared operating dashboard built for launch teams and revenue leaders alike.
          </p>
        </div>
        <div className="mt-10 aspect-video w-full overflow-hidden rounded-[2rem] bg-taupe-900 p-5 shadow-elevated">
          <div className="flex h-full flex-col rounded-[1.5rem] border border-white/10 bg-taupe-950/70 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="label text-taupe-500">Q2 launch cockpit</p>
                <p className="subheading mt-2 text-white">Pipeline creation up 31% quarter over quarter</p>
              </div>
              <Badge variant="brand">Live data</Badge>
            </div>
            <div className="mt-6 grid flex-1 gap-4 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                <div className="grid h-full grid-cols-12 gap-2">
                  {[48, 64, 54, 74, 68, 82, 78, 92, 88, 100, 94, 108].map((height, index) => (
                    <div key={height + index} className="flex items-end">
                      <div
                        className="w-full rounded-t-full bg-brand-primary"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4">
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="caption text-taupe-400">Launch readiness</p>
                  <p className="heading mt-2 text-white">96%</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="caption text-taupe-400">Open blockers</p>
                  <p className="heading mt-2 text-white">4</p>
                </div>
                <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                  <p className="caption text-taupe-400">Campaigns live</p>
                  <p className="heading mt-2 text-white">18</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-taupe-100 p-5">
              <h4 className="subheading text-taupe-900">{feature.title}</h4>
              <p className="body mt-2 text-taupe-500">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
