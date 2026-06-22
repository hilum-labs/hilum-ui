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
  {
    name: "Whitney Francis",
    title: "Copywriter",
    email: "whitney.francis@example.com",
    initials: "WF",
    dept: "Marketing",
  },
  {
    name: "Leonard Krasner",
    title: "Senior Designer",
    email: "leonard.krasner@example.com",
    initials: "LK",
    dept: "Design",
  },
] as const;

const STORIES = [
  {
    person: PEOPLE[0],
    preview:
      "Shared the updated component inventory and flagged three states that still need responsive QA before launch.",
    date: "Apr 12",
  },
  {
    person: PEOPLE[1],
    preview:
      "Posted a fresh set of motion studies for the dashboard drawer, including a calmer exit transition for dense views.",
    date: "Apr 11",
  },
  {
    person: PEOPLE[2],
    preview:
      "Outlined the next sprint priorities with a focus on reducing friction in setup, billing, and enterprise handoff moments.",
    date: "Apr 10",
  },
  {
    person: PEOPLE[3],
    preview:
      "Drafted a shorter onboarding sequence with clearer status messaging and fewer interruptions during first-run setup.",
    date: "Apr 9",
  },
] as const;

const GROUPED_LISTS = [
  {
    heading: "Today",
    people: [PEOPLE[0], PEOPLE[2]],
  },
  {
    heading: "Yesterday",
    people: [PEOPLE[1], PEOPLE[4]],
  },
  {
    heading: "This week",
    people: [PEOPLE[3]],
  },
] as const;

const COLLABORATOR_ROWS = [
  {
    name: "Dashboard refresh",
    owner: PEOPLE[0],
    collaborators: [PEOPLE[1], PEOPLE[2], PEOPLE[4]],
  },
  {
    name: "Pricing narrative",
    owner: PEOPLE[3],
    collaborators: [PEOPLE[0], PEOPLE[2]],
  },
  {
    name: "Motion audit",
    owner: PEOPLE[4],
    collaborators: [PEOPLE[1], PEOPLE[3], PEOPLE[0]],
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

export default function StackedLists() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="w-full rounded-xl border border-ground-100 bg-white">
        <ul className="divide-y divide-ground-100">
          {PEOPLE.map((person) => (
            <li key={person.email} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3">
                <PersonAvatar person={person} />
                <div>
                  <p className="body font-medium text-ground-900">{person.name}</p>
                  <p className="caption text-ground-400">{person.title}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="caption text-ground-500">{person.email}</p>
                <Badge variant="secondary" className="mt-2">
                  {person.dept}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full rounded-xl border border-ground-100 bg-white">
        <ul className="divide-y divide-ground-100">
          {STORIES.map((story) => (
            <li key={`${story.person.email}-${story.date}`} className="flex gap-4 px-6 py-4">
              <PersonAvatar person={story.person} />
              <div className="min-w-0 flex-1">
                <p className="body font-medium text-ground-900">{story.person.name}</p>
                <p className="body line-clamp-2 text-ground-500">{story.preview}</p>
              </div>
              <p className="caption whitespace-nowrap text-ground-400">{story.date}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full rounded-xl border border-ground-100 bg-white">
        <div className="max-h-[280px] overflow-auto px-6 py-3">
          {GROUPED_LISTS.map((group) => (
            <div key={group.heading}>
              <div className="sticky top-0 bg-white py-1 caption font-semibold text-ground-400">
                {group.heading}
              </div>
              <ul className="divide-y divide-ground-100">
                {group.people.map((person) => (
                  <li
                    key={`${group.heading}-${person.email}`}
                    className="flex items-center gap-3 py-3"
                  >
                    <PersonAvatar person={person} size="sm" />
                    <div>
                      <p className="body font-medium text-ground-900">{person.name}</p>
                      <p className="caption text-ground-400">
                        {person.title} · {person.dept}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full rounded-xl border border-ground-100 bg-white">
        <ul className="divide-y divide-ground-100">
          {COLLABORATOR_ROWS.map((item) => (
            <li key={item.name} className="flex items-center justify-between gap-4 px-4 py-3">
              <div className="flex items-center gap-3">
                <PersonAvatar person={item.owner} size="md" className="size-8" />
                <div>
                  <p className="body font-medium text-ground-900">{item.name}</p>
                  <p className="caption text-ground-400">{item.owner.name}</p>
                </div>
              </div>
              <div className="flex -space-x-1">
                {item.collaborators.map((person) => (
                  <PersonAvatar
                    key={`${item.name}-${person.email}`}
                    person={person}
                    size="sm"
                    className="ring-2 ring-white"
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
