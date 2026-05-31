# Task Memory Maintenance Rules

## Update Frequency

Update `.ai/active/task-state.md` after meaningful progress, not after every tiny file read.

Good update moments:

- After initial repo scan
- After finishing one feature, endpoint group, or domain
- After changing files
- After finding a blocker
- After changing the plan
- After memory cleanup
- Before the final response

## What Not To Store

Do not store:

- Full terminal logs
- Full source files
- Secrets, credentials, or private tokens
- Huge stack traces unless summarized
- Duplicate information already documented elsewhere
- Vague entries like "worked on code"
- Temporary notes after they have been resolved
- Scratch placeholder notes after initialization

## What To Store

Store:

- Task goal
- Current phase
- Exact constraints
- Important decisions
- Assumptions
- Blockers
- Completed work
- Next steps
- Verification status
- TTL labels for self-expiring entries

Prefer specific entries:

```md
- Scanned `app/api/**/route.ts`; found 12 route handlers.
- Documented auth behavior for `/api/users`.
- Need confirmation: `/api/reports/export` returns CSV but response headers are unclear.
```

Avoid vague entries:

```md
- Did some API work.
```

## Staleness Rule

If memory files are stale, update them.

If unsure whether they are stale, inspect the repo and record what changed.

## Command Discipline

For memory-only cleanup, do not inspect or run the app unless app behavior changed, verification state depends on runtime behavior, or the user explicitly asks for an app check. Record the skip reason in `.ai/active/verification.md`.

Run git checks only when the current workspace is a git repository. In temporary non-git workspaces, rely on file readback and explicit changed-file lists instead.

## Decay Rules

Classify each memory item during cleanup:

- Keep active: still needed for current or upcoming work.
- Compress: too detailed, but the summary still matters.
- Archive: historically useful, but not needed daily.
- Delete: stale, duplicated, wrong, temporary, or irrelevant.

Do not delete active user constraints, current goals, unresolved blockers, unresolved open questions, active done criteria, or decisions that still affect implementation unless the user approves or a superseding item is recorded.

## TTL Labels

Use TTL labels to avoid guessing during cleanup:

- `[ttl:session]`: delete after the current agent session.
- `[ttl:phase]`: delete or archive after the current phase.
- `[ttl:task]`: keep until the task is complete.
- `[ttl:permanent]`: keep unless explicitly superseded.
