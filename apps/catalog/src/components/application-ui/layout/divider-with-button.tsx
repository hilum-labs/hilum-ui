import { Button } from "@hilum/ui";

export default function DividerWithButton() {
  return (
    <div className="w-full bg-white p-6">
      <div className="body text-ground-500">Recent activity</div>
      <div className="relative flex items-center py-4">
        <div className="h-px flex-1 bg-ground-100" />
        <Button variant="outline" size="sm" className="mx-4">
          Load more
        </Button>
        <div className="h-px flex-1 bg-ground-100" />
      </div>
      <div className="body text-ground-500">Earlier activity</div>
    </div>
  );
}
