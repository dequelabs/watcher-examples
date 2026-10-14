#!/usr/bin/env bash
# Retrieve (and gate on) an axe Watcher run by SESSION ID.
#
# `sessions get` accepts a session UUID as well as a commit SHA. Use this when
# a step already knows the exact session to check — e.g. a Watcher scan step
# that emits its session ID — rather than resolving one from the commit. The
# exit-code gating is identical to the commit-SHA path (see gate.sh).
#
# Required environment:
#   AXE_DEVHUB_API_KEY  axe Developer Hub API key (store as a CI secret).
#   AXE_PROJECT_ID      Project UUID.
#   SESSION_ID          Session UUID to retrieve.

set -euo pipefail

: "${AXE_DEVHUB_API_KEY:?set AXE_DEVHUB_API_KEY (store it as a CI secret)}"
: "${AXE_PROJECT_ID:?set AXE_PROJECT_ID}"
: "${SESSION_ID:?set SESSION_ID to the session UUID to retrieve}"

# The summary report drives the pass/fail gate. Capture the exit code so each
# outcome gets a clear message instead of a generic failure.
set +e
axe-watcher-results sessions get "$AXE_PROJECT_ID" "$SESSION_ID" --format=json >summary.json
code=$?
set -e

cat summary.json

case "$code" in
  0)
    echo "Accessibility gate passed."
    ;;
  10)
    echo "Accessibility threshold exceeded — failing the build."
    exit 1
    ;;
  12)
    echo "No comparison data for session ${SESSION_ID}."
    echo "Recover by re-running the axe Watcher scan with CI=true, or by seeding a baseline."
    # Policy choice: fail the build. To warn instead, replace with: exit 0
    exit 1
    ;;
  11)
    echo "Timed out waiting for the session to finish processing."
    exit 1
    ;;
  9)
    echo "axe Watcher DevHub returned a server error."
    exit 1
    ;;
  2 | 3)
    echo "Configuration error — check AXE_DEVHUB_API_KEY, AXE_PROJECT_ID, and flags."
    exit 1
    ;;
  *)
    echo "axe-watcher-results exited with code ${code}."
    exit 1
    ;;
esac

# Optional: archive the complete result set. --detail=full streams the raw axe
# Common Export Format document to stdout and ignores --format. This is a
# best-effort extra: the gate already passed above, so a transient failure
# fetching the full document must not fail the build.
if axe-watcher-results sessions get "$AXE_PROJECT_ID" "$SESSION_ID" --detail=full >results-full.json; then
  echo "Wrote results-full.json"
else
  echo "Warning: could not fetch the full result set; skipping results-full.json." >&2
fi
