import { Fragment, useEffect, useRef, type ReactNode } from "react";
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
} from "@hilum/ui";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useLink } from "./link-context";
import type { NavItem, NavSection, User } from "./types";

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
  user?: User;
  userMenu?: AppMobileNavMenuItem[];
  accountLabel?: ReactNode;
  accountMenuLabel?: string;
  getItemLabel?: (item: NavItem) => ReactNode;
  className?: string;
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
  user,
  userMenu = DEFAULT_USER_MENU,
  accountLabel = user?.email,
  accountMenuLabel = "Open account menu",
  getItemLabel = (item) => item.label,
  className,
}: AppMobileNavProps) {
  const Link = useLink();
  const activeItemRef = useRef<HTMLLIElement | null>(null);
  const navItems = sections.flatMap((section) => section.items);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [navItems.map((item) => `${item.href}:${item.active ? "1" : "0"}`).join("|")]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/95 px-3 py-2 backdrop-blur md:hidden",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        {logo && <div className="shrink-0">{logo}</div>}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-tight text-foreground">{brand}</p>
          {subtitle && (
            <p className="mt-0.5 truncate text-[11px] leading-tight text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex size-10 shrink-0 items-center justify-center rounded-md transition-[background-color,box-shadow,scale] hover:bg-muted active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30"
                aria-label={accountMenuLabel}
              >
                <Avatar size="xs">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                  <AvatarFallback className="bg-brand-primary text-background">
                    {user.initials ?? user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="px-2.5 py-2">
                <p className="caption font-semibold text-foreground">{user.name}</p>
                {accountLabel && (
                  <p className="caption-xs truncate text-muted-foreground">{accountLabel}</p>
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
      </div>
      <div className="-mx-3 mt-2 overflow-x-auto scroll-px-3 px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <nav aria-label="Mobile sections">
          <ul className="flex w-max min-w-full gap-1.5 pr-3">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <li
                  key={`${item.href}-${index}`}
                  ref={item.active ? activeItemRef : undefined}
                  className="shrink-0"
                >
                  <Link
                    href={item.disabled ? "#" : item.href}
                    aria-current={item.active ? "page" : undefined}
                    {...(item.onClick && { onClick: item.onClick })}
                    className={cn(
                      "flex h-10 min-w-[76px] scroll-mx-3 items-center justify-center gap-1 rounded-md px-2.5 text-[11px] font-medium transition-[background-color,box-shadow,color,scale] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                      item.active
                        ? "bg-ground-900 text-background shadow-natural"
                        : item.disabled
                          ? "cursor-default text-muted-foreground/60"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {Icon && <Icon className="size-3.5 shrink-0" />}
                    <span className="truncate">{getItemLabel(item)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export { AppMobileNav };
export type { AppMobileNavMenuItem, AppMobileNavProps };
