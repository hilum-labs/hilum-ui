import DOMPurify from "dompurify";

/**
 * HTML sanitizer used by the RichTextEditor.
 *
 * The allowlist is exactly the markup the editor toolbar can produce (plus the
 * harmless structural tags browsers insert while typing in a contentEditable:
 * `div`, `p`, `br`, `span`, and `b`/`i` from native shortcuts). Everything else —
 * scripts, event handlers, styles, iframes, forms, `javascript:` URLs — is
 * stripped.
 */

export const RICH_TEXT_ALLOWED_TAGS = [
  "a",
  "b",
  "blockquote",
  "br",
  "code",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "hr",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "pre",
  "s",
  "span",
  "strike",
  "strong",
  "u",
  "ul",
] as const;

export const RICH_TEXT_ALLOWED_ATTR = ["href", "src", "alt", "title", "target", "rel"] as const;

// http(s), mailto, tel, relative/fragment URLs. Anything with another scheme
// (javascript:, vbscript:, data: on links, …) is rejected.
const SAFE_URL = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;
// Images additionally accept inline raster data URIs (not SVG, which can script).
const SAFE_IMG_DATA_URL = /^data:image\/(?:png|gif|jpe?g|webp|avif);base64,[a-z0-9+/=\s]+$/i;

/** True when `url` is safe to use as a link href (no `javascript:` etc.). */
export function isSafeUrl(url: string): boolean {
  // Strip whitespace/control chars browsers ignore inside the scheme ("java\tscript:").
  const normalized = url.replace(/[\u0000- \u007f-\u009f]/g, "");
  return SAFE_URL.test(normalized);
}

/** True when `url` is safe to use as an image src. */
export function isSafeImageUrl(url: string): boolean {
  return isSafeUrl(url) || SAFE_IMG_DATA_URL.test(url.trim());
}

type Purifier = ReturnType<typeof DOMPurify>;
let purifier: Purifier | null = null;
let purifierBroken = false;

function getPurifier(): Purifier | null {
  if (purifier) return purifier;
  if (purifierBroken || typeof window === "undefined") return null;
  // A dedicated instance so our hooks never leak into the app's own DOMPurify use.
  const instance = DOMPurify(window);
  if (!instance.isSupported) return null;

  instance.addHook("afterSanitizeAttributes", (node) => {
    const el = node as Element;
    if (el.tagName === "A") {
      const href = el.getAttribute("href");
      if (href != null && !isSafeUrl(href)) el.removeAttribute("href");
      const target = el.getAttribute("target");
      if (target != null && target !== "_blank") el.removeAttribute("target");
      // Always sever the opener, regardless of what the source said.
      el.setAttribute("rel", "noopener noreferrer");
    } else if (el.tagName === "IMG") {
      const src = el.getAttribute("src");
      if (src != null && !isSafeImageUrl(src)) el.removeAttribute("src");
    } else {
      // `rel`/`target` only make sense on links.
      el.removeAttribute("rel");
      el.removeAttribute("target");
    }
  });

  // Self-test: some non-browser DOM implementations (e.g. happy-dom) break
  // DOMPurify's NodeIterator walk, which silently leaves later nodes
  // unsanitized. Only trust DOMPurify when it passes a known probe; the
  // allowlist pass below is enforced either way.
  const probe = instance.sanitize('<p>a</p><img src="x" onerror="y"><b>c</b>');
  if (probe !== '<p>a</p><img src="x"><b>c</b>') {
    purifierBroken = true;
    return null;
  }

  purifier = instance;
  return purifier;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sanitize rich-text HTML down to the editor's allowlist.
 *
 * Without a DOM (SSR) no parser is available, so the input is fully
 * HTML-escaped instead — safe, if not pretty; the client re-sanitizes on mount.
 */
export function sanitizeRichTextHtml(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined" || typeof document === "undefined") return escapeHtml(html);
  const p = getPurifier();
  if (!p) return enforceAllowlist(html);
  const purified = p.sanitize(html, {
    ALLOWED_TAGS: [...RICH_TEXT_ALLOWED_TAGS],
    ALLOWED_ATTR: [...RICH_TEXT_ALLOWED_ATTR],
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
    KEEP_CONTENT: true,
  });
  // Second, independent allowlist pass over an inert <template>. DOMPurify is
  // the primary defence (it handles parser/mXSS quirks in real browsers); this
  // pass guarantees the allowlist even where DOMPurify's DOM assumptions don't
  // hold (non-browser DOM implementations, future config drift).
  return enforceAllowlist(purified);
}

const ALLOWED_TAG_SET = new Set<string>(RICH_TEXT_ALLOWED_TAGS);
const ALLOWED_ATTR_SET = new Set<string>(RICH_TEXT_ALLOWED_ATTR);
// Elements whose content must be dropped, not unwrapped.
const DROP_WITH_CONTENT = new Set([
  "script",
  "style",
  "iframe",
  "frame",
  "frameset",
  "object",
  "embed",
  "noscript",
  "noembed",
  "template",
  "textarea",
  "title",
  "svg",
  "math",
  "select",
  "option",
  "head",
  "meta",
  "link",
  "base",
]);

function enforceAllowlist(html: string): string {
  if (typeof document === "undefined") return escapeHtml(html);
  const template = document.createElement("template");
  template.innerHTML = html;
  cleanChildren(template.content);
  return template.innerHTML;
}

function cleanChildren(parent: Node) {
  let child = parent.firstChild;
  while (child) {
    const next = child.nextSibling;
    if (child.nodeType === 1) {
      const el = child as Element;
      const tag = el.nodeName.toLowerCase();
      if (DROP_WITH_CONTENT.has(tag)) {
        el.remove();
      } else if (!ALLOWED_TAG_SET.has(tag)) {
        // Unwrap: keep (cleaned) children, drop the element itself.
        cleanChildren(el);
        while (el.firstChild) parent.insertBefore(el.firstChild, el);
        el.remove();
      } else {
        cleanAttributes(el, tag);
        cleanChildren(el);
      }
    } else if (child.nodeType !== 3) {
      // Comments, processing instructions, CDATA — drop.
      parent.removeChild(child);
    }
    child = next;
  }
}

function cleanAttributes(el: Element, tag: string) {
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase();
    if (!ALLOWED_ATTR_SET.has(name)) {
      el.removeAttribute(attr.name);
      continue;
    }
    if (name === "href" && (tag !== "a" || !isSafeUrl(attr.value))) el.removeAttribute(attr.name);
    else if (name === "src" && (tag !== "img" || !isSafeImageUrl(attr.value)))
      el.removeAttribute(attr.name);
    else if (name === "target" && (tag !== "a" || attr.value !== "_blank"))
      el.removeAttribute(attr.name);
    else if (name === "rel" && tag !== "a") el.removeAttribute(attr.name);
  }
  if (tag === "a") el.setAttribute("rel", "noopener noreferrer");
}

/** Convert plain text to HTML (escaped, newlines → `<br>`). */
export function plainTextToHtml(text: string): string {
  return escapeHtml(text).replace(/\r\n?|\n/g, "<br>");
}
