import { createContext, useContext, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

/**
 * The minimal contract a designer shell needs from the engine beneath it.
 *
 * The chrome (toolbar, panel, pane, sidebar) reads from this context.
 * It does NOT know what is being edited — selection IDs are opaque strings
 * (layer IDs, field IDs, node IDs — whatever the engine uses), and active
 * tool is an open string the app defines (`select`, `hand`, `text`, …).
 *
 * @hilum/designer-canvas wires this up for canvas apps. A form-builder app
 * could wire its own engine to ShellContext with the same primitives.
 */
export interface ShellContextValue {
  /** IDs of currently-selected items. Engine-defined meaning. */
  selectedIds: string[];
  setSelectedIds: Dispatch<SetStateAction<string[]>>;

  /** Active tool. App-defined enum (e.g. 'select' | 'hand' | 'text'). */
  activeTool: string;
  setActiveTool: Dispatch<SetStateAction<string>>;

  /** When true, mutating actions should no-op. Used for previews. */
  readOnly: boolean;

  /**
   * Optional resolver: given a `selectedId`, return its engine-defined "kind"
   * (e.g. 'text', 'image'). DesignerPane.showFor uses this to decide whether
   * to render. Apps that don't have typed selections can leave this undefined.
   */
  resolveKind?: (id: string) => string | undefined;
}

const noop = () => {};

const DEFAULT: ShellContextValue = {
  selectedIds: [],
  setSelectedIds: noop as Dispatch<SetStateAction<string[]>>,
  activeTool: "select",
  setActiveTool: noop as Dispatch<SetStateAction<string>>,
  readOnly: false,
  resolveKind: undefined,
};

const ShellContext = createContext<ShellContextValue>(DEFAULT);

export function useShellContext(): ShellContextValue {
  return useContext(ShellContext);
}

interface ShellProviderProps {
  /** Initial selected IDs. Default: []. */
  initialSelectedIds?: string[];
  /** Initial active tool. Default: 'select'. */
  initialTool?: string;
  /** Read-only flag. */
  readOnly?: boolean;
  /** Kind resolver — see ShellContextValue.resolveKind. */
  resolveKind?: (id: string) => string | undefined;
  /** Controlled override — pass a value to lift state out of the provider. */
  value?: Partial<ShellContextValue>;
  children: ReactNode;
}

export function ShellProvider({
  initialSelectedIds = [],
  initialTool = "select",
  readOnly = false,
  resolveKind,
  value: controlled,
  children,
}: ShellProviderProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);
  const [activeTool, setActiveTool] = useState<string>(initialTool);

  const value = useMemo<ShellContextValue>(
    () => ({
      selectedIds: controlled?.selectedIds ?? selectedIds,
      setSelectedIds: controlled?.setSelectedIds ?? setSelectedIds,
      activeTool: controlled?.activeTool ?? activeTool,
      setActiveTool: controlled?.setActiveTool ?? setActiveTool,
      readOnly: controlled?.readOnly ?? readOnly,
      resolveKind: controlled?.resolveKind ?? resolveKind,
    }),
    [selectedIds, activeTool, readOnly, resolveKind, controlled],
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}
