"use client";

import * as React from "react";
import { AspectRatio } from "radix-ui";
import { cn } from "../lib/utils";

const AspectRatioRoot = React.forwardRef<
  React.ComponentRef<typeof AspectRatio.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatio.Root>
>(({ className, ...props }, ref) => (
  <AspectRatio.Root
    ref={ref}
    className={cn("relative w-full overflow-hidden", className)}
    {...props}
  />
));
AspectRatioRoot.displayName = "AspectRatio";

export { AspectRatioRoot as AspectRatio };
