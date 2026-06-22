import { Avatar, AvatarFallback } from "@hilum/ui";

const person = {
  name: "Margaret Thropp",
  email: "margaret@example.com",
  title: "Backend Developer",
  dept: "Engineering",
  bio: "Experienced backend developer with 8 years in distributed systems and cloud infrastructure.",
} as const;

const cardFields = [
  ["Full name", person.name],
  ["Email", person.email],
  ["Title", person.title],
  ["Department", person.dept],
  ["Bio", person.bio],
] as const;

export default function DescriptionListCard() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-ground-100 bg-white">
      <div className="flex items-center justify-between border-b border-ground-100 px-6 py-4">
        <h3 className="subheading text-ground-900">Applicant Information</h3>
        <Avatar className="size-9">
          <AvatarFallback className="bg-brand-primary text-white">MT</AvatarFallback>
        </Avatar>
      </div>
      <dl className="divide-y divide-ground-100">
        {cardFields.map(([term, definition]) => (
          <div key={term} className="px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="caption font-medium text-ground-500">{term}</dt>
            <dd className="mt-1 body text-ground-900 sm:col-span-2 sm:mt-0">{definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
