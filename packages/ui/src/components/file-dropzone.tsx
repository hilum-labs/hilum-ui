"use client";

import * as React from "react";
import { File as FileIcon, Upload } from "lucide-react";
import { Spinner } from "./spinner";
import { cn } from "../lib/utils";

type FileDropzoneSelectedFile = Pick<File, "name" | "size">;

interface FileDropzoneLabels {
  /** Chip under the summary when `multiple`. */
  readyToUpload: string;
  /** Chip under the summary for a single file. */
  selected: string;
  /** Summary for several files; `size` is pre-formatted (e.g. "2.4 MB"). */
  filesSelected: (count: number, size: string) => string;
}

const DEFAULT_LABELS: FileDropzoneLabels = {
  readyToUpload: "Ready to upload",
  selected: "Selected",
  filesSelected: (count, size) => `${count} files selected (${size})`,
};

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
  /** Override the English UI strings (i18n). */
  labels?: Partial<FileDropzoneLabels>;
  ref?: React.Ref<HTMLLabelElement> | undefined;
}

function formatFileSize(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, unitIndex);

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function getFileSummary(
  files: readonly FileDropzoneSelectedFile[],
  filesSelected: FileDropzoneLabels["filesSelected"],
) {
  const [first] = files;
  if (!first) return null;
  if (files.length === 1) return `${first.name} (${formatFileSize(first.size)})`;
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  return filesSelected(files.length, formatFileSize(totalSize));
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
  labels: labelsProp,
  ...props
}: FileDropzoneProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [isDragging, setIsDragging] = React.useState(false);
  const inputId = React.useId();
  const resolvedId = id ?? inputId;
  const fileSummary = getFileSummary(selectedFiles ?? [], labels.filesSelected);
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
      data-slot="file-dropzone"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role -- label for the hidden file input, made a focusable button with Enter/Space handling (onKeyDown) so it also works as a drop target
      role="button"
      tabIndex={isUnavailable ? -1 : (tabIndex ?? 0)}
      aria-disabled={isUnavailable || undefined}
      data-dragging={isDragging ? "true" : "false"}
      className={cn(
        "group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-natural",
        "transition-[background-color,border-color,box-shadow,scale] duration-150",
        "hover:border-brand-primary/50 hover:bg-muted/40 active:scale-[0.96]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
          <span className="min-w-0 truncate">
            {multiple ? labels.readyToUpload : labels.selected}
          </span>
        </span>
      )}
    </label>
  );
}

FileDropzone.displayName = "FileDropzone";

export { FileDropzone, formatFileSize, DEFAULT_LABELS as FILE_DROPZONE_DEFAULT_LABELS };
export type { FileDropzoneProps, FileDropzoneSelectedFile, FileDropzoneLabels };
