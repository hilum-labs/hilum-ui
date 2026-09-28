# @hilum/blocks

CLI for adding Hilum marketing blocks to an app.

## Install

```bash
pnpm add -D @hilum/blocks
```

## Usage

```bash
pnpm hilum list [category]
pnpm hilum add hero-simple-centered
pnpm hilum --version
```

`hilum add` writes the selected block to `src/components/blocks/<name>.tsx` by default and installs any missing dependencies declared by the block registry.

### `hilum add <name>` options

| Option             | Description                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `--outdir <dir>`   | Output directory (default `src/components/blocks`).                                                    |
| `-f, --force`      | Overwrite the block file if it already exists. Without it, an existing file is skipped with a message. |
| `--dry-run`        | Print what would be written and the install command that would run, without changing anything.         |
| `--registry <url>` | Use a different registry (see below).                                                                  |

### `hilum list [category]` options

| Option             | Description                           |
| ------------------ | ------------------------------------- |
| `--registry <url>` | Use a different registry (see below). |

## Registry

The registry URL is resolved from, in order: the `--registry <url>` option, the `HILUM_REGISTRY_URL` environment variable, then `https://ui.hilum.dev/registry.json`.

- The URL must use `https`. Plain `http` is only accepted for `localhost`, `127.0.0.1` and `[::1]`.
- Requests time out after 15 seconds.
- The response is validated. A malformed registry, a block name that isn't `[a-z0-9-]` (letters, digits and dashes only), or a dependency that isn't a plain npm `name[@version]` spec is rejected before anything is written or installed.

## Dependency installation

Missing dependencies are installed with the package manager that owns the project. It is detected from the nearest lockfile, searching the current directory and then its parents, so running inside a monorepo package uses the workspace root's lockfile:

| Lockfile                    | Command         |
| --------------------------- | --------------- |
| `pnpm-lock.yaml`            | `pnpm add …`    |
| `bun.lock` / `bun.lockb`    | `bun add …`     |
| `yarn.lock`                 | `yarn add …`    |
| `package-lock.json` or none | `npm install …` |

The package manager is spawned directly with an argument list, not through a shell. If installation fails, the CLI prints the exact command to run by hand.
