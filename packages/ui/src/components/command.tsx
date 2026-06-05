"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "../lib/utils";

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
    <CommandCtx.Provider value={{ query, setQuery, ...(onSelect !== undefined && { onSelect }), reportVisible }}>
      <CommandVisibleCtx.Provider value={visibleCount}>
        <div
          className={cn(
            "flex flex-col overflow-hidden rounded-xl border border-ground-200 bg-white",
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

const CommandInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">
>(({ className, ...props }, ref) => {
  const { query, setQuery } = React.useContext(CommandCtx);
  return (
    <div className="flex items-center gap-2 border-b border-ground-100 px-3">
      <Search size={14} className="shrink-0 text-ground-400" />
      <input
        ref={ref}
        type="text"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        className={cn(
          "flex h-10 w-full bg-transparent body text-ground-900",
          "placeholder:text-ground-400 focus:outline-none",
          className,
        )}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        {...props}
      />
    </div>
  );
});
CommandInput.displayName = "CommandInput";

const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
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
      <div
        ref={combinedRef}
        role="listbox"
        onKeyDown={handleKeyDown}
        className={cn("max-h-[300px] overflow-y-auto py-1", className)}
        {...props}
      />
    );
  },
);
CommandList.displayName = "CommandList";

const CommandEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children = "No results found.", ...props }, ref) => {
    const visibleCount = React.useContext(CommandVisibleCtx);
    if (visibleCount > 0) return null;
    return (
      <div
        ref={ref}
        className={cn("py-6 text-center caption text-ground-400", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CommandEmpty.displayName = "CommandEmpty";

interface CommandGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

const CommandGroup = React.forwardRef<HTMLDivElement, CommandGroupProps>(
  ({ className, heading, children, ...props }, ref) => (
    <div ref={ref} role="group" className={cn("py-1", className)} {...props}>
      {heading && <p className="px-3 pb-1 pt-0.5 label text-ground-400">{heading}</p>}
      {children}
    </div>
  ),
);
CommandGroup.displayName = "CommandGroup";

interface CommandItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value?: string;
  keywords?: string[];
  disabled?: boolean;
  onSelect?: (value: string) => void;
}

const CommandItem = React.forwardRef<HTMLDivElement, CommandItemProps>(
  ({ className, value = "", keywords, disabled, onSelect, children, ...props }, ref) => {
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
      <div
        ref={ref}
        role="option"
        aria-selected={false}
        aria-disabled={disabled || undefined}
        data-cmd-item
        tabIndex={disabled ? undefined : 0}
        className={cn(
          "relative flex cursor-default select-none items-center gap-2 rounded-md px-2.5 py-1.5 mx-1",
          "body text-ground-700 outline-none transition-colors",
          "hover:bg-ground-50 hover:text-ground-900",
          "focus:bg-ground-50 focus:text-ground-900",
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
  },
);
CommandItem.displayName = "CommandItem";

const CommandSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("my-1 h-px bg-ground-100", className)} {...props} />
  ),
);
CommandSeparator.displayName = "CommandSeparator";

function CommandShortcut({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("ml-auto caption text-ground-300 tracking-widest font-medium", className)}
      {...props}
    />
  );
}
CommandShortcut.displayName = "CommandShortcut";

Command.displayName = "Command";

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
};
