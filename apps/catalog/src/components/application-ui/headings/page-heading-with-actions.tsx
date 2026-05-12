import { Button } from "@hilum/ui";

export default function PageHeadingWithActions() {
  return (
    <div className="w-full border-b border-taupe-100 bg-white px-8 py-8">
      <div className="flex items-center justify-between">
        <h1 className="heading text-taupe-900">Projects</h1>
        <Button>New Project</Button>
      </div>
    </div>
  );
}
