
import { Reply } from "lucide-react";
import { Button } from "@hilum/ui";

function ToastShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-ground-100 bg-white p-4 shadow-elevated">
      {children}
    </div>
  );
}

export default function NotificationWithActions() {
  return (
    <ToastShell>
      <p className="subheading text-ground-900">New reply from Eduardo</p>
      <p className="body mt-1 text-ground-500">
        The client approved the revised rollout date and asked for an updated status recap.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm">
          <Reply size={14} />
          Reply
        </Button>
        <Button size="sm" variant="outline">
          Dismiss
        </Button>
      </div>
    </ToastShell>
  );
}
