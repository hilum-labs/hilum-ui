import type { ReactNode } from "react";
import { AppFrameMain, AppFrameRoot, type AppFrameProps } from "./app-frame";

interface AppShellProps extends AppFrameProps {
  /** Navigation column, typically `<AppSidebar>` (or a `@hilum/ui` `<Sidebar>`). */
  sidebar?: ReactNode;
  /** Top bar, typically `<AppHeader>`. Rendered above `<main>`. */
  header?: ReactNode;
  /**
   * Content above the header in the content column — `<AppStatusBanner>`,
   * `<AppMobileNav>` (which hides itself from `md` up), etc.
   */
  banner?: ReactNode;
  /** Page content. Wrapped in `<main>` unless `main={false}`. */
  children?: ReactNode;
}

/**
 * Root layout (app frame) for any product app — Hilum School, Hilum Shop,
 * admin, dashboard. Owns the landmarks, skip link, global loading bar, toast
 * host, top-bar search slot and `--hilum-header-height`.
 *
 * <AppShell
 *   linkComponent={({ href, ...r }) => <Link to={href} {...r} />}
 *   sidebar={<AppSidebar sections={...} />}
 *   header={<AppHeader breadcrumbs={...} />}
 *   search={<AppCommandButton />}
 *   loading={navigation.state === "loading"}
 * >
 *   {children}
 * </AppShell>
 *
 * Legacy composition (sidebar/header/main as children) still works with
 * `main={false}` — give your own `<main>` `id="main-content"`.
 */
function AppShell({
  sidebar,
  header,
  banner,
  main = true,
  mainClassName,
  loading,
  children,
  ...frameProps
}: AppShellProps) {
  const mainRegion = main ? (
    <AppFrameMain id={frameProps.mainId} loading={loading} className={mainClassName}>
      {children}
    </AppFrameMain>
  ) : (
    children
  );
  const hasColumn = sidebar !== undefined || header !== undefined || banner !== undefined;

  return (
    <AppFrameRoot {...frameProps} loading={loading ?? false} layoutClassName="flex">
      {sidebar}
      {hasColumn ? (
        <div className="flex min-w-0 flex-1 flex-col" data-slot="app-shell-column">
          {banner}
          {header}
          {mainRegion}
        </div>
      ) : (
        mainRegion
      )}
    </AppFrameRoot>
  );
}

export { AppShell };
export type { AppShellProps };
