
import React, { useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import { cn } from "@hilum/ui";

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border border-taupe-100", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-taupe-100 bg-white px-5 py-3">
        <div>
          <p className="subheading text-taupe-900">{title}</p>
          {description && (
            <p className="caption mt-0.5 text-taupe-400">{description}</p>
          )}
        </div>
        <button
          onClick={() => setShowCode(!showCode)}
          className={cn(
            "flex h-7 items-center gap-1.5 rounded-md px-2.5 caption font-medium transition-colors",
            showCode
              ? "bg-taupe-900 text-white"
              : "text-taupe-400 hover:bg-taupe-100 hover:text-taupe-700"
          )}
        >
          <Code2 size={12} />
          Code
        </button>
      </div>

      {/* Preview area — dot grid */}
      <div
        className={cn(
          "flex min-h-32 flex-wrap items-center justify-center gap-3 p-8",
          "bg-taupe-50",
          previewClassName
        )}
      >
        {children}
      </div>

      {/* Code panel */}
      {showCode && (
        <div className="relative border-t border-taupe-100">
          <button
            onClick={handleCopy}
            className="absolute right-3 top-3 z-10 flex h-7 items-center gap-1.5 rounded-md bg-taupe-800 px-2.5 text-xs font-medium text-taupe-300 transition-colors hover:bg-taupe-700 hover:text-white"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
          <pre className="overflow-x-auto bg-taupe-950 px-5 py-5 caption leading-relaxed">
            <code className="font-mono text-taupe-300">{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
