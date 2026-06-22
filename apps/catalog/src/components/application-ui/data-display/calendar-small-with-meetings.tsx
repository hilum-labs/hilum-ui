import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@hilum/ui";
import { cn } from "@hilum/ui";

const events = [
  { day: 13, name: "Team sync", time: "10am" },
  { day: 18, name: "Design review", time: "2pm" },
  { day: 25, name: "Sprint planning", time: "9am" },
] as const;

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const firstDayOfMonth = 6;
const daysInMonth = 31;
const today = 12;

const eventDays = new Set<number>(events.map((event) => event.day));
const leadingEmptyDays = Array.from({ length: firstDayOfMonth }, (_, index) => index);
const calendarDays = Array.from({ length: daysInMonth }, (_, index) => index + 1);

export default function CalendarSmallWithMeetings() {
  const [currentMonth] = useState("January 2022");

  return (
    <div className="flex w-full flex-col gap-6 lg:flex-row">
      <div className="flex-1 rounded-xl border border-ground-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <Button variant="outline" size="icon-sm" aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </Button>
          <h3 className="subheading text-ground-900">{currentMonth}</h3>
          <Button variant="outline" size="icon-sm" aria-label="Next month">
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-y-1.5">
          {daysOfWeek.map((day) => (
            <p key={day} className="text-center caption text-ground-400">
              {day}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1.5">
          {leadingEmptyDays.map((index) => (
            <div key={`compact-empty-${index}`} className="aspect-square" />
          ))}
          {calendarDays.map((day) => {
            const isToday = day === today;
            const hasEvent = eventDays.has(day);

            return (
              <div
                key={`compact-${day}`}
                className="relative flex aspect-square flex-col items-center justify-center"
              >
                <span
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full caption font-medium transition-colors",
                    isToday ? "bg-brand-primary text-white" : "text-ground-700",
                  )}
                >
                  {day}
                </span>
                {hasEvent && <span className="mt-0.5 size-1 rounded-full bg-brand-primary" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1">
        <p className="mb-3 subheading text-ground-900">Today&apos;s Meetings</p>
        {events.map((event) => (
          <div
            key={`meeting-${event.day}`}
            className="mb-2 rounded-lg border border-ground-100 bg-white px-4 py-3"
          >
            <p className="body font-medium text-ground-900">{event.name}</p>
            <p className="caption text-ground-500">{event.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
