
import { X } from "lucide-react";
import { Button } from "@hilum/ui";

function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-ground-100 bg-white shadow-elevated overflow-hidden">
      {children}
    </div>
  );
}

export default function ModalSimpleWithDismiss() {
  return (
    <ModalShell>
      <div className="relative px-6 py-6">
        <button className="absolute right-4 top-4 text-ground-400 hover:text-ground-700" type="button">
          <X size={18} />
        </button>
        <h3 className="subheading text-ground-900">Workspace updated</h3>
        <p className="body mt-3 text-ground-500">
          Everyone on the project has access to the new navigation structure and revised permissions.
        </p>
        <Button className="mt-6 w-full">Got it</Button>
      </div>
    </ModalShell>
  );
}
