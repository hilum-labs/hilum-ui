import { ArrowRight } from "lucide-react";
import { Badge } from "@hilum/ui";

export default function FeatureSideBySideImages() {
  const cards = [
    {
      eyebrow: "For growth",
      title: "Measure what messaging changes actually move pipeline",
      description:
        "Tie creative updates and landing page tests directly to conversion movement, not just clicks and page views.",
      cta: "View growth analytics",
      accent: "from-brand-secondary/50 via-white to-brand-primary/20",
    },
    {
      eyebrow: "For product marketing",
      title: "Keep every launch artifact aligned from brief to publish",
      description:
        "Store positioning, proof points, and release assets in a shared workspace that scales with your launch volume.",
      cta: "See launch assets",
      accent: "from-brand-secondary/25 via-white to-ground-100",
    },
  ];

  return (
    <section className="w-full bg-white px-8 py-16 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        {cards.map((card, index) => (
          <article
            key={card.title}
            className="overflow-hidden rounded-[2rem] border border-ground-100 bg-white shadow-natural"
          >
            <div className={`aspect-[4/3] bg-gradient-to-br ${card.accent} p-6`}>
              <div className="flex h-full flex-col justify-between rounded-[1.5rem] bg-white/70 p-6 shadow-natural ring-1 ring-inset ring-white/[0.035] backdrop-blur">
                <div className="flex items-center justify-between">
                  <p className="label text-ground-400">{index === 0 ? "Attribution view" : "Asset control"}</p>
                  <Badge variant={index === 0 ? "warning" : "success"}>
                    {index === 0 ? "Live experiment" : "Approved"}
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-natural">
                    <p className="caption text-ground-400">{index === 0 ? "Qualified pipeline" : "Launch readiness"}</p>
                    <p className="subheading text-ground-900">{index === 0 ? "+23%" : "96%"}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-4 py-3 shadow-natural">
                    <p className="caption text-ground-400">{index === 0 ? "Winning audience" : "Reusable modules"}</p>
                    <p className="subheading text-ground-900">{index === 0 ? "Mid-market IT" : "48 sections"}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-7">
              <p className="label text-ground-400">{card.eyebrow}</p>
              <h3 className="heading mt-3 text-ground-900">{card.title}</h3>
              <p className="body mt-3 text-ground-500">{card.description}</p>
              <a
                href="#"
                className="subheading mt-6 inline-flex items-center gap-2 text-ground-900 transition-colors hover:text-brand-primary"
              >
                {card.cta}
                <ArrowRight className="size-4" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
