import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";

function ToastShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-ground-100 bg-white p-4 shadow-elevated">
      {children}
    </div>
  );
}

function PersonAvatar({
  initials,
  size = "md",
  className = "",
}: {
  initials: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className="bg-brand-primary/10 text-brand-primary">{initials}</AvatarFallback>
    </Avatar>
  );
}

export default function NotificationWithAvatar() {
  return (
    <ToastShell>
      <div className="flex items-start gap-3">
        <PersonAvatar initials="CH" />
        <div className="min-w-0 flex-1">
          <p className="body text-ground-500">
            <span className="font-medium text-ground-900">Courtney Henry</span> left feedback on the
            hero treatment.
          </p>
        </div>
        <button className="text-ground-400 hover:text-ground-700" type="button">
          <X size={16} />
        </button>
      </div>
    </ToastShell>
  );
}
