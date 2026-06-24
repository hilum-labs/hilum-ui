"use client";

import * as React from "react";
import { CircleHelp } from "lucide-react";
import { cn } from "../lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

interface HelpTooltipProps {
  text: string;
  learnMoreUrl?: string;
  learnMoreURL?: string;
  placement?: "top" | "right" | "bottom" | "left";
  className?: string;
  contentClassName?: string;
}

function HelpTooltip({
  text,
  learnMoreUrl,
  learnMoreURL,
  placement = "top",
  className,
  contentClassName,
}: HelpTooltipProps) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLSpanElement>(null);
  const url = learnMoreUrl ?? learnMoreURL;
  const body = text.length > 120 ? `${text.slice(0, 117)}...` : text;

  React.useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <span ref={rootRef} className={cn("inline-flex align-middle", className)}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn(
                "relative ml-1 inline-flex size-5 items-center justify-center rounded-full text-muted-foreground",
                "transition-[color,scale] duration-150 hover:text-foreground active:scale-[0.96]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
                "before:absolute before:-inset-2.5 before:content-['']",
              )}
              aria-label="Help"
              onClick={(event) => {
                event.preventDefault();
                setOpen((current) => !current);
              }}
            >
              <CircleHelp className="size-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side={placement}
            collisionPadding={12}
            className={cn("max-w-xs text-sm", contentClassName)}
          >
            <p className="text-pretty">{body}</p>
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-xs font-medium text-brand-primary underline-offset-4 hover:underline"
              >
                Learn more
              </a>
            )}
          </TooltipContent>
        </span>
      </Tooltip>
    </TooltipProvider>
  );
}

HelpTooltip.displayName = "HelpTooltip";

export { HelpTooltip, type HelpTooltipProps };
