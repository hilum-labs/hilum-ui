import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

function SlideOverFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[400px] overflow-hidden rounded-xl border border-ground-100">
      <div className="flex flex-1 items-center justify-center bg-ground-50 p-8 body text-ground-400">
        Main page content preview
      </div>
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

export default function SlideOverUserProfile() {
  return (
    <SlideOverFrame>
      <div className="flex w-96 flex-col bg-white border-l border-ground-100">
        <div className="flex items-center justify-between border-b border-ground-100 px-6 py-4">
          <h2 className="subheading text-ground-900">Profile</h2>
          <button type="button">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 px-6 py-6">
          <div className="flex items-center gap-4">
            <PersonAvatar initials="LW" size="xl" />
            <div>
              <p className="subheading text-ground-900">Lindsay Walton</p>
              <p className="body text-ground-500">Front-end Developer</p>
              <Badge variant="secondary" className="mt-2">
                Engineering
              </Badge>
            </div>
          </div>
          <div className="mt-6 space-y-4 rounded-xl border border-ground-100 p-4">
            <div>
              <p className="label text-ground-400">Email</p>
              <p className="body mt-1 text-ground-900">lindsay.walton@example.com</p>
            </div>
            <div>
              <p className="label text-ground-400">Phone</p>
              <p className="body mt-1 text-ground-900">+1 (555) 123-4300</p>
            </div>
            <div>
              <p className="label text-ground-400">Location</p>
              <p className="body mt-1 text-ground-900">San Francisco, CA</p>
            </div>
          </div>
        </div>
        <div className="border-t border-ground-100 px-6 py-4">
          <Button className="w-full">Edit profile</Button>
        </div>
      </div>
    </SlideOverFrame>
  );
}
