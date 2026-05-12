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
        dark ? "bg-taupe-800 text-taupe-200 ring-2 ring-taupe-700" : "bg-taupe-200 text-taupe-500"
      }`}
    >
      {initials}
    </div>
  );
}

export default function GridWithLargeRoundImages() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-2xl">
          <Badge variant="outline">Team</Badge>
          <h2 className="heading mt-4 text-taupe-900">The operators building the product and platform</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="rounded-3xl border border-taupe-100 bg-taupe-50 p-8"
            >
              <AvatarCircle initials={member.initials} size="size-32" />
              <h3 className="subheading mt-6 text-taupe-900">{member.name}</h3>
              <p className="body mt-2 text-taupe-500">{member.role}</p>
              <p className="body mt-4 text-taupe-700">{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
