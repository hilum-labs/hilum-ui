import type { ReactNode } from "react";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@hilum/ui";
import { useLink } from "./link-context";
import type { NavSection, User } from "./types";

interface AppSidebarProps {
  /** Optional logo block — e.g. an image or a custom mark. */
  logo?: ReactNode;
  /** Brand name beside the logo. */
  brand?: ReactNode;
  sections: NavSection[];
  /** Account block at the bottom. Omit for sidebars without auth. */
  user?: User;
  /** Items in the user dropdown. Default: Profile / Settings / Sign out. */
  userMenu?: {
    label: string;
    icon?: ReactNode;
    href?: string;
    onSelect?: () => void;
    destructive?: boolean;
  }[];
  collapsed?: boolean;
  className?: string;
}

const DEFAULT_USER_MENU = [
  { label: "Profile", icon: <UserIcon size={13} /> },
  { label: "Settings", icon: <Settings size={13} /> },
  { label: "Sign out", icon: <LogOut size={13} />, destructive: true },
];

function AppSidebar({
  logo,
  brand,
  sections,
  user,
  userMenu = DEFAULT_USER_MENU,
  collapsed = false,
  className,
}: AppSidebarProps) {
  const Link = useLink();

  return (
    <aside
      className={cn(
        "flex flex-col bg-white border-r border-ground-100 shrink-0",
        collapsed ? "w-14" : "w-60",
        className,
      )}
    >
      {(logo || brand) && (
        <div className="flex h-14 items-center gap-2 border-b border-ground-100 px-3">
          {logo}
          {!collapsed && brand && (
            <span className="label font-semibold text-ground-900">{brand}</span>
          )}
        </div>
      )}

      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {sections.map((section, sIdx) => (
          <AppSidebarSection
            key={sIdx}
            {...(section.label !== undefined && { label: section.label })}
            collapsed={collapsed}
          >
            {section.items.map((item, iIdx) => {
              const Icon = item.icon;
              const linkOnClick = item.disabled
                ? (e: unknown) => (e as { preventDefault?: () => void }).preventDefault?.()
                : item.onClick;
              return (
                <Link
                  key={iIdx}
                  href={item.disabled ? "#" : item.href}
                  {...(linkOnClick !== undefined && { onClick: linkOnClick })}
                  {...(collapsed && { title: item.label })}
                  className={cn(
                    "flex items-center rounded-lg transition-colors caption",
                    collapsed ? "size-9 justify-center" : "gap-2.5 px-2.5 py-2",
                    item.active
                      ? "bg-brand-primary/10 text-brand-primary font-medium"
                      : item.disabled
                        ? "cursor-default text-ground-300"
                        : "text-ground-600 hover:bg-ground-50 hover:text-ground-900",
                  )}
                >
                  {Icon && <Icon size={14} className="shrink-0" />}
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge != null && (
                        <Badge
                          variant={item.active ? "outline" : "secondary"}
                          className="caption-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </AppSidebarSection>
        ))}
      </nav>

      {user && (
        <div className="border-t border-ground-100 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center rounded-lg transition-colors caption text-ground-700 hover:bg-ground-50",
                  collapsed ? "size-9 justify-center" : "gap-2.5 px-2.5 py-2",
                )}
              >
                <Avatar size="xs">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                  <AvatarFallback className="bg-brand-primary text-white">
                    {user.initials ?? user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="caption font-semibold text-ground-900 truncate">{user.name}</p>
                      {user.email && (
                        <p className="caption-xs text-ground-400 truncate">{user.email}</p>
                      )}
                    </div>
                    <ChevronDown size={12} className="text-ground-400" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-48">
              {userMenu.map((m, idx) => (
                <Fragment key={idx}>
                  {idx === userMenu.length - 1 && m.destructive && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    {...(m.onSelect !== undefined && { onSelect: m.onSelect })}
                    className={cn(m.destructive && "text-red-600")}
                  >
                    {m.icon && <span className="mr-2">{m.icon}</span>}
                    {m.label}
                  </DropdownMenuItem>
                </Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
    <div className={cn("mb-3 last:mb-0", className)}>
      {label && !collapsed && (
        <p className="caption-xs uppercase tracking-wider font-semibold text-ground-400 px-2.5 py-1.5">
          {label}
        </p>
      )}
      <ul className="flex flex-col gap-0.5">
        {/* Children are <Link> elements — wrap each in <li> for semantics. */}
        {Array.isArray(children) ? (
          children.map((child, i) => <li key={i}>{child}</li>)
        ) : (
          <li>{children}</li>
        )}
      </ul>
    </div>
  );
}

import { Fragment } from "react";

export { AppSidebar, AppSidebarSection };
export type { AppSidebarProps, AppSidebarSectionProps };
