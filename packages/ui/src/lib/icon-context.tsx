"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

import {
  lucideIcons,
  iconLibraryOrder,
  type IconLibrary,
  type IconLibraryRegistry,
  type IconName,
  type IconComponent,
} from "./icon-map";
import { isTypingTarget } from "./keyboard-shortcut";

// Re-export types for consumers
export type {
  IconComponent,
  IconComponentProps,
  IconName,
  IconLibrary,
  IconLibraryRegistry,
  IconSet,
} from "./icon-map";
export { iconLibraryOrder, iconLibraryLabels, lucideIcons } from "./icon-map";

interface IconContextValue {
  iconLibrary: IconLibrary;
  setIconLibrary: (lib: IconLibrary) => void;
  /** Libraries that can actually render (always includes `lucide`), in canonical order. */
  availableLibraries: IconLibrary[];
  libraries: IconLibraryRegistry;
}

const IconContext = createContext<IconContextValue | null>(null);

/**
 * Returns the current icon library, its setter and the libraries registered
 * with the provider. Throws if used outside IconProvider.
 */
function useIconLibrary() {
  const ctx = useContext(IconContext);
  if (!ctx) throw new Error("useIconLibrary must be used within an IconProvider");
  return ctx;
}

function resolveIcon(ctx: IconContextValue | null, name: IconName): IconComponent {
  if (!ctx || ctx.iconLibrary === "lucide") return lucideIcons[name];
  return ctx.libraries[ctx.iconLibrary]?.[name] ?? lucideIcons[name];
}

/**
 * Returns a single icon component for the given name.
 * Falls back to Lucide without a provider, or when the active library isn't
 * registered / lacks the icon.
 */
function useIcon(name: IconName): IconComponent {
  const ctx = useContext(IconContext);
  return resolveIcon(ctx, name);
}

/**
 * Returns the full icon map for the current library.
 * Falls back to Lucide if no provider is present.
 */
function useIcons(): Record<IconName, IconComponent> {
  const ctx = useContext(IconContext);
  const lib = ctx?.iconLibrary ?? "lucide";
  const set = ctx?.libraries[lib];
  return useMemo(() => (set ? { ...lucideIcons, ...set } : lucideIcons), [set]);
}

interface IconProviderProps {
  children: ReactNode;
  /** Initial library. Defaults to `"lucide"`, which needs no registration. */
  defaultLibrary?: IconLibrary;
  /**
   * Alternative icon sets, e.g. `iconLibraries` from `@hilum/ui/icon-libraries`.
   * Only Lucide ships with the main entry; selecting an unregistered library
   * renders Lucide. Nested providers inherit their parent's registrations.
   */
  libraries?: IconLibraryRegistry;
}

function IconProvider({ children, defaultLibrary = "lucide", libraries }: IconProviderProps) {
  const parent = useContext(IconContext);
  const [iconLibrary, setIconLibraryState] = useState<IconLibrary>(defaultLibrary);

  const setIconLibrary = useCallback((next: IconLibrary) => {
    setIconLibraryState(next);
  }, []);

  const merged = useMemo<IconLibraryRegistry>(
    () => ({ ...parent?.libraries, ...libraries }),
    [parent?.libraries, libraries],
  );

  const availableLibraries = useMemo(
    () => iconLibraryOrder.filter((lib) => lib === "lucide" || merged[lib] != null),
    [merged],
  );

  useEffect(() => {
    if (iconLibrary !== "lucide" && merged[iconLibrary] == null) {
      console.warn(
        `[@hilum/ui] IconProvider: icon library "${iconLibrary}" is not registered; ` +
          `falling back to Lucide. Pass it via <IconProvider libraries={…}> ` +
          `(see "@hilum/ui/icon-libraries").`,
      );
    }
  }, [iconLibrary, merged]);

  const value = useMemo(
    () => ({ iconLibrary, setIconLibrary, availableLibraries, libraries: merged }),
    [iconLibrary, setIconLibrary, availableLibraries, merged],
  );

  return <IconContext.Provider value={value}>{children}</IconContext.Provider>;
}

interface CycleShortcutOptions {
  /** Key that cycles (case-insensitive, no modifiers). */
  key?: string;
  /** Attach the listener. Defaults to `true`. */
  enabled?: boolean;
}

/**
 * Opt-in global shortcut that cycles through the registered icon libraries.
 * Must be called inside an IconProvider. Ignores keystrokes with modifiers
 * and keystrokes aimed at text-entry targets. The library itself never
 * installs global key handlers — apps (e.g. a docs site) choose to.
 */
function useIconLibraryCycleShortcut({ key = "i", enabled = true }: CycleShortcutOptions = {}) {
  const { iconLibrary, setIconLibrary, availableLibraries } = useIconLibrary();

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      if (isTypingTarget(e.target)) return;
      e.preventDefault();
      const idx = availableLibraries.indexOf(iconLibrary);
      const next = availableLibraries[(idx + 1) % availableLibraries.length];
      if (next) setIconLibrary(next);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [enabled, key, iconLibrary, setIconLibrary, availableLibraries]);
}

export { IconProvider, useIcon, useIcons, useIconLibrary, useIconLibraryCycleShortcut };
export type { IconProviderProps, CycleShortcutOptions };
