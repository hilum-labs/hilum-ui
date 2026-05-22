import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import * as React from "react";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  appMenubar: `import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarItem, MenubarSeparator, MenubarShortcut,
  MenubarCheckboxItem, MenubarRadioGroup, MenubarRadioItem, MenubarLabel,
} from "@hilum/ui"

function AppMenubar() {
  const [showToolbar, setShowToolbar] = React.useState(true)
  const [showSidebar, setShowSidebar] = React.useState(false)
  const [zoom, setZoom] = React.useState("100")

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New Tab <MenubarShortcut>⌘T</MenubarShortcut></MenubarItem>
          <MenubarItem>New Window <MenubarShortcut>⌘N</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Open <MenubarShortcut>⌘O</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="text-red-500 focus:bg-red-50 focus:text-red-600">Close</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo <MenubarShortcut>⌘Z</MenubarShortcut></MenubarItem>
          <MenubarItem>Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Select All</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={showToolbar} onCheckedChange={setShowToolbar}>
            Show Toolbar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={showSidebar} onCheckedChange={setShowSidebar}>
            Show Sidebar
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Zoom</MenubarLabel>
          <MenubarRadioGroup value={zoom} onValueChange={setZoom}>
            <MenubarRadioItem value="50">50%</MenubarRadioItem>
            <MenubarRadioItem value="100">100%</MenubarRadioItem>
            <MenubarRadioItem value="150">150%</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Keyboard Shortcuts</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}`,

  textEditorMenubar: `import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarItem, MenubarSeparator, MenubarShortcut,
  MenubarCheckboxItem, MenubarSub, MenubarSubTrigger, MenubarSubContent,
} from "@hilum/ui"

function TextEditorMenubar() {
  const [darkMode, setDarkMode] = React.useState(false)
  const [focusMode, setFocusMode] = React.useState(false)

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Bold <MenubarShortcut>⌘B</MenubarShortcut></MenubarItem>
          <MenubarItem>Italic <MenubarShortcut>⌘I</MenubarShortcut></MenubarItem>
          <MenubarItem>Underline <MenubarShortcut>⌘U</MenubarShortcut></MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Heading</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>H1</MenubarItem>
              <MenubarItem>H2</MenubarItem>
              <MenubarItem>H3</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Insert</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Image</MenubarItem>
          <MenubarItem>Link</MenubarItem>
          <MenubarItem>Code Block</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Word Count</MenubarItem>
          <MenubarItem>Outline</MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked={darkMode} onCheckedChange={setDarkMode}>
            Dark Mode
          </MenubarCheckboxItem>
          <MenubarCheckboxItem checked={focusMode} onCheckedChange={setFocusMode}>
            Focus Mode
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
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

function AppMenubarDemo() {
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const [zoom, setZoom] = React.useState("100");

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New Window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Open <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="text-red-500 focus:bg-red-50 focus:text-red-600">
            Close
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⌘⇧Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Select All</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem
            checked={showToolbar}
            onCheckedChange={setShowToolbar}
          >
            Show Toolbar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={showSidebar}
            onCheckedChange={setShowSidebar}
          >
            Show Sidebar
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarLabel>Zoom</MenubarLabel>
          <MenubarRadioGroup value={zoom} onValueChange={setZoom}>
            <MenubarRadioItem value="50">50%</MenubarRadioItem>
            <MenubarRadioItem value="100">100%</MenubarRadioItem>
            <MenubarRadioItem value="150">150%</MenubarRadioItem>
          </MenubarRadioGroup>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Help</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Documentation</MenubarItem>
          <MenubarItem>Keyboard Shortcuts</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>About</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function TextEditorMenubarDemo() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [focusMode, setFocusMode] = React.useState(false);

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Bold <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Italic <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Underline <MenubarShortcut>⌘U</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Heading</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>H1</MenubarItem>
              <MenubarItem>H2</MenubarItem>
              <MenubarItem>H3</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Insert</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Image</MenubarItem>
          <MenubarItem>Link</MenubarItem>
          <MenubarItem>Code Block</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Word Count</MenubarItem>
          <MenubarItem>Outline</MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked={darkMode} onCheckedChange={setDarkMode}>
            Dark Mode
          </MenubarCheckboxItem>
          <MenubarCheckboxItem
            checked={focusMode}
            onCheckedChange={setFocusMode}
          >
            Focus Mode
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

function MenubarPage() {
  return (
    <div className="mx-auto max-w-7xl px-8 py-10">
      <div className="mb-10">
        <div className="caption mb-4 flex items-center gap-1.5 text-ground-400">
          <a href="/" className="hover:text-ground-700">
            Design System
          </a>
          <span>/</span>
          <a href="/atoms" className="hover:text-ground-700">
            Atoms
          </a>
          <span>/</span>
          <span className="font-semibold text-ground-900">Menubar</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Menubar</h1>
        <p className="body max-w-lg text-ground-500">
          Horizontal menu bar for application-level navigation and commands,
          with support for submenus, checkboxes, and radio groups.
        </p>
      </div>

      <PageDocs path="/atoms/menubar/" />

      <div className="flex flex-col gap-3">
        <SectionHeading label="Menubar · Variants" />

        <PreviewBlock
          title="Application menubar"
          description="File / Edit / View / Help menus with shortcuts, checkboxes, and radio items"
          code={CODE.appMenubar}
        >
          <AppMenubarDemo />
        </PreviewBlock>

        <PreviewBlock
          title="Text editor menubar"
          description="Compact Format / Insert / View with submenu and toggle states"
          code={CODE.textEditorMenubar}
        >
          <TextEditorMenubarDemo />
        </PreviewBlock>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/atoms/menubar/")({
  head: () => createCatalogPageHead("/atoms/menubar/"),
  component: MenubarPage,
});
