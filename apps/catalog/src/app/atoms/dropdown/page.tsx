import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";
import { useState } from "react";
import {
  Bell,
  Clock,
  Lock,
  Mail,
  Monitor,
  Palette,
  Settings,
  Shield,
  SquareLibrary,
  Star,
  Users,
} from "lucide-react";
import { Dropdown, DropdownLabel, DropdownSeparator, MenuItem } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const BASIC_CODE = `import { Dropdown, MenuItem } from "@hilum/ui"
import { Clock, Lock, SquareLibrary, Star, Users } from "lucide-react"
import { useState } from "react"

const items = [
  { icon: SquareLibrary, label: "Teamspaces" },
  { icon: Clock, label: "Recents" },
  { icon: Star, label: "Favorites" },
  { icon: Users, label: "Shared" },
  { icon: Lock, label: "Private" },
]
const [selected, setSelected] = useState<number | null>(0)

<Dropdown {...(selected === null ? {} : { checkedIndex: selected })}>
  {items.map((item, index) => (
    <MenuItem
      key={item.label}
      index={index}
      icon={item.icon}
      label={item.label}
      checked={selected === index}
      onSelect={() => setSelected(selected === index ? null : index)}
    />
  ))}
</Dropdown>`;

const GROUPS_CODE = `import { Dropdown, DropdownLabel, DropdownSeparator, MenuItem } from "@hilum/ui"
import { Bell, Mail, Monitor, Palette, Settings, Shield } from "lucide-react"

<Dropdown>
  <DropdownLabel>Account</DropdownLabel>
  <MenuItem index={0} icon={Mail} label="Email" />
  <MenuItem index={1} icon={Bell} label="Notifications" />
  <MenuItem index={2} icon={Shield} label="Privacy" />
  <DropdownSeparator />
  <DropdownLabel>Appearance</DropdownLabel>
  <MenuItem index={3} icon={Settings} label="General" />
  <MenuItem index={4} icon={Palette} label="Theme" />
  <MenuItem index={5} icon={Monitor} label="Display" />
</Dropdown>`;

function DropdownPage() {
  const items = [
    { icon: SquareLibrary, label: "Teamspaces" },
    { icon: Clock, label: "Recents" },
    { icon: Star, label: "Favorites" },
    { icon: Users, label: "Shared" },
    { icon: Lock, label: "Private" },
  ];
  const [selected, setSelected] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <h1 className="display mb-2 text-ground-900">Dropdown</h1>
      <p className="body mb-8 max-w-lg text-ground-500">
        Menu-style dropdown with proximity hover and animated backgrounds.
      </p>
      <PageDocs path="/atoms/dropdown/" />
      <div className="flex flex-col gap-3">
        <PreviewBlock title="Basic" description="Checked item with hover preview" code={BASIC_CODE}>
          <Dropdown {...(selected === null ? {} : { checkedIndex: selected })}>
            {items.map((item, index) => (
              <MenuItem
                key={item.label}
                index={index}
                icon={item.icon}
                label={item.label}
                checked={selected === index}
                onSelect={() => setSelected(selected === index ? null : index)}
              />
            ))}
          </Dropdown>
        </PreviewBlock>
        <PreviewBlock title="Groups" description="Labels and separators" code={GROUPS_CODE}>
          <Dropdown>
            <DropdownLabel>Account</DropdownLabel>
            <MenuItem index={0} icon={Mail} label="Email" />
            <MenuItem index={1} icon={Bell} label="Notifications" />
            <MenuItem index={2} icon={Shield} label="Privacy" />
            <DropdownSeparator />
            <DropdownLabel>Appearance</DropdownLabel>
            <MenuItem index={3} icon={Settings} label="General" />
            <MenuItem index={4} icon={Palette} label="Theme" />
            <MenuItem index={5} icon={Monitor} label="Display" />
          </Dropdown>
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/dropdown/")({
  head: () => createCatalogPageHead("/atoms/dropdown/"),
  component: DropdownPage,
});
