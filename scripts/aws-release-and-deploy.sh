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
version="$(cat .aws-release/version)"

pnpm release:preflight
pnpm turbo build --filter=...@hilum/catalog

git add "${PACKAGE_DIRS[@]/%//package.json}" "${PACKAGE_DIRS[@]/%//CHANGELOG.md}"
git commit -m "chore: release hilum ${version}"

for package_name in "${PACKAGE_NAMES[@]}"; do
  git tag -a "${package_name}@${version}" -m "${package_name}@${version}"
done

npm config set "//registry.npmjs.org/:_authToken" "${NPM_TOKEN}"
pnpm exec changeset publish --no-git-tag

git push origin "HEAD:${RELEASE_BRANCH}"
git push origin --tags

aws s3 sync apps/catalog/dist/client/assets "s3://${CATALOG_BUCKET_NAME}/assets" \
  --delete \
  --cache-control "public,max-age=31536000,immutable"

aws s3 sync apps/catalog/dist/client "s3://${CATALOG_BUCKET_NAME}" \
  --delete \
  --exclude "assets/*" \
  --exclude "*.html" \
  --cache-control "public,max-age=300"

aws s3 sync apps/catalog/dist/client "s3://${CATALOG_BUCKET_NAME}" \
  --delete \
  --exclude "*" \
  --include "*.html" \
  --cache-control "no-cache,no-store,must-revalidate"

aws cloudfront create-invalidation \
  --distribution-id "${CATALOG_CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths "/*"

echo "Published Hilum UI ${version} and deployed catalog."
