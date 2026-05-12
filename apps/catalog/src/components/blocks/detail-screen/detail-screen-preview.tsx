import { Mail, Phone, MapPin, Calendar, Edit, MessageSquare } from "lucide-react";
import { PageHeading } from "@hilum/ui";
import { DescriptionList } from "@hilum/ui";
import { ActivityFeed } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Badge } from "@hilum/ui";

const PERSON = {
  name: "Tom Cook",
  role: "Engineering Manager",
  department: "Engineering",
  email: "tom@example.com",
  phone: "+1 (555) 012-3456",
  location: "San Francisco, CA",
  joined: "January 2021",
  status: "Active",
};

const DL_ITEMS = [
  { term: "Full name", details: "Tom Cook" },
  { term: "Email", details: "tom@example.com" },
  { term: "Phone", details: "+1 (555) 012-3456" },
  { term: "Location", details: "San Francisco, CA" },
  { term: "Department", details: "Engineering" },
  { term: "Status", details: <Badge variant="success" className="caption-xs">Active</Badge> },
];

const FEED = [
  {
    id: 1,
    icon: <MessageSquare size={14} />,
    iconBgClass: "bg-brand-secondary text-taupe-900",
    content: (
      <p className="caption text-taupe-600">
        <span className="font-semibold text-taupe-900">Sophie Chen</span> left a comment:{" "}
        "Tom has been leading the platform migration with exceptional clarity."
      </p>
    ),
    date: "2h ago",
  },
  {
    id: 2,
    icon: <Edit size={14} />,
    iconBgClass: "bg-taupe-100 text-taupe-500",
    content: (
      <p className="caption text-taupe-600">
        <span className="font-semibold text-taupe-900">HR System</span> updated role to{" "}
        <span className="font-medium text-taupe-900">Engineering Manager</span>
      </p>
    ),
    date: "3 days ago",
  },
  {
    id: 3,
    icon: <Calendar size={14} />,
    iconBgClass: "bg-brand-primary text-white",
    content: (
      <p className="caption text-taupe-600">
        <span className="font-semibold text-taupe-900">Tom Cook</span> joined the team.
      </p>
    ),
    date: "Jan 2021",
  },
];

export default function DetailScreenPreview() {
  return (
    <div className="w-full flex flex-col gap-6">
      {/* Page heading */}
      <PageHeading
        title={PERSON.name}
        breadcrumbs={[
          { label: "Team", href: "#" },
          { label: PERSON.name },
        ]}
        badge={{ label: PERSON.status, variant: "outline" }}
        meta={[
          { icon: <Mail size={13} />, text: PERSON.email },
          { icon: <MapPin size={13} />, text: PERSON.location },
          { icon: <Calendar size={13} />, text: `Joined ${PERSON.joined}` },
        ]}
        actions={[
          { label: "Edit", onClick: () => {} },
          { label: "Delete", onClick: () => {}, primary: false },
        ]}
      />

      <div className="grid grid-cols-5 gap-5">
        {/* Details card */}
        <div className="col-span-3 rounded-xl border border-taupe-100 bg-white shadow-natural overflow-hidden">
          <div className="border-b border-taupe-100 px-5 py-3.5">
            <p className="label text-taupe-900">Details</p>
          </div>
          <DescriptionList items={DL_ITEMS} columns={2} />
        </div>

        {/* Right column */}
        <div className="col-span-2 flex flex-col gap-5">
          {/* Team card */}
          <div className="rounded-xl border border-taupe-100 bg-white shadow-natural overflow-hidden">
            <div className="border-b border-taupe-100 px-5 py-3.5">
              <p className="label text-taupe-900">Team</p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {[
                { name: "Sophie Chen", role: "Senior Engineer", color: "bg-brand-secondary text-taupe-900", initials: "SC" },
                { name: "James Park", role: "Engineer", color: "bg-brand-primary text-white", initials: "JP" },
                { name: "Mia Torres", role: "Engineer", color: "bg-taupe-900 text-white", initials: "MT" },
              ].map((m) => (
                <div key={m.name} className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback className={m.color}>{m.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="caption font-semibold text-taupe-900">{m.name}</p>
                    <p className="caption-xs text-taupe-400">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact card */}
          <div className="rounded-xl border border-taupe-100 bg-white shadow-natural overflow-hidden">
            <div className="border-b border-taupe-100 px-5 py-3.5">
              <p className="label text-taupe-900">Contact</p>
            </div>
            <div className="divide-y divide-taupe-50">
              <a href={`mailto:${PERSON.email}`} className="flex items-center gap-3 px-5 py-3 caption text-taupe-600 hover:bg-taupe-50 transition-colors">
                <Mail size={13} className="text-taupe-400" />
                {PERSON.email}
              </a>
              <a href={`tel:${PERSON.phone}`} className="flex items-center gap-3 px-5 py-3 caption text-taupe-600 hover:bg-taupe-50 transition-colors">
                <Phone size={13} className="text-taupe-400" />
                {PERSON.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Activity */}
      <div className="rounded-xl border border-taupe-100 bg-white shadow-natural overflow-hidden">
        <div className="border-b border-taupe-100 px-5 py-3.5">
          <p className="label text-taupe-900">Activity</p>
        </div>
        <div className="p-5">
          <ActivityFeed events={FEED} />
        </div>
      </div>
    </div>
  );
}
