"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "../lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog";

interface CommandContextValue {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  onSelect?: (value: string) => void;
  reportVisible: (id: string, visible: boolean) => void;
}

const CommandCtx = React.createContext<CommandContextValue>({
  query: "",
  setQuery: () => {},
  reportVisible: () => {},
});

const CommandVisibleCtx = React.createContext(0);

interface CommandProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  onSelect?: (value: string) => void;
}

function Command({ className, children, onSelect, ...props }: CommandProps) {
  const [query, setQuery] = React.useState("");
  const visibleIds = React.useRef(new Set<string>());
  const [visibleCount, setVisibleCount] = React.useState(0);

  const reportVisible = React.useCallback((id: string, visible: boolean) => {
    const had = visibleIds.current.has(id);
    if (visible && !had) {
      visibleIds.current.add(id);
      setVisibleCount(visibleIds.current.size);
    } else if (!visible && had) {
      visibleIds.current.delete(id);
      setVisibleCount(visibleIds.current.size);
    }
  }, []);

  return (
    <CommandCtx.Provider
      value={{ query, setQuery, ...(onSelect !== undefined && { onSelect }), reportVisible }}
    >
      <CommandVisibleCtx.Provider value={visibleCount}>
        <div
          data-slot="command"
          className={cn(
            "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </CommandVisibleCtx.Provider>
    </CommandCtx.Provider>
  );
}

function CommandInput({
  ref,
  className,
  ...props
}: Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> & {
  ref?: React.Ref<HTMLInputElement> | undefined;
}) {
  const { query, setQuery } = React.useContext(CommandCtx);
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex items-center gap-2 border-b border-border px-3"
    >
      <Search size={14} className="shrink-0 text-muted-foreground" />
      <input
        ref={ref}
        data-slot="command-input"
        type="text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className={cn(
          "flex h-10 w-full bg-transparent body text-foreground",
          "placeholder:text-muted-foreground focus:outline-none",
          className,
        )}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        {...props}
      />
    </div>
  );
}
CommandInput.displayName = "CommandInput";

function CommandList({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const combinedRef = React.useCallback(
    (el: HTMLDivElement | null) => {
      listRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [ref],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const el = listRef.current;
    if (!el) return;
    const items = Array.from(
      el.querySelectorAll<HTMLElement>("[data-cmd-item]:not([aria-disabled='true'])"),
    );
    if (!items.length) return;
    const focused = el.querySelector<HTMLElement>("[data-cmd-item]:focus");
    const idx = focused ? items.indexOf(focused) : -1;
    const next =
      e.key === "ArrowDown"
        ? items[Math.min(idx + 1, items.length - 1)]
        : items[Math.max(idx - 1, 0)];
    next?.focus();
  };

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- focus lives on the options (roving tabindex); the listbox only delegates Arrow keys
    <div
      ref={combinedRef}
      data-slot="command-list"
      role="listbox"
      onKeyDown={handleKeyDown}
      className={cn("max-h-75 overflow-y-auto py-1", className)}
      {...props}
    />
  );
}
CommandList.displayName = "CommandList";

function CommandEmpty({
  ref,
  className,
  children = "No results found.",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const visibleCount = React.useContext(CommandVisibleCtx);
  if (visibleCount > 0) return null;
  return (
    <div
      ref={ref}
      data-slot="command-empty"
      className={cn("py-6 text-center caption text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
}
CommandEmpty.displayName = "CommandEmpty";

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

function CommandGroup({
  ref,
  className,
  heading,
  children,
  ...props
}: CommandGroupProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <div
      ref={ref}
      data-slot="command-group"
      role="group"
      className={cn("py-1", className)}
      {...props}
    >
      {heading && <p className="px-3 pb-1 pt-0.5 label text-muted-foreground">{heading}</p>}
      {children}
    </div>
  );
}
CommandGroup.displayName = "CommandGroup";

interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: (value: string) => void;
}

function CommandItem({
  ref,
  className,
  value = "",
  keywords,
  disabled,
  onSelect,
  children,
  ...props
}: CommandItemProps & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  const { query, onSelect: ctxOnSelect, reportVisible } = React.useContext(CommandCtx);
  const id = React.useId();

  const searchText = (keywords ?? [value]).join(" ").toLowerCase();
  const isVisible = !query || searchText.includes(query.toLowerCase());

  React.useLayoutEffect(() => {
    reportVisible(id, isVisible && !disabled);
    return () => reportVisible(id, false);
  }, [id, isVisible, disabled, reportVisible]);

  if (!isVisible) return null;

  const handleSelect = () => {
    if (disabled) return;
    onSelect?.(value);
    ctxOnSelect?.(value);
  };

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- enabled options get tabIndex=0; disabled options are intentionally unfocusable
    <div
      ref={ref}
      data-slot="command-item"
      role="option"
      aria-selected={false}
      aria-disabled={disabled || undefined}
      data-cmd-item
      tabIndex={disabled ? undefined : 0}
      className={cn(
        "relative mx-1 flex min-h-10 cursor-default select-none items-center gap-2 rounded-md px-2.5 py-2 compact:min-h-7 compact:px-2 compact:py-1 compact:text-[13px] compact:rounded-[4px]",
        "body text-muted-foreground outline-none transition-colors",
        "hover:bg-muted hover:text-foreground",
        "focus:bg-active focus:text-foreground",
        disabled && "pointer-events-none opacity-40",
        className,
      )}
      onClick={handleSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSelect();
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
}
CommandItem.displayName = "CommandItem";

function CommandSeparator({
  ref,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { ref?: React.Ref<HTMLDivElement> | undefined }) {
  return (
    <div
      ref={ref}
      data-slot="command-separator"
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}
CommandSeparator.displayName = "CommandSeparator";

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn("ms-auto caption text-muted-foreground tracking-widest font-medium", className)}
      {...props}
    />
  );
}
CommandShortcut.displayName = "CommandShortcut";

interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
  title?: string;
  description?: string;
  className?: string;
  /** Screen-reader label of the dialog's close button. Default: "Close". */
  closeLabel?: string;
}

function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  closeLabel,
  ...props
}: CommandDialogProps) {
  return (
    <Dialog {...props}>
      <DialogContent
        className={cn("gap-0 overflow-hidden p-0 sm:max-w-xl", className)}
        {...(closeLabel !== undefined ? { closeLabel } : {})}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Command className="rounded-none border-0 shadow-none">{children}</Command>
      </DialogContent>
    </Dialog>
  );
}
CommandDialog.displayName = "CommandDialog";

Command.displayName = "Command";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
