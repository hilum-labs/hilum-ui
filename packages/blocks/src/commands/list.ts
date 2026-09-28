import { Command } from "commander";
import { fetchRegistry, type Block } from "../lib/registry.js";

export const listCommand = new Command("list")
  .description("list available blocks")
  .argument("[category]", "filter by category")
  .option("--registry <url>", "registry URL (default: $HILUM_REGISTRY_URL or the Hilum registry)")
  .action(async (categoryArg: string | undefined, opts: { registry?: string }) => {
    let registry;
    try {
      registry = await fetchRegistry({ url: opts.registry });
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }

    // Group by category
    const grouped = new Map<string, Block[]>();
    for (const block of registry.blocks) {
      if (categoryArg && block.category !== categoryArg) continue;
      const list = grouped.get(block.category) ?? [];
      list.push(block);
      grouped.set(block.category, list);
    }

    if (grouped.size === 0) {
      const msg = categoryArg
        ? `No blocks found in category "${categoryArg}".`
        : "No blocks found.";
      console.log(msg);
      process.exit(0);
    }

    for (const [category, blocks] of grouped) {
      console.log(`\n${category}`);
      for (const block of blocks) {
        const desc = block.description ? `  — ${block.description}` : "";
        console.log(`  ${block.name}${desc}`);
      }
    }
    console.log();
  });
