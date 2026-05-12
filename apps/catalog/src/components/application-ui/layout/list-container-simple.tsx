const names = ["Alice Johnson", "Bob Smith", "Carol White", "Dan Lee"] as const;

export default function ListContainerSimple() {
  return (
    <div className="w-full">
      <ul className="divide-y divide-taupe-100">
        {names.map((name) => (
          <li key={name} className="py-3 body text-taupe-900">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}
