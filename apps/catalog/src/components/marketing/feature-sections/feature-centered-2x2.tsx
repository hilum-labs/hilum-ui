import { Globe, Layers, RefreshCw, Shield } from "lucide-react";
import { Badge } from "@hilum/ui";

export default function FeatureCentered2x2() {
  const features = [
    {
      icon: Globe,
      name: "Localized campaigns",
      description:
        "Spin up region-ready pages with shared brand controls and local market flexibility.",
    },
    {
      icon: Shield,
      name: "Approval routing",
      description:
        "Automate legal, security, and editorial sign-off before anything reaches production.",
    },
    {
      icon: Layers,
      name: "Reusable sections",
      description:
        "Build a library of tested components that keeps every launch on-brand and consistent.",
    },
    {
      icon: RefreshCw,
      name: "Always current",
      description:
        "Refresh messaging, screenshots, and proof points across your site in a single update.",
    },
  ];

  return (
    <section className="w-full bg-ground-50 px-8 py-16 md:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            Growth teams
          </Badge>
          <h3 className="heading text-ground-900">
            A cleaner way to scale your go-to-market engine
          </h3>
          <p className="body mt-3 text-ground-500">
            Standardize the work behind every launch so teams can focus on better campaigns instead
            of repetitive coordination.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article
                key={feature.name}
                className="rounded-3xl bg-white p-7 text-center shadow-natural"
              >
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-brand-secondary/20 text-ground-700">
                  <Icon className="size-6" />
                </div>
                <h4 className="subheading text-ground-900">{feature.name}</h4>
                <p className="body mt-2 text-ground-500">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
