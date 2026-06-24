import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  cn,
} from "@hilum/ui";
import type { NavSection } from "./types";

const APP_COMMAND_PALETTE_EVENT = "hilum:open-command-palette";

interface AppCommandPaletteItem {
  label: string;
  href?: string;
  group?: string;
  icon?: ReactNode;
  keywords?: string[];
  onSelect?: () => void;
  disabled?: boolean;
}

interface AppCommandPaletteProps {
  sections?: NavSection[];
  items?: AppCommandPaletteItem[];
  actions?: AppCommandPaletteItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onNavigate?: (href: string) => void;
  listenForHotkey?: boolean;
  openEventName?: string;
  placeholder?: string;
  emptyText?: string;
  title?: string;
  description?: string;
  className?: string;
}

function openAppCommandPalette(eventName = APP_COMMAND_PALETTE_EVENT) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(eventName));
}

function AppCommandPalette({
  sections = [],
  items = [],
  actions = [],
  open,
  defaultOpen = false,
  onOpenChange,
  onNavigate,
  listenForHotkey = true,
  openEventName = APP_COMMAND_PALETTE_EVENT,
  placeholder = "Search pages, actions...",
  emptyText = "No results found.",
  title = "Command Palette",
  description = "Search pages and actions.",
  className,
}: AppCommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (nextOpen: boolean) => {
    if (!isControlled) setInternalOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    function handleKeyDown(event: KeyboardEvent) {
      if (!listenForHotkey) return;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!isOpen);
      }
    }

    function handleOpen() {
      setOpen(true);
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener(openEventName, handleOpen);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener(openEventName, handleOpen);
    };
  }, [isOpen, listenForHotkey, openEventName]);

  const commandItems = useMemo(() => {
    const navigationItems = sections.flatMap((section) =>
      section.items
        .filter((item) => !item.disabled)
        .map<AppCommandPaletteItem>((item) => {
          const Icon = item.icon;
          return {
            label: item.label,
            href: item.href,
            group: section.label ?? "Navigate",
            icon: Icon ? <Icon className="size-4" /> : undefined,
            keywords: [item.label, String(item.mobileLabel ?? ""), item.href],
          };
        }),
    );

    return [...navigationItems, ...items, ...actions];
  }, [actions, items, sections]);

  const grouped = commandItems.reduce<Record<string, AppCommandPaletteItem[]>>((acc, item) => {
    const group = item.group ?? "Commands";
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  const handleSelect = (item: AppCommandPaletteItem) => {
    setOpen(false);
    if (item.onSelect) {
      item.onSelect();
      return;
    }
    if (item.href) {
      if (onNavigate) {
        onNavigate(item.href);
      } else if (typeof window !== "undefined") {
        window.location.href = item.href;
      }
    }
  };

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={setOpen}
      title={title}
      description={description}
      {...(className && { className })}
    >
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        {Object.entries(grouped).map(([group, groupItems], index) => (
          <div key={group} className="[&:not(:has([data-cmd-item]))]:hidden">
            {index > 0 && <CommandSeparator />}
            <CommandGroup heading={group}>
              {groupItems.map((item) => (
                <CommandItem
                  key={`${item.group ?? "commands"}-${item.href ?? item.label}`}
                  value={item.href ?? item.label}
                  keywords={[item.label, item.group ?? "", item.href ?? "", ...(item.keywords ?? [])]}
                  onSelect={() => handleSelect(item)}
                  className="cursor-pointer"
                >
                  {item.icon && (
                    <span className="mr-2 flex size-4 shrink-0 items-center justify-center text-muted-foreground">
                      {item.icon}
                    </span>
                  )}
                  <span className={cn("min-w-0 truncate", item.disabled && "text-muted-foreground")}>
                    {item.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

AppCommandPalette.displayName = "AppCommandPalette";

export { APP_COMMAND_PALETTE_EVENT, AppCommandPalette, openAppCommandPalette };
export type { AppCommandPaletteItem, AppCommandPaletteProps };
