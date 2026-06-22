import { Avatar, AvatarFallback } from "@hilum/ui";
import { Button } from "@hilum/ui";

export default function PageHeadingWithAvatarActions() {
  return (
    <div className="w-full border-b border-ground-100 bg-white px-8 py-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="size-12">
            <AvatarFallback className="bg-brand-primary text-lg text-white">TF</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="heading text-ground-900">Taylor Foster</h1>
            <p className="body text-ground-500">Senior Designer · Product Design</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Message</Button>
          <Button>Edit Profile</Button>
        </div>
      </div>
    </div>
  );
}
