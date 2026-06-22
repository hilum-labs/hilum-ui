const person = {
  name: "Margaret Thropp",
  email: "margaret@example.com",
  title: "Backend Developer",
  dept: "Engineering",
  location: "New York, NY",
} as const;

const fields = [
  ["Full name", person.name],
  ["Email", person.email],
  ["Title", person.title],
  ["Department", person.dept],
  ["Location", person.location],
] as const;

export default function DescriptionListLeftAligned() {
  return (
    <dl className="w-full space-y-4">
      {fields.map(([term, definition]) => (
        <div key={term} className="sm:grid sm:grid-cols-3 sm:gap-4">
          <dt className="caption font-medium text-ground-500">{term}</dt>
          <dd className="mt-1 body text-ground-900 sm:col-span-2 sm:mt-0">{definition}</dd>
        </div>
      ))}
    </dl>
  );
}
