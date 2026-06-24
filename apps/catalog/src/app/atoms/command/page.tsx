import { createFileRoute } from "@tanstack/react-router";
import { createCatalogPageHead } from "@/lib/seo";
import { PageDocs } from "@/components/catalog/page-docs";

import React, { useState, useEffect } from "react";
import { Calendar, CreditCard, FileText, HelpCircle, Search, Settings, User } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@hilum/ui";
import { Button } from "@hilum/ui";
import { PreviewBlock } from "@/components/catalog/preview-block";

const CODE = {
  basic: `import { Command, CommandInput, CommandList, CommandEmpty, CommandItem } from "@hilum/ui"

<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandItem value="calendar" keywords={["calendar"]}>Calendar</CommandItem>
    <CommandItem value="settings" keywords={["settings"]}>Settings</CommandItem>
    <CommandEmpty />
  </CommandList>
</Command>`,

  grouped: `<Command>
  <CommandInput placeholder="Search..." />
  <CommandList>
    <CommandGroup heading="Suggestions">
      <CommandItem value="calendar" keywords={["calendar"]}>Calendar</CommandItem>
      <CommandItem value="search" keywords={["search emoji"]}>Search Emoji</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem value="profile" keywords={["profile"]}>Profile</CommandItem>
    </CommandGroup>
    <CommandEmpty />
  </CommandList>
</Command>`,

  withShortcuts: `<CommandItem value="new-file" keywords={["new file"]}>
  New File
  <CommandShortcut>⌘N</CommandShortcut>
</CommandItem>`,

  withIcons: `import { Calendar } from "lucide-react"

<CommandItem value="calendar" keywords={["calendar"]}>
  <Calendar size={14} />
  Calendar
</CommandItem>`,

  inDialog: `const [open, setOpen] = useState(false)

// ⌘K listener
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      setOpen(o => !o)
    }
  }
  document.addEventListener("keydown", down)
  return () => document.removeEventListener("keydown", down)
}, [])

<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="Type a command..." />
  <CommandList>...</CommandList>
</CommandDialog>`,
};

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <h2 className="label text-ground-400">{label}</h2>
      <div className="h-px flex-1 bg-ground-100" />
    </div>
  );
}

function CommandDialogDemo() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open Command Palette
        <CommandShortcut>⌘K</CommandShortcut>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty />
          <CommandGroup heading="Suggestions">
            <CommandItem value="calendar" keywords={["calendar"]} onSelect={() => setOpen(false)}>
              <Calendar size={14} />
              Calendar
            </CommandItem>
            <CommandItem
              value="search-emoji"
              keywords={["search emoji"]}
              onSelect={() => setOpen(false)}
            >
              <Search size={14} />
              Search Emoji
            </CommandItem>
            <CommandItem value="settings" keywords={["settings"]} onSelect={() => setOpen(false)}>
              <Settings size={14} />
              Settings
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Account">
            <CommandItem value="profile" keywords={["profile"]} onSelect={() => setOpen(false)}>
              <User size={14} />
              Profile
            </CommandItem>
            <CommandItem value="billing" keywords={["billing"]} onSelect={() => setOpen(false)}>
              <CreditCard size={14} />
              Billing
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

function CommandPage() {
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
          <span className="font-semibold text-ground-900">Command</span>
        </div>
        <h1 className="display mb-2 text-ground-900">Command</h1>
        <p className="body max-w-lg text-ground-500">
          Composable command menu for search, navigation, and actions with keyboard support.
        </p>
        <div className="mt-5 flex items-center gap-4 border-t border-ground-100 pt-5">
          <p className="caption text-ground-400">Atom</p>
          <div className="h-3 w-px bg-ground-100" />
          <p className="caption text-ground-400">Overlay · Command</p>
        </div>
      </div>

      <PageDocs path="/atoms/command/" />

      <div className="flex flex-col gap-10">
        <div>
          <SectionHeading label="Command · Basic" />
          <PreviewBlock
            title="Basic"
            description="Inline command menu with search filtering and empty state"
            code={CODE.basic}
          >
            <div className="w-full max-w-sm mx-auto">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty />
                  <CommandItem value="calendar" keywords={["calendar"]}>
                    Calendar
                  </CommandItem>
                  <CommandItem value="search-emoji" keywords={["search emoji"]}>
                    Search Emoji
                  </CommandItem>
                  <CommandItem value="settings" keywords={["settings"]}>
                    Settings
                  </CommandItem>
                  <CommandItem value="profile" keywords={["profile"]}>
                    Profile
                  </CommandItem>
                  <CommandItem value="documentation" keywords={["documentation"]}>
                    Documentation
                  </CommandItem>
                </CommandList>
              </Command>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Command · With groups" />
          <PreviewBlock
            title="With groups"
            description="Items organized into labeled groups with a separator"
            code={CODE.grouped}
          >
            <div className="w-full max-w-sm mx-auto">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty />
                  <CommandGroup heading="Suggestions">
                    <CommandItem value="calendar" keywords={["calendar"]}>
                      Calendar
                    </CommandItem>
                    <CommandItem value="search-emoji" keywords={["search emoji"]}>
                      Search Emoji
                    </CommandItem>
                    <CommandItem value="calculator" keywords={["calculator"]}>
                      Calculator
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem value="profile" keywords={["profile"]}>
                      Profile
                    </CommandItem>
                    <CommandItem value="billing" keywords={["billing"]}>
                      Billing
                    </CommandItem>
                    <CommandItem value="settings" keywords={["settings"]}>
                      Settings
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Command · With shortcuts" />
          <PreviewBlock
            title="With shortcuts"
            description="Items with keyboard shortcut hints aligned to the right"
            code={CODE.withShortcuts}
          >
            <div className="w-full max-w-sm mx-auto">
              <Command>
                <CommandInput placeholder="Search commands..." />
                <CommandList>
                  <CommandEmpty />
                  <CommandItem value="new-file" keywords={["new file"]}>
                    New File
                    <CommandShortcut>⌘N</CommandShortcut>
                  </CommandItem>
                  <CommandItem value="open" keywords={["open"]}>
                    Open
                    <CommandShortcut>⌘O</CommandShortcut>
                  </CommandItem>
                  <CommandItem value="save" keywords={["save"]}>
                    Save
                    <CommandShortcut>⌘S</CommandShortcut>
                  </CommandItem>
                  <CommandItem value="find" keywords={["find"]}>
                    Find
                    <CommandShortcut>⌘F</CommandShortcut>
                  </CommandItem>
                  <CommandSeparator />
                  <CommandItem value="dashboard" keywords={["dashboard"]}>
                    Dashboard
                    <CommandShortcut>⌘D</CommandShortcut>
                  </CommandItem>
                  <CommandItem value="preferences" keywords={["preferences"]}>
                    Preferences
                    <CommandShortcut>⌘,</CommandShortcut>
                  </CommandItem>
                </CommandList>
              </Command>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Command · With icons" />
          <PreviewBlock
            title="With icons"
            description="Items with leading Lucide icons in grouped sections"
            code={CODE.withIcons}
          >
            <div className="w-full max-w-sm mx-auto">
              <Command>
                <CommandInput placeholder="Search..." />
                <CommandList>
                  <CommandEmpty />
                  <CommandGroup heading="Create">
                    <CommandItem value="new-document" keywords={["new document"]}>
                      <FileText size={14} />
                      New Document
                    </CommandItem>
                    <CommandItem value="new-calendar" keywords={["new calendar event"]}>
                      <Calendar size={14} />
                      New Calendar Event
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Navigate">
                    <CommandItem value="profile" keywords={["profile"]}>
                      <User size={14} />
                      Profile
                    </CommandItem>
                    <CommandItem value="settings" keywords={["settings"]}>
                      <Settings size={14} />
                      Settings
                    </CommandItem>
                    <CommandItem value="billing" keywords={["billing"]}>
                      <CreditCard size={14} />
                      Billing
                    </CommandItem>
                    <CommandItem value="help" keywords={["help"]}>
                      <HelpCircle size={14} />
                      Help
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </PreviewBlock>
        </div>

        <div>
          <SectionHeading label="Command · In dialog" />
          <PreviewBlock
            title="In dialog"
            description="Command palette triggered by a button or ⌘K keyboard shortcut"
            code={CODE.inDialog}
          >
            <CommandDialogDemo />
          </PreviewBlock>
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

export const Route = createFileRoute("/atoms/command/")({
  head: () => createCatalogPageHead("/atoms/command/"),
  component: CommandPage,
});
