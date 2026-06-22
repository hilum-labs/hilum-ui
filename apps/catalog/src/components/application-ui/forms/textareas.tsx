import { type ReactNode } from "react";
import { Bold, Italic, Paperclip, Underline } from "lucide-react";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Button } from "@hilum/ui";
import { Input } from "@hilum/ui";
import { Label } from "@hilum/ui";
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

export default function Textareas() {
  return (
    <div className="bg-white px-8 py-10">
      <div className="grid gap-5">
        <VariantCard title="1. Simple">
          <div className="space-y-2">
            <Label htmlFor="project-note">Project note</Label>
            <Textarea
              id="project-note"
              defaultValue="We should move the onboarding audit one week earlier so the team can absorb feedback before launch."
            />
            <p className="caption text-ground-400">121 / 240 characters</p>
          </div>
        </VariantCard>

        <VariantCard title="2. With avatar and actions">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback className="bg-brand-primary text-white">TC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                defaultValue="Shipping a revised handoff today. Please review the updated spacing tokens before 4 PM."
                className="min-h-[110px]"
              />
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full border border-ground-200 px-3 py-1.5 caption text-ground-500 transition-colors hover:border-ground-300 hover:text-ground-700"
                >
                  <Paperclip size={14} />
                  Attach file
                </button>
                <Button>Post update</Button>
              </div>
            </div>
          </div>
        </VariantCard>

        <VariantCard title="3. With title and pill actions">
          <div className="space-y-3">
            <Input defaultValue="Q2 launch recap" />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-ground-200 px-3 py-1.5 caption text-ground-600 transition-colors hover:border-ground-300 hover:text-ground-900"
              >
                <Bold size={13} />
                Bold
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-ground-200 px-3 py-1.5 caption text-ground-600 transition-colors hover:border-ground-300 hover:text-ground-900"
              >
                <Italic size={13} />
                Italic
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-ground-200 px-3 py-1.5 caption text-ground-600 transition-colors hover:border-ground-300 hover:text-ground-900"
              >
                <Underline size={13} />
                Link
              </button>
            </div>
            <Textarea
              defaultValue="We closed the quarter with stronger adoption in billing, a lighter support load, and clearer standards for incoming app teams."
              className="min-h-[120px]"
            />
          </div>
        </VariantCard>
      </div>
    </div>
  );
}
