const TESTIMONIAL = {
  quote:
    "What impressed me was the clarity. Every section feels intentional, so our team can move fast without the site starting to look generic.",
  name: "Nina Lee",
  company: "Studio Current",
  initials: "NL",
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

export default function WithLargeAvatar() {
  return (
    <section className="w-full bg-white px-8 py-20">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Avatar
          initials={TESTIMONIAL.initials}
          className="mb-8 size-20 text-2xl"
        />
        <p className="display italic text-ground-900">
          {TESTIMONIAL.quote}
        </p>
        <div className="mt-8">
          <p className="subheading font-semibold text-ground-900">
            {TESTIMONIAL.name}
          </p>
          <p className="body text-ground-500">
            {TESTIMONIAL.company}
          </p>
        </div>
      </div>
    </section>
  );
}
