
export default function BreadcrumbSimple() {
  return (
    <div className="w-full bg-white px-6 py-5">
      <div className="flex items-center gap-1.5 text-sm">
        <a href="#" className="text-taupe-500 hover:text-taupe-900">
          Home
        </a>
        <span className="text-taupe-300">/</span>
        <a href="#" className="text-taupe-500 hover:text-taupe-900">
          Projects
        </a>
        <span className="text-taupe-300">/</span>
        <span className="font-medium text-taupe-900">Website Redesign</span>
      </div>
    </div>
  );
}
