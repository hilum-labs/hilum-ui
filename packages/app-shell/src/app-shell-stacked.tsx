import type { ReactNode } from "react";
import { cn } from "@hilum/ui";
import { LinkProvider } from "./link-context";
import type { LinkComponent } from "./types";
import { Navbar } from "./navbar";
import type { NavbarProps } from "./navbar";

interface AppShellStackedProps extends NavbarProps {
  linkComponent?: LinkComponent;
  className?: string;
  children: ReactNode;
}

/**
 * Top-nav variant of <AppShell> — no sidebar. Used for marketing-adjacent
 * apps (admin dashboards with a flat IA, public-facing tools, etc.).
 */
function AppShellStacked({
  linkComponent,
  className,
  children,
  ...navbarProps
}: AppShellStackedProps) {
  const Wrapper = linkComponent ? LinkProvider : Fragment;
  const wrapperProps = linkComponent ? { value: linkComponent } : {};

  return (
    <Wrapper {...(wrapperProps as { value: LinkComponent })}>
      <div
        className={cn(
          "flex flex-col h-screen overflow-hidden bg-taupe-50 text-taupe-900",
          className,
        )}
      >
        <Navbar {...navbarProps} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </Wrapper>
  );
}

import { Fragment } from "react";

export { AppShellStacked };
export type { AppShellStackedProps };
