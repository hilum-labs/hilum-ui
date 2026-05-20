
import { type ReactNode } from "react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Label } from "@hilum/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@hilum/ui";
import { Textarea } from "@hilum/ui";

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
    <div className={`rounded-2xl border border-ground-100 bg-ground-50/60 p-5 ${className}`}>
      <p className="label mb-3 text-ground-400">{title}</p>
      {children}
    </div>
  );
}

export default function FormLayouts() {
  return (
    <div className="bg-white px-8 py-10">
      <div className="space-y-8">
        <VariantCard title="1. Simple stacked" className="p-0">
          <div className="mx-auto max-w-2xl px-8 py-10">
            <div className="mb-8 flex flex-col gap-4 border-b border-ground-100 pb-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Avatar size="xl">
                  <AvatarFallback className="bg-brand-primary text-white">TC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="subheading text-ground-900">Tom Cook</p>
                  <p className="caption text-ground-400">tom@example.com</p>
                </div>
              </div>
              <Button variant="outline">Change</Button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Name</Label>
                <Input id="profile-name" defaultValue="Tom Cook" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-email">Email</Label>
                <Input id="profile-email" type="email" defaultValue="tom@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-country">Country</Label>
                <Select defaultValue="united-states">
                  <SelectTrigger id="profile-country">
                    <SelectValue placeholder="Choose a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="mexico">Mexico</SelectItem>
                    <SelectItem value="united-states">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profile-about">About</Label>
                <Textarea
                  id="profile-about"
                  defaultValue="Product designer focusing on system foundations, internal tooling, and cross-team workflow."
                  className="min-h-[120px]"
                />
              </div>
              <div className="pt-2">
                <Button>Save</Button>
              </div>
            </div>
          </div>
        </VariantCard>

        <VariantCard title="2. Labels on left">
          <div className="mx-auto max-w-4xl space-y-5">
            {[
              ["First name", "Tom", "text"],
              ["Last name", "Cook", "text"],
              ["Email", "tom@example.com", "email"],
              ["Street", "123 Market Street", "text"],
              ["City", "San Francisco", "text"],
              ["State", "California", "text"],
              ["ZIP", "94107", "text"],
            ].map(([label, value, type]) => (
              <div
                key={label}
                className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)] md:items-center"
              >
                <Label className="justify-self-start md:justify-self-end">{label}</Label>
                <Input type={type} defaultValue={value} />
              </div>
            ))}

            <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)] md:items-center">
              <Label className="justify-self-start md:justify-self-end">Country</Label>
              <Select defaultValue="united-states">
                <SelectTrigger>
                  <SelectValue placeholder="Choose a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="mexico">Mexico</SelectItem>
                  <SelectItem value="united-states">United States</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
