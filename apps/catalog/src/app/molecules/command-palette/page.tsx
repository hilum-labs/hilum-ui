
import { useState } from "react";
import { LayoutDashboard, Users, FolderOpen, Settings, FileText, Search } from "lucide-react";
import { CommandPalette } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Kbd } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const COMMANDS = [
  { id: 1, label: "Dashboard", description: "View your main dashboard", icon: <LayoutDashboard size={15} />, category: "Navigation", href: "#" },
  { id: 2, label: "Team members", description: "Manage your team", icon: <Users size={15} />, category: "Navigation", href: "#" },
  { id: 3, label: "Projects", description: "Browse all projects", icon: <FolderOpen size={15} />, category: "Navigation", href: "#" },
  { id: 4, label: "Settings", description: "Account preferences", icon: <Settings size={15} />, category: "Navigation", href: "#" },
  { id: 5, label: "New document", description: "Create a new document", icon: <FileText size={15} />, category: "Actions", onSelect: () => alert("New document!") },
  { id: 6, label: "Search users", description: "Find a team member", icon: <Search size={15} />, category: "Actions", onSelect: () => {} },
];

const CODE = {
  basic: `import { CommandPalette } from "@hilum/ui"
import { LayoutDashboard, Users } from "lucide-react"

const commands = [
  { id: 1, label: "Dashboard", icon: <LayoutDashboard size={15} />, category: "Navigation", href: "/dashboard" },
  { id: 2, label: "Team members", icon: <Users size={15} />, category: "Navigation", href: "/team" },
  { id: 3, label: "New document", icon: <FileText size={15} />, category: "Actions", onSelect: () => {} },
]

function Example() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open palette</Button>
      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={commands}
        placeholder="Search commands..."
      />
    </>
  )
}`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function CommandPalettePage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Command Palette</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Command Palette</h1>
        <p className="body max-w-md text-ground-400">
          A modal search dialog for navigating and executing commands quickly. Items are filtered as you type. Groups by category.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Dialog · Input · Icon · Kbd</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Command Palette · Basic" />
          <PreviewBlock title="Searchable command list" description="Grouped by category, filtered as you type" code={CODE.basic}>
            <div className="flex items-center gap-4">
              <Button onClick={() => setOpen(true)}>
                Open palette
              </Button>
              <div className="flex items-center gap-1.5 caption text-ground-400">
                or press <Kbd>⌘</Kbd><Kbd>K</Kbd>
              </div>
            </div>
          </PreviewBlock>
        </div>
      </div>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        items={COMMANDS}
        placeholder="Search pages and actions..."
      />

      <div className="h-16" />
    </div>
  );
}
