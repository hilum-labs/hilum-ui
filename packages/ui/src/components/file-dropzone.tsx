"use client";

import * as React from "react";
import { File as FileIcon, Upload } from "lucide-react";
import { Spinner } from "./spinner";
import { cn } from "../lib/utils";

type FileDropzoneSelectedFile = Pick<File, "name" | "size">;

interface FileDropzoneProps extends Omit<
  React.HTMLAttributes<HTMLLabelElement>,
  "children" | "onChange" | "onDrop" | "onDragOver" | "onDragLeave"
> {
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
  label?: React.ReactNode;
  activeLabel?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  selectedFiles?: readonly FileDropzoneSelectedFile[] | null;
  inputRef?: React.Ref<HTMLInputElement>;
  inputClassName?: string;
  inputName?: string;
  onFilesSelected?: (files: File[]) => void;
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, unitIndex);

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function getFileSummary(files: readonly FileDropzoneSelectedFile[]) {
  if (files.length === 0) return null;
  if (files.length === 1) return `${files[0].name} (${formatFileSize(files[0].size)})`;
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  return `${files.length} files selected (${formatFileSize(totalSize)})`;
}

function FileDropzone({
  accept,
  multiple,
  disabled,
  loading,
  loadingText = "Uploading...",
  label = "Drag files here or click to upload",
  activeLabel = "Drop files to upload",
  description,
  icon,
  selectedFiles,
  inputRef,
  inputClassName,
  inputName,
  onFilesSelected,
  className,
  id,
  tabIndex,
  onKeyDown,
  onClick,
  ...props
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const inputId = React.useId();
  const resolvedId = id ?? inputId;
  const fileSummary = getFileSummary(selectedFiles ?? []);
  const isUnavailable = Boolean(disabled || loading);

  const emitFiles = React.useCallback(
    (fileList: FileList | null) => {
      if (!fileList || isUnavailable) return;
      onFilesSelected?.(Array.from(fileList));
    },
    [isUnavailable, onFilesSelected],
  );

  return (
    <label
      htmlFor={resolvedId}
      role="button"
      tabIndex={isUnavailable ? -1 : (tabIndex ?? 0)}
      aria-disabled={isUnavailable || undefined}
      data-dragging={isDragging ? "true" : "false"}
      className={cn(
        "group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-natural",
        "transition-[background-color,border-color,box-shadow,scale] duration-150",
        "hover:border-brand-primary/50 hover:bg-muted/40 active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/30",
        "data-[dragging=true]:border-brand-primary data-[dragging=true]:bg-brand-secondary/25",
        isUnavailable && "pointer-events-none cursor-not-allowed opacity-60 active:scale-100",
        className,
      )}
      onDragOver={(event) => {
        event.preventDefault();
        if (!isUnavailable) setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setIsDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        emitFiles(event.dataTransfer.files);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || isUnavailable) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          document.getElementById(resolvedId)?.click();
        }
      }}
      onClick={(event) => {
        if (isUnavailable) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...props}
    >
      <input
        ref={inputRef}
        id={resolvedId}
        name={inputName}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={isUnavailable}
        className={cn("sr-only", inputClassName)}
        onChange={(event) => emitFiles(event.currentTarget.files)}
      />
      <span
        className={cn(
          "mb-3 flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground",
          "transition-[background-color,color,scale] duration-150 group-hover:bg-brand-secondary/35 group-hover:text-foreground",
          "group-data-[dragging=true]:bg-brand-secondary group-data-[dragging=true]:text-foreground",
        )}
        aria-hidden="true"
      >
        {loading ? <Spinner size="sm" /> : (icon ?? <Upload className="size-5" />)}
      </span>
      <span className="body-sm font-medium text-foreground text-balance">
        {loading ? loadingText : isDragging ? activeLabel : fileSummary ? fileSummary : label}
      </span>
      {description && (
        <span className="caption mt-1 max-w-md text-pretty text-muted-foreground">
          {description}
        </span>
      )}
      {fileSummary && !loading && (
        <span className="caption mt-2 inline-flex min-h-7 max-w-full items-center gap-1 rounded-full bg-muted px-2.5 text-muted-foreground">
          <FileIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="min-w-0 truncate">{multiple ? "Ready to upload" : "Selected"}</span>
        </span>
      )}
    </label>
  );
}

FileDropzone.displayName = "FileDropzone";

export { FileDropzone, formatFileSize };
export type { FileDropzoneProps, FileDropzoneSelectedFile };
