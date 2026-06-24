import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Callout } from "./callout";
import { Switch } from "./switch";
import { cn } from "../lib/utils";

function normalizeUrlHandle(value: string): string {
  return String(value || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
}

function urlResourcePath(prefix: string, handle: string): string {
  const cleanPrefix = normalizeUrlHandle(prefix);
  const cleanHandle = normalizeUrlHandle(handle);
  if (!cleanPrefix || !cleanHandle) return "";
  return `/${cleanPrefix}/${cleanHandle}`;
}

function hasUrlHandleChanged(originalHandle?: string, nextHandle?: string): boolean {
  const original = normalizeUrlHandle(originalHandle || "");
  const next = normalizeUrlHandle(nextHandle || "");
  return Boolean(original && next && original !== next);
}

interface UrlRedirectPromptProps {
  originalHandle?: string;
  nextHandle?: string;
  pathPrefix: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  switchLabel?: string;
  className?: string;
}

function UrlRedirectPrompt({
  originalHandle,
  nextHandle,
  pathPrefix,
  checked,
  onCheckedChange,
  title = "Create URL redirect",
  description,
  switchLabel = "Create URL redirect",
  className,
}: UrlRedirectPromptProps) {
  if (!hasUrlHandleChanged(originalHandle, nextHandle)) return null;

  const fromPath = urlResourcePath(pathPrefix, originalHandle || "");
  const toPath = urlResourcePath(pathPrefix, nextHandle || "");
  const calloutProps = className ? { className } : {};

  return (
    <Callout
      tone="warning"
      compact
      icon={<ArrowRight aria-hidden="true" />}
      title={title}
      actions={
        <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={switchLabel} />
      }
      {...calloutProps}
    >
      {description || (
        <p className="body-sm text-pretty text-muted-foreground">
          Preserve search rankings and old links by redirecting{" "}
          <span className="font-mono text-foreground">{fromPath}</span> to{" "}
          <span className="font-mono text-foreground">{toPath}</span>.
        </p>
      )}
    </Callout>
  );
}

UrlRedirectPrompt.displayName = "UrlRedirectPrompt";

export {
  UrlRedirectPrompt,
  hasUrlHandleChanged,
  normalizeUrlHandle,
  urlResourcePath,
};
export type { UrlRedirectPromptProps };
