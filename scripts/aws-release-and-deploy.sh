#!/usr/bin/env bash
set -euo pipefail

RELEASE_BRANCH="${RELEASE_BRANCH:-main}"
CODECOMMIT_REPO_NAME="${CODECOMMIT_REPO_NAME:-hilum-ui}"
AWS_REGION="${AWS_REGION:-us-east-1}"

PACKAGE_DIRS=(
  "packages/ui"
  "packages/app-shell"
  "packages/designer"
  "packages/designer-canvas"
  "packages/blocks"
)

PACKAGE_NAMES=(
  "@hilum/ui"
  "@hilum/app-shell"
  "@hilum/designer"
  "@hilum/designer-canvas"
  "@hilum/blocks"
)

latest_message="$(git log -1 --pretty=%B)"
if [[ "${latest_message}" == chore:\ release\ hilum* ]]; then
  echo "Release commit detected; skipping auto patch publish."
  exit 0
fi

if [[ -z "${NPM_TOKEN:-}" ]]; then
  echo "NPM_TOKEN is required. Store the npm automation token in the configured AWS Secrets Manager secret." >&2
  exit 1
fi

if [[ -z "${CATALOG_BUCKET_NAME:-}" || -z "${CATALOG_CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
  echo "CATALOG_BUCKET_NAME and CATALOG_CLOUDFRONT_DISTRIBUTION_ID are required." >&2
  exit 1
fi

git config --global user.name "${GIT_AUTHOR_NAME:-Hilum AWS Release Bot}"
git config --global user.email "${GIT_AUTHOR_EMAIL:-release-bot@hilum.dev}"
git config --global credential.helper '!aws codecommit credential-helper $@'
git config --global credential.UseHttpPath true
git remote set-url origin "https://git-codecommit.${AWS_REGION}.amazonaws.com/v1/repos/${CODECOMMIT_REPO_NAME}"

corepack enable
corepack prepare pnpm@9.0.0 --activate
pnpm install --frozen-lockfile

node scripts/aws-auto-version.mjs
version="$(tr -d '[:space:]' < .aws-release/version)"

# Guard: never try to publish a version npm already has. This happens when a
# previous run published but failed afterwards, or when someone published by
# hand. Abort rather than push a release commit npm will reject.
npm config set "//registry.npmjs.org/:_authToken" "${NPM_TOKEN}"
# (`npm view pkg@x.y.z` exits 0 with empty output for a missing version, so
# list all published versions instead; a registry/network error fails loudly.)
for package_name in "${PACKAGE_NAMES[@]}"; do
  published_versions="$(npm view "${package_name}" versions --json)"
  if VERSION="${version}" node -e 'const v=JSON.parse(require("fs").readFileSync(0,"utf8")); process.exit([].concat(v).includes(process.env.VERSION)?0:1)' <<<"${published_versions}"; then
    echo "${package_name}@${version} already exists on npm; aborting release. Bump the version (add a changeset) or reconcile the repo with npm first." >&2
    exit 1
  fi
done

pnpm release:preflight
pnpm turbo build --filter=...@hilum/catalog

# Commit + tag + push BEFORE publishing. If main moved on since the triggering
# commit (non-fast-forward) the push is rejected and we stop here with nothing
# published; the newer commit's own build will release instead. --atomic keeps
# the branch update and the tags all-or-nothing.
git add "${PACKAGE_DIRS[@]/%//package.json}" "${PACKAGE_DIRS[@]/%//CHANGELOG.md}" .changeset
git commit -m "chore: release hilum ${version}"

release_tags=()
for package_name in "${PACKAGE_NAMES[@]}"; do
  git tag -a "${package_name}@${version}" -m "${package_name}@${version}"
  release_tags+=("refs/tags/${package_name}@${version}")
done

git push --atomic origin "HEAD:refs/heads/${RELEASE_BRANCH}" "${release_tags[@]}"

# Publish only after the release commit is on the branch. If this step fails,
# re-run `pnpm exec changeset publish --no-git-tag` from the release commit:
# it publishes only the versions npm doesn't have yet.
pnpm exec changeset publish --no-git-tag

# Catalog deploy: upload new hashed assets first, then HTML (which references
# them), and only then delete stale objects — so no HTML is ever served that
# points at an asset that hasn't been uploaded yet or was already removed.
aws s3 sync apps/catalog/dist/client/assets "s3://${CATALOG_BUCKET_NAME}/assets" \
  --cache-control "public,max-age=31536000,immutable"

aws s3 sync apps/catalog/dist/client "s3://${CATALOG_BUCKET_NAME}" \
  --exclude "assets/*" \
  --exclude "*.html" \
  --cache-control "public,max-age=300"

aws s3 sync apps/catalog/dist/client "s3://${CATALOG_BUCKET_NAME}" \
  --exclude "*" \
  --include "*.html" \
  --cache-control "no-cache,no-store,must-revalidate"

# Stale-object cleanup. Everything current was uploaded above (identical
# sizes), so with --size-only this pass copies nothing and only removes
# objects that are no longer part of the build.
aws s3 sync apps/catalog/dist/client "s3://${CATALOG_BUCKET_NAME}" \
  --delete \
  --size-only

aws cloudfront create-invalidation \
  --distribution-id "${CATALOG_CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths "/*"

echo "Published Hilum UI ${version} and deployed catalog."
