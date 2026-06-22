const items = [
  { name: "Alice Johnson", role: "Designer" },
  { name: "Bob Smith", role: "Engineer" },
  { name: "Carol White", role: "PM" },
  { name: "Dan Lee", role: "QA" },
] as const;

export default function ListContainerCard() {
  return (
    <div className="w-full rounded-xl border border-ground-100 bg-white overflow-hidden">
      <ul className="divide-y divide-ground-100">
        {items.map((item) => (
          <li key={item.name} className="flex items-center justify-between px-6 py-4">
            <span className="body text-ground-900">{item.name}</span>
            <span className="caption text-ground-500">{item.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
