import { AlertTriangle } from "lucide-react";
import { Button } from "@hilum/ui";

function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-ground-100 bg-white shadow-elevated overflow-hidden">
      {children}
    </div>
  );
}

export default function ModalSimpleAlert() {
  return (
    <ModalShell>
      <div className="px-6 py-8 text-center">
        <AlertTriangle size={40} className="mx-auto text-brand-secondary" />
        <h3 className="subheading mt-4 text-ground-900">Deactivate account</h3>
        <p className="body mt-2 text-ground-500">
          Deactivating this account will remove access to all shared workspaces and billing tools.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="destructive">Deactivate</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </ModalShell>
  );
}
