# Continuation Prompt

Use this prompt when resuming a long-running task:

```txt
Use the task-memory skill.

Before continuing:
1. Read all files in `.ai/active/`.
2. Inspect `.ai/archive/` and `.ai/scratch/` only if needed.
3. Summarize:
   - current goal
   - completed work
   - next step
   - constraints
   - open questions
4. Continue from the next step.
5. Update `.ai/active/` files after meaningful progress.
6. Run memory cleanup after completing a major phase or if active memory is noisy.

Do not rely only on chat history.
```

## API Documentation Tasks

```txt
Use the task-memory skill.

Task:
Document all APIs in this Next.js app.

Before continuing:
1. Read `.ai/active/task-state.md`.
2. Read `.ai/active/decisions.md`.
3. Read `.ai/active/assumptions.md`.
4. Read `.ai/active/constraints.md`.
5. Read `.ai/active/verification.md`.
6. Read `.ai/active/memory-policy.md`.

Then continue documenting APIs.

Final output should be written to:

`docs/api-documentation.md`

Do not modify app logic.
Mark unclear API behavior as `Needs confirmation`.
Update `.ai/active/` memory files after each meaningful phase.
Archive completed phase summaries under `.ai/archive/completed-phases.md`.
Keep temporary route-scan notes in `.ai/scratch/temporary-notes.md` and delete or promote them during cleanup.
```

## Memory Cleanup

```txt
Use the task-memory skill.

Before continuing, perform memory cleanup.

Read `.ai/active/`, `.ai/archive/`, and `.ai/scratch/`.

If this is memory-only cleanup, do not inspect or run the app unless app behavior changed, verification state depends on runtime behavior, or the user explicitly asks for an app check.

Run git checks only when the current workspace is a git repository.

For each item:
- keep it active if it is needed for current or upcoming work
- compress it if it is too detailed
- archive it if it is historical but useful
- delete it if it is stale, duplicated, wrong, or no longer useful

Do not delete active user constraints, current goal, unresolved blockers, unresolved open questions, or current done criteria.

After cleanup, summarize:
1. what stayed active
2. what was archived
3. what was deleted
4. current next step
```
