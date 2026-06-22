import { useState } from "react";
import { X } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import { Button } from "@hilum/ui";

const TEAM = [
  {
    name: "Lindsay Walton",
    initials: "LW",
    role: "Front-end Developer",
    email: "lindsay.walton@example.com",
  },
  { name: "Courtney Henry", initials: "CH", role: "Designer", email: "courtney.henry@example.com" },
  { name: "Tom Cook", initials: "TC", role: "Director of Product", email: "tom.cook@example.com" },
] as const;

function SlideOverFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[400px] overflow-hidden rounded-xl border border-ground-100">
      <div className="flex flex-1 items-center justify-center bg-ground-50 p-8 body text-ground-400">
        Main page content preview
      </div>
      {children}
    </div>
  );
}

function PersonAvatar({
  initials,
  size = "md",
  className = "",
}: {
  initials: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className="bg-brand-primary/10 text-brand-primary">{initials}</AvatarFallback>
    </Avatar>
  );
}

export default function SlideOverCreateProjectForm() {
  const [projectName, setProjectName] = useState("Northstar Portal");
  const [projectDescription, setProjectDescription] = useState(
    "A shared client workspace for onboarding, billing, and weekly performance reporting.",
  );
  const [selectedMembers, setSelectedMembers] = useState<string[]>(["Lindsay Walton", "Tom Cook"]);

  const toggleMember = (name: string) => {
    setSelectedMembers((current) =>
      current.includes(name) ? current.filter((member) => member !== name) : [...current, name],
    );
  };

  return (
    <SlideOverFrame>
      <div className="flex w-96 flex-col bg-white border-l border-ground-100">
        <div className="flex items-center justify-between border-b border-ground-100 px-6 py-4">
          <h2 className="subheading text-ground-900">Create project</h2>
          <button type="button">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 space-y-5 px-6 py-6">
          <div>
            <label className="label text-ground-400" htmlFor="project-name">
              Name
            </label>
            <input
              id="project-name"
              value={projectName}
              onChange={(event) => setProjectName(event.target.value)}
              className="mt-2 w-full rounded-xl border border-ground-200 bg-white px-3 py-2 body text-ground-900 outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <label className="label text-ground-400" htmlFor="project-description">
              Description
            </label>
            <textarea
              id="project-description"
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
              rows={4}
              className="mt-2 w-full rounded-xl border border-ground-200 bg-white px-3 py-2 body text-ground-900 outline-none focus:border-brand-primary"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <p className="label text-ground-400">Team members</p>
              <Badge variant="secondary">{selectedMembers.length} selected</Badge>
            </div>
            <div className="mt-3 space-y-3">
              {TEAM.map((member) => (
                <label
                  key={member.email}
                  className="flex items-center gap-3 rounded-xl border border-ground-100 px-3 py-3"
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.name)}
                    onChange={() => toggleMember(member.name)}
                    className="h-4 w-4 rounded border-ground-300"
                  />
                  <PersonAvatar initials={member.initials} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="body font-medium text-ground-900">{member.name}</p>
                    <p className="caption text-ground-400">{member.role}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-ground-100 px-6 py-4">
          <Button className="w-full">Create</Button>
        </div>
      </div>
    </SlideOverFrame>
  );
}
