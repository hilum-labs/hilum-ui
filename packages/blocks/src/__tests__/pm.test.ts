import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { detectPm, installedDeps } from "../lib/pm";

let tmpDir: string;

beforeEach(() => {
  tmpDir = join(tmpdir(), `hilum-blocks-test-${Date.now()}`);
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
