#!/usr/bin/env bash
# Packed-output smoke check: runs publint against each published package's
# `npm pack` output (exports/types/files consistency, missing dist files, …).
# Run after `pnpm build:packages`. Uses a pinned publint via npx so it doesn't
# need to be a workspace dependency.
set -euo pipefail

PUBLINT="publint@0.3.24"
status=0
for dir in packages/ui packages/app-shell packages/designer packages/designer-canvas packages/blocks; do
  echo "── ${dir}"
  if ! npx --yes "${PUBLINT}" run "${dir}" --strict --pack pnpm; then
    status=1
  fi
done
exit "${status}"
