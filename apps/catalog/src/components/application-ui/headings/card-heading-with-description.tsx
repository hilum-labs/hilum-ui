export default function CardHeadingWithDescription() {
  return (
    <div className="w-full rounded-xl border border-ground-100 bg-white overflow-hidden">
      <div className="border-b border-ground-100 px-6 py-4">
        <h3 className="subheading text-ground-900">Project Details</h3>
        <p className="caption mt-0.5 text-ground-400">Manage your project settings</p>
      </div>
      <div className="h-24 px-6 py-4 body text-ground-500">
        Manage and configure your project settings here.
      </div>
    </div>
  );
}
