# Releasing

Hilum UI publishes the five packages to **npm** in **lockstep** — one version covers all five (D4 in `PLATFORM_PLAN.md`).

## Workflow

CodeCommit is the source of truth. Every non-release push to `main` starts the AWS CodeBuild release job.

1. **Make changes.** Edit code and verify locally.

   ```bash
   pnpm typecheck
   pnpm test
   pnpm build
   ```

2. **Push to CodeCommit `main`.**

   ```bash
   git push codecommit main
   ```

3. **AWS publishes automatically.** The CodeBuild job:

   - bumps the lockstep patch version (`x.y.z` -> `x.y.z+1`);
   - runs typecheck, tests, and package builds;
   - publishes all five packages to npm;
   - commits `chore: release hilum <version>` back to CodeCommit;
   - creates per-package tags such as `@hilum/ui@3.8.1`;
   - builds and deploys the catalog to S3 + CloudFront.

Release commits are detected and skipped by the release job, so the pipeline does not loop forever.

## AWS setup

Terraform for the catalog/release stack lives in `infra/terraform/catalog`.

The pipeline requires the npm automation token to be stored as a plain secret string:

```bash
aws secretsmanager put-secret-value \
  --secret-id hilum-ui/prod/npm-token \
  --secret-string '<npm automation token>'
```

The CodeBuild role reads this secret and uses it only for `npm publish`.

## Local publish (escape hatch)

If you ever need to publish without going through CI:

```bash
# Authenticate to npm once (writes ~/.npmrc).
npm login

# Bump package versions manually if needed.
node scripts/aws-auto-version.mjs

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

The AWS mainline release job always emits an automatic patch release. Manual minor/major releases should be handled intentionally by editing package versions/changelogs or by reintroducing a one-off Changesets version step before pushing.

We are pre-1.0 (`0.x`). Until 1.0.0:
- Minor versions can include breaking changes (semver convention for 0.x).
- Major version 1.0.0 will be cut once Pappery successfully consumes all four packages and proves the API.
