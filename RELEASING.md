# Releasing

Hilum UI publishes five packages to **npm** in **lockstep**: `@hilum/ui`, `@hilum/app-shell`, `@hilum/designer`, `@hilum/designer-canvas` and `@hilum/blocks`. One version covers all five (the Changesets `fixed` group in `.changeset/config.json`; D4 in `PLATFORM_PLAN.md`). The current line is **3.x**.

## Pipeline

CodeCommit is the source of truth. **Every push to `main` releases.** There is no manual gate, so check your work before pushing.

```
push to CodeCommit main
  → EventBridge (referenceUpdated on main, passes the pushed commit id)
  → CodeBuild project `*-release` (concurrent_build_limit = 1, builds that exact commit)
  → scripts/aws-release-and-deploy.sh
```

The script (`buildspec.aws-release.yml` → `scripts/aws-release-and-deploy.sh`):

1. Skips if the commit is itself a `chore: release hilum <version>` commit, so the pipeline doesn't loop.
2. **Versions** (`scripts/aws-auto-version.mjs`):
   - with pending changesets (`.changeset/*.md`), runs `changeset version`: the group bumps by the highest declared type, the changelogs get your entries, and the changeset files are deleted;
   - with none, does an automatic **patch** bump for all five packages and writes a generic changelog entry.
3. **Guard:** aborts if that version already exists on npm for any package.
4. Runs `pnpm release:preflight` (lint, typecheck, tests, package builds) and builds the catalog.
5. **Commit, tag and push first:** commits `chore: release hilum <version>`, tags `@hilum/<pkg>@<version>`, and runs `git push --atomic` for the branch and the tags. If `main` moved on in the meantime, the push is rejected and the build stops before anything is published. The newer commit's own build then does the release.
6. **Publishes** with `changeset publish --no-git-tag`. This only publishes versions npm doesn't have yet.
7. **Deploys the catalog** to S3 + CloudFront. New hashed assets go up first, then other files, then HTML. Only after that does a `--delete` pass remove stale objects, and then CloudFront is invalidated.

## Day-to-day workflow

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build   # = what CI runs
```

- **Patch-level change:** just push. The pipeline patch-bumps automatically.
- **Minor/major change,** or when you want a real changelog entry: add a changeset before pushing:

  ```bash
  pnpm changeset          # pick any package in the group, choose patch/minor/major, write the note
  git add .changeset && git commit
  git push codecommit main
  ```

  Changesets are consumed by the next release. Delete stale changesets whose change has already shipped, or they'll trigger a surprise bump.

## Recovery

- **Publish failed after the push** (the release commit and tags exist, npm doesn't have the version): the next push won't retry, because the release commit is skipped. From the release commit, run the following with npm credentials:

  ```bash
  pnpm install --frozen-lockfile && pnpm build:packages
  pnpm exec changeset publish --no-git-tag
  ```

  It publishes only the missing versions.
- **Guard tripped** ("already exists on npm"): the repo's version is behind npm. Bump the package versions to the latest published version in a commit, then push again.
- **Deploy failed after publish:** re-run the CodeBuild build for the release commit's parent, or deploy `apps/catalog/dist/client` by hand with the same `aws s3 sync` sequence as the script.

## AWS setup

Terraform for the catalog/release stack lives in `infra/terraform/catalog`. It covers the S3 bucket, CloudFront, the CodeBuild project, the EventBridge rule and target, and IAM.

The pipeline requires the npm automation token as a plain secret string:

```bash
aws secretsmanager put-secret-value \
  --secret-id hilum-ui/prod/npm-token \
  --secret-string '<npm automation token>'
```

The CodeBuild role reads this secret and uses it only for npm.

## Local publish (escape hatch)

Avoid this. It bypasses the push-first ordering. If you must:

```bash
npm login
node scripts/aws-auto-version.mjs   # consumes changesets or patch-bumps
pnpm release:preflight
git commit -am "chore: release hilum $(cat .aws-release/version)" && git push codecommit HEAD:main
pnpm exec changeset publish
```

Your npm account needs publish access to the `@hilum` org.

## Consumer setup

Apps install directly from npm, with no `.npmrc` configuration:

```bash
pnpm add @hilum/ui @hilum/app-shell lucide-react
# editor apps:
pnpm add @hilum/ui @hilum/app-shell @hilum/designer @hilum/designer-canvas lucide-react
```

`lucide-react` is a required peer of `@hilum/ui`, `@hilum/app-shell`, `@hilum/designer` and `@hilum/designer-canvas`. For Tailwind `@source` setup, see `packages/ui/README.md`.

## Versioning policy (semver, 3.x)

- **patch:** bug fixes, type-only changes, internal refactors with no API surface change.
- **minor:** new components, new props with backwards-compatible defaults, new optional services.
- **major:** breaking API changes, removed exports, or renamed props without aliases.

Because all five packages share one version, a major bump in any package bumps all of them.
