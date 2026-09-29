"use client";

import * as React from "react";
import { PanelLeft } from "lucide-react";
import { Slot } from "radix-ui";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

/* ------------------------------------------------------------------ */
/*  Constants                                                           */
/* ------------------------------------------------------------------ */

const SIDEBAR_COOKIE_NAME = "sidebar:state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3.5rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const MOBILE_BREAKPOINT = 768;

/** Localizable strings. Every entry has an English default. */
interface SidebarLabels {
  /** Accessible name of `SidebarTrigger` and `SidebarRail`. */
  toggleSidebar: string;
  /** Screen-reader title of the mobile sidebar sheet. */
  mobileTitle: string;
  /** Screen-reader description of the mobile sidebar sheet. */
  mobileDescription: string;
}

const SIDEBAR_DEFAULT_LABELS: SidebarLabels = {
  toggleSidebar: "Toggle sidebar",
  mobileTitle: "Sidebar",
  mobileDescription: "Displays the mobile sidebar.",
};

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => setIsMobile(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

/* ------------------------------------------------------------------ */
/*  Context                                                             */
/* ------------------------------------------------------------------ */

interface SidebarContextValue {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  openMobile: boolean;
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
  labels: SidebarLabels;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
}

function useOptionalSidebar() {
  return React.useContext(SidebarContext);
}

/* ------------------------------------------------------------------ */
/*  SidebarProvider                                                     */
/* ------------------------------------------------------------------ */

interface SidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Localizable strings shared by every sidebar part under this provider. */
  labels?: Partial<SidebarLabels>;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  labels: labelsProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);

  const open = openProp !== undefined ? openProp : _open;

  const setOpen = React.useCallback(
    (value: React.SetStateAction<boolean>) => {
      const nextOpen = typeof value === "function" ? value(open) : value;
      if (onOpenChange) {
        onOpenChange(nextOpen);
      } else {
        _setOpen(nextOpen);
      }
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${nextOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [onOpenChange, open],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((currentOpen) => !currentOpen);
      return;
    }

    setOpen((currentOpen) => !currentOpen);
  }, [isMobile, setOpen]);

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? "expanded" : "collapsed";

  const labels = React.useMemo(() => ({ ...SIDEBAR_DEFAULT_LABELS, ...labelsProp }), [labelsProp]);

  const contextValue = React.useMemo<SidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
      labels,
    }),
    [state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar, labels],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-provider"
          data-sidebar="provider"
          data-state={state}
          className={cn("group/sidebar-wrapper flex min-h-svh w-full", className)}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar                                                             */
/* ------------------------------------------------------------------ */

interface SidebarProps extends React.ComponentProps<"div"> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
  /** Overrides the provider's labels for this sidebar (mobile sheet title/description). */
  labels?: Partial<SidebarLabels>;
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
  labels: labelsProp,
  className,
  children,
  ...props
}: SidebarProps) {
  const { state, isMobile, openMobile, setOpenMobile, labels: contextLabels } = useSidebar();
  const labels = { ...contextLabels, ...labelsProp };

  if (collapsible === "none") {
    return (
      <aside
        data-slot="sidebar"
        data-side={side}
        data-variant={variant}
        data-collapsible="none"
        className={cn(
          "flex flex-col h-svh bg-card border-e border-border w-(--sidebar-width)",
          side === "right" && "border-e-0 border-s",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-slot="sidebar"
          data-sidebar="sidebar"
          data-mobile="true"
          // The desktop sidebar follows DOM order (flips in RTL), so the mobile
          // sheet uses logical sides to open from the same edge.
          side={side === "right" ? "end" : "start"}
          className={cn(
            "w-(--sidebar-width-mobile) max-w-[85dvw] bg-card p-0 text-foreground [&>button]:hidden",
            className,
          )}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{labels.mobileTitle}</SheetTitle>
            <SheetDescription>{labels.mobileDescription}</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  if (collapsible === "offcanvas") {
    return (
      <aside
        data-slot="sidebar"
        data-state={state}
        data-side={side}
        data-variant={variant}
        data-collapsible="offcanvas"
        className={cn(
          "group peer flex flex-col h-svh bg-card border-e border-border",
          "transition-[width,transform] duration-200 ease-linear",
          "data-[state=expanded]:w-(--sidebar-width) data-[state=collapsed]:w-0 data-[state=collapsed]:-translate-x-full rtl:data-[state=collapsed]:translate-x-full",
          side === "right" &&
            "border-e-0 border-s data-[state=collapsed]:translate-x-full rtl:data-[state=collapsed]:-translate-x-full",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    );
  }

  // collapsible === "icon" (default)
  return (
    <aside
      data-slot="sidebar"
      data-state={state}
      data-side={side}
      data-variant={variant}
      data-collapsible="icon"
      className={cn(
        "group peer hidden md:flex flex-col h-svh bg-card border-e border-border",
        "transition-[width] duration-200 ease-linear overflow-hidden",
        "data-[state=expanded]:w-(--sidebar-width) data-[state=collapsed]:w-(--sidebar-width-icon)",
        side === "right" && "border-e-0 border-s",
        variant === "floating" && "m-2 h-[calc(100svh-1rem)] rounded-xl border shadow-natural",
        variant === "inset" && "border-e-0",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarTrigger                                                      */
/* ------------------------------------------------------------------ */

function SidebarTrigger({ className, onClick, ...props }: React.ComponentProps<typeof Button>) {
  const { toggleSidebar, labels } = useSidebar();

  return (
    <Button
      data-slot="sidebar-trigger"
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={className}
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft size={16} className="rtl:-scale-x-100" />
      <span className="sr-only">{labels.toggleSidebar}</span>
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarRail                                                         */
/* ------------------------------------------------------------------ */

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar, labels } = useSidebar();

  return (
    <button
      data-slot="sidebar-rail"
      data-sidebar="rail"
      aria-label={labels.toggleSidebar}
      tabIndex={-1}
      onClick={toggleSidebar}
      title={labels.toggleSidebar}
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 rtl:translate-x-1/2 cursor-col-resize transition-[left,right,width] ease-linear",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-0.5",
        "hover:after:bg-brand-primary/30",
        "group-data-[side=left]:-end-4 group-data-[side=right]:start-0",
        "sm:flex",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarInset                                                        */
/* ------------------------------------------------------------------ */

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      data-sidebar="inset"
      className={cn(
        "relative flex min-h-svh flex-1 flex-col overflow-hidden bg-background",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Structure components                                                */
/* ------------------------------------------------------------------ */

function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-3 border-b border-border", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-3", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-3 border-t border-border", className)}
      {...props}
    />
  );
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("mx-2 my-1 bg-muted", className)}
      {...props}
    />
  );
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn("h-8 w-full bg-background shadow-none", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Group components                                                    */
/* ------------------------------------------------------------------ */

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div";
  const state = useOptionalSidebar()?.state ?? "expanded";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      data-state={state}
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 label text-muted-foreground",
        "outline-none ring-ring transition-[margin,opacity] duration-200 ease-linear",
        "data-[state=collapsed]:h-0 data-[state=collapsed]:m-0 data-[state=collapsed]:overflow-hidden data-[state=collapsed]:p-0 data-[state=collapsed]:opacity-0",
        "group-data-[state=collapsed]/sidebar-wrapper:opacity-0",
        "group-data-[state=collapsed]/sidebar-wrapper:h-0",
        "group-data-[state=collapsed]/sidebar-wrapper:m-0",
        "group-data-[state=collapsed]/sidebar-wrapper:p-0",
        "group-data-[state=collapsed]/sidebar-wrapper:overflow-hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "absolute end-2 top-2 flex size-8 items-center justify-center",
        "rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Menu components                                                     */
/* ------------------------------------------------------------------ */

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarMenuButton                                                   */
/* ------------------------------------------------------------------ */

interface SidebarMenuButtonProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string;
  size?: "default" | "sm" | "lg";
}

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  tooltip,
  size = "default",
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const Comp = asChild ? (Slot.Root as React.ElementType) : "button";
  const state = useOptionalSidebar()?.state ?? "expanded";

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-state={state}
      data-active={isActive}
      data-size={size}
      className={cn(
        // Base
        "peer/menu-button flex min-h-8 w-full items-center gap-2 overflow-hidden rounded-md px-2 py-1.5 body-sm text-start",
        "outline-none ring-ring",
        "transition-[width,height,padding] duration-150",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "active:bg-muted",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        "[&>span]:min-w-0 [&>span]:truncate",
        // Size variants
        size === "sm" && "h-7 text-xs",
        size === "lg" && "h-10",
        // Active state: brand tint with --brand-text (≥ 4.5:1 on the tint in
        // every theme; brand-primary text was 3.9:1)
        isActive && [
          "bg-brand-primary/10 text-brand-text",
          "hover:bg-brand-primary/15 hover:text-brand-text",
        ],
        // Collapsed state
        "data-[state=collapsed]:size-9 data-[state=collapsed]:justify-center data-[state=collapsed]:p-0",
        "data-[state=collapsed]:[&>span]:hidden",
        "group-data-[state=collapsed]/sidebar-wrapper:justify-center",
        "group-data-[state=collapsed]/sidebar-wrapper:size-9",
        "group-data-[state=collapsed]/sidebar-wrapper:p-0",
        "group-data-[state=collapsed]/sidebar-wrapper:[&>span]:hidden",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );

  if (!tooltip) {
    return button;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        className={cn(
          // Only visible when collapsed
          "hidden group-data-[state=collapsed]/sidebar-wrapper:block",
        )}
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarMenuAction                                                   */
/* ------------------------------------------------------------------ */

interface SidebarMenuActionProps extends React.ComponentProps<"button"> {
  asChild?: boolean;
  showOnHover?: boolean;
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: SidebarMenuActionProps) {
  const Comp = asChild ? (Slot.Root as React.ElementType) : "button";

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        "absolute end-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center",
        "rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring",
        showOnHover && [
          "opacity-0 transition-opacity",
          "group-hover/menu-item:opacity-100",
          "peer-data-[active=true]/menu-button:opacity-100",
        ],
        "group-data-[state=collapsed]/sidebar-wrapper:hidden",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarMenuBadge                                                    */
/* ------------------------------------------------------------------ */

function SidebarMenuBadge({ className, ...props }: React.ComponentProps<"div">) {
  const state = useOptionalSidebar()?.state ?? "expanded";

  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      data-state={state}
      className={cn(
        "absolute end-1 flex h-5 min-w-5 items-center justify-center rounded-full",
        "caption font-medium bg-muted text-muted-foreground px-1",
        "data-[state=collapsed]:hidden",
        "group-data-[state=collapsed]/sidebar-wrapper:hidden",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarMenuSkeleton                                                 */
/* ------------------------------------------------------------------ */

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & { showIcon?: boolean }) {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <div className="size-4 shrink-0 rounded-md bg-muted animate-pulse" />}
      <div
        className="h-4 max-w-(--skeleton-width) flex-1 rounded-md bg-muted animate-pulse"
        style={{ "--skeleton-width": width } as React.CSSProperties}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub menu                                                            */
/* ------------------------------------------------------------------ */

function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  const state = useOptionalSidebar()?.state ?? "expanded";

  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      data-state={state}
      className={cn(
        "mx-3.5 flex min-w-0 flex-col gap-1 border-s border-border ps-3",
        "data-[state=collapsed]:hidden",
        "group-data-[state=collapsed]/sidebar-wrapper:hidden",
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

interface SidebarMenuSubButtonProps extends React.ComponentProps<"a"> {
  asChild?: boolean;
  isActive?: boolean;
}

function SidebarMenuSubButton({
  asChild = false,
  isActive = false,
  className,
  ...props
}: SidebarMenuSubButtonProps) {
  const Comp = asChild ? (Slot.Root as React.ElementType) : "a";

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-active={isActive}
      className={cn(
        "flex min-h-8 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2",
        "body text-muted-foreground outline-none",
        "transition-colors duration-150",
        "hover:text-foreground hover:bg-muted",
        "focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&>svg]:size-3.5 [&>svg]:shrink-0",
        isActive && "text-brand-text hover:text-brand-text",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                             */
/* ------------------------------------------------------------------ */

export {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SIDEBAR_COOKIE_MAX_AGE,
  SIDEBAR_DEFAULT_LABELS,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_WIDTH_MOBILE,
  useOptionalSidebar,
  useSidebar,
};
export type { SidebarLabels };
