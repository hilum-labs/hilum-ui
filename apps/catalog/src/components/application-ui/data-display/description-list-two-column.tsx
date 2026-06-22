const person = {
  name: "Margaret Thropp",
  email: "margaret@example.com",
  title: "Backend Developer",
  dept: "Engineering",
  location: "New York, NY",
  salary: "$120,000",
} as const;

const detailFields = [
  ["Full name", person.name],
  ["Department", person.dept],
  ["Email", person.email],
  ["Location", person.location],
  ["Title", person.title],
  ["Salary", person.salary],
] as const;

export default function DescriptionListTwoColumn() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-ground-100 bg-white">
      <div className="border-b border-ground-100 px-6 py-4">
        <h3 className="subheading text-ground-900">Employee Details</h3>
      </div>
      <dl className="grid grid-cols-1 gap-x-8 gap-y-4 px-6 py-4 md:grid-cols-2">
        {detailFields.map(([term, definition]) => (
          <div key={term}>
            <dt className="caption font-medium text-ground-500">{term}</dt>
            <dd className="mt-0.5 body text-ground-900">{definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
