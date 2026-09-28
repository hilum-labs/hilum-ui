import * as React from "react";
import { ArrowRight } from "lucide-react";
import { Callout } from "./callout";
import { Switch } from "./switch";

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

/** Localizable strings. Every entry has an English default. */
interface UrlRedirectPromptLabels {
  /** Callout title. */
  title: React.ReactNode;
  /** Accessible name of the redirect switch. */
  switchLabel: string;
  /** Default body copy; receives the normalized `/prefix/handle` paths, which
   *  the default wraps in `<span>`s. */
  description: (fromPath: React.ReactNode, toPath: React.ReactNode) => React.ReactNode;
}

const DEFAULT_LABELS: UrlRedirectPromptLabels = {
  title: "Create URL redirect",
  switchLabel: "Create URL redirect",
  description: (fromPath, toPath) => (
    <>
      Preserve search rankings and old links by redirecting {fromPath} to {toPath}.
    </>
  ),
};

interface UrlRedirectPromptProps {
  ref?: React.Ref<HTMLDivElement>;
  originalHandle?: string;
  nextHandle?: string;
  pathPrefix: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  switchLabel?: string;
  /** Override the built-in English strings. `title` / `description` /
   *  `switchLabel` props take precedence over these. */
  labels?: Partial<UrlRedirectPromptLabels>;
  className?: string;
}

function UrlRedirectPrompt({
  originalHandle,
  nextHandle,
  pathPrefix,
  checked,
  onCheckedChange,
  title,
  description,
  switchLabel,
  labels: labelsProp,
  className,
  ref,
}: UrlRedirectPromptProps) {
  if (!hasUrlHandleChanged(originalHandle, nextHandle)) return null;

  const fromPath = urlResourcePath(pathPrefix, originalHandle || "");
  const toPath = urlResourcePath(pathPrefix, nextHandle || "");
  const calloutProps = className ? { className } : {};
  const labels = { ...DEFAULT_LABELS, ...labelsProp };

  return (
    <Callout
      ref={ref}
      data-slot="url-redirect-prompt"
      tone="warning"
      compact
      icon={<ArrowRight aria-hidden="true" className="rtl:-scale-x-100" />}
      title={title ?? labels.title}
      actions={
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label={switchLabel ?? labels.switchLabel}
        />
      }
      {...calloutProps}
    >
      {description || (
        <p className="body-sm text-pretty text-muted-foreground">
          {labels.description(
            <span className="font-mono text-foreground" dir="ltr">
              {fromPath}
            </span>,
            <span className="font-mono text-foreground" dir="ltr">
              {toPath}
            </span>,
          )}
        </p>
      )}
    </Callout>
  );
}

UrlRedirectPrompt.displayName = "UrlRedirectPrompt";

export {
  UrlRedirectPrompt,
  DEFAULT_LABELS as URL_REDIRECT_PROMPT_DEFAULT_LABELS,
  hasUrlHandleChanged,
  normalizeUrlHandle,
  urlResourcePath,
};
export type { UrlRedirectPromptProps, UrlRedirectPromptLabels };
