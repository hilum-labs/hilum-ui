/** Packages whose module-level CSS injection is stripped from the bundle. */
export declare const INJECTING_PACKAGES: string[];
/** Remove `name`'s runtime CSS injection from its ESM build; throws if not found. */
export declare function stripInjectedCss(code: string, name: string): string;
/** esbuild plugin (tsup `esbuildPlugins`) applying `stripInjectedCss`. */
export declare function stripInjectedCssPlugin(): {
  name: string;
  setup(build: unknown): void;
};
