#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

# Lint and type check
npm run lint
npm run build
