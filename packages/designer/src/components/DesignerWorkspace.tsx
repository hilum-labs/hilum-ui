import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import { cn } from "@hilum/ui";
import {
  resolveDesignerWorkspaceInsets,
  type DesignerWorkspaceInsets,
  type DesignerWorkspaceInsetsInput,
  type DesignerWorkspaceInsetValue,
} from "./designer-workspace-insets";

interface DesignerWorkspaceProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  /**
   * Insets that describe the unobscured canvas area between floating chrome.
   * Numbers are interpreted as pixels; CSS lengths and calc() expressions are
   * accepted for responsive shells.
   */
  safeInsets?: DesignerWorkspaceInsetsInput;
  children: ReactNode;
}

interface DesignerWorkspaceViewportProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  children: ReactNode;
}

type WorkspaceStyle = CSSProperties & {
  "--designer-workspace-inset-top": string;
  "--designer-workspace-inset-right": string;
  "--designer-workspace-inset-bottom": string;
  "--designer-workspace-inset-left": string;
};

/**
 * Positioning boundary for a canvas editor. Floating rails, panels, and
 * toolbars are layered over this surface while DesignerWorkspaceViewport uses
 * the configured safe insets to keep document content unobscured.
 */
function DesignerWorkspace({
  safeInsets,
  className,
  style,
  children,
  ...props
}: DesignerWorkspaceProps) {
  const insets = resolveDesignerWorkspaceInsets(safeInsets);
  const workspaceStyle = {
    "--designer-workspace-inset-top": insets.top,
    "--designer-workspace-inset-right": insets.right,
    "--designer-workspace-inset-bottom": insets.bottom,
    "--designer-workspace-inset-left": insets.left,
    ...style,
  } as WorkspaceStyle;

  return (
    <div
      data-designer-workspace
      className={cn(
        "relative isolate flex min-h-0 min-w-0 flex-1 overflow-hidden bg-muted",
        className,
      )}
      style={workspaceStyle}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Safe, canvas-sized region within DesignerWorkspace. Its bounds are derived
 * from the workspace's safeInsets so fit/center calculations use the visible
 * area between floating editor chrome.
 */
function DesignerWorkspaceViewport({
  className,
  style,
  children,
  ...props
}: DesignerWorkspaceViewportProps) {
  return (
    <div
      data-designer-workspace-viewport
      className={cn("absolute z-0 flex min-h-0 min-w-0 overflow-hidden", className)}
      style={{
        top: "var(--designer-workspace-inset-top)",
        right: "var(--designer-workspace-inset-right)",
        bottom: "var(--designer-workspace-inset-bottom)",
        left: "var(--designer-workspace-inset-left)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export { DesignerWorkspace, DesignerWorkspaceViewport };
export type {
  DesignerWorkspaceProps,
  DesignerWorkspaceViewportProps,
  DesignerWorkspaceInsets,
  DesignerWorkspaceInsetsInput,
  DesignerWorkspaceInsetValue,
};
