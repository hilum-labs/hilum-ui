import { Avatar, AvatarFallback } from "@hilum/ui";
import { Button } from "@hilum/ui";

export default function CardHeadingWithAvatarActions() {
  return (
    <div className="w-full rounded-xl border border-taupe-100 bg-white overflow-hidden">
      <div className="flex items-center justify-between border-b border-taupe-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarFallback className="bg-brand-primary text-white">
              TC
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="subheading text-taupe-900">Tom Chen</p>
            <p className="caption text-taupe-400">Admin</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50"
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="h-24 px-6 py-4 body text-taupe-500">
        Manage and configure your project settings here.
      </div>
    </div>
  );
}
