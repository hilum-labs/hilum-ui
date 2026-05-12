
import { ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Badge } from "@hilum/ui";

const PEOPLE = [
  {
    name: "Lindsay Walton",
    title: "Front-end Developer",
    email: "lindsay.walton@example.com",
    initials: "LW",
    dept: "Engineering",
  },
  {
    name: "Courtney Henry",
    title: "Designer",
    email: "courtney.henry@example.com",
    initials: "CH",
    dept: "Design",
  },
  {
    name: "Tom Cook",
    title: "Director of Product",
    email: "tom.cook@example.com",
    initials: "TC",
    dept: "Product",
  },
] as const;

const CARD_PEOPLE = [
  {
    person: PEOPLE[0],
    badge: "Core team",
  },
  {
    person: PEOPLE[1],
    badge: "Design lead",
  },
  {
    person: PEOPLE[2],
    badge: "Product owner",
  },
] as const;

const LINK_CARDS = [
  {
    name: "Customer handoff list",
    description: "Open tasks, owners, and launch blockers for the Q2 rollout.",
    marker: "CH",
  },
  {
    name: "Creative review queue",
    description: "Landing pages, product cards, and campaign assets awaiting sign-off.",
    marker: "CR",
  },
  {
    name: "Ops escalation board",
    description: "Support issues grouped by response urgency and team coverage.",
    marker: "OP",
  },
] as const;

type Person = (typeof PEOPLE)[number];

function PersonAvatar({
  person,
  size = "md",
  className = "",
}: {
  person: Person;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className="bg-brand-primary/10 text-brand-primary">
        {person.initials}
      </AvatarFallback>
    </Avatar>
  );
}

export default function GridLists() {
  return (
    <div className="grid gap-6">
      <ul className="grid w-full grid-cols-3 gap-4">
        {CARD_PEOPLE.map(({ person, badge }) => (
          <li
            key={person.email}
            className="rounded-2xl border border-taupe-100 bg-white p-5 shadow-natural"
          >
            <p className="subheading text-taupe-900">{person.name}</p>
            <p className="caption mt-1 text-taupe-400">{person.title}</p>
            <Badge variant="secondary" className="mt-4">
              {badge}
            </Badge>
            <p className="caption mt-5 text-taupe-500">{person.email}</p>
          </li>
        ))}
      </ul>

      <ul className="grid w-full grid-cols-3 gap-4">
        {CARD_PEOPLE.map(({ person }) => (
          <li
            key={person.email}
            className="overflow-hidden rounded-2xl border border-taupe-100 bg-white shadow-natural"
          >
            <div className="h-20 bg-brand-primary/10" />
            <div className="px-5 pb-5">
              <div className="relative -mt-6 -mb-6">
                <PersonAvatar person={person} size="lg" className="ring-4 ring-white" />
              </div>
              <p className="subheading pt-10 text-taupe-900">{person.name}</p>
              <p className="caption mt-1 text-taupe-400">{person.title}</p>
              <p className="caption mt-4 text-taupe-500">{person.email}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex w-full flex-col gap-3">
        {LINK_CARDS.map((card) => (
          <a
            key={card.name}
            href="#"
            className="flex items-center gap-4 rounded-xl border border-taupe-100 p-4 hover:shadow-natural"
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-brand-primary/10 subheading text-brand-primary">
              {card.marker}
            </div>
            <div className="flex-1">
              <p className="body font-medium text-taupe-900">{card.name}</p>
              <p className="caption text-taupe-400">{card.description}</p>
            </div>
            <ChevronRight size={18} className="text-taupe-300" />
          </a>
        ))}
      </div>
    </div>
  );
}
