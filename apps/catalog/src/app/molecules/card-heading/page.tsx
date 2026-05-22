import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import { CardHeading } from "@hilum/ui";
import { Avatar, AvatarFallback } from "@hilum/ui";
import { Badge } from "@hilum/ui";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@hilum/ui";
import { Button } from "@hilum/ui";
import { MoreHorizontal } from "lucide-react";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  simple: `import { CardHeading } from "@hilum/ui"

<div className="rounded-xl border border-ground-100">
  <CardHeading title="Job Postings" />
  <div className="p-5">{/* card content */}</div>
</div>`,

  withAction: `import { CardHeading } from "@hilum/ui"

<CardHeading
  title="Job Postings"
  description="View and manage your current openings."
  actions={[{ label: "Create new job" }]}
/>`,

  withAvatar: `import { CardHeading } from "@hilum/ui"
import { Avatar, AvatarFallback } from "@hilum/ui"

<CardHeading title="Tom Cook" description="tom@example.com">
  <Avatar size="sm">
    <AvatarFallback className="bg-brand-primary text-white">TC</AvatarFallback>
  </Avatar>
</CardHeading>`,

  withDropdown: `import { CardHeading } from "@hilum/ui"
import { DropdownMenu, ... } from "@hilum/ui"
import { MoreHorizontal } from "lucide-react"

<CardHeading title="Tom Cook" description="Account manager">
  <Avatar size="sm"><AvatarFallback className="bg-brand-secondary text-ground-900">TC</AvatarFallback></Avatar>
  <div className="ml-auto">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="size-8 p-0"><MoreHorizontal size={15} /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View profile</DropdownMenuItem>
        <DropdownMenuItem>Send message</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</CardHeading>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function CardHeadingPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/molecules" className="hover:text-ground-700">Molecules</a>
          <span>/</span>
          <span className="body font-semibold text-ground-900">Card Heading</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Card Heading</h1>
        <p className="body max-w-md text-ground-400">
          A header row for cards and panels. Combines a title, optional description, leading slot (avatar/icon), and trailing actions.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Molecule</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Card · Avatar · Button · Dropdown Menu</p>
        </div>
      </div>

      <PageDocs path="/molecules/card-heading/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Card Heading · Basic" />
          <PreviewBlock title="Title only" description="Used as a card's top border section" code={CODE.simple} previewClassName="items-start p-0">
            <div className="w-full max-w-md rounded-xl border border-ground-100 overflow-hidden">
              <CardHeading title="Job Postings" />
              <div className="p-5">
                <p className="body text-ground-400">Card content goes here.</p>
              </div>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Card Heading · With action" />
          <PreviewBlock title="Title + description + CTA" description="Full heading with an action button" code={CODE.withAction} previewClassName="items-start p-0">
            <div className="w-full max-w-md rounded-xl border border-ground-100 overflow-hidden">
              <CardHeading
                title="Job Postings"
                description="View and manage your current openings."
                actions={[{ label: "Create new job" }]}
              />
              <div className="p-5">
                <p className="body text-ground-400">Card content goes here.</p>
              </div>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Card Heading · With avatar" />
          <div className="flex flex-col gap-3">
            <PreviewBlock title="Avatar + name + email" description="Profile card header" code={CODE.withAvatar} previewClassName="items-start p-0">
              <div className="w-full max-w-sm rounded-xl border border-ground-100 overflow-hidden">
                <CardHeading title="Tom Cook" description="tom@example.com">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-brand-primary text-white">TC</AvatarFallback>
                  </Avatar>
                </CardHeading>
                <div className="p-5">
                  <p className="body text-ground-400">Card content.</p>
                </div>
              </div>
            </PreviewBlock>
            <PreviewBlock title="Avatar + dropdown" description="Card header with contextual menu" code={CODE.withDropdown} previewClassName="items-start p-0">
              <div className="w-full max-w-sm rounded-xl border border-ground-100 overflow-hidden">
                <CardHeading title="Tom Cook" description="Account manager">
                  <Avatar size="sm">
                    <AvatarFallback className="bg-brand-secondary text-ground-900">TC</AvatarFallback>
                  </Avatar>
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="size-8 p-0 text-ground-400">
                          <MoreHorizontal size={15} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View profile</DropdownMenuItem>
                        <DropdownMenuItem>Send message</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeading>
                <div className="p-5">
                  <p className="body text-ground-400">Card content.</p>
                </div>
              </div>
            </PreviewBlock>
          </div>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/molecules/card-heading/")({
  head: () => createCatalogPageHead("/molecules/card-heading/"),
  component: CardHeadingPage,
});
