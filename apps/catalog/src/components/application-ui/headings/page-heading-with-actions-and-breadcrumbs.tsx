import { Button } from "@hilum/ui";

export default function PageHeadingWithActionsAndBreadcrumbs() {
  return (
    <div className="w-full border-b border-ground-100 bg-white px-8 py-8">
      <p className="caption mb-2 text-ground-400">Home / Projects</p>
      <div className="flex items-center justify-between">
        <h1 className="heading text-ground-900">Projects</h1>
        <Button>New Project</Button>
      </div>
    </div>
  );
}
