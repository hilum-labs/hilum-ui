import { Command } from "commander";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { dirname, isAbsolute, relative, resolve } from "path";
import { fetchRegistry, type Block } from "../lib/registry.js";
import {
  assertValidDepSpecs,
  depName,
  detectPm,
  formatInstallCommand,
  installedDeps,
  runInstall,
} from "../lib/pm.js";

export interface AddOptions {
  outdir: string;
  force?: boolean;
  dryRun?: boolean;
  registry?: string;
}

const BLOCK_NAME_RE = /^[a-z0-9][a-z0-9-]*$/i;

export function isValidBlockName(name: string): boolean {
  return BLOCK_NAME_RE.test(name);
}

/**
 * Resolves the file a block is written to, refusing names that could escape
 * the output directory (e.g. `../../etc/passwd`).
 */
export function resolveBlockPath(cwd: string, outdir: string, name: string): string {
  if (!isValidBlockName(name)) {
    throw new Error(
      `Invalid block name ${JSON.stringify(name)}: only letters, digits and "-" are allowed.`,
    );
  }
  const outDir = resolve(cwd, outdir);
  const outFile = resolve(outDir, `${name}.tsx`);
  const rel = relative(outDir, outFile);
  if (rel === "" || rel.startsWith("..") || isAbsolute(rel)) {
    throw new Error(`Refusing to write outside ${outDir}: ${outFile}`);
  }
  return outFile;
}

export function findBlock(blocks: readonly Block[], name: string): Block | undefined {
  // Exact match first, then case-insensitive
  return (
    blocks.find((b) => b.name === name) ??
    blocks.find((b) => b.name.toLowerCase() === name.toLowerCase())
  );
}

/**
 * Implementation of `hilum add`. Throws on failure; the command wrapper maps
 * errors to a non-zero exit code.
 */
export async function addBlock(
  name: string,
  opts: AddOptions,
  cwd: string = process.cwd(),
): Promise<void> {
  const registry = await fetchRegistry({ url: opts.registry });

  const block = findBlock(registry.blocks, name);
  if (!block) {
    throw new Error(`Block "${name}" not found.\nRun "hilum list" to see available blocks.`);
  }

  const outFile = resolveBlockPath(cwd, opts.outdir, block.name);
  // Validate before touching disk so a bad registry entry writes nothing.
  assertValidDepSpecs(block.dependencies);

  const dryRun = opts.dryRun === true;
  const prefix = dryRun ? "[dry-run] " : "";

  const exists = existsSync(outFile);
  if (exists && !opts.force) {
    console.log(`skipped: ${outFile} already exists (use --force to overwrite)`);
  } else {
    if (!dryRun) {
      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, block.source, "utf8");
    }
    console.log(`${prefix}${exists ? "overwrote" : "added"}: ${outFile}`);
  }

  // Install any missing dependencies
  if (block.dependencies.length === 0) return;
  const existing = installedDeps(cwd);
  const missing = block.dependencies.filter((d) => !existing.has(depName(d)));
  if (missing.length === 0) return;

  const pm = detectPm(cwd);
  if (dryRun) {
    console.log(`${prefix}would install: ${formatInstallCommand(pm, missing)}`);
    return;
  }

  console.log(`installing: ${missing.join(", ")}`);
  try {
    runInstall(missing, cwd, pm);
  } catch {
    throw new Error(
      `Failed to install dependencies. Run manually:\n  ${formatInstallCommand(pm, missing)}`,
    );
  }
}

export const addCommand = new Command("add")
  .description("add a block to your project")
  .argument("<name>", "block name (e.g. hero-simple-centered)")
  .option("--outdir <dir>", "output directory", "src/components/blocks")
  .option("-f, --force", "overwrite the block file if it already exists")
  .option("--dry-run", "show what would be written and installed without doing it")
  .option("--registry <url>", "registry URL (default: $HILUM_REGISTRY_URL or the Hilum registry)")
  .action(async (name: string, opts: AddOptions) => {
    try {
      await addBlock(name, opts);
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
  });
