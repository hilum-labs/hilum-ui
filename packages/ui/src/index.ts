// @hilum/ui — Hilum design system primitives.
// All components, utilities, and re-exports.
//
// Hilum targets React apps across browser, prerendered docs, Electron, and a
// future React Native package. Keep exports framework-agnostic and avoid
// framework-specific entrypoint directives here.

// Utilities
export { cn } from "./lib/utils";
export * from "./lib/icon-context";
export * from "./lib/shape-context";
export * from "./lib/surface-context";
export * from "./lib/density-context";
export * from "./lib/format";
export * from "./lib/link-context";
export { HilumProvider, MotionProvider, usePrefersReducedMotion } from "./lib/motion-provider";
export type { HilumProviderProps, ReducedMotionSetting } from "./lib/motion-provider";
export { sanitizeRichTextHtml } from "./lib/sanitize-html";
export { controlHeightClass, controlSizeClasses, controlTextClass } from "./lib/interaction";
export {
  useScrollEdges,
  horizontalEdgeMask,
  useHorizontalOverflowMask,
  scrollStripItemIntoView,
} from "./lib/scroll-fade";

// Components (alphabetical)
export * from "./components/accordion";
export * from "./components/account-menu";
export * from "./components/action-panel";
export * from "./components/activity-feed";
export * from "./components/alert";
export * from "./components/alert-dialog";
export * from "./components/aspect-ratio";
export * from "./components/avatar";
export * from "./components/avatar-stack";
export * from "./components/badge";
export * from "./components/breadcrumb";
export * from "./components/button";
export * from "./components/button-group";
export * from "./components/calendar";
export * from "./components/callout";
export * from "./components/card";
export * from "./components/card-heading";
export * from "./components/carousel";
export * from "./components/chart";
export * from "./components/checkbox";
export * from "./components/checkbox-card";
export * from "./components/checkbox-group";
export * from "./components/code-block";
export * from "./components/collapsible";
export * from "./components/color-input";
export * from "./components/color-picker";
export * from "./components/combobox";
export * from "./components/command";
export * from "./components/command-palette";
export * from "./components/context-menu";
export * from "./components/contextual-save-bar";
export * from "./components/data-table";
export * from "./components/data-transfer-controls";
export * from "./components/date-picker";
export * from "./components/date-text";
export * from "./components/date-time-picker";
export * from "./components/description-list";
export * from "./components/dialog";
export * from "./components/drawer";
export * from "./components/dropdown";
export * from "./components/dropdown-menu";
export * from "./components/empty-state";
export * from "./components/field";
export * from "./components/file-dropzone";
export * from "./components/file-thumbnail";
export * from "./components/filter-bar";
export * from "./components/form-layout";
export * from "./components/grid-list";
export * from "./components/help-tooltip";
export * from "./components/hover-card";
export * from "./components/input";
export * from "./components/input-copy";
export * from "./components/input-group";
export * from "./components/input-number";
export * from "./components/input-otp";
export * from "./components/kbd";
export * from "./components/label";
export * from "./components/layout";
export * from "./components/media-asset-card";
export * from "./components/media-asset-grid";
export * from "./components/media-object";
export * from "./components/menu-item";
export * from "./components/menubar";
export * from "./components/mobile-drawer";
export * from "./components/native-select";
export * from "./components/nav-item";
export * from "./components/nav-menu";
export * from "./components/navigation-menu";
export * from "./components/notification";
export * from "./components/page-heading";
export * from "./components/pagination";
export * from "./components/popover";
export * from "./components/progress";
export * from "./components/property-row";
export * from "./components/radio-card";
export * from "./components/radio-group";
export * from "./components/rating";
export * from "./components/resizable";
export * from "./components/resource-item";
export * from "./components/rich-text-editor";
export * from "./components/scroll-area";
export * from "./components/search-input";
export * from "./components/searchable-table";
export * from "./components/section-heading";
export * from "./components/select";
export * from "./components/separator";
export * from "./components/setup-guide";
export * from "./components/sheet";
export * from "./components/sidebar";
export * from "./components/skeleton";
export * from "./components/skeleton-page";
export * from "./components/slider";
export * from "./components/sonner";
export * from "./components/sortable";
export * from "./components/spinner";
export * from "./components/stacked-list";
export * from "./components/stat-card";
export * from "./components/status-badge";
export * from "./components/status-tile";
export * from "./components/steps";
export * from "./components/summary-tile";
export * from "./components/switch";
export * from "./components/table";
export * from "./components/tabs";
export * from "./components/tabs-subtle";
export * from "./components/tag-input";
export * from "./components/textarea";
export * from "./components/thumbnail";
export * from "./components/time-picker";
export * from "./components/time-series-chart";
export * from "./components/titled-card";
export * from "./components/toggle";
export * from "./components/toggle-group";
export * from "./components/tooltip";
export * from "./components/tree-view";
export * from "./components/usage-bar";
