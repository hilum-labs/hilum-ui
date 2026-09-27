"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../lib/utils";

interface CodeBlockProps {
  /** Code as a string (copied verbatim). */
  children: string;
  /** Optional language / filename label in the header. */
  language?: string;
  /** Max height before the block scrolls, e.g. 320 or "20rem". */
  maxHeight?: number | string;
  /** Show a copy button. Default: true. */
  copy?: boolean;
  /** Soft-wrap long lines instead of scrolling horizontally. Default: false. */
  wrap?: boolean;
  className?: string;
}

/**
 * Styled, scrollable `<pre>` with copy-to-clipboard — for API keys, webhook
 * payloads, snippets and logs. No syntax highlighting (bring your own).
 */
function CodeBlock({
  children,
  language,
  maxHeight,
  copy = true,
  wrap = false,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1500);
    return () => window.clearTimeout(id);
  }, [copied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      data-slot="code-block"
      className={cn(
        "relative min-w-0 overflow-hidden rounded-lg border border-border bg-muted text-foreground",
        className,
      )}
    >
      {(language || copy) && (
        <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-1.5">
          <span className="caption-sm font-mono text-muted-foreground">{language}</span>
          {copy && (
            <button
              type="button"
              onClick={onCopy}
              aria-label={copied ? "Copied" : "Copy code"}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copied ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Copy size={14} aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      )}
      <pre
        // Scrollable regions must be keyboard-focusable (axe scrollable-region-focusable).
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={0}
        className={cn(
          "overflow-auto p-3 font-mono text-xs leading-relaxed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          wrap ? "whitespace-pre-wrap break-words" : "whitespace-pre",
        )}
        style={
          maxHeight !== undefined
            ? { maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight }
            : undefined
        }
      >
        <code>{children}</code>
      </pre>
    </div>
  );
}

CodeBlock.displayName = "CodeBlock";

export { CodeBlock };
export type { CodeBlockProps };
