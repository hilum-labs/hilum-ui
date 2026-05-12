
import { cn } from "@hilum/ui";

const person = {
  name: "Margaret Thropp",
  email: "margaret@example.com",
  title: "Backend Developer",
  dept: "Engineering",
  location: "New York, NY",
} as const;

const leftAlignedFields = [
  ["Full name", person.name],
  ["Email", person.email],
  ["Title", person.title],
  ["Department", person.dept],
  ["Location", person.location],
] as const;

export default function DescriptionListStriped() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-taupe-100 bg-white">
      <dl>
        {leftAlignedFields.map(([term, definition], index) => (
          <div
            key={term}
            className={cn(
              "px-6 py-4 sm:grid sm:grid-cols-3 sm:gap-4",
              index % 2 === 0 ? "bg-white" : "bg-taupe-50"
            )}
          >
            <dt className="caption font-medium text-taupe-500">{term}</dt>
            <dd className="body text-taupe-900 sm:col-span-2">{definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
