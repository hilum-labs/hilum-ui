import { Button } from "@hilum/ui";

export default function CardHeadingWithDescriptionAndAction() {
  return (
    <div className="w-full rounded-xl border border-ground-100 bg-white overflow-hidden">
      <div className="flex items-start justify-between border-b border-ground-100 px-6 py-4">
        <div>
          <h3 className="subheading text-ground-900">Project Details</h3>
          <p className="caption mt-0.5 text-ground-400">
            Manage your project settings and configuration
          </p>
        </div>
        <Button size="sm">Save changes</Button>
      </div>
      <div className="h-24 px-6 py-4 body text-ground-500">
        Manage and configure your project settings here.
      </div>
    </div>
  );
}
