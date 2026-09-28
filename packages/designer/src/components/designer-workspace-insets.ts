export type DesignerWorkspaceInsetValue = number | string;

export interface DesignerWorkspaceInsets {
  top: DesignerWorkspaceInsetValue;
  right: DesignerWorkspaceInsetValue;
  bottom: DesignerWorkspaceInsetValue;
  left: DesignerWorkspaceInsetValue;
}

export type DesignerWorkspaceInsetsInput =
  DesignerWorkspaceInsetValue | Partial<DesignerWorkspaceInsets>;

function toCssLength(value: DesignerWorkspaceInsetValue): string {
  return typeof value === "number" ? `${value}px` : value;
}

export function resolveDesignerWorkspaceInsets(
  input: DesignerWorkspaceInsetsInput | undefined,
  fallback: DesignerWorkspaceInsetValue = 0,
): Record<keyof DesignerWorkspaceInsets, string> {
  const fallbackValue = toCssLength(fallback);

  if (typeof input === "number" || typeof input === "string") {
    const value = toCssLength(input);
    return { top: value, right: value, bottom: value, left: value };
  }

  return {
    top: input?.top === undefined ? fallbackValue : toCssLength(input.top),
    right: input?.right === undefined ? fallbackValue : toCssLength(input.right),
    bottom: input?.bottom === undefined ? fallbackValue : toCssLength(input.bottom),
    left: input?.left === undefined ? fallbackValue : toCssLength(input.left),
  };
}

export function getDesignerFloatingMaxHeight(insets: { top: string; bottom: string }): string {
  return `calc(100% - ${insets.top} - ${insets.bottom})`;
}
