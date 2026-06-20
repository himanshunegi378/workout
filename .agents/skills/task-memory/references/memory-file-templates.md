# Memory File Templates

Use these templates when initializing `.ai/` manually. Replace placeholders with task-specific content as soon as the task is clear.

## `.ai/active/task-state.md`

```md
# Task State

## Current Goal
Describe the user's actual task.

## Current Phase
Example: Initial scan / Implementation / Verification / Documentation / Cleanup.

## Completed
- Nothing yet.

## In Progress
- [ttl:session] Initializing task memory.

## Next Steps
- Inspect the repo.
- Identify relevant files.
- Start the first task phase.

## Blockers
- None.

## Open Questions
- None.

## Last Updated
YYYY-MM-DD

## Memory Review
- No cleanup run yet.
```

## `.ai/active/decisions.md`

```md
# Decisions

## YYYY-MM-DD
- [ttl:task] Initialized durable task memory in `.ai/`.
```

## `.ai/active/assumptions.md`

```md
# Assumptions

## Active Assumptions
- None yet.

## Verified Facts
- None yet.
```

## `.ai/active/constraints.md`

```md
# Constraints

## User Constraints
- Follow the user's stated task.

## Safety Constraints
- Do not make unrelated changes.
- Do not invent behavior.
- Preserve existing app behavior unless explicitly asked to change it.

## Repo Constraints
- Follow existing project conventions.
- Prefer minimal focused edits.
```

## `.ai/active/verification.md`

```md
# Verification

## Done Criteria
- Task-specific done criteria have not been defined yet.

## Checks To Run
- Inspect relevant files.
- Run existing tests/lint/typecheck if appropriate and available.

## Checks Completed
- None yet.

## Known Gaps
- None yet.
```

## `.ai/active/memory-policy.md`

```md
# Memory Policy

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

- After completing a major phase
- Before starting a new task
- When `.ai/active/` becomes too large
- When task direction changes
- Before ending a long agent session

## Cleanup Process

For each item in active memory:

1. Is it still needed for the current task?
   - Yes: keep active.
   - No: continue.
2. Could it help later?
   - Yes: summarize and move to archive.
   - No: delete.
3. Is it wrong or outdated?
   - Yes: remove or mark as superseded.
4. Is it duplicated?
   - Yes: keep the best version and remove the rest.

## Never Delete Without Confirmation

Do not delete:

- Explicit user constraints
- Explicit user preferences
- Current task goal
- Unresolved open questions
- Unresolved blockers
- Active done criteria
- Decisions that still affect current implementation

## Compression Rule

Prefer this:

- Scanned 18 API routes. 14 documented, 4 need auth confirmation.

Instead of this:

- Full list of every file read
- Full terminal output
- Long conversation transcript
```

## `.ai/archive/completed-phases.md`

```md
# Completed Phases

## YYYY-MM-DD
- No completed phases archived yet.
```

## `.ai/archive/superseded-decisions.md`

```md
# Superseded Decisions

## YYYY-MM-DD
- None yet.
```

## `.ai/archive/old-assumptions.md`

```md
# Old Assumptions

## YYYY-MM-DD
- None yet.
```

## `.ai/scratch/temporary-notes.md`

```md
# Temporary Notes

- None.
```
