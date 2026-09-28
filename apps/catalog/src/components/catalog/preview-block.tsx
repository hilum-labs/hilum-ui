import React, { useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { cn } from "@hilum/ui";
import { tokens } from "@hilum/ui/tokens";
import { slugifyDocAnchor } from "@/lib/catalog-docs";

/**
 * Sections whose demo content is authored against the light palette (hard-coded
 * ground/white classes). Their previews are pinned to the light theme so they
 * stay legible when the catalog chrome is dark.
 */
const LIGHT_ONLY_SECTIONS = ["/marketing", "/ecommerce", "/application-ui", "/blocks"];

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());

/** Light semantic + surface custom properties, re-declared on the preview so
 *  token-driven components inside it resolve to light values too. */
const LIGHT_THEME_VARS = (() => {
  const vars: Record<string, string> = { colorScheme: "light" };
  for (const [k, v] of Object.entries(tokens.semantic.light)) vars[`--${kebab(k)}`] = v;
  tokens.surfaces.light.bg.forEach((v, i) => (vars[`--surface-${i + 1}`] = v));
  tokens.surfaces.light.shadow.forEach((v, i) => (vars[`--surface-shadow-${i + 1}`] = v));
  return vars as React.CSSProperties;
})();

interface PreviewBlockProps {
  title: string;
  description?: string;
  code: string;
  children: React.ReactNode;
  className?: string;
  previewClassName?: string;
}

export function PreviewBlock({
  title,
  description,
  code,
  children,
  className,
  previewClassName,
}: PreviewBlockProps) {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const anchorId = slugifyDocAnchor(title);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const lightOnly = LIGHT_ONLY_SECTIONS.some((section) => pathname.startsWith(section));

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border", className)}>
      {/* Header */}
      <div
        id={anchorId}
        className="flex items-center justify-between border-b border-border bg-background px-5 py-3 scroll-mt-6"
      >
        <div>
          <p className="subheading text-foreground">{title}</p>
          {description && <p className="caption mt-0.5 text-muted-foreground">{description}</p>}
        </div>
        <button
          onClick={() => setShowCode(!showCode)}
          className={cn(
            "flex h-7 items-center gap-1.5 rounded-md px-2.5 caption font-medium transition-colors",
            showCode
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <Code2 size={12} />
          Code
        </button>
      </div>

      {/* Preview area */}
      <div
        data-theme={lightOnly ? "light" : undefined}
        style={lightOnly ? LIGHT_THEME_VARS : undefined}
        className={cn(
          "flex min-h-32 min-w-0 flex-wrap items-center justify-center gap-3 overflow-x-auto p-4 sm:p-8",
          "bg-background text-foreground",
          previewClassName,
        )}
      >
        {children}
      </div>

      {/* Code panel */}
      {showCode && (
        <div className="relative border-t border-border">
          <button
            onClick={handleCopy}
            className="absolute right-3 top-3 z-10 flex h-7 items-center gap-1.5 rounded-md bg-ground-800 px-2.5 text-xs font-medium text-ground-300 transition-colors hover:bg-ground-700 hover:text-white"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre className="overflow-x-auto bg-ground-950 px-5 py-5 caption leading-relaxed">
            <code className="font-mono text-ground-300">{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
