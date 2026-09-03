# Gating CI on axe Watcher results

The framework examples in this repo (see [`js/`](../js) and [`java/`](../java))
show how to **run** an axe Watcher scan. These examples are one **optional**
way to work with a run's results afterward: pulling them into CI with the
[`axe-watcher-results`](https://github.com/dequelabs/axe-watcher-results) CLI
and turning them into a **pass/fail build gate**, so a build can fail on an
accessibility regression.

| Provider                   | Example                                                        |
| -------------------------- | -------------------------------------------------------------- |
| GitHub Actions             | [`github-actions/a11y-gate.yml`](github-actions/a11y-gate.yml) |
| GitLab CI                  | [`gitlab-ci/.gitlab-ci.yml`](gitlab-ci/.gitlab-ci.yml)         |
| Any (shell)                | [`shell/gate.sh`](shell/gate.sh)                               |
| Any (shell), by session ID | [`shell/session-results.sh`](shell/session-results.sh)         |

## The gating model

The CLI retrieves the axe Watcher run for a commit and **reflects the outcome
in its exit code** — so a CI step passes or fails based on that code:

```sh
axe-watcher-results sessions get "$AXE_PROJECT_ID" "$COMMIT_SHA" --format=json
```

Each example captures the exit code, prints a clear message per outcome, and
archives the JSON output as a build artifact.

> The provider examples gate on a **commit SHA** because that is the
> identifier CI already provides (GitHub `github.event.pull_request.head.sha`,
> GitLab `$CI_COMMIT_SHA`). `sessions get` also accepts a **session UUID** —
> see [By session ID](#by-session-id).

## By session ID

`sessions get` accepts a **session UUID** as well as a commit SHA. This is
useful when a step already knows the exact session to check — for example a
scan step that emits its session ID — so you gate on that session directly
instead of resolving one from the commit:

```sh
axe-watcher-results sessions get "$AXE_PROJECT_ID" "$SESSION_ID" --format=json
```

The exit-code gating is identical to the commit-SHA path. Two session-only
options:

- `--detail=summary` (default) — the counts report, rendered per `--format`.
- `--detail=full` — streams the raw axe Common Export Format JSON to stdout
  (ignores `--format`), handy to archive the complete result set.

See [`shell/session-results.sh`](shell/session-results.sh) for a runnable
version. The provider examples above use a commit SHA because CI supplies one
automatically; swap in a session UUID wherever you have one.

## Exit codes

| Code | Meaning                             | How the examples treat it |
| ---- | ----------------------------------- | ------------------------- |
| 0    | Success (under threshold)           | Pass the step             |
| 2    | Missing required argument / env var | Fail (misconfiguration)   |
| 3    | Invalid argument value              | Fail (misconfiguration)   |
| 9    | Server error from DevHub            | Fail, surfaced clearly    |
| 10   | Accessibility threshold exceeded    | **Fail — the core gate**  |
| 11   | Session polling timed out           | Fail, surfaced clearly    |
| 12   | No comparison data for this commit  | Policy choice (see below) |

**Exit 12 — no comparison data.** The commit has scan results but the server
has nothing to diff them against. The examples **fail by default** and print
how to recover:

- re-run the axe Watcher scan with `CI=true` (marks the session canonical, so
  it self-compares), or
- seed a baseline by scanning this commit again, or any earlier commit on the
  same branch.

Each example shows, in a comment, how to **warn instead of fail** (exit 0) if
your team prefers a softer policy while baselines are being established.

## Installing the CLI

Download the released binary for your runner's OS/arch from Agora. Each version
folder holds one binary per platform —
`axe-watcher-results/<version>/<os>/<arch>/axe-watcher-results` (`.exe` on
Windows) — for `linux/amd64`, `linux/arm64`, `darwin/arm64`, and
`windows/amd64`, alongside a `SHA256SUMS` manifest to verify the download and
the generated `usage.md`:

```sh
# TODO: set AGORA_BASE_URL to the published Agora repository base once the
# publish location is finalized (dequelabs/axe-watcher-results#36).
AGORA_BASE_URL="https://agora.dequecloud.com/artifactory/<repository>"
CLI_VERSION="1.0.0" # the axe-watcher-results release to install
os="$(uname -s | tr '[:upper:]' '[:lower:]')" # linux or darwin
arch="$(uname -m)"
case "$arch" in x86_64) arch=amd64 ;; aarch64) arch=arm64 ;; esac

curl -fsSL \
  "$AGORA_BASE_URL/axe-watcher-results/$CLI_VERSION/$os/$arch/axe-watcher-results" \
  -o axe-watcher-results
chmod +x axe-watcher-results
# Then put ./axe-watcher-results on your PATH. The CI examples do this per
# provider — e.g. the GitHub Actions example installs into "$RUNNER_TEMP/bin"
# and appends it to "$GITHUB_PATH".
```

## Secrets

`AXE_DEVHUB_API_KEY` is your axe Developer Hub API key, available from your
axe account settings — always source it from your provider's secret store —
GitHub Actions `secrets`, GitLab **masked** (and protected) CI/CD variables —
never inline it in the pipeline file. `AXE_PROJECT_ID` is the project UUID and
can be a plain variable.
