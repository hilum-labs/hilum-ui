const TESTIMONIAL = {
  quote:
    "Switching to this system cut our launch cycle from six weeks to nine days. The team stopped debating components and started shipping better pages.",
  name: "Jordan Brooks",
  title: "VP of Marketing, Northstar Labs",
  initials: "JB",
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
      className={`flex items-center justify-center rounded-full bg-ground-200 body font-semibold text-ground-400 ${className ?? ""}`}
    >
      {initials}
    </div>
  );
}

export default function SimpleCentered() {
  return (
    <section className="w-full bg-white px-8 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="display text-7xl leading-none text-ground-200">
          &ldquo;
        </div>
        <p className="display italic text-ground-900">
          {TESTIMONIAL.quote}
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <Avatar initials={TESTIMONIAL.initials} className="size-12" />
          <div className="text-left">
            <p className="subheading font-semibold text-ground-900">
              {TESTIMONIAL.name}
            </p>
            <p className="body text-ground-500">
              {TESTIMONIAL.title}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
