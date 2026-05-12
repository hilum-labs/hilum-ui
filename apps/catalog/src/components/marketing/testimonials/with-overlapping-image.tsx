import { Badge } from "@hilum/ui";

const TESTIMONIAL = {
  quote:
    "The split layouts gave us a premium editorial feel without custom-building every page. It looks bespoke, but it operates like a system.",
  name: "Priya Desai",
  title: "Marketing Director, Cedar & Co.",
  initials: "PD",
};

function Avatar({
  initials,
  className,
}: {
  initials: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-full bg-taupe-200 body font-semibold text-taupe-400 ${className ?? ""}`}
    >
      {initials}
    </div>
  );
}

export default function WithOverlappingImage() {
  return (
    <section className="w-full overflow-hidden bg-white">
      <div className="grid md:grid-cols-2">
        <div className="bg-taupe-50 p-8 md:p-12">
          <div className="mx-auto max-w-md">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="outline">Case Study</Badge>
              <span className="caption text-taupe-400">Editorial layout</span>
            </div>
            <div className="aspect-square w-full rounded-2xl bg-taupe-200 shadow-natural md:translate-x-8" />
          </div>
        </div>

        <div className="flex items-center px-8 py-16 md:px-16">
          <div className="max-w-xl">
            <p className="heading leading-tight text-taupe-900">
              {TESTIMONIAL.quote}
            </p>
            <div className="mt-8 flex items-center gap-4">
              <Avatar initials={TESTIMONIAL.initials} className="size-12" />
              <div>
                <p className="subheading font-semibold text-taupe-900">
                  {TESTIMONIAL.name}
                </p>
                <p className="body text-taupe-500">
                  {TESTIMONIAL.title}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
