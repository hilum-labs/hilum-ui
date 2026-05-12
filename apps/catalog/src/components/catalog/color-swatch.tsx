
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@hilum/ui";

interface ColorSwatchProps {
  name: string;
  hex: string;
  usage?: string;
  lightText?: boolean;
  size?: "sm" | "md";
}

export function ColorSwatch({
  name,
  hex,
  usage,
  lightText = true,
  size = "md",
}: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button onClick={handleCopy} className="group flex flex-col gap-2 text-left">
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-lg transition-all group-hover:ring-2 group-hover:ring-taupe-900/10 group-hover:ring-offset-2",
          size === "md" ? "h-14" : "h-9"
        )}
        style={{ backgroundColor: hex }}
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100",
            lightText ? "text-white" : "text-taupe-900"
          )}
        >
          {copied ? (
            <Check size={14} />
          ) : (
            <span className="caption-xs font-semibold tracking-wide">COPY</span>
          )}
        </div>
      </div>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-semibold text-taupe-700">{name}</p>
        <p className="font-mono caption-xs text-taupe-400">{hex}</p>
        {usage && (
          <p className="mt-0.5 caption-xs leading-tight text-taupe-300">{usage}</p>
        )}
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Semantic token row                                                  */
/* ------------------------------------------------------------------ */

interface TokenRowProps {
  token: string;
  value: string;
  hex: string;
  usage: string;
  lightText?: boolean;
}

export function TokenRow({ token, value, hex, usage, lightText = true }: TokenRowProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`var(--${token})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left transition-colors hover:bg-taupe-50"
    >
      {/* Color dot */}
      <div
        className="size-6 shrink-0 rounded-md border border-taupe-100"
        style={{ backgroundColor: hex }}
      />
      {/* Token name */}
      <div className="min-w-0 flex-1">
        <p className="font-mono text-xs font-medium text-taupe-900">--{token}</p>
        <p className="caption-xs text-taupe-400">{usage}</p>
      </div>
      {/* Value */}
      <span className="shrink-0 rounded bg-taupe-100 px-2 py-0.5 font-mono caption-xs text-taupe-600">
        {value}
      </span>
      {/* Copy feedback */}
      <span className="w-12 shrink-0 text-right caption-xs font-medium text-taupe-300 opacity-0 transition-opacity group-hover:opacity-100">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}
