import { Button } from "@hilum/ui";

export default function PanelWithTaupeBody() {
  return (
    <div className="w-full rounded-xl border border-taupe-100 bg-white overflow-hidden">
      <div className="border-b border-taupe-100 px-6 py-4">
        <h3 className="subheading text-taupe-900">Settings</h3>
      </div>
      <div className="bg-taupe-50 px-6 py-4 body text-taupe-500">
        This panel uses a subtle taupe background in the body area to create
        visual hierarchy.
      </div>
      <div className="flex justify-end border-t border-taupe-100 bg-white px-6 py-3">
        <Button size="sm">Save</Button>
      </div>
    </div>
  );
}
