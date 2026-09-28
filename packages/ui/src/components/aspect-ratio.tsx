"use client";

import * as React from "react";
import { AspectRatio } from "radix-ui";
import { cn } from "../lib/utils";

function AspectRatioRoot({ className, ...props }: React.ComponentProps<typeof AspectRatio.Root>) {
  return (
    <AspectRatio.Root
      data-slot="aspect-ratio"
      className={cn("relative w-full overflow-hidden", className)}
      {...props}
    />
  );
}
AspectRatioRoot.displayName = "AspectRatio";

export { AspectRatioRoot as AspectRatio };
