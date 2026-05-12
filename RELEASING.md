# Releasing

Hilum UI publishes the five packages to **npm** in **lockstep** — one version covers all five (D4 in `PLATFORM_PLAN.md`).

## Workflow

1. **Make changes.** Edit code in `packages/*/src` and verify locally.

   ```bash
   pnpm typecheck
   pnpm test
   pnpm build
   ```

2. **Author a changeset.** Every PR that touches `packages/*` must include one.

   ```bash
   pnpm changeset
   ```

   Pick `patch`, `minor`, or `major`. Because of lockstep config (`fixed` array in `.changeset/config.json`), all four packages bump together — pick the level matching the **most-impactful change** in the PR.

   The CLI writes a `.changeset/<random>.md` file. Commit it.

3. **Open the PR.** CI runs typecheck + test + build + `changeset status`.

4. **Merge to `main`.** The `release` job opens or updates a "chore: release" PR that bumps versions and consolidates the changesets into `CHANGELOG.md` files.

5. **Merge the release PR.** GitHub Actions then publishes all five packages to npm with the new version.

## Local publish (escape hatch)

If you ever need to publish without going through CI:

```bash
# Authenticate to npm once (writes ~/.npmrc).
npm login

# Bump versions according to current changesets.
pnpm release:version

# Build and publish.
pnpm release:publish
```

Make sure your npm account has publish access to the `@hilum` org.

## Consumer setup

Apps that consume Hilum UI install directly from npm — no `.npmrc` configuration needed:


```bash
pnpm add @hilum/ui @hilum/app-shell
# or all four for an editor app:
pnpm add @hilum/ui @hilum/app-shell @hilum/designer @hilum/designer-canvas
```

## Versioning policy

- **patch** — bug fixes, type-only changes, internal refactors with no API surface change.
- **minor** — new components, new props with backwards-compatible defaults, new optional services.
- **major** — breaking API changes, removed exports, renamed props without aliases.

We are pre-1.0 (`0.x`). Until 1.0.0:
- Minor versions can include breaking changes (semver convention for 0.x).
- Major version 1.0.0 will be cut once Pappery successfully consumes all four packages and proves the API.
