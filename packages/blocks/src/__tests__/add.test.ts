// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import type { Registry } from "../lib/registry";
import type * as PmModule from "../lib/pm";

const fetchRegistry = vi.hoisted(() => vi.fn());
const runInstall = vi.hoisted(() => vi.fn());

vi.mock("../lib/registry.js", () => ({ fetchRegistry }));
vi.mock("../lib/pm.js", async (importOriginal) => ({
  ...(await importOriginal<typeof PmModule>()),
  runInstall,
}));

const { addBlock, isValidBlockName, resolveBlockPath } = await import("../commands/add");

function registry(blocks: Partial<Registry["blocks"][number]>[]): Registry {
  return {
    version: "1",
    updatedAt: "2026-01-01",
    blocks: blocks.map((b) => ({
      name: "hero",
      category: "marketing",
      title: "Hero",
      description: "",
      source: "export const Hero = 1;",
      dependencies: [],
      ...b,
    })),
  };
}

let tmpDir: string;
let log: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  tmpDir = join(tmpdir(), `hilum-add-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  mkdirSync(tmpDir, { recursive: true });
  fetchRegistry.mockReset();
  runInstall.mockReset();
  log = vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  rmSync(tmpDir, { recursive: true, force: true });
  vi.restoreAllMocks();
});

const out = () => join(tmpDir, "src/components/blocks/hero.tsx");
const opts = { outdir: "src/components/blocks" };

describe("block name validation", () => {
  it.each(["hero", "hero-simple-centered", "Hero2"])("accepts %s", (n) => {
    expect(isValidBlockName(n)).toBe(true);
  });

  it.each(["../evil", "a/b", "a\\b", "-x", "", ".", "..", "a.b", "a b"])("rejects %j", (n) => {
    expect(isValidBlockName(n)).toBe(false);
    expect(() => resolveBlockPath(tmpDir, "out", n)).toThrow(/Invalid block name/);
  });

  it("resolves inside the output directory", () => {
    expect(resolveBlockPath(tmpDir, "out", "hero")).toBe(join(tmpDir, "out", "hero.tsx"));
  });
});

describe("addBlock", () => {
  it("writes the block and forwards --registry", async () => {
    fetchRegistry.mockResolvedValue(registry([{}]));
    await addBlock("hero", { ...opts, registry: "https://r.example/r.json" }, tmpDir);
    expect(fetchRegistry).toHaveBeenCalledWith({ url: "https://r.example/r.json" });
    expect(readFileSync(out(), "utf8")).toBe("export const Hero = 1;");
  });

  it("refuses a registry block name that traverses out of the outdir", async () => {
    fetchRegistry.mockResolvedValue(registry([{ name: "../../pwned" }]));
    await expect(addBlock("../../pwned", opts, tmpDir)).rejects.toThrow(/Invalid block name/);
    expect(existsSync(join(tmpDir, "pwned.tsx"))).toBe(false);
  });

  it("refuses invalid dependency specs before writing anything", async () => {
    fetchRegistry.mockResolvedValue(registry([{ dependencies: ["react; rm -rf ~"] }]));
    await expect(addBlock("hero", opts, tmpDir)).rejects.toThrow(/invalid dependency spec/i);
    expect(existsSync(out())).toBe(false);
    expect(runInstall).not.toHaveBeenCalled();
  });

  it("skips an existing file without --force", async () => {
    fetchRegistry.mockResolvedValue(registry([{}]));
    mkdirSync(join(tmpDir, "src/components/blocks"), { recursive: true });
    writeFileSync(out(), "mine");
    await addBlock("hero", opts, tmpDir);
    expect(readFileSync(out(), "utf8")).toBe("mine");
    expect(log).toHaveBeenCalledWith(expect.stringMatching(/skipped: .*--force/));
  });

  it("overwrites an existing file with --force", async () => {
    fetchRegistry.mockResolvedValue(registry([{}]));
    mkdirSync(join(tmpDir, "src/components/blocks"), { recursive: true });
    writeFileSync(out(), "mine");
    await addBlock("hero", { ...opts, force: true }, tmpDir);
    expect(readFileSync(out(), "utf8")).toBe("export const Hero = 1;");
  });

  it("--dry-run writes and installs nothing", async () => {
    fetchRegistry.mockResolvedValue(registry([{ dependencies: ["lodash"] }]));
    writeFileSync(join(tmpDir, "yarn.lock"), "");
    await addBlock("hero", { ...opts, dryRun: true }, tmpDir);
    expect(existsSync(out())).toBe(false);
    expect(runInstall).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining("would install: yarn add lodash"));
  });

  it("installs only missing deps, comparing by package name", async () => {
    fetchRegistry.mockResolvedValue(registry([{ dependencies: ["react@^19", "lodash"] }]));
    writeFileSync(
      join(tmpDir, "package.json"),
      JSON.stringify({ dependencies: { react: "19.0.0" } }),
    );
    writeFileSync(join(tmpDir, "pnpm-lock.yaml"), "");
    await addBlock("hero", opts, tmpDir);
    expect(runInstall).toHaveBeenCalledWith(["lodash"], tmpDir, "pnpm");
  });

  it("suggests the detected package manager when install fails", async () => {
    fetchRegistry.mockResolvedValue(registry([{ dependencies: ["lodash"] }]));
    writeFileSync(join(tmpDir, "bun.lockb"), "");
    runInstall.mockImplementation(() => {
      throw new Error("boom");
    });
    await expect(addBlock("hero", opts, tmpDir)).rejects.toThrow(
      /Run manually:\n {2}bun add lodash/,
    );
  });

  it("reports unknown blocks", async () => {
    fetchRegistry.mockResolvedValue(registry([{}]));
    await expect(addBlock("nope", opts, tmpDir)).rejects.toThrow(/Block "nope" not found/);
  });
});
