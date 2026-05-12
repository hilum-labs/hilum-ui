import { Badge } from "@hilum/ui";

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
    <div className={`${className} flex items-center justify-center bg-taupe-100`}>
      <div className="rounded-full border border-taupe-200 bg-white px-4 py-2 subheading text-taupe-500">
        {initials}
      </div>
    </div>
  );
}

export default function WithLargeImages() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <Badge variant="secondary">Leadership portraits</Badge>
          <h2 className="heading mt-4 text-taupe-900">Profiles anchored by large image space</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="rounded-2xl border border-taupe-100 bg-white p-5"
            >
              <PortraitPlaceholder initials={member.initials} className="w-full aspect-[3/4] rounded-2xl" />
              <h3 className="subheading mt-5 text-taupe-900">{member.name}</h3>
              <p className="body mt-2 text-taupe-500">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
