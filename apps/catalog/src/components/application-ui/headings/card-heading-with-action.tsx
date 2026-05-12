import { Button } from "@hilum/ui";

export default function CardHeadingWithAction() {
  return (
    <div className="w-full rounded-xl border border-taupe-100 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-taupe-100 px-6 py-4">
        <h3 className="subheading text-taupe-900">Project Details</h3>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </div>
      <div className="h-24 px-6 py-4 body text-taupe-500">
        Manage and configure your project settings here.
      </div>
    </div>
  );
}
