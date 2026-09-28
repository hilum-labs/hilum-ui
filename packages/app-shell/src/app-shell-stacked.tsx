import type { ReactNode } from "react";
import { AppFrameMain, AppFrameRoot, type AppFrameProps } from "./app-frame";
import { Navbar } from "./navbar";
import type { NavbarProps } from "./navbar";

interface AppShellStackedProps
  extends Omit<NavbarProps, "className" | "search">, Omit<AppFrameProps, "children"> {
  /** Content between the navbar and `<main>` (e.g. `<AppStatusBanner>`). */
  banner?: ReactNode;
  /** Class name for the `<Navbar>`. */
  navbarClassName?: string;
  children: ReactNode;
}

/**
 * Top-nav variant of <AppShell> — no sidebar. Used for marketing-adjacent
 * apps (admin dashboards with a flat IA, public-facing tools, etc.). Shares
 * AppShell's frame features: skip link, `<main>`, loading bar, toaster,
 * search slot and `--hilum-header-height`.
 */
function AppShellStacked({
  linkComponent,
  search,
  loading,
  loadingLabel,
  toaster,
  main = true,
  mainId,
  mainClassName,
  skipLink,
  headerHeight,
  banner,
  navbarClassName,
  className,
  children,
  ...navbarProps
}: AppShellStackedProps) {
  return (
    <AppFrameRoot
      {...(linkComponent !== undefined && { linkComponent })}
      {...(search !== undefined && { search })}
      {...(loadingLabel !== undefined && { loadingLabel })}
      {...(toaster !== undefined && { toaster })}
      {...(mainId !== undefined && { mainId })}
      {...(skipLink !== undefined && { skipLink })}
      {...(headerHeight !== undefined && { headerHeight })}
      {...(className !== undefined && { className })}
      loading={loading ?? false}
      layoutClassName="flex flex-col"
    >
      <Navbar
        {...navbarProps}
        {...(navbarClassName !== undefined && { className: navbarClassName })}
      />
      {banner}
      {main ? (
        <AppFrameMain id={mainId} loading={loading} className={mainClassName}>
          {children}
        </AppFrameMain>
      ) : (
        children
      )}
    </AppFrameRoot>
  );
}

export { AppShellStacked };
export type { AppShellStackedProps };
