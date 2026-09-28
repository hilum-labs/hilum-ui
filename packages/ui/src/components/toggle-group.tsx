"use client";

import * as React from "react";
import { ToggleGroup } from "radix-ui";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";
import {
  segmentedItemClasses,
  segmentedItemOnClasses,
  segmentedTrackClasses,
} from "../lib/interaction";
import { toggleVariants } from "./toggle";

type ToggleGroupVariantProps = Omit<VariantProps<typeof toggleVariants>, "variant"> & {
  /**
   * `segmented` renders the group as one track with a raised chip for the
   * "on" item (the ButtonGroup look, including its compact editor-chrome
   * tier); the other variants are spaced Toggles.
   */
  variant?: VariantProps<typeof toggleVariants>["variant"] | "segmented";
};

type ToggleGroupVariant = NonNullable<ToggleGroupVariantProps["variant"]>;

const ToggleGroupContext = React.createContext<ToggleGroupVariantProps>({
  size: "default",
  variant: "default",
});

function ToggleGroupRoot({
  className,
  variant = "default",
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroup.Root> & ToggleGroupVariantProps) {
  return (
    <ToggleGroup.Root
      data-slot="toggle-group"
      className={cn(
        variant === "segmented" ? segmentedTrackClasses : "inline-flex items-center gap-1",
        className,
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroup.Root>
  );
}
ToggleGroupRoot.displayName = "ToggleGroup";

function ToggleGroupItem({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroup.Item> & ToggleGroupVariantProps) {
  const context = React.useContext(ToggleGroupContext);
  const resolvedVariant = variant ?? context.variant;
  return (
    <ToggleGroup.Item
      data-slot="toggle-group-item"
      className={cn(
        resolvedVariant === "segmented"
          ? [
              segmentedItemClasses,
              "disabled:pointer-events-none disabled:opacity-50",
              segmentedItemOnClasses,
            ]
          : toggleVariants({ variant: resolvedVariant, size: size ?? context.size }),
        className,
      )}
      {...props}
    />
  );
}
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroupRoot as ToggleGroup, ToggleGroupItem };
export type { ToggleGroupVariant };
