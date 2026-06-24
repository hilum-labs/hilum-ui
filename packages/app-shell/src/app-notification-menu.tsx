import type { ReactNode } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  cn,
} from "@hilum/ui";
import { Bell } from "lucide-react";

interface AppNotificationItem {
  title: ReactNode;
  message?: ReactNode;
  time?: ReactNode;
  icon?: ReactNode;
  onSelect?: () => void;
}

interface AppNotificationMenuProps {
  items?: AppNotificationItem[];
  unreadCount?: number;
  maxItems?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
  emptyText?: ReactNode;
  clearLabel?: ReactNode;
  onClear?: () => void;
  triggerLabel?: string;
  className?: string;
  contentClassName?: string;
}

function AppNotificationMenu({
  items = [],
  unreadCount,
  maxItems = 8,
  open,
  defaultOpen,
  onOpenChange,
  title = "Notifications",
  emptyText = "No new notifications",
  clearLabel = "Clear all",
  onClear,
  triggerLabel = "Notifications",
  className,
  contentClassName,
}: AppNotificationMenuProps) {
  const visibleItems = items.slice(0, maxItems);
  const count = unreadCount ?? items.length;
  const hasUnread = count > 0;

  return (
    <DropdownMenu
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange ? { onOpenChange } : {})}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "relative size-9 text-muted-foreground transition-[color,scale] hover:text-foreground active:scale-[0.96]",
            className,
          )}
          aria-label={triggerLabel}
        >
          <Bell className="size-4" aria-hidden="true" />
          {hasUnread && (
            <span
              className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold leading-none text-background tabular-nums"
              aria-label={`${count} unread notifications`}
            >
              {count > 9 ? "9+" : count}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={cn("z-[70] max-h-96 w-80 overflow-y-auto p-1", contentClassName)}
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex min-h-10 items-center justify-between gap-3 px-2">
          <span className="body-sm font-semibold text-foreground">{title}</span>
          {items.length > 0 && onClear && (
            <button
              type="button"
              className="caption min-h-10 rounded-md px-2 font-medium text-primary transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30"
              onClick={onClear}
            >
              {clearLabel}
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleItems.length === 0 ? (
          <div className="body-sm py-6 text-center text-muted-foreground">{emptyText}</div>
        ) : (
          visibleItems.map((item, index) => (
            <DropdownMenuItem
              key={index}
              className="flex min-h-12 items-start gap-2 rounded-md px-2 py-2"
              {...(item.onSelect ? { onSelect: item.onSelect } : {})}
            >
              {item.icon && (
                <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  {item.icon}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="body-sm block truncate font-semibold text-foreground">
                  {item.title}
                </span>
                {item.message && (
                  <span className="caption mt-0.5 line-clamp-2 text-muted-foreground">
                    {item.message}
                  </span>
                )}
                {item.time && (
                  <span className="caption-xs mt-1 block text-muted-foreground">{item.time}</span>
                )}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

AppNotificationMenu.displayName = "AppNotificationMenu";

export { AppNotificationMenu };
export type { AppNotificationItem, AppNotificationMenuProps };
