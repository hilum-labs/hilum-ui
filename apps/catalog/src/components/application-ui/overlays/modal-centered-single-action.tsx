
import { CheckCircle2 } from "lucide-react";
import { Button } from "@hilum/ui";

function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-ground-100 bg-white shadow-elevated overflow-hidden">
      {children}
    </div>
  );
}

export default function ModalCenteredSingleAction() {
  return (
    <ModalShell>
      <div className="px-6 py-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-brand-secondary" />
        <h3 className="subheading mt-4 text-ground-900">Payment successful</h3>
        <p className="body mt-2 text-ground-500">
          Your annual plan is active and the new invoice has been emailed to finance.
        </p>
        <Button className="mt-6">Close</Button>
      </div>
    </ModalShell>
  );
}
