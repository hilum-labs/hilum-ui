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

function PortraitPlaceholder({ initials, className }: { initials: string; className: string }) {
  return (
    <div className={`${className} flex items-center justify-center bg-ground-100`}>
      <div className="rounded-full border border-ground-200 bg-white px-4 py-2 subheading text-ground-500">
        {initials}
      </div>
    </div>
  );
}

export default function FullWidthWithVerticalImages() {
  return (
    <section className="w-full bg-white px-8 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <Badge variant="secondary">Leadership team</Badge>
            <h2 className="heading mt-4 text-ground-900">
              A stronger visual roster for about pages
            </h2>
          </div>
          <p className="body max-w-md text-ground-500">
            Use large cards when individual profiles should feel more prominent and the team story
            needs more presence.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {TEAM.map((member) => (
            <article
              key={member.name}
              className="rounded-3xl border border-ground-100 bg-white p-5"
            >
              <PortraitPlaceholder
                initials={member.initials}
                className="w-full aspect-[3/4] rounded-2xl"
              />
              <h3 className="subheading mt-5 text-ground-900">{member.name}</h3>
              <p className="body mt-2 text-ground-500">{member.role}</p>
              <p className="caption mt-3 leading-6 text-ground-500">{member.bio}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
