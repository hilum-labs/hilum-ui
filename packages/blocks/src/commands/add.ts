import { Command } from 'commander'
import { mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fetchRegistry } from '../lib/registry.js'
import { installedDeps, runInstall } from '../lib/pm.js'

export const addCommand = new Command('add')
  .description('add a block to your project')
  .argument('<name>', 'block name (e.g. hero-simple-centered)')
  .option('--outdir <dir>', 'output directory', 'src/components/blocks')
  .action(async (name: string, opts: { outdir: string }) => {
    let registry
    try {
      registry = await fetchRegistry()
    } catch (err) {
      console.error((err as Error).message)
      process.exit(1)
    }

    // Exact match first, then case-insensitive
    const block =
      registry.blocks.find(b => b.name === name) ??
      registry.blocks.find(b => b.name.toLowerCase() === name.toLowerCase())

    if (!block) {
      console.error(`Block "${name}" not found.`)
      console.error(`Run "hilum list" to see available blocks.`)
      process.exit(1)
    }

    const cwd = process.cwd()
    const outDir = join(cwd, opts.outdir)
    const outFile = join(outDir, `${block.name}.tsx`)

    mkdirSync(outDir, { recursive: true })
    writeFileSync(outFile, block.source, 'utf8')
    console.log(`added: ${outFile}`)

    // Install any missing dependencies
    if (block.dependencies.length > 0) {
      const existing = installedDeps(cwd)
      const missing = block.dependencies.filter(d => !existing.has(d))
      if (missing.length > 0) {
        console.log(`installing: ${missing.join(', ')}`)
        try {
          runInstall(missing, cwd)
        } catch {
          console.error(`Failed to install dependencies. Run manually:`)
          console.error(`  npm install ${missing.join(' ')}`)
          process.exit(1)
        }
      }
    }
  })
