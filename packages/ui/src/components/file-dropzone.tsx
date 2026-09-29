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
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "onChange" | "onDrop" | "onDragOver" | "onDragLeave" | "onPaste"
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
  /** The drop area (a `<div>` since 4.4.4; the browse control is a `<button>` inside it). */
  ref?: React.Ref<HTMLDivElement> | undefined;
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

/**
 * Drop area for files. The area itself is a plain container (drop target and
 * paste target); the one interactive element is the `<button>` carrying the
 * label, stretched over the whole area, which opens the hidden file input.
 * Drag files onto it, click anywhere in it, press Enter/Space on the button,
 * or paste files (⌘/Ctrl+V) while it has focus.
 */
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
  labels: labelsProp,
  ref,
  ...props
}: FileDropzoneProps) {
  const labels = { ...DEFAULT_LABELS, ...labelsProp };
  const [isDragging, setIsDragging] = React.useState(false);
  const baseId = React.useId();
  const resolvedId = id ?? baseId;
  const descriptionId = `${baseId}-description`;
  const summaryId = `${baseId}-summary`;
  const localInputRef = React.useRef<HTMLInputElement>(null);
  const fileSummary = getFileSummary(selectedFiles ?? [], labels.filesSelected);
  const isUnavailable = Boolean(disabled || loading);
  const showSummaryChip = Boolean(fileSummary && !loading);
  const describedBy = [description && descriptionId, showSummaryChip && summaryId]
    .filter(Boolean)
    .join(" ");

  const setInputRef = React.useCallback(
    (node: HTMLInputElement | null) => {
      localInputRef.current = node;
      if (typeof inputRef === "function") inputRef(node);
      else if (inputRef) (inputRef as React.RefObject<HTMLInputElement | null>).current = node;
    },
    [inputRef],
  );

  const emitFiles = React.useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0 || isUnavailable) return;
      onFilesSelected?.(Array.from(fileList));
    },
    [isUnavailable, onFilesSelected],
  );

  return (
    <div
      ref={ref}
      data-slot="file-dropzone"
      data-dragging={isDragging ? "true" : "false"}
      data-disabled={isUnavailable || undefined}
      // Dimmed text of an unavailable control is exempt from contrast (WCAG 1.4.3).
      aria-disabled={isUnavailable || undefined}
      className={cn(
        "group relative flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-6 text-center shadow-natural",
        "transition-[background-color,border-color,box-shadow,scale] duration-150",
        "hover:border-brand-primary/50 hover:bg-muted/40 has-[button:active]:scale-[0.96]",
        "data-[dragging=true]:border-brand-primary data-[dragging=true]:bg-brand-secondary/25",
        isUnavailable && "cursor-not-allowed opacity-60 has-[button:active]:scale-100",
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
      onPaste={(event) => {
        if (!event.clipboardData?.files.length) return;
        event.preventDefault();
        emitFiles(event.clipboardData.files);
      }}
      {...props}
    >
      <input
        ref={setInputRef}
        id={resolvedId}
        name={inputName}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={isUnavailable}
        // The button below is the control; the input only opens the picker.
        tabIndex={-1}
        aria-hidden="true"
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
      <button
        type="button"
        data-slot="file-dropzone-button"
        tabIndex={tabIndex}
        aria-disabled={isUnavailable || undefined}
        {...(describedBy ? { "aria-describedby": describedBy } : {})}
        className={cn(
          "body-sm font-medium text-foreground text-balance outline-none",
          // Stretched over the whole area: a click anywhere opens the picker,
          // and the focus ring outlines the area.
          "after:absolute after:inset-0 after:rounded-xl after:content-['']",
          "focus-visible:after:ring-2 focus-visible:after:ring-ring",
          isUnavailable ? "cursor-not-allowed" : "cursor-pointer",
        )}
        onClick={() => {
          if (!isUnavailable) localInputRef.current?.click();
        }}
      >
        {loading ? loadingText : isDragging ? activeLabel : fileSummary ? fileSummary : label}
      </button>
      {description && (
        <span
          id={descriptionId}
          className="caption mt-1 max-w-md text-pretty text-muted-foreground"
        >
          {description}
        </span>
      )}
      {showSummaryChip && (
        <span className="caption mt-2 inline-flex min-h-7 max-w-full items-center gap-1 rounded-full bg-muted px-2.5 text-muted-foreground">
          <FileIcon className="size-3.5 shrink-0" aria-hidden="true" />
          <span id={summaryId} className="min-w-0 truncate">
            {multiple ? labels.readyToUpload : labels.selected}
          </span>
        </span>
      )}
    </div>
  );
}

FileDropzone.displayName = "FileDropzone";

export { FileDropzone, formatFileSize, DEFAULT_LABELS as FILE_DROPZONE_DEFAULT_LABELS };
export type { FileDropzoneProps, FileDropzoneSelectedFile, FileDropzoneLabels };
