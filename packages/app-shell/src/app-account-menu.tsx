import { Fragment, type ReactNode } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  useLink,
} from "@hilum/ui";
import type { User } from "./types";

type AppAccountMenuItem = {
  label: string;
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
  destructive?: boolean;
};

function AccountAvatar({ user }: { user: User }) {
  return (
    <Avatar size="sm">
      {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
      <AvatarFallback className="bg-brand-primary text-primary-foreground">
        {user.initials ?? user.name.slice(0, 2).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}

/**
 * The account menu's contents: who is signed in, then the items. A
 * destructive item (sign out) gets a separator above it. Shared by the sidebar
 * footer menu and `AppAccountMenu`, so both read the same.
 */
function AccountMenuItems({ user, items }: { user: User; items: AppAccountMenuItem[] }) {
  const Link = useLink();
  return (
    <>
      <div className="px-2.5 py-2">
        <p className="caption truncate font-semibold text-foreground">{user.name}</p>
        {user.email && <p className="caption-xs truncate text-muted-foreground">{user.email}</p>}
      </div>
      <DropdownMenuSeparator />
      {items.map((item, index) => (
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
    </>
  );
}

interface AppAccountMenuProps {
  /** Who is signed in. */
  user: User;
  /** Menu items, e.g. account pages and a destructive "Log out". */
  items: AppAccountMenuItem[];
  /** Accessible name of the avatar button. Default: "Open account menu". */
  label?: string;
  className?: string;
}

/**
 * Avatar button with the account menu, for the top right of `<AppHeader
 * actions>`. Same contents as the `<AppSidebar user>` footer menu.
 */
function AppAccountMenu({
  user,
  items,
  label = "Open account menu",
  className,
}: AppAccountMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          className={cn("size-8 rounded-full p-0", className)}
          data-slot="app-account-menu"
        >
          <AccountAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <AccountMenuItems user={user} items={items} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { AppAccountMenu, AccountAvatar, AccountMenuItems };
export type { AppAccountMenuItem, AppAccountMenuProps };
