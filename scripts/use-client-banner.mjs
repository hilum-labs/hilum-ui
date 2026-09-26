// Prepends a "use client" directive to built entry files and shifts their
// sourcemaps by one line so mappings stay correct.
//
// Used from the packages' tsup `onSuccess` hooks: esbuild drops module-level
// directives when bundling, and a tsup `banner` would also stamp shared
// chunks (which server-safe entries such as @hilum/ui/tokens import).
import { readFile, writeFile } from 'node:fs/promises'

const DIRECTIVE = '"use client";\n'

export async function prependUseClient(files) {
  for (const file of files) {
    const code = await readFile(file, 'utf8')
    if (code.startsWith('"use client"') || code.startsWith("'use client'")) continue
    await writeFile(file, DIRECTIVE + code)

    const mapFile = `${file}.map`
    let map
    try {
      map = JSON.parse(await readFile(mapFile, 'utf8'))
    } catch {
      continue // no sourcemap
    }
    // One extra generated line at the top == one leading ";" in `mappings`.
    map.mappings = ';' + map.mappings
    await writeFile(mapFile, JSON.stringify(map))
  }
}
