import type { ReactNode } from "react";
import { cn } from "@hilum/ui";
import { LinkProvider } from "./link-context";
import type { LinkComponent } from "./types";

interface AppShellProps {
  /** Router-aware link component. See D13 in PLATFORM_PLAN.md. */
  linkComponent?: LinkComponent;
  className?: string;
  children: ReactNode;
}

/**
 * Root layout for any product app — Hilum School, Hilum Shop, admin, dashboard.
 * Place an <AppSidebar> + <AppHeader> + <main> as direct children.
 *
 * <AppShell linkComponent={({ href, ...r }) => <Link to={href} {...r} />}>
 *   <AppSidebar sections={...} user={...} />
 *   <div className="flex flex-col flex-1 min-w-0">
 *     <AppHeader breadcrumbs={...} />
 *     <main className="flex-1 overflow-auto">{children}</main>
 *   </div>
 * </AppShell>
 */
function AppShell({ linkComponent, className, children }: AppShellProps) {
  const Wrapper = linkComponent ? LinkProvider : Fragment;
  const wrapperProps = linkComponent ? { value: linkComponent } : {};

  return (
    <Wrapper {...(wrapperProps as { value: LinkComponent })}>
      <div className={cn("flex h-screen overflow-hidden bg-muted text-foreground", className)}>
        {children}
      </div>
    </Wrapper>
  );
}

// Local Fragment alias keeps the conditional provider terse.
import { Fragment } from "react";

export { AppShell };
export type { AppShellProps };
