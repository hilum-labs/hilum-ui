const items = [
  { name: "Alice Johnson", role: "Designer" },
  { name: "Bob Smith", role: "Engineer" },
  { name: "Carol White", role: "PM" },
] as const;

export default function ListContainerSeparateCards() {
  return (
    <div className="w-full">
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between rounded-xl border border-ground-100 bg-white px-6 py-4"
          >
            <span className="body text-ground-900">{item.name}</span>
            <span className="caption text-ground-500">{item.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
