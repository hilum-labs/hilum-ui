import { MessageCircle, Tag, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";

const FEED = [
  {
    id: 1,
    type: "comment",
    user: "Eduardo Benz",
    initials: "EB",
    text: "Called client, they said they would hold off until procurement signs the revised scope.",
    time: "6d ago",
  },
  {
    id: 2,
    type: "assignment",
    user: "Hilary Mahy",
    initials: "HM",
    text: "Assigned to you by Jason Meyers",
    time: "2d ago",
  },
  {
    id: 3,
    type: "tag",
    user: "Kristin Watson",
    initials: "KW",
    text: "Added tag Closing to this ticket",
    time: "1d ago",
  },
  {
    id: 4,
    type: "comment",
    user: "Emily Selman",
    initials: "ES",
    text: "Sent them an email, waiting for response.",
    time: "2h ago",
  },
] as const;

function FeedMarker({ type }: { type: (typeof FEED)[number]["type"] }) {
  if (type === "assignment") {
    return <UserPlus size={16} className="text-brand-primary" />;
  }

  if (type === "tag") {
    return <Tag size={16} className="text-brand-primary" />;
  }

  return <MessageCircle size={16} className="text-brand-primary" />;
}

export default function Feeds() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ul className="w-full space-y-6">
        {FEED.map((item, index) => (
          <li key={item.id} className="relative pl-14">
            {index < FEED.length - 1 && (
              <span className="absolute left-4 top-10 h-[calc(100%+1.5rem)] w-px bg-ground-100" />
            )}
            <div className="absolute left-0 top-0">
              <Avatar size="md">
                <AvatarFallback className="bg-brand-primary/10 text-brand-primary">
                  {item.initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="rounded-xl border border-ground-100 bg-white p-4 shadow-natural">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="body font-medium text-ground-900">{item.user}</p>
                <p className="caption text-ground-400">{item.time}</p>
              </div>
              <p className="body text-ground-500">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <ul className="w-full space-y-4">
        {FEED.map((item, index) => (
          <li key={item.id} className="relative pl-14">
            {index < FEED.length - 1 && (
              <span className="absolute left-5 top-10 h-[calc(100%+1rem)] w-px bg-ground-100" />
            )}
            <div className="absolute left-0 top-0 flex size-10 items-center justify-center rounded-full bg-ground-100">
              <FeedMarker type={item.type} />
            </div>
            <div className="pt-1">
              <div className="flex items-center gap-2">
                <p className="body font-medium text-ground-900">{item.user}</p>
                <span className="caption text-ground-300">•</span>
                <p className="caption text-ground-400">{item.time}</p>
              </div>
              <p className="body mt-1 text-ground-500">{item.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
