"use client";

import * as React from "react";
import { AlertTriangle, ExternalLink, Monitor, Smartphone, Tablet } from "lucide-react";
import { cn } from "../lib/utils";
import { useControllableState } from "../lib/use-controllable-state";
import { Button } from "./button";
import { Skeleton } from "./skeleton";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

type PreviewDevice = "mobile" | "tablet" | "desktop";

/** Localizable strings. Every entry has an English default. */
interface PreviewFrameLabels {
  /** Accessible name of the device toggle. */
  device: string;
  mobile: string;
  tablet: string;
  desktop: string;
  /** Announced while the page loads. */
  loading: string;
  /** Error state title. */
  errorTitle: string;
  /** Error state description. */
  errorDescription: string;
  /** Error state retry button. */
  retry: string;
  /** Link that opens `src` in a new tab (`showOpenInNewTab`). */
  openInNewTab: string;
}

const PREVIEW_FRAME_DEFAULT_LABELS: PreviewFrameLabels = {
  device: "Preview device",
  mobile: "Mobile",
  tablet: "Tablet",
  desktop: "Desktop",
  loading: "Loading preview",
  errorTitle: "The preview couldn't load",
  errorDescription: "Check your connection and try again.",
  retry: "Try again",
  openInNewTab: "Open in new tab",
};

/** CSS widths the page is laid out at, per device. Desktop also fills wider containers. */
const PREVIEW_DEVICE_WIDTHS: Record<PreviewDevice, number> = {
  mobile: 390,
  tablet: 820,
  desktop: 1280,
};

const DEVICE_ICONS = { mobile: Smartphone, tablet: Tablet, desktop: Monitor } as const;

/** Sandbox for a storefront preview: scripts, forms and popups, same-origin cookies. */
const PREVIEW_FRAME_DEFAULT_SANDBOX = "allow-scripts allow-same-origin allow-forms allow-popups";

interface PreviewFrameProps {
  /** URL of the page to preview. */
  src: string;
  /** Accessible name of the frame, e.g. "Preview of Dawn". Required. */
  title: string;
  /** Device width to render (controlled). */
  device?: PreviewDevice;
  /** Initial device (uncontrolled). Default "desktop". */
  defaultDevice?: PreviewDevice;
  onDeviceChange?: (device: PreviewDevice) => void;
  /** Devices offered in the toggle. Default all three. */
  devices?: PreviewDevice[];
  /** Override the layout width of a device, in CSS pixels. */
  deviceWidths?: Partial<Record<PreviewDevice, number>>;
  /** Show the device toggle. Default true when more than one device is offered. */
  showDeviceToggle?: boolean;
  /** Show a link that opens `src` in a new tab. */
  showOpenInNewTab?: boolean;
  /** Extra toolbar content at the end (e.g. a Publish button). */
  toolbar?: React.ReactNode;
  /** Height of the preview area. Default 600 (px). Pass "100%" inside a sized parent. */
  height?: number | string;
  /**
   * iframe `sandbox`. Default: scripts, same-origin, forms and popups, for a
   * storefront on another origin. Never combine `allow-scripts` with
   * `allow-same-origin` for a page served from your app's own origin.
   */
  sandbox?: string;
  /** iframe `allow` (permissions policy), e.g. "clipboard-write". */
  allow?: string;
  /** iframe `referrerPolicy`. Default "no-referrer" (preview URLs often carry tokens). */
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  /**
   * Show the error state (e.g. the app knows the preview failed). A string
   * replaces the default description.
   */
  error?: boolean | string;
  /** Treat the preview as failed when it hasn't loaded after this many ms. */
  loadTimeout?: number;
  onLoad?: () => void;
  /** Called when the frame errors or times out. */
  onError?: () => void;
  /** Called by the error state's retry button (the frame reloads either way). */
  onRetry?: () => void;
  className?: string;
  /** Override the English UI strings (i18n). */
  labels?: Partial<PreviewFrameLabels>;
  /** Ref to the <iframe>. */
  ref?: React.Ref<HTMLIFrameElement> | undefined;
}

/** `src` values that load a blank document synchronously on insertion. */
function isBlankSrc(src: string) {
  return src.trim() === "" || /^about:blank(?:[?#]|$)/i.test(src.trim());
}

function useElementSize<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);
  const [size, setSize] = React.useState<{ width: number; height: number } | null>(null);
  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const measure = () => {
      const rect = element.getBoundingClientRect();
      setSize((previous) =>
        previous && previous.width === rect.width && previous.height === rect.height
          ? previous
          : { width: rect.width, height: rect.height },
      );
    };
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return [ref, size] as const;
}

/**
 * Sandboxed iframe for storefront and theme previews: mobile / tablet /
 * desktop widths with a device toggle, the page scaled down to fit the
 * container, a loading skeleton until it loads, and an error state with
 * retry. CSP-safe (sizes are set through the style prop).
 */
function PreviewFrame({
  src,
  title,
  device: deviceProp,
  defaultDevice = "desktop",
  onDeviceChange,
  devices = ["mobile", "tablet", "desktop"],
  deviceWidths,
  showDeviceToggle,
  showOpenInNewTab = false,
  toolbar,
  height = 600,
  sandbox = PREVIEW_FRAME_DEFAULT_SANDBOX,
  allow,
  referrerPolicy = "no-referrer",
  error: errorProp,
  loadTimeout,
  onLoad,
  onError,
  onRetry,
  className,
  labels: labelsProp,
  ref,
}: PreviewFrameProps) {
  const labels = { ...PREVIEW_FRAME_DEFAULT_LABELS, ...labelsProp };
  const [device, setDevice] = useControllableState<PreviewDevice>({
    value: deviceProp,
    defaultValue: defaultDevice,
    onChange: onDeviceChange,
  });
  const [attempt, setAttempt] = React.useState(0);
  // Load state belongs to one page load: a new `src` or a retry starts over.
  const frameKey = `${src}#${attempt}`;
  const [loadedKey, setLoadedKey] = React.useState<string | null>(null);
  const [failedKey, setFailedKey] = React.useState<string | null>(null);
  const loaded = loadedKey === frameKey;
  const failed = failedKey === frameKey;
  const [stageRef, stage] = useElementSize<HTMLDivElement>();

  const onErrorRef = React.useRef(onError);
  const onLoadRef = React.useRef(onLoad);
  React.useEffect(() => {
    onErrorRef.current = onError;
    onLoadRef.current = onLoad;
  });

  // Marks a page load as done and calls `onLoad` once per load.
  const reportedLoadRef = React.useRef<string | null>(null);
  const markLoaded = React.useCallback((key: string) => {
    setLoadedKey(key);
    if (reportedLoadRef.current === key) return;
    reportedLoadRef.current = key;
    onLoadRef.current?.();
  }, []);

  const frameRef = React.useRef<HTMLIFrameElement | null>(null);
  const setFrameRef = React.useCallback(
    (node: HTMLIFrameElement | null) => {
      frameRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) (ref as React.RefObject<HTMLIFrameElement | null>).current = node;
    },
    [ref],
  );
  React.useEffect(() => {
    if (loaded || failed || !loadTimeout) return;
    const timer = window.setTimeout(() => {
      setFailedKey(frameKey);
      onErrorRef.current?.();
    }, loadTimeout);
    return () => window.clearTimeout(timer);
  }, [loaded, failed, loadTimeout, frameKey]);

  const widths = { ...PREVIEW_DEVICE_WIDTHS, ...deviceWidths };
  const stageWidth = stage?.width ?? 0;
  const stageHeight = stage?.height ?? 0;
  // Desktop fills a wider container; every device scales down to fit.
  const layoutWidth = device === "desktop" ? Math.max(widths.desktop, stageWidth) : widths[device];
  const scale = stageWidth > 0 ? Math.min(1, stageWidth / layoutWidth) : 1;
  const frameHeight = stageHeight > 0 ? stageHeight / scale : undefined;
  const framed = device !== "desktop" && scale === 1 && layoutWidth < stageWidth;

  const showErrorState = Boolean(errorProp) || failed;
  // A frame can finish loading while React inserts it (about:blank loads
  // synchronously; a cached same-origin page can be quick), and React drops
  // events fired during its commit, so `onLoad` would never run and the
  // skeleton would stay. Check the frame once it is in the document.
  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame || showErrorState) return;
    if (isBlankSrc(src)) {
      markLoaded(frameKey);
      return;
    }
    try {
      // Same-origin only (null otherwise). Before navigation the frame holds
      // its initial about:blank document, which doesn't count.
      const doc = frame.contentDocument;
      if (doc && doc.readyState === "complete" && doc.URL !== "about:blank") {
        markLoaded(frameKey);
      }
    } catch {
      // Cross-origin: wait for the load event.
    }
  }, [frameKey, src, showErrorState, markLoaded]);

  const errorMessage =
    typeof errorProp === "string" && errorProp ? errorProp : labels.errorDescription;
  const showError = showErrorState;
  const toggleVisible = (showDeviceToggle ?? devices.length > 1) && devices.length > 0;

  return (
    <div
      data-slot="preview-frame"
      data-device={device}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-muted/40",
        className,
      )}
    >
      {(toggleVisible || showOpenInNewTab || toolbar) && (
        <div
          data-slot="preview-frame-toolbar"
          className="flex min-h-12 flex-wrap items-center justify-between gap-2 border-b border-border bg-background px-3 py-2"
        >
          {toggleVisible ? (
            <ToggleGroup
              type="single"
              variant="segmented"
              value={device}
              onValueChange={(next) => {
                if (next) setDevice(next as PreviewDevice);
              }}
              aria-label={labels.device}
            >
              {devices.map((option) => {
                const Icon = DEVICE_ICONS[option];
                return (
                  <ToggleGroupItem key={option} value={option} aria-label={labels[option]}>
                    <Icon size={16} aria-hidden="true" />
                  </ToggleGroupItem>
                );
              })}
            </ToggleGroup>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-2">
            {showOpenInNewTab && (
              <Button asChild variant="ghost" size="sm">
                <a href={src} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} aria-hidden="true" />
                  {labels.openInNewTab}
                </a>
              </Button>
            )}
            {toolbar}
          </div>
        </div>
      )}

      <div
        ref={stageRef}
        data-slot="preview-frame-stage"
        aria-busy={!loaded && !showError ? true : undefined}
        className={cn("relative flex min-w-0 justify-center overflow-hidden", framed && "py-4")}
        style={{ height }}
      >
        {/* The scaler occupies the scaled size so flexbox centres it in either
            writing direction; inside it the frame is laid out at the device
            width and scaled from its top-left corner. */}
        <div
          dir="ltr"
          data-slot="preview-frame-viewport"
          className={cn(
            "relative shrink-0 overflow-hidden bg-background",
            framed && "rounded-2xl shadow-natural ring-1 ring-border",
          )}
          style={{ width: layoutWidth * scale, height: "100%" }}
        >
          {!showError && (
            <iframe
              key={frameKey}
              ref={setFrameRef}
              src={src}
              title={title}
              sandbox={sandbox}
              {...(allow ? { allow } : {})}
              referrerPolicy={referrerPolicy}
              data-slot="preview-frame-iframe"
              className="absolute top-0 left-0 block border-0 bg-background"
              // Physical left / origin on purpose: the viewport is dir="ltr"
              // geometry, centred by its flex parent in either direction.
              style={{
                width: layoutWidth,
                height: scale === 1 || frameHeight === undefined ? "100%" : frameHeight,
                transform: scale === 1 ? undefined : `scale(${scale})`,
                transformOrigin: "0 0",
              }}
              onLoad={() => markLoaded(frameKey)}
              onError={() => {
                setFailedKey(frameKey);
                onError?.();
              }}
            />
          )}
        </div>

        {!loaded && !showError && (
          <div
            data-slot="preview-frame-loading"
            className="absolute inset-0 flex flex-col gap-4 bg-background p-6"
          >
            <span className="sr-only" role="status">
              {labels.loading}
            </span>
            <Skeleton aria-hidden="true" className="h-8 w-1/3" />
            <Skeleton aria-hidden="true" className="h-48 w-full" />
            <div aria-hidden="true" className="grid grid-cols-3 gap-4">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
          </div>
        )}

        {showError && (
          <div
            role="alert"
            data-slot="preview-frame-error"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background p-6 text-center"
          >
            <AlertTriangle size={24} className="text-muted-foreground" aria-hidden="true" />
            <p className="body font-medium text-foreground">{labels.errorTitle}</p>
            <p className="body max-w-sm text-muted-foreground">{errorMessage}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setAttempt((current) => current + 1);
                onRetry?.();
              }}
            >
              {labels.retry}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
PreviewFrame.displayName = "PreviewFrame";

export {
  PreviewFrame,
  PREVIEW_FRAME_DEFAULT_LABELS,
  PREVIEW_FRAME_DEFAULT_SANDBOX,
  PREVIEW_DEVICE_WIDTHS,
};
export type { PreviewFrameProps, PreviewFrameLabels, PreviewDevice };
