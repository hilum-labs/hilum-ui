import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchRegistry } from "../lib/registry";
import type { Registry } from "../lib/registry";

const MOCK_REGISTRY: Registry = {
  version: "0.1.0",
  updatedAt: "2026-05-12T00:00:00Z",
  blocks: [
    {
      name: "hero-simple-centered",
      category: "marketing",
      title: "Simple Centered Hero",
      description: "A centered hero section",
      source: "export function Hero() { return <div>Hero</div> }",
      dependencies: ["@hilum/ui"],
    },
    {
      name: "feature-grid",
      category: "marketing",
      title: "Feature Grid",
      description: "A grid of features",
      source: "export function FeatureGrid() { return <div /> }",
      dependencies: [],
    },
  ],
};

describe("fetchRegistry", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the parsed registry on 200", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_REGISTRY,
    } as Response);

    const registry = await fetchRegistry();
    expect(registry.blocks).toHaveLength(2);
    expect(registry.blocks[0].name).toBe("hero-simple-centered");
  });

  it("throws a descriptive error when fetch fails with a non-ok status", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(fetchRegistry()).rejects.toThrow("HTTP 404");
  });

  it("throws a network error message when fetch throws", async () => {
    vi.mocked(global.fetch).mockRejectedValueOnce(new TypeError("Network error"));

    await expect(fetchRegistry()).rejects.toThrow(/registry/);
  });

  it("returns blocks with the expected shape", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_REGISTRY,
    } as Response);

    const registry = await fetchRegistry();
    const block = registry.blocks[0];
    expect(block).toHaveProperty("name");
    expect(block).toHaveProperty("category");
    expect(block).toHaveProperty("title");
    expect(block).toHaveProperty("source");
    expect(block).toHaveProperty("dependencies");
    expect(Array.isArray(block.dependencies)).toBe(true);
  });

  it("handles empty blocks array", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...MOCK_REGISTRY, blocks: [] }),
    } as Response);

    const registry = await fetchRegistry();
    expect(registry.blocks).toHaveLength(0);
  });
});
