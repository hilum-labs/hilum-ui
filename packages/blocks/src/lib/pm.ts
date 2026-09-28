import { existsSync, readFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { spawnSync } from "child_process";

export type PackageManager = "pnpm" | "bun" | "yarn" | "npm";

/**
 * Lockfiles checked in each directory, in priority order. The first
 * directory (walking up from `cwd`) containing any of them decides the
 * package manager, so running inside a monorepo package picks up the
 * workspace root's lockfile.
 */
const LOCKFILES: ReadonlyArray<readonly [string, PackageManager]> = [
  ["pnpm-lock.yaml", "pnpm"],
  ["bun.lock", "bun"],
  ["bun.lockb", "bun"],
  ["yarn.lock", "yarn"],
  ["package-lock.json", "npm"],
];

export function detectPm(cwd: string): PackageManager {
  let dir = resolve(cwd);
  for (;;) {
    for (const [file, pm] of LOCKFILES) {
      if (existsSync(join(dir, file))) return pm;
    }
    const parent = dirname(dir);
    if (parent === dir) return "npm";
    dir = parent;
  }
}

export function installedDeps(cwd: string): Set<string> {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) return new Set();
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    return new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ]);
  } catch {
    return new Set();
  }
}

/* ------------------------------------------------------------------ */
/* Dependency spec validation                                          */
/* ------------------------------------------------------------------ */

// npm package name (optionally scoped). Stricter than npm itself: names may
// not start with "-" or "." so a spec can never be parsed as a CLI flag.
const NAME = String.raw`(?:@[a-z0-9~][a-z0-9._~-]*\/)?[a-z0-9~][a-z0-9._~-]*`;
// Optional version / range / dist-tag. Deliberately excludes whitespace and
// shell metacharacters (<, >, |, &, ;, $, `, quotes, %), so complex ranges
// such as ">=1 <2" are rejected.
const VERSION = String.raw`[A-Za-z0-9.^~*+_-]+`;
const DEP_SPEC_RE = new RegExp(`^(${NAME})(?:@(${VERSION}))?$`);
const MAX_NAME_LENGTH = 214;

export function isValidDepSpec(spec: string): boolean {
  const match = DEP_SPEC_RE.exec(spec);
  return match !== null && match[1]!.length <= MAX_NAME_LENGTH;
}

/** Throws if any dependency spec is not a plain npm `name[@range]`. */
export function assertValidDepSpecs(specs: readonly string[]): void {
  const invalid = specs.filter((s) => typeof s !== "string" || !isValidDepSpec(s));
  if (invalid.length > 0) {
    throw new Error(
      `Refusing to install invalid dependency spec(s): ${invalid
        .map((s) => JSON.stringify(s))
        .join(", ")}. Expected an npm package name with an optional @version.`,
    );
  }
}

/** Package name without the version part (`@scope/pkg@^1` → `@scope/pkg`). */
export function depName(spec: string): string {
  const match = DEP_SPEC_RE.exec(spec);
  return match ? match[1]! : spec;
}

/* ------------------------------------------------------------------ */
/* Install                                                             */
/* ------------------------------------------------------------------ */

export interface InstallCommand {
  command: PackageManager;
  args: string[];
}

export function installCommand(pm: PackageManager, deps: readonly string[]): InstallCommand {
  return { command: pm, args: [pm === "npm" ? "install" : "add", ...deps] };
}

/** Human-readable install command, e.g. for "run manually" hints. */
export function formatInstallCommand(pm: PackageManager, deps: readonly string[]): string {
  const { command, args } = installCommand(pm, deps);
  return [command, ...args].join(" ");
}

export function runInstall(deps: string[], cwd: string, pm: PackageManager = detectPm(cwd)): void {
  assertValidDepSpecs(deps);
  const { command, args } = installCommand(pm, deps);
  console.log(`  running: ${formatInstallCommand(pm, deps)}`);

  // No shell on POSIX: args are passed straight to the executable. On
  // Windows the package managers are `.cmd` shims, which Node can only
  // launch through cmd.exe; every arg has been validated above to contain
  // no shell metacharacters, and is additionally double-quoted so `^` is
  // taken literally.
  const isWindows = process.platform === "win32";
  const result = isWindows
    ? spawnSync(
        `${command}.cmd`,
        args.map((a) => `"${a}"`),
        {
          cwd,
          stdio: "inherit",
          shell: true,
        },
      )
    : spawnSync(command, args, { cwd, stdio: "inherit", shell: false });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} exited with code ${result.status ?? "null"}`);
  }
}
