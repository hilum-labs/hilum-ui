import { useState } from "react";
import { PageHeading } from "@hilum/ui";
import { SectionHeading as SectionHeadingComponent } from "@hilum/ui";
import { ActionPanel } from "@hilum/ui";
import { Field } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Textarea } from "@hilum/ui";
import { Switch } from "@hilum/ui";
import { Label } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";

const NOTIFICATIONS = [
  {
    id: "notif-comments",
    label: "Comments",
    description: "Get notified when someone comments.",
    defaultChecked: true,
  },
  {
    id: "notif-mentions",
    label: "Mentions",
    description: "Get notified when you are mentioned.",
    defaultChecked: true,
  },
  {
    id: "notif-updates",
    label: "Product updates",
    description: "News and announcements.",
    defaultChecked: false,
  },
  {
    id: "notif-security",
    label: "Security alerts",
    description: "Login and account security events.",
    defaultChecked: true,
  },
];

export default function SettingsPreview() {
  const [notifications, setNotifications] = useState(
    NOTIFICATIONS.map((n) => ({ id: n.id, checked: n.defaultChecked })),
  );

  function toggle(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, checked: !n.checked } : n)));
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeading title="Settings" />

      {/* Profile */}
      <div className="grid grid-cols-3 gap-6 border-b border-ground-100 pb-8">
        <div>
          <SectionHeadingComponent title="Profile" description="Update your public profile." />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-brand-primary text-white heading font-semibold">
                TC
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change photo
            </Button>
          </div>
          <Field label="Display name" htmlFor="settings-name">
            <Input id="settings-name" defaultValue="Tom Cook" />
          </Field>
          <Field label="Email" htmlFor="settings-email">
            <Input id="settings-email" type="email" defaultValue="tom@example.com" />
          </Field>
          <Field label="Bio" htmlFor="settings-bio" hint="Brief description for your profile.">
            <Textarea id="settings-bio" rows={3} defaultValue="Engineering manager at Acme Inc." />
          </Field>
          <div className="flex justify-end">
            <Button size="sm">Save profile</Button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="grid grid-cols-3 gap-6 border-b border-ground-100 pb-8">
        <div>
          <SectionHeadingComponent
            title="Notifications"
            description="Choose what you want to be notified about."
          />
        </div>
        <div className="col-span-2 flex flex-col gap-5">
          {NOTIFICATIONS.map((n) => {
            const state = notifications.find((s) => s.id === n.id);
            return (
              <div key={n.id} className="flex items-center justify-between gap-4">
                <div>
                  <Label htmlFor={n.id} className="body font-medium text-ground-900">
                    {n.label}
                  </Label>
                  <p className="caption text-ground-400 mt-0.5">{n.description}</p>
                </div>
                <Switch
                  id={n.id}
                  {...(state?.checked !== undefined && { checked: state.checked })}
                  onCheckedChange={() => toggle(n.id)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Password */}
      <div className="grid grid-cols-3 gap-6 border-b border-ground-100 pb-8">
        <div>
          <SectionHeadingComponent
            title="Password"
            description="Update your password to keep your account secure."
          />
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          <Field label="Current password" htmlFor="settings-current-pw">
            <Input id="settings-current-pw" type="password" />
          </Field>
          <Field label="New password" htmlFor="settings-new-pw">
            <Input id="settings-new-pw" type="password" />
          </Field>
          <Field label="Confirm new password" htmlFor="settings-confirm-pw">
            <Input id="settings-confirm-pw" type="password" />
          </Field>
          <div className="flex justify-end">
            <Button size="sm">Update password</Button>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <ActionPanel
        title="Delete account"
        description="Permanently delete your account and all associated data. This action cannot be undone."
        actions={[{ label: "Delete account", onClick: () => {} }]}
        variant="muted"
      />
    </div>
  );
}
