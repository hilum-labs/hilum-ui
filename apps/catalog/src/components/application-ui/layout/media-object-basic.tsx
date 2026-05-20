import { Avatar, AvatarFallback } from "@hilum/ui";

export default function MediaObjectBasic() {
  return (
    <div className="w-full bg-white p-6">
      <div className="flex gap-4">
        <Avatar className="size-10 shrink-0">
          <AvatarFallback className="bg-brand-primary text-white">
            JD
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="subheading text-ground-900">Jane Doe</p>
          <p className="body text-ground-500">
            Full-stack engineer with expertise in React and Node.js. Passionate
            about clean code.
          </p>
        </div>
      </div>
    </div>
  );
}
