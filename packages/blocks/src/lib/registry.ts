export const DEFAULT_REGISTRY_URL = "https://ui.hilum.dev/registry.json";
export const REGISTRY_ENV_VAR = "HILUM_REGISTRY_URL";
export const DEFAULT_REGISTRY_TIMEOUT_MS = 15_000;

export interface Block {
  name: string;
  category: string;
  title: string;
  description: string;
  source: string;
  dependencies: string[];
}

export interface Registry {
  version: string;
  updatedAt: string;
  blocks: Block[];
}

export interface FetchRegistryOptions {
  /** Registry URL. Falls back to `$HILUM_REGISTRY_URL`, then the default. */
  url?: string | undefined;
  /** Request timeout in ms (default 15s). */
  timeoutMs?: number;
}

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/**
 * Resolves and validates the registry URL. HTTPS is required; plain HTTP is
 * only accepted for localhost so a local registry can be used in development.
 */
export function resolveRegistryUrl(
  url: string | undefined = undefined,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const raw = url ?? env[REGISTRY_ENV_VAR] ?? DEFAULT_REGISTRY_URL;
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    throw new Error(`Invalid registry URL: ${raw}`);
  }
  if (parsed.protocol === "https:") return parsed.href;
  if (parsed.protocol === "http:" && LOCAL_HOSTS.has(parsed.hostname)) return parsed.href;
  throw new Error(`Registry URL must use https (http is only allowed for localhost): ${raw}`);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBlock(value: unknown, index: number): Block {
  const where = `blocks[${index}]`;
  if (!isRecord(value)) throw new Error(`${where} is not an object`);
  for (const key of ["name", "category", "title", "source"] as const) {
    if (typeof value[key] !== "string") throw new Error(`${where}.${key} must be a string`);
  }
  const description = value.description ?? "";
  if (typeof description !== "string") {
    throw new Error(`${where}.description must be a string`);
  }
  const dependencies = value.dependencies ?? [];
  if (!Array.isArray(dependencies) || !dependencies.every((d) => typeof d === "string")) {
    throw new Error(`${where}.dependencies must be an array of strings`);
  }
  return {
    name: value.name as string,
    category: value.category as string,
    title: value.title as string,
    description,
    source: value.source as string,
    dependencies: dependencies as string[],
  };
}

/** Validates an untrusted registry payload, throwing a descriptive error. */
export function parseRegistry(data: unknown): Registry {
  try {
    if (!isRecord(data)) throw new Error("expected a JSON object");
    if (typeof data.version !== "string") throw new Error("version must be a string");
    if (typeof data.updatedAt !== "string") throw new Error("updatedAt must be a string");
    if (!Array.isArray(data.blocks)) throw new Error("blocks must be an array");
    return {
      version: data.version,
      updatedAt: data.updatedAt,
      blocks: data.blocks.map(parseBlock),
    };
  } catch (err) {
    throw new Error(`Invalid registry response: ${(err as Error).message}`);
  }
}

export async function fetchRegistry(options: FetchRegistryOptions = {}): Promise<Registry> {
  const url = resolveRegistryUrl(options.url);
  const timeoutMs = options.timeoutMs ?? DEFAULT_REGISTRY_TIMEOUT_MS;
  let res: Response;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  } catch (err) {
    if ((err as Error)?.name === "TimeoutError") {
      throw new Error(`Timed out after ${timeoutMs}ms fetching registry at ${url}.`);
    }
    throw new Error(`Could not reach registry at ${url}. Are you online?`);
  }
  if (!res.ok) {
    throw new Error(`Registry returned HTTP ${res.status}`);
  }
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Invalid registry response: body is not valid JSON`);
  }
  return parseRegistry(data);
}
