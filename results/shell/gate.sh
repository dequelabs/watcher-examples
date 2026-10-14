#!/usr/bin/env bash
# Provider-agnostic axe Watcher accessibility gate.
#
# Retrieves the latest axe Watcher run for a commit and turns the CLI's exit
# code into a pass/fail decision. Wire this into any CI provider (see the
# ../github-actions and ../gitlab-ci examples for provider-specific versions).
#
# Required environment:
#   AXE_DEVHUB_API_KEY  axe Developer Hub API key (store as a CI secret).
#   AXE_PROJECT_ID      Project UUID.
#   COMMIT_SHA          Commit to gate on. In GitHub Actions on pull_request use
#                       github.event.pull_request.head.sha (github.sha is the
#                       merge commit, which Watcher did not scan); GitLab
#                       $CI_COMMIT_SHA; CircleCI $CIRCLE_SHA1; Jenkins $GIT_COMMIT.
#
# This gate resolves the run by COMMIT SHA — the identifier CI hands you for
# free. `sessions get` also accepts a session UUID; to gate on or fetch a
# specific session instead, see session-results.sh.

set -euo pipefail

: "${AXE_DEVHUB_API_KEY:?set AXE_DEVHUB_API_KEY (store it as a CI secret)}"
: "${AXE_PROJECT_ID:?set AXE_PROJECT_ID}"
: "${COMMIT_SHA:?set COMMIT_SHA to the commit you want to gate on}"

# Capture the exit code rather than letting a non-zero result abort the script,
# so each meaningful outcome gets a clear message instead of a generic failure.
set +e
axe-watcher-results sessions get "$AXE_PROJECT_ID" "$COMMIT_SHA" --format=json >result.json
code=$?
set -e

cat result.json

case "$code" in
  0)
    echo "Accessibility gate passed."
    ;;
  10)
    echo "Accessibility threshold exceeded — failing the build."
    exit 1
    ;;
  12)
    echo "No comparison data for commit ${COMMIT_SHA}."
    echo "Recover by re-running the axe Watcher scan with CI=true, or by seeding a"
    echo "baseline (a prior scan on this commit, or any earlier commit on the branch)."
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
