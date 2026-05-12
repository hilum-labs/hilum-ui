
import { type ReactNode, useState } from "react";
import { AlertCircle, Mail } from "lucide-react";
import { Input } from "@hilum/ui";
import { Label } from "@hilum/ui";

function VariantCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-taupe-100 bg-taupe-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-taupe-400">{title}</p>
      {children}
    </div>
  );
}

export default function InputGroups() {
  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5 lg:grid-cols-2">
        <VariantCard title="1. With label">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company name</Label>
            <Input id="company-name" defaultValue="Acme Studio" />
          </div>
        </VariantCard>

        <VariantCard title="2. With label and help text">
          <div className="space-y-2">
            <Label htmlFor="workspace-url">Workspace URL</Label>
            <Input id="workspace-url" placeholder="acme-team" />
            <p className="caption text-taupe-400">
              Used for your public workspace link and internal invites.
            </p>
          </div>
        </VariantCard>

        <VariantCard title="3. With leading icon">
          <div className="space-y-2">
            <Label htmlFor="team-email">Team email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-taupe-400" />
              <Input
                id="team-email"
                type="email"
                className="pl-9"
                placeholder="team@acme.com"
              />
            </div>
          </div>
        </VariantCard>

        <VariantCard title="4. With add-on">
          <div className="space-y-2">
            <Label htmlFor="site-address">Website</Label>
            <div className="flex">
              <span className="flex items-center rounded-l-md border border-r-0 border-taupe-200 bg-taupe-50 px-3 caption text-taupe-500">
                https://
              </span>
              <Input
                id="site-address"
                className="rounded-l-none"
                defaultValue="studio.acme.com"
              />
            </div>
          </div>
        </VariantCard>

        <VariantCard title="5. With trailing icon">
          <div className="space-y-2">
            <Label htmlFor="billing-email">Billing email</Label>
            <div className="relative">
              <Input
                id="billing-email"
                type="email"
                defaultValue="finance@acme"
                className="pr-9"
              />
              <AlertCircle className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-red-500" />
            </div>
          </div>
        </VariantCard>

        <VariantCard title="6. With validation error">
          <div className="space-y-2">
            <Label htmlFor="project-slug">Project slug</Label>
            <Input
              id="project-slug"
              defaultValue="new campaign!"
              className="border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20"
            />
            <p className="caption text-red-600">
              Use only lowercase letters, numbers, and hyphens.
            </p>
          </div>
        </VariantCard>

        <VariantCard title="7. With keyboard shortcut">
          <div className="space-y-2">
            <Label htmlFor="search-command">Quick search</Label>
            <div className="relative">
              <Input
                id="search-command"
                placeholder="Search settings, users, and invoices"
                className="pr-16"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-taupe-200 bg-taupe-50 px-2 py-1">
                <kbd className="caption font-sans text-taupe-500">⌘K</kbd>
              </span>
            </div>
          </div>
        </VariantCard>

        <VariantCard title="8. With inline leading and trailing add-ons">
          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <div className="flex items-center overflow-hidden rounded-md border border-taupe-200 bg-white">
              <span className="px-3 caption text-taupe-500">$</span>
              <input
                id="budget"
                defaultValue="12,500"
                className="h-9 flex-1 bg-transparent px-1 body text-taupe-900 outline-none"
              />
              <span className="px-3 caption text-taupe-500">.00</span>
            </div>
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
