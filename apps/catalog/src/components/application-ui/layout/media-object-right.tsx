import { Avatar, AvatarFallback } from "@hilum/ui";

export default function MediaObjectRight() {
  return (
    <div className="w-full bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="subheading text-ground-900">Sara Lopez</p>
          <p className="body text-ground-500">
            Engineering lead responsible for platform infrastructure and developer tooling.
          </p>
        </div>
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="bg-brand-secondary text-ground-900">SL</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
