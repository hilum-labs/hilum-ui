import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Apps may build from the published source (for per-route code splitting), so
// every runtime import in the shipped `src/` files must resolve from the
// consumer's install: it has to be a dependency or peer dependency, not a
// dev dependency the dist happens to bundle.

const packageRoot = join(__dirname, "..", "..");
const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8")) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};
const installable = new Set([
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
]);

// Mirrors the `files` globs for src in package.json.
const publishedDirs = ["components", "lib", "hooks", "tokens"];
const publishedRootFiles = ["icons.ts", "icon-libraries.ts", "index.ts", "ai.ts", "form.tsx"];

function publishedSourceFiles(): string[] {
  const src = join(packageRoot, "src");
  const files = publishedRootFiles.map((file) => join(src, file));
  for (const dir of publishedDirs) {
    for (const entry of readdirSync(join(src, dir), { withFileTypes: true })) {
      if (entry.isFile() && /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
        files.push(join(src, dir, entry.name));
      }
    }
  }
  return files;
}

function packageName(specifier: string): string {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : (parts[0] ?? specifier);
}

// Runtime imports and re-exports; `import type` is erased and doesn't count.
const IMPORT =
  /^\s*(?:import|export)\s+(?!type\b)[^'"]*?from\s+["']([^"']+)["']|^\s*import\s+["']([^"']+)["']/gm;

describe("published source", () => {
  it("imports only packages a consumer has installed", () => {
    const missing: string[] = [];
    for (const file of publishedSourceFiles()) {
      const code = readFileSync(file, "utf8");
      for (const match of code.matchAll(IMPORT)) {
        const specifier = match[1] ?? match[2] ?? "";
        if (!specifier || specifier.startsWith(".") || specifier.startsWith("node:")) continue;
        const name = packageName(specifier);
        if (!installable.has(name)) missing.push(`${relative(packageRoot, file)} → ${specifier}`);
      }
    }
    expect(missing).toEqual([]);
  });
});
