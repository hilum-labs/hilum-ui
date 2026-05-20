import { Button } from "@hilum/ui";

export default function PanelWithHeaderAndFooter() {
  return (
    <div className="w-full rounded-xl border border-ground-100 bg-white overflow-hidden">
      <div className="border-b border-ground-100 px-6 py-4">
        <h3 className="subheading text-ground-900">Confirm Action</h3>
      </div>
      <div className="px-6 py-4 body text-ground-500">
        Are you sure you want to proceed? This action may have consequences.
      </div>
      <div className="flex justify-end gap-2 border-t border-ground-100 bg-ground-50 px-6 py-3">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Confirm</Button>
      </div>
    </div>
  );
}
