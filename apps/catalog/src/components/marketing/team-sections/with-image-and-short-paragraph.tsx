const TEAM = [
  {
    name: "Sarah Johnson",
    role: "CEO & Co-founder",
    initials: "SJ",
    bio: "Building the future of collaborative design.",
  },
  {
    name: "Marcus Lee",
    role: "CTO & Co-founder",
    initials: "ML",
    bio: "10+ years in distributed systems and developer tools.",
  },
  {
    name: "Priya Patel",
    role: "Head of Design",
    initials: "PP",
    bio: "Former design lead at Figma and Notion.",
  },
  {
    name: "Tom Wright",
    role: "Head of Engineering",
    initials: "TW",
    bio: "Loves Rust, TypeScript, and great coffee.",
  },
  {
    name: "Aisha Diallo",
    role: "VP of Marketing",
    initials: "AD",
    bio: "Grew three startups from seed to Series B.",
  },
  {
    name: "Chris Nakamura",
    role: "Lead Product Manager",
    initials: "CN",
    bio: "Obsessed with user research and fast shipping.",
  },
] as const;

function PortraitPlaceholder({
  initials,
  className,
}: {
  initials: string;
  className: string;
}) {
  return (
    <div className={`${className} flex items-center justify-center bg-ground-100`}>
      <div className="rounded-full border border-ground-200 bg-white px-4 py-2 subheading text-ground-500">
        {initials}
      </div>
    </div>
  );
}

export default function WithImageAndShortParagraph() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        {TEAM.slice(0, 4).map((member, index) => (
          <article
            key={member.name}
            className={`grid items-center gap-6 rounded-3xl border border-ground-100 p-6 lg:grid-cols-2 ${
              index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
            }`}
          >
            <PortraitPlaceholder initials={member.initials} className="min-h-[320px] rounded-2xl" />
            <div className="max-w-xl">
              <p className="caption text-brand-primary">{member.role}</p>
              <h3 className="display mt-3 text-ground-900">{member.name}</h3>
              <p className="body mt-5 text-ground-600">{member.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
