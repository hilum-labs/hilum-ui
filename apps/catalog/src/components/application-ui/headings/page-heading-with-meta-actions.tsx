import { Calendar, Tag, Users } from "lucide-react";
import { Button } from "@hilum/ui";

export default function PageHeadingWithMetaActions() {
  return (
    <div className="w-full border-b border-taupe-100 bg-white px-8 py-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="heading text-taupe-900">Engineering Team</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <span className="caption flex items-center gap-1 text-taupe-500">
              <Calendar className="size-3" />
              Created Jan 1, 2021
            </span>
            <span className="caption flex items-center gap-1 text-taupe-500">
              <Users className="size-3" />
              12 members
            </span>
            <span className="caption flex items-center gap-1 text-taupe-500">
              <Tag className="size-3" />
              Engineering
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Settings</Button>
          <Button>Add Member</Button>
        </div>
      </div>
    </div>
  );
}
