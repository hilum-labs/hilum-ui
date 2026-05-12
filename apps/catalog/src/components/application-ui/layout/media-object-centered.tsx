import { Avatar, AvatarFallback } from "@hilum/ui";

export default function MediaObjectCentered() {
  return (
    <div className="w-full bg-white p-6">
      <div className="flex items-center gap-4">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="bg-brand-secondary text-taupe-900">
            MK
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="subheading text-taupe-900">Mark Kim</p>
          <p className="caption text-taupe-500">Product Designer</p>
        </div>
      </div>
    </div>
  );
}
