import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Replaced with the package.json version at build time (see tsup.config.ts).
declare const __HILUM_BLOCKS_VERSION__: string | undefined;

/** The version of @hilum/blocks that is running. */
export function cliVersion(): string {
  if (typeof __HILUM_BLOCKS_VERSION__ === "string") return __HILUM_BLOCKS_VERSION__;
  // Unbundled (tests / tsx): read package.json relative to this source file.
  try {
    const pkg = JSON.parse(
      readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../../package.json"), "utf8"),
    );
    return typeof pkg.version === "string" ? pkg.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}
