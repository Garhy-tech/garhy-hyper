#!/bin/bash
# Runs automatically after a task is merged into the main app.
# Keep it fast, idempotent, and non-interactive (stdin is closed).
set -euo pipefail

echo "[post-merge] Installing dependencies..."
# Sync node_modules with the merged package.json / package-lock.json.
# Use a clean, deterministic install when the lockfile is in sync; fall back to
# a regular install if the lockfile drifted (e.g. a merged task added a dep).
npm ci --no-audit --no-fund || npm install --no-audit --no-fund

echo "[post-merge] Done."
