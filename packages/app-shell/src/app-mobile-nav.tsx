import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  useLink,
} from "@hilum/ui";
import { LogOut, Menu, Settings, User as UserIcon } from "lucide-react";
import { AppNavTree } from "./app-nav-tree";
import { isNavItemActive } from "./nav-utils";
import type { NavItem, NavSection, SectionLabelVariant, User } from "./types";

type AppMobileNavVariant = "tabs" | "drawer";

/** Above this many top-level items the tab strip gets unwieldy; default to the drawer. */
const MOBILE_TABS_MAX_ITEMS = 5;

type AppMobileNavMenuItem = {
  label: string;
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
  destructive?: boolean;
};

interface AppMobileNavProps {
  logo?: ReactNode;
  brand: ReactNode;
  subtitle?: ReactNode;
  sections: NavSection[];
  /** Drawer section headings: tracked uppercase (`eyebrow`) or sentence case (`plain`). Default: `eyebrow`. */
  sectionLabelVariant?: SectionLabelVariant;
  user?: User;
  userMenu?: AppMobileNavMenuItem[];
  accountLabel?: ReactNode;
  accountMenuLabel?: string;
  /**
   * Actions in the top bar, before the account menu: a search / command
   * palette button, the notification menu, … Use icon-size (36px) buttons.
   */
  actions?: ReactNode;
  /**
   * Custom account menu content (e.g. `AccountMenuHeader` + `AccountMenuSection`
   * / `DropdownMenuItem`s, the same content as the desktop account menu).
   * Replaces the built-in name / email header and `userMenu` items.
   */
  accountMenu?: ReactNode;
  /** Classes for the account menu popover (e.g. a width). */
  accountMenuClassName?: string;
  getItemLabel?: (item: NavItem) => ReactNode;
  /** Account avatar size. Default: `sm` (fits two-letter initials). */
  avatarSize?: "xs" | "sm" | "md";
  /**
   * `tabs`: horizontally scrolling tab strip of top-level items.
   * `drawer`: hamburger button opening a sheet with the full sectioned + nested nav.
   * Default: `drawer` when there are more than 5 top-level items or any item has
   * `children`, otherwise `tabs`.
   */
  variant?: AppMobileNavVariant;
  /** Accessible name for the navigation landmark. Default: "Mobile sections". */
  navLabel?: string;
  /** Accessible label for the drawer's menu button. Default: "Open navigation". */
  menuLabel?: string;
  className?: string;
}

/** Edge fade while the tab strip hides items (kept local: works with any @hilum/ui 3.x peer). */
function useOverflowFade(ref: RefObject<HTMLElement | null>): CSSProperties | undefined {
  const [edges, setEdges] = useState({ left: false, right: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const overflowing = el.scrollWidth - el.clientWidth > 1;
      const left = overflowing && el.scrollLeft > 1;
      const right = overflowing && el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
      setEdges((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro?.disconnect();
    };
  }, [ref]);
  if (!edges.left && !edges.right) return undefined;
  const start = edges.left ? "transparent 0, #000 24px" : "#000 0";
  const end = edges.right ? "#000 calc(100% - 24px), transparent 100%" : "#000 100%";
  const mask = `linear-gradient(to right, ${start}, ${end})`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

const DEFAULT_USER_MENU: AppMobileNavMenuItem[] = [
  { label: "Profile", icon: <UserIcon size={13} /> },
  { label: "Settings", icon: <Settings size={13} /> },
  { label: "Sign out", icon: <LogOut size={13} />, destructive: true },
];

function AppMobileNav({
  logo,
  brand,
  subtitle,
  sections,
  sectionLabelVariant = "eyebrow",
  user,
  userMenu = DEFAULT_USER_MENU,
  accountLabel = user?.email,
  accountMenuLabel = "Open account menu",
  actions,
  accountMenu,
  accountMenuClassName,
  getItemLabel = (item) => item.mobileLabel ?? item.label,
  avatarSize = "sm",
  variant,
  navLabel = "Mobile sections",
  menuLabel = "Open navigation",
  className,
}: AppMobileNavProps) {
  const Link = useLink();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navItems = sections.flatMap((section) => section.items);
  const resolvedVariant: AppMobileNavVariant =
    variant ??
    (navItems.length > MOBILE_TABS_MAX_ITEMS || navItems.some((item) => item.children?.length)
      ? "drawer"
      : "tabs");
  const isDrawer = resolvedVariant === "drawer";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/95 px-3 py-2 backdrop-blur md:hidden",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {isDrawer && (
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={menuLabel}
                className="-ms-1 flex size-9 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-[background-color,box-shadow,color,scale] hover:bg-muted hover:text-foreground active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-72 max-w-[85dvw] flex-col overflow-y-auto p-4"
              data-slot="app-mobile-nav-drawer"
            >
              <SheetHeader className="pe-10">
                <SheetTitle className="flex min-w-0 items-center gap-2">
                  {logo && <span className="shrink-0">{logo}</span>}
                  <span className="truncate">{brand}</span>
                </SheetTitle>
                {subtitle ? (
                  <SheetDescription className="caption truncate">{subtitle}</SheetDescription>
                ) : (
                  <SheetDescription className="sr-only">Navigation</SheetDescription>
                )}
              </SheetHeader>
              <AppNavTree
                sections={sections}
                label={navLabel}
                getItemLabel={(item) => item.label}
                sectionLabelVariant={sectionLabelVariant}
                onNavigate={() => setDrawerOpen(false)}
              />
            </SheetContent>
          </Sheet>
        )}
        {logo && <div className="shrink-0">{logo}</div>}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">{brand}</p>
          {subtitle && (
            <p className="mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div
            data-slot="app-mobile-nav-actions"
            className="flex shrink-0 items-center gap-1 [&>[data-slot=button][data-icon-only]]:size-9"
          >
            {actions}
          </div>
        )}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex size-9 shrink-0 items-center justify-center rounded-md transition-[background-color,box-shadow,scale] hover:bg-muted active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={accountMenuLabel}
              >
                <Avatar size={avatarSize}>
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                  <AvatarFallback className="bg-brand-primary text-primary-foreground">
                    {user.initials ?? user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              data-slot="app-mobile-nav-account-menu"
              className={cn(accountMenu ? "w-72 p-0" : "w-64", accountMenuClassName)}
            >
              {accountMenu ?? (
                <>
                  <div className="px-2.5 py-2">
                    <p className="caption truncate font-semibold text-foreground">{user.name}</p>
                    {accountLabel && (
                      <p className="caption-xs truncate text-muted-foreground">{accountLabel}</p>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              {!accountMenu &&
                userMenu.map((item, index) => (
                  <Fragment key={`${item.label}-${index}`}>
                    {index > 0 && item.destructive && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      {...(item.destructive && { destructive: true })}
                      {...(item.onSelect && { onSelect: item.onSelect })}
                      asChild={Boolean(item.href)}
                    >
                      {item.href ? (
                        <Link href={item.href}>
                          {item.icon && <span className="me-2">{item.icon}</span>}
                          {item.label}
                        </Link>
                      ) : (
                        <>
                          {item.icon && <span className="me-2">{item.icon}</span>}
                          {item.label}
                        </>
                      )}
                    </DropdownMenuItem>
                  </Fragment>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {!isDrawer && (
        <AppMobileNavTabs navItems={navItems} navLabel={navLabel} getItemLabel={getItemLabel} />
      )}
    </header>
  );
}

function AppMobileNavTabs({
  navItems,
  navLabel,
  getItemLabel,
}: {
  navItems: NavItem[];
  navLabel: string;
  getItemLabel: (item: NavItem) => ReactNode;
}) {
  const Link = useLink();
  const activeItemRef = useRef<HTMLLIElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  // Fade whichever edge still hides tabs, so overflow reads as scrollable at 390px.
  const overflowMask = useOverflowFade(scrollerRef);
  const activeKey = navItems
    .map((item) => `${item.href}:${isNavItemActive(item) ? "1" : "0"}`)
    .join("|");

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeKey]);

  const tabClass =
    "flex h-9 min-w-[76px] scroll-mx-3 items-center justify-center gap-1 rounded-md px-2.5 text-[11px] font-medium transition-[background-color,box-shadow,color,scale] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div
      ref={scrollerRef}
      data-slot="app-mobile-nav-scroller"
      style={overflowMask}
      className="-mx-3 mt-2 overflow-x-auto overscroll-x-contain scroll-px-3 px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <nav aria-label={navLabel}>
        <ul className="flex w-max min-w-full gap-1.5 pe-3">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isNavItemActive(item);
            const content = (
              <>
                {Icon && <Icon className="size-3.5 shrink-0" aria-hidden="true" />}
                <span className="truncate">{getItemLabel(item)}</span>
              </>
            );
            return (
              <li
                key={`${item.href}-${index}`}
                ref={active ? activeItemRef : undefined}
                className="shrink-0"
              >
                {item.disabled ? (
                  <span
                    role="link"
                    aria-disabled="true"
                    className={cn(tabClass, "cursor-not-allowed text-muted-foreground/60")}
                  >
                    {content}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    {...(item.onClick && { onClick: item.onClick })}
                    className={cn(
                      tabClass,
                      "active:scale-[0.96]",
                      active
                        ? "bg-brand-primary/10 text-brand-text"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {content}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export { AppMobileNav };
export type { AppMobileNavMenuItem, AppMobileNavProps, AppMobileNavVariant };
