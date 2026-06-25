"use client";

import * as React from "react";
import {
  AlignLeft,
  Bold,
  FileText,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListOrdered,
  Minus,
  Strikethrough,
  Underline,
  XCircle,
} from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { cn } from "../lib/utils";

type RichTextImageUrlHandler = () => string | null | undefined | Promise<string | null | undefined>;

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string | number;
  id?: string;
  "aria-label"?: string;
  className?: string;
  editorClassName?: string;
  toolbarClassName?: string;
  onRequestImageUrl?: RichTextImageUrlHandler;
}

interface ToolbarButtonConfig {
  icon: React.ComponentType<{ className?: string }>;
  command: string;
  title: string;
  value?: string;
}

function wrapSelectionInline(tag: string, attrs?: Record<string, string>) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const wrapper = document.createElement(tag);

  Object.entries(attrs ?? {}).forEach(([key, value]) => {
    wrapper.setAttribute(key, value);
  });

  wrapper.appendChild(range.extractContents());
  range.insertNode(wrapper);

  selection.removeAllRanges();
  const nextRange = document.createRange();
  nextRange.selectNodeContents(wrapper);
  selection.addRange(nextRange);
}

function formatBlock(tag: string) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  let block = range.startContainer as HTMLElement;

  if (block.nodeType === Node.TEXT_NODE) block = block.parentElement as HTMLElement;
  while (block && block.isContentEditable !== true) {
    const parent = block.parentElement;
    if (!parent || parent.getAttribute("contenteditable") === "true") break;
    block = parent;
  }

  const nextBlock = document.createElement(tag);
  if (block && block.getAttribute("contenteditable") !== "true") {
    nextBlock.innerHTML = block.innerHTML;
    block.replaceWith(nextBlock);
  } else {
    nextBlock.appendChild(range.extractContents());
    range.insertNode(nextBlock);
  }

  selection.removeAllRanges();
  const nextRange = document.createRange();
  nextRange.selectNodeContents(nextBlock);
  selection.addRange(nextRange);
}

function insertList(ordered: boolean) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const fragment = range.extractContents();
  const list = document.createElement(ordered ? "ol" : "ul");
  const children = Array.from(fragment.childNodes);

  if (children.length === 0) {
    const item = document.createElement("li");
    item.innerHTML = "\u200B";
    list.appendChild(item);
  } else {
    children.forEach((child) => {
      const item = document.createElement("li");
      item.appendChild(child);
      list.appendChild(item);
    });
  }

  range.insertNode(list);
  selection.removeAllRanges();
  const nextRange = document.createRange();
  nextRange.selectNodeContents(list);
  selection.addRange(nextRange);
}

function insertElement(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  range.deleteContents();
  range.insertNode(element);

  const nextRange = document.createRange();
  nextRange.setStartAfter(element);
  nextRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(nextRange);
}

function removeFormat() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

  const range = selection.getRangeAt(0);
  const fragment = range.extractContents();
  const cleaned = document.createDocumentFragment();

  Array.from(fragment.childNodes).forEach((child) => {
    cleaned.appendChild(document.createTextNode(child.textContent ?? ""));
  });

  range.insertNode(cleaned);
}

function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = "200px",
  id,
  "aria-label": ariaLabel,
  className,
  editorClassName,
  toolbarClassName,
  onRequestImageUrl,
}: RichTextEditorProps) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const savedRangeRef = React.useRef<Range | null>(null);
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor || document.activeElement === editor || editor.innerHTML === value) return;
    editor.innerHTML = value;
  }, [value]);

  const emitChange = React.useCallback(() => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const saveSelection = React.useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      savedRangeRef.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = React.useCallback(() => {
    const range = savedRangeRef.current;
    const selection = window.getSelection();
    if (!range || !selection) return;
    selection.removeAllRanges();
    selection.addRange(range);
    savedRangeRef.current = null;
  }, []);

  const runCommand = React.useCallback(
    (command: string, commandValue?: string) => {
      editorRef.current?.focus();

      switch (command) {
        case "bold":
          wrapSelectionInline("strong");
          break;
        case "italic":
          wrapSelectionInline("em");
          break;
        case "underline":
          wrapSelectionInline("u");
          break;
        case "strikeThrough":
          wrapSelectionInline("s");
          break;
        case "formatBlock":
          if (commandValue) formatBlock(commandValue);
          break;
        case "insertUnorderedList":
          insertList(false);
          break;
        case "insertOrderedList":
          insertList(true);
          break;
        case "insertHorizontalRule":
          insertElement(document.createElement("hr"));
          break;
        case "removeFormat":
          removeFormat();
          break;
        default:
          break;
      }

      emitChange();
    },
    [emitChange],
  );

  const insertLink = React.useCallback(() => {
    const url = linkUrl.trim();
    if (!url) return;

    restoreSelection();
    wrapSelectionInline("a", { href: url });
    editorRef.current?.focus();
    setLinkUrl("");
    setShowLinkInput(false);
    emitChange();
  }, [emitChange, linkUrl, restoreSelection]);

  const insertImage = React.useCallback(async () => {
    const url =
      (await onRequestImageUrl?.()) ??
      (typeof window !== "undefined" ? window.prompt("Image URL:") : null);

    if (!url) return;

    const image = document.createElement("img");
    image.src = url;
    image.alt = "";
    editorRef.current?.focus();
    insertElement(image);
    emitChange();
  }, [emitChange, onRequestImageUrl]);

  const toolbarGroups: ToolbarButtonConfig[][] = [
    [
      { icon: Bold, command: "bold", title: "Bold (Ctrl+B)" },
      { icon: Italic, command: "italic", title: "Italic (Ctrl+I)" },
      { icon: Underline, command: "underline", title: "Underline (Ctrl+U)" },
      { icon: Strikethrough, command: "strikeThrough", title: "Strikethrough" },
    ],
    [
      { icon: Heading1, command: "formatBlock", title: "Heading 1", value: "h1" },
      { icon: Heading2, command: "formatBlock", title: "Heading 2", value: "h2" },
      { icon: Heading3, command: "formatBlock", title: "Heading 3", value: "h3" },
    ],
    [
      { icon: List, command: "insertUnorderedList", title: "Bullet list" },
      { icon: ListOrdered, command: "insertOrderedList", title: "Numbered list" },
      { icon: AlignLeft, command: "formatBlock", title: "Blockquote", value: "blockquote" },
      { icon: FileText, command: "formatBlock", title: "Code block", value: "pre" },
    ],
  ];

  const renderToolbarButton = ({
    icon: Icon,
    command,
    title,
    value: commandValue,
  }: ToolbarButtonConfig) => (
    <Button
      key={`${command}-${title}`}
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 text-muted-foreground hover:text-foreground"
      title={title}
      aria-label={title}
      onMouseDown={(event) => {
        event.preventDefault();
        runCommand(command, commandValue);
      }}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Button>
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-natural",
        "focus-within:border-brand-primary/50 focus-within:ring-2 focus-within:ring-brand-primary/25",
        className,
      )}
      data-slot="rich-text-editor"
    >
      <div
        className={cn(
          "flex min-w-0 flex-wrap items-center gap-1 border-b border-border bg-muted/40 p-1.5",
          toolbarClassName,
        )}
        role="toolbar"
        aria-label="Text formatting"
      >
        {toolbarGroups.map((group, index) => (
          <React.Fragment key={`toolbar-group-${index}`}>
            {index > 0 && <Separator orientation="vertical" className="mx-1 h-6" />}
            {group.map(renderToolbarButton)}
          </React.Fragment>
        ))}
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hover:text-foreground"
          title="Insert link"
          aria-label="Insert link"
          onMouseDown={(event) => {
            event.preventDefault();
            saveSelection();
            setShowLinkInput((current) => !current);
          }}
        >
          <Link className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hover:text-foreground"
          title="Insert image"
          aria-label="Insert image"
          onMouseDown={(event) => {
            event.preventDefault();
            void insertImage();
          }}
        >
          <Image className="size-4" aria-hidden="true" />
        </Button>
        {renderToolbarButton({
          icon: Minus,
          command: "insertHorizontalRule",
          title: "Horizontal rule",
        })}
        {renderToolbarButton({
          icon: XCircle,
          command: "removeFormat",
          title: "Clear formatting",
        })}
      </div>

      {showLinkInput && (
        <div className="flex min-w-0 flex-col gap-2 border-b border-border bg-muted/60 p-2 sm:flex-row">
          <Input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="https://..."
            className="h-10 flex-1 bg-background"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                insertLink();
              }
            }}
            autoFocus
            aria-label="Link URL"
          />
          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <Button type="button" size="sm" className="h-10" onClick={insertLink}>
              Insert
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-10"
              onClick={() => setShowLinkInput(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div
        ref={editorRef}
        id={id}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel ?? "Content editor"}
        className={cn(
          "rich-text-editor-content min-w-0 px-4 py-3 text-sm leading-6 text-foreground outline-none",
          "empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
          editorClassName,
        )}
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={emitChange}
        onBlur={emitChange}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      <style>{`
        .rich-text-editor-content h1 { font-size: 1.5rem; font-weight: 700; line-height: 1.2; margin: 0.75rem 0 0.5rem; text-wrap: balance; }
        .rich-text-editor-content h2 { font-size: 1.25rem; font-weight: 650; line-height: 1.25; margin: 0.75rem 0 0.5rem; text-wrap: balance; }
        .rich-text-editor-content h3 { font-size: 1.1rem; font-weight: 650; line-height: 1.3; margin: 0.5rem 0 0.25rem; text-wrap: balance; }
        .rich-text-editor-content blockquote { border-left: 3px solid var(--border); color: var(--muted-foreground); margin: 0.75rem 0; padding-left: 1rem; text-wrap: pretty; }
        .rich-text-editor-content pre { background: var(--muted); border-radius: 0.5rem; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.85rem; margin: 0.75rem 0; overflow-x: auto; padding: 0.75rem; }
        .rich-text-editor-content a { color: var(--brand-primary); text-decoration: underline; text-underline-offset: 3px; }
        .rich-text-editor-content img { border-radius: 0.5rem; box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1); height: auto; margin: 0.5rem 0; max-width: 100%; }
        .dark .rich-text-editor-content img { box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1); }
        .rich-text-editor-content hr { border: none; border-top: 1px solid var(--border); margin: 1rem 0; }
        .rich-text-editor-content ul, .rich-text-editor-content ol { margin: 0.5rem 0; padding-left: 1.5rem; }
        .rich-text-editor-content li { margin: 0.25rem 0; }
      `}</style>
    </div>
  );
}

RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor };
export type { RichTextEditorProps, RichTextImageUrlHandler };
