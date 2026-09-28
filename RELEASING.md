# Releasing

Hilum UI publishes five packages to **npm** in **lockstep**: `@hilum/ui`, `@hilum/app-shell`, `@hilum/designer`, `@hilum/designer-canvas` and `@hilum/blocks`. One version covers all five (the Changesets `fixed` group in `.changeset/config.json`; D4 in `PLATFORM_PLAN.md`). The current line is **4.x**.

The repo lives at [github.com/hilum-labs/hilum-ui](https://github.com/hilum-labs/hilum-ui). Everything runs on GitHub Actions:

| Workflow                        | Trigger                                                 | Does                                                                                      |
| ------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `.github/workflows/ci.yml`      | every pull request, every push to `main`                | `pnpm verify:ci`, changeset status (PRs only), browser tests; uploads coverage            |
| `.github/workflows/release.yml` | push to `main`                                          | opens/updates the **Version Packages** PR, or publishes to npm once it is merged          |
| `.github/workflows/pages.yml`   | push to `main` touching the catalog/packages, or manual | builds the catalog and deploys it to GitHub Pages at [ui.hilum.dev](https://ui.hilum.dev) |

## Release flow

```
PR with a changeset ──merge──▶ main
  → release.yml: changesets/action opens/updates the "chore: version packages" PR
    (runs `pnpm release:version`: bumps the group, writes changelogs, deletes the changesets)
  → merge the Version Packages PR
  → release.yml: no changesets left, so it runs `pnpm release:publish`
    (build:packages → check:packages → changeset publish), tags @hilum/<pkg>@<version>,
    and creates GitHub releases
```

- Publishing uses **npm trusted publishing** (OIDC from GitHub Actions). There is no `NPM_TOKEN` secret. Every version is published **with provenance** (`NPM_CONFIG_PROVENANCE=true`), so npm shows a verified link back to the workflow run and commit.
- `changeset publish` only publishes versions npm doesn't have yet, so re-running a failed release job is safe.
- The catalog deploys on its own (`pages.yml`) whenever `main` changes something under `apps/catalog/` or `packages/`. It doesn't wait for a release. To redeploy by hand: Actions → **Deploy catalog** → Run workflow.

## Day-to-day workflow

```bash
pnpm verify   # the full local gate: verify:ci + changeset status against origin/main
```

- **Any change to a published package** (`packages/*`) needs a changeset, whatever its size. CI fails without one (`changeset status --since=origin/<base branch>`):

  ```bash
  pnpm changeset          # pick any package in the group, choose patch/minor/major, write the note
  git add .changeset && git commit
  ```

- **Catalog-only / tooling-only changes** (`apps/catalog`, root config, docs) need no changeset. The catalog redeploys on merge.
- Delete stale changesets whose change has already shipped, or they'll trigger a surprise bump.

## Pull request checks

`ci.yml` runs on Node 22 and pnpm 9 (from `packageManager`). It never publishes and has only `contents: read`. The `verify` job runs `pnpm verify:ci`, which is `pnpm verify` without the changeset step:

| Step             | Script                                                                         | Fails when                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Format           | `pnpm format:check` (Prettier)                                                 | any file isn't Prettier-formatted                                                                                  |
| Lint             | `pnpm lint` (turbo → `eslint src --max-warnings 0` per package, plus `tests/`) | any error **or warning**                                                                                           |
| Typecheck        | `pnpm typecheck`, `pnpm typecheck:tests`                                       | any TS error (packages, catalog, root `tests/`)                                                                    |
| Tests + coverage | `pnpm test:coverage` (`vitest run --coverage`)                                 | a failing test, or coverage below the `thresholds` in `vitest.config.ts` (70% lines/functions/branches/statements) |
| Package build    | `pnpm build:packages`, `pnpm check:packages` (publint)                         | build error, broken `exports`/`files`                                                                              |
| Bundle size      | `pnpm size` (size-limit, `.size-limit.js`)                                     | a dist entry exceeds its brotli budget                                                                             |
| Changeset (PRs)  | `pnpm changeset:status` with `DESTINATION_BRANCH` = the PR's base branch       | packages changed without a changeset                                                                               |

The `browser-tests` job installs Playwright Chromium and runs `pnpm test:browser` (vitest browser mode). Coverage is uploaded as the `coverage` artifact on every run.

## One-time setup

### npm: trusted publishers

For **each** of `@hilum/ui`, `@hilum/app-shell`, `@hilum/designer`, `@hilum/designer-canvas` and `@hilum/blocks`, on npmjs.com → package → **Settings** → **Trusted Publisher** → **GitHub Actions**:

- Organization or user: `hilum-labs`
- Repository: `hilum-ui`
- Workflow filename: `release.yml`
- Environment: leave empty

Then, under **Publishing access**, choose "Require two-factor authentication and disallow tokens" and revoke any old automation tokens. Trusted publishing needs npm CLI ≥ 11.5.1 (the workflow installs `npm@11`; npm 12 rejects the `--git-checks` flag pnpm passes through), and each package's `repository.url` must be `git+https://github.com/hilum-labs/hilum-ui.git`, as it already is.

### GitHub repository

- **Settings → Actions → General → Workflow permissions:** enable "Allow GitHub Actions to create and approve pull requests" so `changesets/action` can open the Version Packages PR.
- **Settings → Pages:** Source = **GitHub Actions**. Custom domain = `ui.hilum.dev`, then tick **Enforce HTTPS** once the certificate is issued. The deployed site also carries `CNAME` (from `apps/catalog/public/CNAME`).
- **Settings → Branches (or Rulesets) for `main`:** require a pull request, and require the **Verify** and **Browser tests** status checks to pass. Block force pushes.
- Optionally verify `hilum.dev` under **Settings → Pages → Verified domains** (org level) to prevent domain takeover.

### DNS

At the `hilum.dev` DNS provider, add a `CNAME` record `ui` → `hilum-labs.github.io`. Remove any old records for `ui` first.

## Recovery

- **Publish failed** (the Version Packages PR is merged but npm doesn't have the version): re-run the failed **Release** job from the Actions tab. `changeset publish` skips versions that already exist.
- **Trusted publishing error (`E404`/`ENEEDAUTH` on publish):** check the package's trusted publisher settings (org, repo, workflow filename `release.yml`) and that `repository.url` in its `package.json` matches the GitHub repo exactly.
- **Catalog deploy failed:** re-run **Deploy catalog**, or trigger it with **Run workflow**.

## Consumer setup

Apps install directly from npm, with no `.npmrc` configuration:

```bash
pnpm add @hilum/ui @hilum/app-shell lucide-react
# editor apps:
pnpm add @hilum/ui @hilum/app-shell @hilum/designer @hilum/designer-canvas lucide-react
```

`lucide-react` is a required peer of `@hilum/ui`, `@hilum/app-shell`, `@hilum/designer` and `@hilum/designer-canvas`. For Tailwind `@source` setup, see `packages/ui/README.md`.

## Versioning policy (semver, 4.x)

- **patch:** bug fixes, type-only changes, internal refactors with no API surface change.
- **minor:** new components, new props with backwards-compatible defaults, new optional services.
- **major:** breaking API changes, removed exports, or renamed props without aliases.

Because all five packages share one version, a major bump in any package bumps all of them.
