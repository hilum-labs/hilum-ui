import { Fragment, type ReactNode } from "react";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
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
  SidebarSeparator,
  useOptionalSidebar,
} from "@hilum/ui";
import { useLink } from "./link-context";
import type { NavSection, User } from "./types";

type AppSidebarMenuItem = {
  label: string;
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
  destructive?: boolean;
};

interface AppSidebarProps {
  /** Optional logo block, e.g. an image or custom mark. */
  logo?: ReactNode;
  /** Brand name beside the logo. */
  brand?: ReactNode;
  /** Optional secondary brand/workspace label. */
  subtitle?: ReactNode;
  /** Optional action rendered in the brand header, e.g. Studio's new-project button. */
  headerAction?: ReactNode;
  sections: NavSection[];
  /** Optional custom footer content rendered above the user account block. */
  footer?: ReactNode;
  /** Account block at the bottom. Omit for sidebars without auth. */
  user?: User;
  /** Items in the user dropdown. Default: Profile / Settings / Sign out. */
  userMenu?: AppSidebarMenuItem[];
  /** Use when rendered inside a collapsible @hilum/ui Sidebar. */
  collapsed?: boolean;
  className?: string;
}

const DEFAULT_USER_MENU: AppSidebarMenuItem[] = [
  { label: "Profile", icon: <UserIcon size={13} /> },
  { label: "Settings", icon: <Settings size={13} /> },
  { label: "Sign out", icon: <LogOut size={13} />, destructive: true },
];

function AppSidebar({
  logo,
  brand,
  subtitle,
  headerAction,
  sections,
  footer,
  user,
  userMenu = DEFAULT_USER_MENU,
  collapsed = false,
  className,
}: AppSidebarProps) {
  const Link = useLink();
  const sidebar = useOptionalSidebar();

  function closeMobileSidebar() {
    if (sidebar?.isMobile) {
      sidebar.setOpenMobile(false);
    }
  }

  function wasDefaultPrevented(event: unknown): boolean {
    return (
      typeof event === "object" &&
      event !== null &&
      "defaultPrevented" in event &&
      Boolean((event as { defaultPrevented?: boolean }).defaultPrevented)
    );
  }

  return (
    <aside
      className={cn(
        "flex h-svh w-64 shrink-0 flex-col border-r border-border bg-card text-foreground",
        collapsed && "w-14",
        className,
      )}
    >
      {(logo || brand || headerAction) && (
        <SidebarHeader
          className={cn(
            "min-h-16 justify-center",
            collapsed ? "items-center px-2" : "px-3 py-3",
          )}
        >
          <div
            className={cn(
              "flex min-w-0 items-center gap-2",
              collapsed ? "justify-center" : "w-full",
            )}
          >
            {logo && <div className="shrink-0">{logo}</div>}
            {!collapsed && (brand || subtitle) && (
              <div className="min-w-0 flex-1">
                {brand && (
                  <div className="truncate text-lg font-bold leading-none tracking-tight">
                    {brand}
                  </div>
                )}
                {subtitle && (
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {subtitle}
                  </div>
                )}
              </div>
            )}
            {!collapsed && headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        </SidebarHeader>
      )}

      <SidebarContent className="gap-0 p-3">
        {sections.map((section, sectionIndex) => (
          <Fragment key={sectionIndex}>
            {sectionIndex > 0 && <SidebarSeparator />}
            <AppSidebarSection
              {...(section.label !== undefined && { label: section.label })}
              collapsed={collapsed}
            >
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                const linkOnClick = (event: unknown) => {
                  if (item.disabled) {
                    (event as { preventDefault?: () => void }).preventDefault?.();
                    return;
                  }

                  item.onClick?.(event);

                  if (!wasDefaultPrevented(event)) {
                    closeMobileSidebar();
                  }
                };

                return (
                  <SidebarMenuItem key={`${item.href}-${itemIndex}`}>
                    <SidebarMenuButton
                      asChild
                      isActive={Boolean(item.active)}
                      {...(collapsed && sidebar && { tooltip: item.label })}
                      className={cn(
                        item.disabled && "cursor-default text-muted-foreground/60 hover:bg-transparent hover:text-muted-foreground/60",
                      )}
                    >
                      <Link
                        href={item.disabled ? "#" : item.href}
                        aria-current={item.active ? "page" : undefined}
                        {...(collapsed && { "aria-label": item.label, title: item.label })}
                        onClick={linkOnClick}
                      >
                        {Icon && <Icon aria-hidden="true" />}
                        {!collapsed && (
                          <>
                            <span className="min-w-0 flex-1 truncate">{item.label}</span>
                            {item.badge != null && (
                              <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                            )}
                          </>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </AppSidebarSection>
          </Fragment>
        ))}
      </SidebarContent>

      {(footer || user) && (
        <SidebarFooter>
          {footer && !collapsed && <div>{footer}</div>}
          {footer && user && !collapsed && <SidebarSeparator className="mx-0" />}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center rounded-md text-left body-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
                    collapsed ? "size-9 justify-center" : "min-h-10 gap-2 px-2",
                  )}
                >
                  <Avatar size="sm">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                    <AvatarFallback className="bg-brand-primary text-background">
                      {user.initials ?? user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
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
                <div className="px-2.5 py-2">
                  <p className="caption truncate font-semibold text-foreground">{user.name}</p>
                  {user.email && (
                    <p className="caption-xs truncate text-muted-foreground">{user.email}</p>
                  )}
                </div>
                <DropdownMenuSeparator />
                {userMenu.map((item, index) => (
                  <Fragment key={`${item.label}-${index}`}>
                    {index > 0 && item.destructive && <DropdownMenuSeparator />}
                    <DropdownMenuItem
                      {...(item.destructive && { destructive: true })}
                      {...(item.onSelect && { onSelect: item.onSelect })}
                      asChild={Boolean(item.href)}
                    >
                      {item.href ? (
                        <Link href={item.href}>
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.label}
                        </Link>
                      ) : (
                        <>
                          {item.icon && <span className="mr-2">{item.icon}</span>}
                          {item.label}
                        </>
                      )}
                    </DropdownMenuItem>
                  </Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </SidebarFooter>
      )}
    </aside>
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
    <SidebarGroup className={cn("p-0", className)}>
      {label && !collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>{children}</SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export { AppSidebar, AppSidebarSection };
export type { AppSidebarMenuItem, AppSidebarProps, AppSidebarSectionProps };
