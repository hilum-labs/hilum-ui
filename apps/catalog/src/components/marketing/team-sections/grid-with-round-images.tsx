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

function AvatarCircle({
  initials,
  size,
  dark = false,
}: {
  initials: string;
  size: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`${size} flex items-center justify-center rounded-full body font-semibold ${
        dark
          ? "bg-ground-800 text-ground-200 ring-2 ring-ground-700"
          : "bg-ground-200 text-ground-500"
      }`}
    >
      {initials}
    </div>
  );
}

export default function GridWithRoundImages() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <Badge variant="secondary">Leadership</Badge>
          <h2 className="heading mt-4 text-ground-900">Meet the people behind the system</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="rounded-2xl border border-ground-100 bg-white p-6 text-center"
            >
              <div className="flex justify-center">
                <AvatarCircle initials={member.initials} size="size-24" />
              </div>
              <h3 className="subheading mt-5 text-ground-900">{member.name}</h3>
              <p className="body mt-2 text-ground-500">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
