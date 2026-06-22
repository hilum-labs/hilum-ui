export default function BreadcrumbSimple() {
  return (
    <div className="w-full bg-white px-6 py-5">
      <div className="flex items-center gap-1.5 text-sm">
        <a href="#" className="text-ground-500 hover:text-ground-900">
          Home
        </a>
        <span className="text-ground-300">/</span>
        <a href="#" className="text-ground-500 hover:text-ground-900">
          Projects
        </a>
        <span className="text-ground-300">/</span>
        <span className="font-medium text-ground-900">Website Redesign</span>
      </div>
    </div>
  );
}
