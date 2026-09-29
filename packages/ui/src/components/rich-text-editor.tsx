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
import {
  isSafeImageUrl,
  isSafeUrl,
  plainTextToHtml,
  sanitizeRichTextHtml,
} from "../lib/sanitize-html";

type RichTextImageUrlHandler = () => string | null | undefined | Promise<string | null | undefined>;

/** Localizable strings. Every entry has an English default. */
interface RichTextEditorLabels {
  /** Accessible name of the toolbar. */
  toolbar: string;
  bold: string;
  italic: string;
  underline: string;
  strikethrough: string;
  heading1: string;
  heading2: string;
  heading3: string;
  bulletList: string;
  numberedList: string;
  blockquote: string;
  codeBlock: string;
  insertLink: string;
  insertImage: string;
  horizontalRule: string;
  clearFormatting: string;
  /** Accessible name of the link URL field. */
  linkUrl: string;
  /** Placeholder of the link URL field. */
  linkUrlPlaceholder: string;
  /** Confirm button of the link field. */
  insert: string;
  /** Cancel button of the link field. */
  cancel: string;
  /** `window.prompt` message used when `onRequestImageUrl` is not set. */
  imageUrlPrompt: string;
  /** Accessible name of the editable area when `aria-label` is not set. */
  editor: string;
}

const RICH_TEXT_EDITOR_DEFAULT_LABELS: RichTextEditorLabels = {
  toolbar: "Text formatting",
  bold: "Bold (Ctrl+B)",
  italic: "Italic (Ctrl+I)",
  underline: "Underline (Ctrl+U)",
  strikethrough: "Strikethrough",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  bulletList: "Bullet list",
  numberedList: "Numbered list",
  blockquote: "Blockquote",
  codeBlock: "Code block",
  insertLink: "Insert link",
  insertImage: "Insert image",
  horizontalRule: "Horizontal rule",
  clearFormatting: "Clear formatting",
  linkUrl: "Link URL",
  linkUrlPlaceholder: "https://...",
  insert: "Insert",
  cancel: "Cancel",
  imageUrlPrompt: "Image URL:",
  editor: "Content editor",
};

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
  /** Localizable strings; unspecified keys fall back to English. */
  labels?: Partial<RichTextEditorLabels>;
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

function insertHtmlAtRange(root: HTMLElement, html: string, range?: Range | null) {
  const selection = window.getSelection();
  let target = range ?? (selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null);
  if (!target || !root.contains(target.commonAncestorContainer)) {
    // No caret inside the editor — append at the end.
    target = document.createRange();
    target.selectNodeContents(root);
    target.collapse(false);
  }

  const template = document.createElement("template");
  template.innerHTML = html;
  const fragment = template.content;
  const last = fragment.lastChild;

  target.deleteContents();
  target.insertNode(fragment);

  if (selection) {
    const nextRange = document.createRange();
    if (last && last.parentNode) nextRange.setStartAfter(last);
    else nextRange.setStart(target.startContainer, target.startOffset);
    nextRange.collapse(true);
    selection.removeAllRanges();
    selection.addRange(nextRange);
  }
}

/** Caret position as a character offset into the editor's text content. */
function getCaretOffset(root: HTMLElement): number | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  const range = selection.getRangeAt(0);
  if (!root.contains(range.endContainer)) return null;
  const pre = document.createRange();
  pre.selectNodeContents(root);
  pre.setEnd(range.endContainer, range.endOffset);
  return pre.toString().length;
}

function setCaretOffset(root: HTMLElement, offset: number) {
  const selection = window.getSelection();
  if (!selection) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = offset;
  let node = walker.nextNode();
  const range = document.createRange();
  while (node) {
    const length = node.textContent?.length ?? 0;
    if (remaining <= length) {
      range.setStart(node, remaining);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }
    remaining -= length;
    node = walker.nextNode();
  }
  range.selectNodeContents(root);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

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
  labels: labelsProp,
}: RichTextEditorProps) {
  const labels = { ...RICH_TEXT_EDITOR_DEFAULT_LABELS, ...labelsProp };
  const editorRef = React.useRef<HTMLDivElement>(null);
  const savedRangeRef = React.useRef<Range | null>(null);
  const [showLinkInput, setShowLinkInput] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");

  // The last HTML we emitted through onChange. When the parent echoes it back
  // as `value`, the DOM already holds it — touching innerHTML would reset the
  // caret, so we skip.
  const lastEmittedRef = React.useRef<string | null>(null);

  // Controlled contentEditable: React never owns the children (no
  // dangerouslySetInnerHTML, which would re-apply markup on every render). We
  // write sanitized HTML imperatively, and only when the external value
  // actually differs from what is in the DOM.
  useIsomorphicLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (value === lastEmittedRef.current && editor.innerHTML === value) return;
    const safe = sanitizeRichTextHtml(value);
    if (editor.innerHTML === safe) return;
    const focused = document.activeElement === editor;
    const caret = focused ? getCaretOffset(editor) : null;
    editor.innerHTML = safe;
    lastEmittedRef.current = null;
    if (focused && caret != null) setCaretOffset(editor, caret);
  }, [value]);

  const emitChange = React.useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const html = editor.innerHTML;
    // Output is sanitized too, as defence in depth (e.g. markup that slipped in
    // via drag-and-drop or browser extensions).
    const safe = sanitizeRichTextHtml(html);
    if (safe !== html) {
      const caret = getCaretOffset(editor);
      editor.innerHTML = safe;
      if (caret != null) setCaretOffset(editor, caret);
    }
    lastEmittedRef.current = safe;
    onChange(safe);
  }, [onChange]);

  const handlePaste = React.useCallback(
    (event: React.ClipboardEvent<HTMLDivElement>) => {
      const editor = editorRef.current;
      if (!editor) return;
      event.preventDefault();
      const html = event.clipboardData.getData("text/html");
      const text = event.clipboardData.getData("text/plain");
      const safe = html ? sanitizeRichTextHtml(html) : plainTextToHtml(text);
      if (!safe) return;
      insertHtmlAtRange(editor, safe);
      emitChange();
    },
    [emitChange],
  );

  const handleDrop = React.useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const editor = editorRef.current;
      const data = event.dataTransfer;
      if (!editor || !data) return;
      const html = data.getData("text/html");
      const text = data.getData("text/plain");
      // Let files etc. fall through untouched; only intercept markup/text.
      if (!html && !text) return;
      event.preventDefault();
      const doc = document as Document & {
        caretRangeFromPoint?: (x: number, y: number) => Range | null;
      };
      const range = doc.caretRangeFromPoint?.(event.clientX, event.clientY) ?? null;
      insertHtmlAtRange(editor, html ? sanitizeRichTextHtml(html) : plainTextToHtml(text), range);
      emitChange();
    },
    [emitChange],
  );

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
    if (!url || !isSafeUrl(url)) return;

    restoreSelection();
    wrapSelectionInline("a", { href: url, rel: "noopener noreferrer" });
    editorRef.current?.focus();
    setLinkUrl("");
    setShowLinkInput(false);
    emitChange();
  }, [emitChange, linkUrl, restoreSelection]);

  const insertImage = React.useCallback(async () => {
    const url =
      (await onRequestImageUrl?.()) ??
      (typeof window !== "undefined" ? window.prompt(labels.imageUrlPrompt) : null);

    if (!url || !isSafeImageUrl(url)) return;

    const image = document.createElement("img");
    image.src = url;
    image.alt = "";
    editorRef.current?.focus();
    insertElement(image);
    emitChange();
  }, [emitChange, onRequestImageUrl, labels.imageUrlPrompt]);

  const toolbarGroups: ToolbarButtonConfig[][] = [
    [
      { icon: Bold, command: "bold", title: labels.bold },
      { icon: Italic, command: "italic", title: labels.italic },
      { icon: Underline, command: "underline", title: labels.underline },
      { icon: Strikethrough, command: "strikeThrough", title: labels.strikethrough },
    ],
    [
      { icon: Heading1, command: "formatBlock", title: labels.heading1, value: "h1" },
      { icon: Heading2, command: "formatBlock", title: labels.heading2, value: "h2" },
      { icon: Heading3, command: "formatBlock", title: labels.heading3, value: "h3" },
    ],
    [
      { icon: List, command: "insertUnorderedList", title: labels.bulletList },
      { icon: ListOrdered, command: "insertOrderedList", title: labels.numberedList },
      { icon: AlignLeft, command: "formatBlock", title: labels.blockquote, value: "blockquote" },
      { icon: FileText, command: "formatBlock", title: labels.codeBlock, value: "pre" },
    ],
  ];

  const renderToolbarButton = ({
    icon: Icon,
    command,
    title,
    value: commandValue,
  }: ToolbarButtonConfig) => (
    <Button
      key={`${command}-${commandValue ?? ""}`}
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
        aria-label={labels.toolbar}
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
          title={labels.insertLink}
          aria-label={labels.insertLink}
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
          title={labels.insertImage}
          aria-label={labels.insertImage}
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
          title: labels.horizontalRule,
        })}
        {renderToolbarButton({
          icon: XCircle,
          command: "removeFormat",
          title: labels.clearFormatting,
        })}
      </div>

      {showLinkInput && (
        <div className="flex min-w-0 flex-col gap-2 border-b border-border bg-muted/60 p-2 sm:flex-row">
          <Input
            type="url"
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder={labels.linkUrlPlaceholder}
            className="flex-1 bg-background"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                insertLink();
              }
            }}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- focuses the URL field when the link popover opens (dialog focus management)
            autoFocus
            aria-label={labels.linkUrl}
          />
          <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
            <Button type="button" size="lg" className="px-4" onClick={insertLink}>
              {labels.insert}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="px-4"
              onClick={() => setShowLinkInput(false)}
            >
              {labels.cancel}
            </Button>
          </div>
        </div>
      )}

      <div
        ref={editorRef}
        id={id}
        contentEditable
        tabIndex={0}
        role="textbox"
        aria-multiline="true"
        aria-label={ariaLabel ?? labels.editor}
        className={cn(
          "rich-text-editor-content min-w-0 px-4 py-3 text-sm leading-6 text-foreground outline-none",
          "empty:before:pointer-events-none empty:before:text-muted-foreground empty:before:content-[attr(data-placeholder)]",
          editorClassName,
        )}
        style={{ minHeight }}
        onInput={emitChange}
        onBlur={emitChange}
        onPaste={handlePaste}
        onDrop={handleDrop}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
}

RichTextEditor.displayName = "RichTextEditor";

export { RichTextEditor, RICH_TEXT_EDITOR_DEFAULT_LABELS };
export type { RichTextEditorProps, RichTextEditorLabels, RichTextImageUrlHandler };
