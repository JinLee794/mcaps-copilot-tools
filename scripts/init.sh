#!/usr/bin/env bash
# Cross-platform init wrapper — delegates to scripts/init.js
# Usage:  ./scripts/init.sh [--check]
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
exec node "$SCRIPT_DIR/init.js" "$@"
