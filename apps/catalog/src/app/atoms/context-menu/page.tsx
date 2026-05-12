
import { Copy, Edit2, FileText, FolderOpen, Share2, Trash2, ExternalLink, Link2, Mail } from "lucide-react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuLabel,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuSeparator,
} from "@hilum/ui"

<ContextMenu>
  <ContextMenuTrigger className="flex items-center justify-center rounded-xl border border-dashed border-taupe-200 bg-taupe-50 p-8">
    <span className="body text-taupe-400">Right-click anywhere in this area</span>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>New Tab</ContextMenuItem>
    <ContextMenuItem>New Window</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem destructive>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,

  withIcons: `import { Edit2, Copy, FileText, FolderOpen, Trash2 } from "lucide-react"

<ContextMenu>
  <ContextMenuTrigger className="flex items-center justify-center rounded-xl border border-dashed border-taupe-200 bg-taupe-50 p-8">
    <span className="body text-taupe-400">Right-click to see icons</span>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem><Edit2 size={14} /> Rename</ContextMenuItem>
    <ContextMenuItem><Copy size={14} /> Duplicate</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem><FileText size={14} /> View details</ContextMenuItem>
    <ContextMenuItem><FolderOpen size={14} /> Move to folder</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem destructive><Trash2 size={14} /> Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,

  withSubmenu: `import { Share2, ExternalLink, Link2, Mail } from "lucide-react"

<ContextMenu>
  <ContextMenuTrigger className="flex items-center justify-center rounded-xl border border-dashed border-taupe-200 bg-taupe-50 p-8">
    <span className="body text-taupe-400">Right-click to see submenu</span>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem><Edit2 size={14} /> Edit</ContextMenuItem>
    <ContextMenuItem><Copy size={14} /> Copy</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuSub>
      <ContextMenuSubTrigger><Share2 size={14} /> Share</ContextMenuSubTrigger>
      <ContextMenuSubContent>
        <ContextMenuItem><ExternalLink size={14} /> Open in new tab</ContextMenuItem>
        <ContextMenuItem><Link2 size={14} /> Copy link</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem><Mail size={14} /> Send via email</ContextMenuItem>
      </ContextMenuSubContent>
    </ContextMenuSub>
    <ContextMenuSeparator />
    <ContextMenuItem destructive><Trash2 size={14} /> Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-taupe-400">{label}</h2>
      <div className="h-px flex-1 bg-taupe-100" />
    </div>
  );
}

export default function ContextMenuPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-taupe-400">
          <a href="/" className="hover:text-taupe-700">Design System</a>
          <span>/</span>
          <a href="/atoms" className="hover:text-taupe-700">Atoms</a>
          <span>/</span>
          <span className="font-semibold text-taupe-900">Context Menu</span>
        </div>
        <h1 className="display mb-2 text-taupe-900">Context Menu</h1>
        <p className="body max-w-lg text-taupe-500">
          Contextual menu revealed on right-click, offering actions relevant to the target element.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <section>
          <SectionHeading label="Variants" />
          <div className="flex flex-col gap-3">
            <PreviewBlock
              title="Basic"
              description="Plain text items with separators and a destructive action"
              code={CODE.basic}
            >
              <ContextMenu>
                <ContextMenuTrigger className="flex w-full max-w-sm cursor-default items-center justify-center rounded-xl border border-dashed border-taupe-200 bg-taupe-50 p-8">
                  <span className="body text-taupe-400">Right-click anywhere in this area</span>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>New Tab</ContextMenuItem>
                  <ContextMenuItem>New Window</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>Copy</ContextMenuItem>
                  <ContextMenuItem>Paste</ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem destructive>Delete</ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </PreviewBlock>

            <PreviewBlock
              title="With Icons"
              description="Leading icons to reinforce each action's meaning"
              code={CODE.withIcons}
            >
              <ContextMenu>
                <ContextMenuTrigger className="flex w-full max-w-sm cursor-default items-center justify-center rounded-xl border border-dashed border-taupe-200 bg-taupe-50 p-8">
                  <span className="body text-taupe-400">Right-click to see icons</span>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuLabel>File actions</ContextMenuLabel>
                  <ContextMenuItem>
                    <Edit2 size={14} /> Rename
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Copy size={14} /> Duplicate
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem>
                    <FileText size={14} /> View details
                    <ContextMenuShortcut>⌘I</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <FolderOpen size={14} /> Move to folder
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem destructive>
                    <Trash2 size={14} /> Delete
                    <ContextMenuShortcut>⌫</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </PreviewBlock>

            <PreviewBlock
              title="With Submenu"
              description="Nested share options accessible via a sub-trigger"
              code={CODE.withSubmenu}
            >
              <ContextMenu>
                <ContextMenuTrigger className="flex w-full max-w-sm cursor-default items-center justify-center rounded-xl border border-dashed border-taupe-200 bg-taupe-50 p-8">
                  <span className="body text-taupe-400">Right-click to see submenu</span>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem>
                    <Edit2 size={14} /> Edit
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Copy size={14} /> Copy
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>
                      <Share2 size={14} /> Share
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      <ContextMenuItem>
                        <ExternalLink size={14} /> Open in new tab
                      </ContextMenuItem>
                      <ContextMenuItem>
                        <Link2 size={14} /> Copy link
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>
                        <Mail size={14} /> Send via email
                      </ContextMenuItem>
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSeparator />
                  <ContextMenuItem destructive>
                    <Trash2 size={14} /> Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            </PreviewBlock>
          </div>
        </section>
      </div>
    </div>
  );
}
