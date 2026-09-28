// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  DEFAULT_REGISTRY_URL,
  fetchRegistry,
  parseRegistry,
  resolveRegistryUrl,
} from "../lib/registry";
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
    expect(registry.blocks[0]!.name).toBe("hero-simple-centered");
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
    expect(Array.isArray(block!.dependencies)).toBe(true);
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

describe("fetchRegistry hardening", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("passes an abort signal so the request can time out", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_REGISTRY,
    } as Response);
    await fetchRegistry();
    const [url, init] = vi.mocked(global.fetch).mock.calls[0]!;
    expect(url).toBe(DEFAULT_REGISTRY_URL);
    expect((init as RequestInit).signal).toBeInstanceOf(AbortSignal);
  });

  it("reports timeouts distinctly", async () => {
    const err = new Error("timed out");
    err.name = "TimeoutError";
    vi.mocked(global.fetch).mockRejectedValueOnce(err);
    await expect(fetchRegistry({ timeoutMs: 50 })).rejects.toThrow(/Timed out after 50ms/);
  });

  it("uses an explicit registry URL", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => MOCK_REGISTRY,
    } as Response);
    await fetchRegistry({ url: "https://example.com/r.json" });
    expect(vi.mocked(global.fetch).mock.calls[0]![0]).toBe("https://example.com/r.json");
  });

  it("rejects a malformed payload", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...MOCK_REGISTRY, blocks: [{ name: 1 }] }),
    } as Response);
    await expect(fetchRegistry()).rejects.toThrow(/Invalid registry response: blocks\[0\]\.name/);
  });

  it("rejects a non-JSON body", async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new SyntaxError("Unexpected token");
      },
    } as unknown as Response);
    await expect(fetchRegistry()).rejects.toThrow(/not valid JSON/);
  });

  it("does not fetch an insecure URL", async () => {
    await expect(fetchRegistry({ url: "http://example.com/r.json" })).rejects.toThrow(/https/);
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe("parseRegistry", () => {
  it("accepts a valid registry and defaults optional fields", () => {
    const { description: _d, dependencies: _deps, ...bare } = MOCK_REGISTRY.blocks[0]!;
    const parsed = parseRegistry({ ...MOCK_REGISTRY, blocks: [bare] });
    expect(parsed.blocks[0]).toEqual({ ...bare, description: "", dependencies: [] });
  });

  it.each([
    [null, /JSON object/],
    [[], /JSON object/],
    [{ ...MOCK_REGISTRY, version: 1 }, /version/],
    [{ ...MOCK_REGISTRY, updatedAt: undefined }, /updatedAt/],
    [{ ...MOCK_REGISTRY, blocks: {} }, /blocks must be an array/],
    [{ ...MOCK_REGISTRY, blocks: ["x"] }, /blocks\[0\] is not an object/],
    [{ ...MOCK_REGISTRY, blocks: [{ ...MOCK_REGISTRY.blocks[0], source: null }] }, /source/],
    [
      { ...MOCK_REGISTRY, blocks: [{ ...MOCK_REGISTRY.blocks[0], dependencies: [1] }] },
      /dependencies/,
    ],
    [{ ...MOCK_REGISTRY, blocks: [{ ...MOCK_REGISTRY.blocks[0], description: 5 }] }, /description/],
  ])("rejects %j", (data, msg) => {
    expect(() => parseRegistry(data)).toThrow(msg);
  });
});

describe("resolveRegistryUrl", () => {
  it("defaults to the Hilum registry", () => {
    expect(resolveRegistryUrl(undefined, {})).toBe(DEFAULT_REGISTRY_URL);
  });

  it("reads HILUM_REGISTRY_URL", () => {
    expect(
      resolveRegistryUrl(undefined, { HILUM_REGISTRY_URL: "https://mirror.example/r.json" }),
    ).toBe("https://mirror.example/r.json");
  });

  it("prefers the explicit URL over the env var", () => {
    expect(
      resolveRegistryUrl("https://a.example/r.json", {
        HILUM_REGISTRY_URL: "https://b.example/r.json",
      }),
    ).toBe("https://a.example/r.json");
  });

  it("allows http only for localhost", () => {
    expect(resolveRegistryUrl("http://localhost:3000/r.json", {})).toBe(
      "http://localhost:3000/r.json",
    );
    expect(resolveRegistryUrl("http://127.0.0.1/r.json", {})).toBe("http://127.0.0.1/r.json");
    expect(resolveRegistryUrl("http://[::1]:8080/r.json", {})).toBe("http://[::1]:8080/r.json");
    expect(() => resolveRegistryUrl("http://example.com/r.json", {})).toThrow(/https/);
    expect(() => resolveRegistryUrl("http://localhost.evil.com/r.json", {})).toThrow(/https/);
  });

  it("rejects other protocols and garbage", () => {
    expect(() => resolveRegistryUrl("file:///etc/passwd", {})).toThrow(/https/);
    expect(() => resolveRegistryUrl("not a url", {})).toThrow(/Invalid registry URL/);
  });
});
