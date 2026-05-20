import { Avatar, AvatarFallback } from "@hilum/ui";
import { Button } from "@hilum/ui";

export default function PageHeadingWithBanner() {
  return (
    <div className="w-full">
      <div className="relative h-32 overflow-hidden bg-ground-900">
        <div className="absolute inset-0 bg-gradient-to-br from-ground-800 to-ground-950" />
      </div>
      <div className="border-b border-ground-100 bg-white px-8 pb-6">
        <div className="-mt-4 flex items-end justify-between gap-6">
          <div className="flex items-end gap-4">
            <Avatar className="size-16 ring-4 ring-white">
              <AvatarFallback className="bg-brand-primary text-xl text-white">
                AC
              </AvatarFallback>
            </Avatar>
            <div className="mb-1">
              <h1 className="heading text-ground-900">Acme Corp</h1>
              <p className="body text-ground-500">Engineering · 48 members</p>
            </div>
          </div>
          <div className="mb-1 flex gap-2">
            <Button variant="outline">Follow</Button>
            <Button>Join Team</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
