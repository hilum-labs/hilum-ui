"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

interface MobileDrawerProps extends React.ComponentProps<typeof Sheet> {
  title: React.ReactNode;
  description?: React.ReactNode;
  triggerLabel?: string;
  children: React.ReactNode;
}

function MobileDrawer({
  title,
  description,
  triggerLabel = "Open menu",
  children,
  ...props
}: MobileDrawerProps) {
  return (
    <Sheet {...props}>
      <SheetTrigger asChild>
        <Button type="button" variant="ghost" size="icon" aria-label={triggerLabel}>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[min(22rem,calc(100vw-2rem))] p-4">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}

MobileDrawer.displayName = "MobileDrawer";

export { MobileDrawer };
export type { MobileDrawerProps };
