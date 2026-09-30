import { Fragment, useId, type ReactNode } from "react";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  MediaObject,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useLink,
  useOptionalSidebar,
} from "@hilum/ui";
import { AccountAvatar, AccountMenuItems, type AppAccountMenuItem } from "./app-account-menu";
import { hasActiveDescendant, useExpandedState, wasDefaultPrevented } from "./nav-utils";
import type { NavItem, NavSection, User } from "./types";

type AppSidebarMenuItem = AppAccountMenuItem;

interface AppSidebarProps {
  /** Brand mark or full product logo. Pass a full logo image to match Studio exactly. */
  logo?: ReactNode;
  /** Optional text rendered beside the logo when a full logo image is not supplied. */
  brand?: ReactNode;
  /** Optional secondary brand/workspace label. */
  subtitle?: ReactNode;
  /** Optional link target for the brand block. */
  brandHref?: string;
  /** Accessible label for the brand link. */
  brandAriaLabel?: string;
  /** Header action rendered like Studio's new-project button. */
  headerAction?: ReactNode;
  sections: NavSection[];
  /** Custom footer content rendered in Studio's SidebarFooter slot. */
  footer?: ReactNode;
  /** Optional account block. Studio keeps account actions in the header, so omit this for parity. */
  user?: User;
  userMenu?: AppSidebarMenuItem[];
  /** Use when rendered inside a collapsible @hilum/ui Sidebar. */
  collapsed?: boolean;
  /** Accessible name for the navigation landmark wrapping `sections`. Default: "Main". */
  navLabel?: string;
  className?: string;
}

const DEFAULT_USER_MENU: AppSidebarMenuItem[] = [
  { label: "Profile", icon: <UserIcon size={13} /> },
  { label: "Settings", icon: <Settings size={13} /> },
  { label: "Sign out", icon: <LogOut size={13} />, destructive: true },
];

const APP_SIDEBAR_MENU_BUTTON_CLASS = "min-h-7 py-1";

function AppSidebar({
  logo,
  brand,
  subtitle,
  brandHref,
  brandAriaLabel,
  headerAction,
  sections,
  footer,
  user,
  userMenu = DEFAULT_USER_MENU,
  collapsed = false,
  navLabel = "Main",
  className,
}: AppSidebarProps) {
  const Link = useLink();
  const sidebar = useOptionalSidebar();
  const isStandalone = !sidebar;

  function closeMobileSidebar() {
    if (sidebar?.isMobile) {
      sidebar.setOpenMobile(false);
    }
  }

  const brandContent =
    logo && !brand && !subtitle ? (
      logo
    ) : (
      <div className="flex min-w-0 items-center gap-2">
        {logo && <div className="shrink-0">{logo}</div>}
        {!collapsed && (brand || subtitle) && (
          <div className="min-w-0 flex-1">
            {brand && (
              <div className="truncate text-lg font-bold leading-none tracking-tight">{brand}</div>
            )}
            {subtitle && (
              <div className="mt-0.5 truncate text-xs text-muted-foreground">{subtitle}</div>
            )}
          </div>
        )}
      </div>
    );

  const brandBlock =
    brandHref && !collapsed ? (
      <Link href={brandHref} aria-label={brandAriaLabel}>
        {brandContent}
      </Link>
    ) : (
      brandContent
    );

  const content = (
    <>
      {(logo || brand || subtitle || headerAction) && (
        <SidebarHeader>
          {headerAction && !collapsed ? (
            <MediaObject media={headerAction} mediaPosition="right" align="center">
              {brandBlock}
            </MediaObject>
          ) : (
            brandBlock
          )}
        </SidebarHeader>
      )}

      <SidebarContent>
        <nav aria-label={navLabel} className="flex flex-col gap-2" data-slot="app-sidebar-nav">
          {sections.map((section, sectionIndex) => (
            <Fragment key={sectionIndex}>
              {sectionIndex > 0 && <SidebarSeparator />}
              <AppSidebarSection
                {...(section.label !== undefined && { label: section.label })}
                collapsed={collapsed}
              >
                {section.items.map((item, itemIndex) => (
                  <AppSidebarNavItem
                    key={`${item.href}-${itemIndex}`}
                    item={item}
                    collapsed={collapsed}
                    onNavigate={closeMobileSidebar}
                  />
                ))}
              </AppSidebarSection>
            </Fragment>
          ))}
        </nav>
      </SidebarContent>

      {(footer || user) && (
        <SidebarFooter>
          {footer && !collapsed && footer}
          {user && <AppSidebarUserMenu user={user} userMenu={userMenu} collapsed={collapsed} />}
        </SidebarFooter>
      )}
    </>
  );

  if (!isStandalone) {
    return content;
  }

  return (
    <aside
      className={cn("flex h-dvh w-64 shrink-0 flex-col border-e border-border bg-card", className)}
    >
      {content}
    </aside>
  );
}

interface AppSidebarNavItemProps {
  item: NavItem;
  collapsed: boolean;
  /** Called after a non-prevented click on an enabled link (closes the mobile sidebar). */
  onNavigate: () => void;
  /** Nesting depth; 0 renders a top-level menu button, >0 a sub-menu button. */
  depth?: number;
}

const DISABLED_ITEM_CLASS =
  "cursor-not-allowed text-muted-foreground/60 hover:bg-transparent hover:text-muted-foreground/60";

/** One navigation row — link, disabled placeholder, or collapsible parent with sub-items. */
function AppSidebarNavItem({ item, collapsed, onNavigate, depth = 0 }: AppSidebarNavItemProps) {
  const Link = useLink();
  const sidebar = useOptionalSidebar();
  const subListId = useId();
  const childActive = hasActiveDescendant(item);
  const hasChildren = Boolean(item.children && item.children.length > 0);
  const [expanded, setExpanded] = useExpandedState(
    item.defaultExpanded ?? childActive,
    childActive,
  );
  const Icon = item.icon;
  const isSub = depth > 0;
  // Sub-items never render in the collapsed (icon-only) rail.
  const showToggle = hasChildren && !collapsed;

  const handleClick = (event: unknown) => {
    item.onClick?.(event);
    if (!wasDefaultPrevented(event)) onNavigate();
  };

  const inner = (
    <>
      {Icon && <Icon aria-hidden="true" />}
      {(!collapsed || isSub) && (
        <>
          <span>{item.label}</span>
          {item.badge != null &&
            (isSub || hasChildren ? (
              <span className="caption ms-auto shrink-0 rounded-full bg-muted px-1.5 font-medium text-muted-foreground">
                {item.badge}
              </span>
            ) : (
              <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
            ))}
        </>
      )}
    </>
  );

  const linkProps = {
    "aria-current": item.active ? ("page" as const) : undefined,
    ...(collapsed && !isSub && { "aria-label": item.label, title: item.label }),
  };

  const row = item.disabled ? (
    <span role="link" aria-disabled="true" {...linkProps}>
      {inner}
    </span>
  ) : (
    <Link href={item.href} {...linkProps} onClick={handleClick}>
      {inner}
    </Link>
  );

  const toggle = showToggle && (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={subListId}
      aria-label={`${expanded ? "Collapse" : "Expand"} ${item.label}`}
      onClick={() => setExpanded(!expanded)}
      data-slot="app-sidebar-toggle"
      className="absolute end-1 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <ChevronDown
        size={14}
        aria-hidden="true"
        className={cn(
          "transition-transform motion-reduce:transition-none",
          expanded && "rotate-180",
        )}
      />
    </button>
  );

  const subList = hasChildren && (
    <SidebarMenuSub id={subListId} hidden={collapsed || !expanded} className="mt-0.5">
      {item.children!.map((child, index) => (
        <AppSidebarNavItem
          key={`${child.href}-${index}`}
          item={child}
          collapsed={collapsed}
          onNavigate={onNavigate}
          depth={depth + 1}
        />
      ))}
    </SidebarMenuSub>
  );

  if (isSub) {
    return (
      <SidebarMenuSubItem>
        <div className="relative">
          <SidebarMenuSubButton
            asChild
            isActive={Boolean(item.active)}
            className={cn(showToggle && "pe-9", item.disabled && DISABLED_ITEM_CLASS)}
          >
            {row}
          </SidebarMenuSubButton>
          {toggle}
        </div>
        {subList}
      </SidebarMenuSubItem>
    );
  }

  return (
    <SidebarMenuItem>
      <div className="relative">
        <SidebarMenuButton
          asChild
          isActive={Boolean(item.active)}
          {...(collapsed && sidebar && { tooltip: item.label })}
          className={cn(
            APP_SIDEBAR_MENU_BUTTON_CLASS,
            showToggle && "pe-9",
            childActive && !item.active && "font-medium text-foreground",
            item.disabled && DISABLED_ITEM_CLASS,
          )}
        >
          {row}
        </SidebarMenuButton>
        {toggle}
      </div>
      {subList}
    </SidebarMenuItem>
  );
}

interface AppSidebarSectionProps {
  label?: string;
  collapsed?: boolean;
  children: ReactNode;
  className?: string;
}

function AppSidebarSection({ label, collapsed, children, className }: AppSidebarSectionProps) {
  return (
    <SidebarGroup className={className}>
      {label && !collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>{children}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function AppSidebarUserMenu({
  user,
  userMenu,
  collapsed,
}: {
  user: User;
  userMenu: AppSidebarMenuItem[];
  collapsed: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center rounded-md text-start body-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            collapsed ? "size-9 justify-center" : "min-h-10 gap-2 px-2",
          )}
        >
          <AccountAvatar user={user} />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-foreground">{user.name}</p>
                {user.email && (
                  <p className="caption-xs truncate text-muted-foreground">{user.email}</p>
                )}
              </div>
              <ChevronDown size={12} className="shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <AccountMenuItems user={user} items={userMenu} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { AppSidebar, AppSidebarSection };
export type { AppSidebarMenuItem, AppSidebarProps, AppSidebarSectionProps };
