// @hilum/app-shell — composed product-app layouts.

export * from "./types";
// The link context lives in @hilum/ui so one provider drives both packages.
export { useLink, LinkProvider } from "@hilum/ui";
export { flattenNavItems, flattenNavSections, isNavItemActive } from "./nav-utils";

export { useAppFrame } from "./app-frame";
export type { AppFrameContextValue, AppFrameProps } from "./app-frame";
export * from "./app-shell";
export * from "./app-shell-stacked";
export * from "./app-loading-bar";
export * from "./skip-link";
export * from "./app-nav-tree";
export * from "./app-command-palette";
export * from "./app-sidebar";
export { AppAccountMenu } from "./app-account-menu";
export type { AppAccountMenuItem, AppAccountMenuProps } from "./app-account-menu";
export * from "./app-header";
export * from "./app-mobile-nav";
export * from "./app-notification-menu";
export * from "./app-status-banner";
export * from "./navbar";
export * from "./page-header";
export * from "./detail-screen";
export * from "./settings-screen";
export * from "./sign-in-screen";
