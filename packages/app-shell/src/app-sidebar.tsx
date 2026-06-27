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
  brandHref,
  brandAriaLabel,
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
  const isStandalone = !sidebar;

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
                        item.disabled &&
                          "cursor-default text-muted-foreground/60 hover:bg-transparent hover:text-muted-foreground/60",
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
                            <span>{item.label}</span>
                            {item.badge != null && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
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
    <aside className={cn("flex flex-col h-svh bg-card border-r border-border w-64", className)}>
      {content}
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
  const Link = useLink();

  return (
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
                {user.email && <p className="caption-xs truncate text-muted-foreground">{user.email}</p>}
              </div>
              <ChevronDown size={12} className="shrink-0 text-muted-foreground" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" className="w-56">
        <div className="px-2.5 py-2">
          <p className="caption truncate font-semibold text-foreground">{user.name}</p>
          {user.email && <p className="caption-xs truncate text-muted-foreground">{user.email}</p>}
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
  );
}

export { AppSidebar, AppSidebarSection };
export type { AppSidebarMenuItem, AppSidebarProps, AppSidebarSectionProps };
