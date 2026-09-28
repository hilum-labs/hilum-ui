import {
  createContext,
  useContext,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn, LinkProvider, Toaster } from "@hilum/ui";
import { AppLoadingBar } from "./app-loading-bar";
import { DEFAULT_MAIN_ID, SkipLink } from "./skip-link";
import type { LinkComponent } from "./types";

type ToasterProps = ComponentProps<typeof Toaster>;

/**
 * Frame-level options shared by `<AppShell>` and `<AppShellStacked>`.
 *
 * Both shells are the "app frame": they own the landmarks (skip link +
 * `<main>`), the global loading bar, the toast host, the top-bar search slot,
 * and the `--hilum-header-height` CSS variable.
 */
interface AppFrameProps {
  /** Router-aware link component. See D13 in PLATFORM_PLAN.md. */
  linkComponent?: LinkComponent;
  /**
   * Search control for the top bar (e.g. `<AppCommandButton />`). `<AppHeader>`
   * and the stacked `<Navbar>` render it automatically.
   */
  search?: ReactNode;
  /** Show the global indeterminate loading bar and mark `<main>` as `aria-busy`. */
  loading?: boolean;
  /** Accessible name for the loading bar. Default: "Loading". */
  loadingLabel?: string;
  /**
   * Mount `@hilum/ui`'s `<Toaster>` once for the app. Pass props to configure
   * it, or `false` if the app already mounts its own. Default: `true`.
   */
  toaster?: boolean | ToasterProps;
  /**
   * Wrap children in `<main id={mainId} tabIndex={-1}>`. Pass `false` when you
   * render your own `<main>` (give it `id={mainId}` so the skip link works).
   * Default: `true`.
   */
  main?: boolean;
  /** Id of the main region / skip-link target. Default: `main-content`. */
  mainId?: string;
  mainClassName?: string;
  /** Render the "Skip to content" link. Pass a node to customise its text. Default: `true`. */
  skipLink?: boolean | ReactNode;
  /**
   * Top-bar height, exposed as `--hilum-header-height` on the frame so
   * sticky surfaces (e.g. `ContextualSaveBar`) can offset below the header.
   * Numbers are pixels. Default: `"4rem"`.
   */
  headerHeight?: number | string;
  className?: string;
  children?: ReactNode;
}

interface AppFrameContextValue {
  search?: ReactNode;
  mainId: string;
}

const AppFrameContext = createContext<AppFrameContextValue | null>(null);

/** Frame options for components rendered inside `<AppShell>` / `<AppShellStacked>`. */
function useAppFrame(): AppFrameContextValue | null {
  return useContext(AppFrameContext);
}

function MaybeLinkProvider({
  linkComponent,
  children,
}: {
  linkComponent: LinkComponent | undefined;
  children: ReactNode;
}) {
  return linkComponent ? <LinkProvider value={linkComponent}>{children}</LinkProvider> : children;
}

interface AppFrameRootProps extends Omit<AppFrameProps, "children" | "mainClassName" | "main"> {
  /** Layout classes for the root element. */
  layoutClassName: string;
  children: ReactNode;
}

/** Shared root: link provider, frame context, CSS variable, skip link, loading bar, toaster. */
function AppFrameRoot({
  linkComponent,
  search,
  loading = false,
  loadingLabel,
  toaster = true,
  mainId = DEFAULT_MAIN_ID,
  skipLink = true,
  headerHeight = "4rem",
  layoutClassName,
  className,
  children,
}: AppFrameRootProps) {
  const headerHeightValue = typeof headerHeight === "number" ? `${headerHeight}px` : headerHeight;
  const toasterProps = typeof toaster === "object" ? toaster : {};

  return (
    <MaybeLinkProvider linkComponent={linkComponent}>
      <AppFrameContext.Provider value={{ search, mainId }}>
        <div
          data-slot="app-frame"
          className={cn(
            "relative h-dvh overflow-hidden bg-muted text-foreground",
            layoutClassName,
            className,
          )}
          style={{ "--hilum-header-height": headerHeightValue } as CSSProperties}
        >
          {skipLink !== false && (
            <SkipLink targetId={mainId}>{skipLink === true ? undefined : skipLink}</SkipLink>
          )}
          <AppLoadingBar
            active={loading}
            {...(loadingLabel !== undefined && { label: loadingLabel })}
          />
          {children}
          {toaster !== false && <Toaster {...toasterProps} />}
        </div>
      </AppFrameContext.Provider>
    </MaybeLinkProvider>
  );
}

function AppFrameMain({
  id = DEFAULT_MAIN_ID,
  loading,
  className,
  children,
}: {
  id?: string | undefined;
  loading?: boolean | undefined;
  className?: string | undefined;
  children?: ReactNode;
}) {
  return (
    <main
      id={id}
      tabIndex={-1}
      aria-busy={loading || undefined}
      data-slot="app-main"
      className={cn("min-w-0 flex-1 overflow-auto focus:outline-none", className)}
    >
      {children}
    </main>
  );
}

export { AppFrameMain, AppFrameRoot, useAppFrame };
export type { AppFrameContextValue, AppFrameProps };
