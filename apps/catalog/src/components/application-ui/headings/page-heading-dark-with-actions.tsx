import { Button } from "@hilum/ui";

export default function PageHeadingDarkWithActions() {
  return (
    <div className="w-full bg-taupe-900 px-8 py-8">
      <p className="caption mb-2 text-taupe-400">Home / Projects</p>
      <div className="flex items-center justify-between">
        <h1 className="heading text-white">Projects</h1>
        <Button
          variant="outline"
          className="border-taupe-700 text-white hover:bg-taupe-800"
        >
          New Project
        </Button>
      </div>
    </div>
  );
}
