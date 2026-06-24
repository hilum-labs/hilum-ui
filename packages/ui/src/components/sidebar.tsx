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
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebar() {
  const ctx = React.useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used inside SidebarProvider");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  SidebarProvider                                                     */
/* ------------------------------------------------------------------ */

interface SidebarProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
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

  const contextValue = React.useMemo<SidebarContextValue>(
    () => ({
      state,
      open,
      setOpen,
      openMobile,
      setOpenMobile,
      isMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar],
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
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
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "icon",
  className,
  children,
  ...props
}: SidebarProps) {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <aside
        data-side={side}
        data-variant={variant}
        data-collapsible="none"
        className={cn(
          "flex flex-col h-svh bg-card border-r border-border w-(--sidebar-width)",
          side === "right" && "border-r-0 border-l",
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
          data-sidebar="sidebar"
          data-mobile="true"
          side={side}
          className={cn(
            "w-(--sidebar-width-mobile) max-w-[85dvw] bg-card p-0 text-foreground [&>button]:hidden",
            className,
          )}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  if (collapsible === "offcanvas") {
    return (
      <aside
        data-state={state}
        data-side={side}
        data-variant={variant}
        data-collapsible="offcanvas"
        className={cn(
          "group peer flex flex-col h-svh bg-card border-r border-border",
          "transition-[width,transform] duration-200 ease-linear",
          "data-[state=expanded]:w-(--sidebar-width) data-[state=collapsed]:w-0 data-[state=collapsed]:-translate-x-full",
          side === "right" && "border-r-0 border-l data-[state=collapsed]:translate-x-full",
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
      data-state={state}
      data-side={side}
      data-variant={variant}
      data-collapsible="icon"
      className={cn(
        "group peer hidden md:flex flex-col h-svh bg-card border-r border-border",
        "transition-[width] duration-200 ease-linear overflow-hidden",
        "data-[state=expanded]:w-(--sidebar-width) data-[state=collapsed]:w-(--sidebar-width-icon)",
        side === "right" && "border-r-0 border-l",
        variant === "floating" && "m-2 h-[calc(100svh-1rem)] rounded-xl border shadow-natural",
        variant === "inset" && "border-r-0",
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
  const { toggleSidebar } = useSidebar();

  return (
    <Button
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
      <PanelLeft size={16} />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/*  SidebarRail                                                         */
/* ------------------------------------------------------------------ */

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      aria-label="Toggle sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 cursor-col-resize transition-[left,right,width] ease-linear",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-[2px]",
        "hover:after:bg-brand-primary/30",
        "group-data-[side=left]:-right-4 group-data-[side=right]:left-0",
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
      data-sidebar="inset"
      className={cn("relative flex min-h-svh flex-1 flex-col overflow-hidden bg-background", className)}
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
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-3 border-b border-border", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="content"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto p-3", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-3 border-t border-border", className)}
      {...props}
    />
  );
}

function SidebarSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-sidebar="separator"
      className={cn("mx-2 my-1 bg-muted", className)}
      {...props}
    />
  );
}

function SidebarInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  return (
    <Input
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

  return (
    <Comp
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 label text-muted-foreground",
        "outline-none ring-ring transition-[margin,opacity] duration-200 ease-linear",
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
    <div data-sidebar="group-content" className={cn("w-full text-sm", className)} {...props} />
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
      data-sidebar="group-action"
      className={cn(
        "absolute right-2 top-2 flex size-8 items-center justify-center",
        "rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
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
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li data-sidebar="menu-item" className={cn("group/menu-item relative", className)} {...props} />
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

  const button = (
    <Comp
      data-sidebar="menu-button"
      data-active={isActive}
      data-size={size}
      className={cn(
        // Base
        "peer/menu-button flex min-h-10 w-full items-center gap-2 overflow-hidden rounded-md p-2 body-sm text-left",
        "outline-none ring-ring",
        "transition-[width,height,padding] duration-150",
        "hover:bg-muted hover:text-foreground",
        "focus-visible:ring-2 focus-visible:ring-brand-primary/30",
        "active:bg-muted",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&>svg]:size-4 [&>svg]:shrink-0",
        // Size variants
        size === "sm" && "h-7 text-xs",
        size === "lg" && "h-10",
        // Active state
        isActive && [
          "bg-brand-primary/10 text-brand-primary",
          "hover:bg-brand-primary/15 hover:text-brand-primary",
        ],
        // Collapsed state
        "group-data-[state=collapsed]/sidebar-wrapper:justify-center",
        "group-data-[state=collapsed]/sidebar-wrapper:size-10",
        "group-data-[state=collapsed]/sidebar-wrapper:p-0",
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
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center",
        "rounded-md text-muted-foreground hover:bg-muted hover:text-foreground",
        "outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
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
  return (
    <div
      data-sidebar="menu-badge"
      className={cn(
        "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-full",
        "caption font-medium bg-muted text-muted-foreground px-1",
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
  return (
    <ul
      data-sidebar="menu-sub"
      className={cn(
        "mx-3.5 flex min-w-0 flex-col gap-1 border-l border-border pl-3",
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
      data-sidebar="menu-sub-button"
      data-active={isActive}
      className={cn(
        "flex min-h-8 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2",
        "body text-muted-foreground outline-none",
        "transition-colors duration-150",
        "hover:text-foreground hover:bg-muted",
        "focus-visible:ring-2 focus-visible:ring-brand-primary/30",
        "disabled:pointer-events-none disabled:opacity-50",
        "[&>svg]:size-3.5 [&>svg]:shrink-0",
        isActive && "text-brand-primary hover:text-brand-primary",
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
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_ICON,
  SIDEBAR_WIDTH_MOBILE,
  useSidebar,
};
