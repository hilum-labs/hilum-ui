
import {
  Archive,
  ChevronDown,
  Copy,
  Download,
  EllipsisVertical,
  Heart,
  MoreHorizontal,
  MoveRight,
  PenLine,
  Star,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuShortcut,
} from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  simple: `import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@hilum/ui"
import { Button } from "@hilum/ui"
import { ChevronDown } from "lucide-react"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options <ChevronDown size={14} /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Account settings</DropdownMenuItem>
    <DropdownMenuItem>Support</DropdownMenuItem>
    <DropdownMenuItem>License</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,

  withDividers: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options <ChevronDown size={14} /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Archive</DropdownMenuItem>
    <DropdownMenuItem>Move</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Share</DropdownMenuItem>
    <DropdownMenuItem>Add to favorites</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,

  withIcons: `import { PenLine, Copy, Archive, MoveRight, UserPlus, Heart, Trash2 } from "lucide-react"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options <ChevronDown size={14} /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem><PenLine size={14} /> Edit</DropdownMenuItem>
    <DropdownMenuItem><Copy size={14} /> Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem><Archive size={14} /> Archive</DropdownMenuItem>
    <DropdownMenuItem><MoveRight size={14} /> Move</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem><UserPlus size={14} /> Share</DropdownMenuItem>
    <DropdownMenuItem><Heart size={14} /> Add to favorites</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive><Trash2 size={14} /> Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,

  minimalIcon: `import { EllipsisVertical } from "lucide-react"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon" variant="ghost">
      <EllipsisVertical size={16} />
      <span className="sr-only">Open options</span>
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Account settings</DropdownMenuItem>
    <DropdownMenuItem>Support</DropdownMenuItem>
    <DropdownMenuItem>License</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,

  withHeader: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options <ChevronDown size={14} /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <div className="px-2.5 py-2">
      <p className="caption text-ground-400">Signed in as</p>
      <p className="body font-medium text-ground-900 truncate">tom@example.com</p>
    </div>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Account settings</DropdownMenuItem>
    <DropdownMenuItem>Support</DropdownMenuItem>
    <DropdownMenuItem>License</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,

  dropdownMenu: `import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
  DropdownMenuShortcut,
} from "@hilum/ui"
import { Button } from "@hilum/ui"
import { MoreHorizontal } from "lucide-react"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button size="icon" variant="ghost"><MoreHorizontal size={16} /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuItem>
      <Star size={14} /> Add to favourites
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Copy size={14} /> Duplicate
      <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Download size={14} /> Download
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-red-500 focus:text-red-500">
      <Trash2 size={14} /> Delete
      <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

export default function DropdownMenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Dropdown Menu</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Dropdown Menu</h1>
        <p className="body max-w-lg text-ground-500">
          Contextual menu revealed on trigger interaction.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeading label="Dropdown Menu · Variants" />

        <PreviewBlock
          title="Simple"
          description="Button trigger with plain text items"
          code={CODE.simple}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Options <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Account settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem>License</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PreviewBlock>

        <PreviewBlock
          title="With dividers"
          description="Items grouped by separators"
          code={CODE.withDividers}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Options <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem>Move</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Add to favorites</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PreviewBlock>

        <PreviewBlock
          title="With icons"
          description="Leading icon per item"
          code={CODE.withIcons}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Options <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <PenLine size={14} /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy size={14} /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Archive size={14} /> Archive
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MoveRight size={14} /> Move
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserPlus size={14} /> Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart size={14} /> Add to favorites
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem destructive>
                <Trash2 size={14} /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PreviewBlock>

        <PreviewBlock
          title="Minimal icon trigger"
          description="Dots-vertical button — no label"
          code={CODE.minimalIcon}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <EllipsisVertical size={16} />
                <span className="sr-only">Open options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Account settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem>License</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PreviewBlock>

        <PreviewBlock
          title="With simple header"
          description="Account info header above items"
          code={CODE.withHeader}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Options <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="px-2.5 py-2">
                <p className="caption text-ground-400">Signed in as</p>
                <p className="body font-medium text-ground-900 truncate">
                  tom@example.com
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Account settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuItem>License</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PreviewBlock>

        <SectionHeading label="Dropdown Menu · With extras" />

        <PreviewBlock
          title="Context actions"
          description="Label, shortcuts, and destructive item"
          code={CODE.dropdownMenu}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="outline">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Star size={14} />
                Add to favourites
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy size={14} />
                Duplicate
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download size={14} />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50">
                <Trash2 size={14} />
                Delete
                <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </PreviewBlock>
      </div>
    </div>
  );
}
