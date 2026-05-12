import * as React from "react";
import { cn } from "../lib/utils";

interface FeedEvent {
  id?: string | number;
  content: React.ReactNode;
  date?: string;
  datetime?: string;
  icon?: React.ReactNode;
  iconBgClass?: string;
}

interface ActivityFeedProps {
  events: FeedEvent[];
  className?: string;
}

function ActivityFeed({ events, className }: ActivityFeedProps) {
  return (
    <div className={cn("flow-root", className)}>
      <ul role="list" className="-mb-8">
        {events.map((event, i) => {
          const isLast = i === events.length - 1;
          return (
            <li key={event.id ?? i}>
              <div className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-taupe-100"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex gap-3">
                  {/* Icon */}
                  <div>
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full ring-8 ring-white",
                        event.iconBgClass ?? "bg-taupe-100 text-taupe-500"
                      )}
                    >
                      {event.icon}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 items-baseline justify-between gap-4 pt-1">
                    <div className="body text-taupe-600">{event.content}</div>
                    {event.date && (
                      <time
                        dateTime={event.datetime ?? event.date}
                        className="caption whitespace-nowrap text-taupe-400"
                      >
                        {event.date}
                      </time>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { ActivityFeed };
export type { FeedEvent };
