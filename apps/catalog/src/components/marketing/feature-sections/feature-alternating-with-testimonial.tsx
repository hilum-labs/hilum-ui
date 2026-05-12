import { ArrowRight } from "lucide-react";

export default function FeatureAlternatingWithTestimonial() {
  const sections = [
    {
      eyebrow: "Pipeline planning",
      title: "Plan launches around revenue moments, not guesswork",
      description:
        "Build launch calendars around demand windows, customer milestones, and team bandwidth so every release lands with more impact.",
      cta: "See planning workflow",
      imageTheme: "from-brand-primary/20 via-white to-brand-secondary/20",
      imageFirst: true,
    },
    {
      eyebrow: "Cross-functional execution",
      title: "Give every team the same source of truth during launch week",
      description:
        "Keep briefs, approvals, copy, and measurement aligned in one place so stakeholders can move quickly without working from stale context.",
      cta: "Explore execution hub",
      imageTheme: "from-brand-secondary/20 via-white to-taupe-100",
      imageFirst: false,
    },
  ];

  return (
    <section className="w-full bg-taupe-50 px-8 py-16 md:px-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {sections.map((item) => (
          <div
            key={item.title}
            className="grid gap-8 rounded-[2rem] bg-white p-6 shadow-natural lg:grid-cols-2 lg:p-8"
          >
            {item.imageFirst && (
              <div className={`aspect-[4/3] rounded-[1.5rem] bg-gradient-to-br ${item.imageTheme} p-6`}>
                <div className="flex h-full flex-col justify-between rounded-[1.25rem] border border-white/70 bg-white/70 p-6 shadow-natural backdrop-blur">
                  <div>
                    <p className="label text-taupe-400">Launch board</p>
                    <p className="subheading mt-3 text-taupe-900">12 programs shipping this quarter</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {["Approved", "In review", "Blocked"].map((status, index) => (
                      <div key={status} className="rounded-2xl bg-white px-4 py-3 shadow-natural">
                        <p className="caption text-taupe-400">{status}</p>
                        <p className="subheading text-taupe-900">{index === 0 ? "7" : index === 1 ? "3" : "2"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex flex-col justify-center">
              <p className="label text-taupe-400">{item.eyebrow}</p>
              <h3 className="heading mt-3 text-taupe-900">{item.title}</h3>
              <p className="body mt-3 text-taupe-500">{item.description}</p>
              <a
                href="#"
                className="subheading mt-6 inline-flex items-center gap-2 text-taupe-900 transition-colors hover:text-brand-primary"
              >
                {item.cta}
                <ArrowRight className="size-4" />
              </a>
            </div>
            {!item.imageFirst && (
              <div className={`aspect-[4/3] rounded-[1.5rem] bg-gradient-to-br ${item.imageTheme} p-6`}>
                <div className="flex h-full flex-col gap-4 rounded-[1.25rem] border border-white/70 bg-white/70 p-6 shadow-natural backdrop-blur">
                  <div className="rounded-2xl bg-taupe-900 p-5 text-white">
                    <p className="caption text-taupe-300">Live release score</p>
                    <p className="heading mt-2 text-white">94</p>
                  </div>
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white px-4 py-4 shadow-natural">
                      <p className="caption text-taupe-400">Tasks completed</p>
                      <p className="subheading text-taupe-900">126 of 132</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-4 shadow-natural">
                      <p className="caption text-taupe-400">Stakeholder replies</p>
                      <p className="subheading text-taupe-900">2 pending</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="rounded-[2rem] border border-taupe-200 bg-white px-8 py-6 shadow-natural">
          <p className="heading text-taupe-900">
            "We replaced three launch trackers, two approval threads, and a weekly status meeting with one shared workflow."
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-taupe-500">
            <span className="subheading text-taupe-900">Sofia Romero</span>
            <span className="caption">VP Marketing, Northstar Cloud</span>
          </div>
        </div>
      </div>
    </section>
  );
}
