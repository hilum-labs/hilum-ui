
import { useState } from "react";
import {
  Calendar,
  ChevronRight,
  FolderKanban,
  Mail,
  Phone,
  Search,
  Settings,
} from "lucide-react";

const PEOPLE = [
  {
    id: "amelia",
    name: "Amelia Watts",
    initials: "AW",
    title: "Operations Manager",
    email: "amelia@designco.com",
    phone: "+1 (415) 555-0199",
    recent: [
      "Shared the updated staffing forecast",
      "Approved the vendor renewal for Q2",
      "Posted notes from the weekly sync",
    ],
  },
  {
    id: "ben",
    name: "Ben Torres",
    initials: "BT",
    title: "Product Designer",
    email: "ben@designco.com",
    phone: "+1 (415) 555-0122",
    recent: [
      "Uploaded new dashboard mocks",
      "Commented on the onboarding audit",
      "Requested feedback from the marketing team",
    ],
  },
  {
    id: "claire",
    name: "Claire Owens",
    initials: "CO",
    title: "Engineering Manager",
    email: "claire@designco.com",
    phone: "+1 (415) 555-0175",
    recent: [
      "Moved the API rollout to the next milestone",
      "Assigned owners to the accessibility fixes",
      "Documented incident follow-up items",
    ],
  },
  {
    id: "daniel",
    name: "Daniel Reed",
    initials: "DR",
    title: "Account Executive",
    email: "daniel@designco.com",
    phone: "+1 (415) 555-0114",
    recent: [
      "Booked a renewal review with a key client",
      "Closed the spring campaign package",
      "Shared the latest forecast snapshot",
    ],
  },
];

const DIRECTORY_ACTIONS = [
  { label: "Schedule check-in", icon: Calendar },
  { label: "Send email", icon: Mail },
  { label: "Open project list", icon: FolderKanban },
  { label: "Adjust permissions", icon: Settings },
];

function ExampleFrame({ children }: { children: any }) {
  return (
    <div className="min-h-[600px] overflow-hidden rounded-xl border border-taupe-100 bg-white">
      {children}
    </div>
  );
}

export default function DirectoryScreen() {
  const [selectedPersonId, setSelectedPersonId] = useState("ben");
  const selectedPerson = PEOPLE.find((person) => person.id === selectedPersonId) ?? PEOPLE[0];

  return (
    <ExampleFrame>
      <div className="grid min-h-[600px] lg:grid-cols-[280px_1fr_260px]">
        <aside className="border-b border-taupe-100 bg-white p-5 lg:border-b-0 lg:border-r">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-taupe-400" />
            <input
              type="text"
              placeholder="Search people"
              className="h-10 w-full rounded-xl border border-taupe-200 bg-taupe-50 pl-10 pr-4 body text-taupe-500 outline-none"
            />
          </div>
          <div className="mt-5 space-y-5">
            {["A", "B", "C", "D"].map((letter) => (
              <div key={letter}>
                <p className="label mb-2 text-taupe-400">{letter}</p>
                <div className="space-y-2">
                  {PEOPLE.filter((person) => person.name.startsWith(letter)).map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      onClick={() => setSelectedPersonId(person.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${
                        selectedPersonId === person.id
                          ? "bg-brand-primary/10 text-brand-primary font-medium"
                          : "bg-taupe-50 text-taupe-700 hover:bg-taupe-100"
                      }`}
                    >
                      <div className="flex size-9 items-center justify-center rounded-full bg-taupe-900 text-white">
                        <span className="caption font-medium">{person.initials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="body truncate font-medium">{person.name}</p>
                        <p className="caption truncate text-taupe-400">{person.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        <main className="border-b border-taupe-100 bg-taupe-50 p-6 lg:border-b-0 lg:border-r">
          <div className="rounded-2xl border border-taupe-100 bg-white p-6">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex size-16 items-center justify-center rounded-full bg-brand-primary text-white">
                <span className="heading">{selectedPerson.initials}</span>
              </div>
              <div>
                <h3 className="heading text-taupe-900">{selectedPerson.name}</h3>
                <p className="body text-taupe-500">{selectedPerson.title}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-taupe-50 p-4">
                <p className="label text-taupe-400">Email</p>
                <div className="mt-3 flex items-center gap-2">
                  <Mail className="size-4 text-taupe-400" />
                  <span className="body text-taupe-900">{selectedPerson.email}</span>
                </div>
              </div>
              <div className="rounded-xl bg-taupe-50 p-4">
                <p className="label text-taupe-400">Phone</p>
                <div className="mt-3 flex items-center gap-2">
                  <Phone className="size-4 text-taupe-400" />
                  <span className="body text-taupe-900">{selectedPerson.phone}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <p className="subheading text-taupe-900">Recent activity</p>
              <div className="mt-4 space-y-3">
                {selectedPerson.recent.map((item) => (
                  <div key={item} className="rounded-xl bg-taupe-50 p-4">
                    <p className="body text-taupe-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <aside className="bg-white p-5">
          <p className="subheading text-taupe-900">Quick actions</p>
          <div className="mt-4 space-y-3">
            {DIRECTORY_ACTIONS.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl border border-taupe-100 px-4 py-3 text-left transition-colors hover:border-brand-primary/30 hover:bg-taupe-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-taupe-50 text-taupe-700">
                      <Icon className="size-4" />
                    </div>
                    <span className="body font-medium text-taupe-900">{item.label}</span>
                  </div>
                  <ChevronRight className="size-4 text-taupe-400" />
                </button>
              );
            })}
          </div>
          <div className="mt-6 rounded-2xl bg-taupe-50 p-4">
            <p className="label text-taupe-400">Upcoming</p>
            <p className="body mt-3 font-medium text-taupe-900">Quarterly staffing review</p>
            <p className="caption mt-1 text-taupe-400">Tuesday at 2:30 PM with leadership and finance.</p>
          </div>
        </aside>
      </div>
    </ExampleFrame>
  );
}
