---
name: task-memory
description: Maintains durable repo-level memory with active, archived, scratch, and decaying state for long-running coding, documentation, refactoring, migration, debugging, review, and agent tasks. Use when a task may span many agent messages, multiple files, multiple phases, or when important goals, decisions, constraints, assumptions, done criteria, progress, blockers, cleanup policy, TTL labels, or verification status must not be forgotten across context compaction or future sessions.
---

# Task Memory

Use this skill when task state needs to survive beyond chat history. The goal is to keep critical task knowledge in durable project files that can be reloaded before continuing work, while pruning details that no longer affect future decisions.

Conversation is temporary state. `.ai/` files are durable task state. Before relying on chat history, reload `.ai/` files.

Memory is not a transcript. Remember only what changes future decisions, verification, constraints, or next steps.

## Memory Files

Maintain this folder at the project root:

```txt
.ai/
  active/
    task-state.md
    decisions.md
    assumptions.md
    constraints.md
    verification.md
    memory-policy.md
  archive/
    completed-phases.md
    superseded-decisions.md
    old-assumptions.md
  scratch/
    temporary-notes.md
```

Use `.ai/active/` as the source of truth for the current task. Use `.ai/archive/` for compressed historical summaries. Use `.ai/scratch/` for temporary notes that are safe to delete.

## Workflow

### Start Or Resume

1. Check whether `.ai/` exists.
2. If it exists, read `.ai/active/` first, then inspect `.ai/archive/` and `.ai/scratch/` only as needed.
3. Summarize the current goal, completed work, next step, constraints, and open questions.
4. If `.ai/` does not exist, initialize it from `references/memory-file-templates.md` or run `scripts/init-task-memory.sh`.
5. After initialization, replace or remove any scratch placeholder notes before ending the session.

### During Work

Update memory after meaningful progress, not after every tiny action.

- Update `.ai/active/task-state.md` after completing a scan, changing files, finding an important issue, changing the plan, discovering a blocker, completing a phase, or before the final response.
- Update `.ai/active/decisions.md` when making or confirming a durable decision.
- Update `.ai/active/assumptions.md` when introducing, retiring, or verifying an assumption.
- Update `.ai/active/constraints.md` when the user gives a new hard rule.
- Update `.ai/active/verification.md` when defining done criteria, running checks, or recording known gaps.
- Use `.ai/scratch/temporary-notes.md` for short-lived reminders and delete or promote them during cleanup.
- Run git checks only when the current workspace is a git repository.

### Before Major Changes

1. Re-read `.ai/active/constraints.md`.
2. Re-read `.ai/active/decisions.md`.
3. Confirm the planned change does not violate them.
4. If there is a conflict, stop and ask the user.

### End Each Session

Before finishing a response:

1. Update `.ai/active/task-state.md`.
2. Update `.ai/active/verification.md` if checks were run or changed.
3. Run memory cleanup if the session was long, a phase ended, or `.ai/active/` became noisy.
4. Tell the user what was completed, what files changed, what remains, and any blockers or assumptions.

## Memory Decay And Cleanup

Task memory must stay small and relevant. Do not keep every detail forever.

Use four memory states:

1. Active: needed for the current task or next few steps.
2. Archived: historically useful, but not needed for daily work.
3. Scratch: temporary notes that are safe to delete.
4. Discarded: stale, duplicated, wrong, or irrelevant information that should be removed.

Run a memory review after every major phase, before starting a new task, when task direction changes, before ending a long session, or when `.ai/active/` becomes too large.

For memory-only cleanup, do not inspect or run the app unless app behavior changed, verification state depends on runtime behavior, or the user explicitly asks for an app check. Record the skip reason in `.ai/active/verification.md`.

For each memory item:

1. Keep active if it is needed for current or upcoming work.
2. Compress if it is too detailed.
3. Archive if it is historical but useful.
4. Delete if it is stale, duplicated, wrong, or no longer useful.

Do not delete active user constraints, current goals, unresolved blockers, unresolved open questions, active done criteria, or decisions that still affect current implementation unless the user approves or the superseding item is recorded.

After cleanup, update `.ai/active/task-state.md` with a short note covering what stayed active, what was archived, what was removed, and the current next step.

### TTL Labels

Use TTL labels when adding memory so cleanup can be deliberate:

- `[ttl:session]`: delete after the current agent session.
- `[ttl:phase]`: delete or archive after the current phase.
- `[ttl:task]`: keep until the task is complete.
- `[ttl:permanent]`: keep unless explicitly superseded.

## Conflict Rule

If chat history conflicts with `.ai/` memory files:

1. Prefer `.ai/active/` files for current task facts.
2. Prefer the latest explicit user instruction for direction.
3. If the conflict can cause wrong code or wrong documentation, ask for confirmation.
4. Record the resolution in `.ai/active/decisions.md`.

## Priority Order

When deciding what to do next:

1. Latest explicit user instruction
2. `.ai/active/constraints.md`
3. `.ai/active/decisions.md`
4. `.ai/active/task-state.md`
5. Current repo state
6. Older chat history

## Available Resources

- `references/memory-file-templates.md`: Default contents for each `.ai/` memory file.
- `references/continuation-prompt.md`: Prompts for resuming long-running work.
- `references/maintenance-rules.md`: Concise rules for memory quality and update frequency.
- `scripts/init-task-memory.sh`: Creates missing `.ai/active/`, `.ai/archive/`, and `.ai/scratch/` memory files without overwriting existing ones.

Run the script from the project root:

```bash
bash .claude/skills/task-memory/scripts/init-task-memory.sh
```
