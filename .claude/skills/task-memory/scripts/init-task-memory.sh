#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-}"
if [ -z "$ROOT" ]; then
  ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
fi

TODAY="$(date +%F)"
MEMORY_DIR="$ROOT/.ai"
ACTIVE_DIR="$MEMORY_DIR/active"
ARCHIVE_DIR="$MEMORY_DIR/archive"
SCRATCH_DIR="$MEMORY_DIR/scratch"

mkdir -p "$ACTIVE_DIR" "$ARCHIVE_DIR" "$SCRATCH_DIR"

create_if_missing() {
  local file="$1"
  local content="$2"

  if [ ! -f "$file" ]; then
    printf "%s\n" "$content" > "$file"
    echo "created $file"
  else
    echo "exists $file"
  fi
}

create_if_missing "$ACTIVE_DIR/task-state.md" "# Task State

## Current Goal
Needs to be filled from the user's task.

## Current Phase
Initializing task memory.

## Completed
- Initialized task memory files.

## In Progress
- [ttl:session] Preparing to inspect the repo.

## Next Steps
- Read user task.
- Inspect relevant files.
- Define task-specific done criteria.

## Blockers
- None.

## Open Questions
- None.

## Last Updated
$TODAY

## Memory Review
- No cleanup run yet.
"

create_if_missing "$ACTIVE_DIR/decisions.md" "# Decisions

## $TODAY
- [ttl:task] Initialized durable task memory in .ai/.
"

create_if_missing "$ACTIVE_DIR/assumptions.md" "# Assumptions

## Active Assumptions
- None yet.

## Verified Facts
- None yet.
"

create_if_missing "$ACTIVE_DIR/constraints.md" "# Constraints

## User Constraints
- Follow the user's stated task.

## Safety Constraints
- Do not make unrelated changes.
- Do not invent behavior.
- Preserve existing app behavior unless explicitly asked to change it.

## Repo Constraints
- Follow existing project conventions.
- Prefer minimal focused edits.
"

create_if_missing "$ACTIVE_DIR/verification.md" "# Verification

## Done Criteria
- Task-specific done criteria have not been defined yet.

## Checks To Run
- Inspect relevant files.
- Run existing tests/lint/typecheck if appropriate and available.

## Checks Completed
- None yet.

## Known Gaps
- None yet.
"

create_if_missing "$ACTIVE_DIR/memory-policy.md" "# Memory Policy

## Goal

Keep task memory useful, small, and current. Memory should help continue work without rereading the whole chat or storing unnecessary history.

## Memory Tiers

### Active Memory
Keep only information needed for the current task or next few steps.

### Archived Memory
Move information here when it is no longer needed for daily work but may be useful later.

### Scratch Memory
Keep temporary working notes here. Scratch memory is safe to delete after review.

### Discarded Memory
Remove information that is stale, wrong, duplicated, or no longer useful.

## Cleanup Rules

Run memory cleanup:
- after completing a major phase
- before starting a new task
- when .ai/active/ becomes too large
- when task direction changes
- before ending a long agent session

## Never Delete Without Confirmation

Do not delete explicit user constraints, explicit user preferences, current task goals, unresolved open questions, unresolved blockers, active done criteria, or decisions that still affect current implementation.

## TTL Labels

- [ttl:session] Delete after the current agent session.
- [ttl:phase] Delete or archive after the current phase.
- [ttl:task] Keep until the task is complete.
- [ttl:permanent] Keep unless explicitly superseded.
"

create_if_missing "$ARCHIVE_DIR/completed-phases.md" "# Completed Phases

## $TODAY
- No completed phases archived yet.
"

create_if_missing "$ARCHIVE_DIR/superseded-decisions.md" "# Superseded Decisions

## $TODAY
- None yet.
"

create_if_missing "$ARCHIVE_DIR/old-assumptions.md" "# Old Assumptions

## $TODAY
- None yet.
"

create_if_missing "$SCRATCH_DIR/temporary-notes.md" "# Temporary Notes

- None.
"
