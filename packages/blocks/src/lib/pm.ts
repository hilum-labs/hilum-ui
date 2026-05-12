import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

type PackageManager = 'pnpm' | 'yarn' | 'npm'

export function detectPm(cwd: string): PackageManager {
  if (existsSync(join(cwd, 'pnpm-lock.yaml'))) return 'pnpm'
  if (existsSync(join(cwd, 'yarn.lock'))) return 'yarn'
  return 'npm'
}

export function installedDeps(cwd: string): Set<string> {
  const pkgPath = join(cwd, 'package.json')
  if (!existsSync(pkgPath)) return new Set()
  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'))
    return new Set([
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.devDependencies ?? {}),
    ])
  } catch {
    return new Set()
  }
}

export function runInstall(deps: string[], cwd: string): void {
  const pm = detectPm(cwd)
  const cmd =
    pm === 'pnpm' ? `pnpm add ${deps.join(' ')}` :
    pm === 'yarn' ? `yarn add ${deps.join(' ')}` :
    `npm install ${deps.join(' ')}`

  console.log(`  running: ${cmd}`)
  execSync(cmd, { cwd, stdio: 'inherit' })
}
