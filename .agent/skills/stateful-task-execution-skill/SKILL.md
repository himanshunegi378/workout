---
name: stateful-task-execution
description: Guides the AI through complex multi-step work using compact state tracking, dynamic todo planning, verification, and course correction. Use when the user asks for a refactor, migration, audit, repo-wide change, multi-file implementation, or wants the agent to document progress, keep a task list, adapt the plan as new facts appear, and surface blockers only when a policy or architecture decision is needed.
compatibility: Best for AI agents and environments where the AI can edit files or maintain a canvas/document during longer tasks.
metadata:
  author: Generated from user workflow
  version: 0.1.0
  category: workflow-automation
  tags: [task-management, agentic-workflows, planning, refactoring]
---

# Stateful Task Execution

## Purpose
Use this skill for complex work that benefits from a compact state document, a dynamic todo list, explicit verification, and controlled replanning.

This skill is especially useful for:
- repo-wide refactors
- folder-structure migrations
- multi-step feature implementation
- audits that later turn into changes
- tasks where discoveries during execution change the remaining plan

## Outcomes
By the end of the task, the AI should have:
- kept a compact record of durable facts, decisions, blockers, and outputs
- maintained a dynamic todo list with evolving subtasks
- verified meaningful changes before marking work complete
- asked the user only when a real policy or architecture choice is needed
- produced a clear summary of what changed, risks, and unresolved items

## Core principles

### 1. Separate facts from execution control
Maintain two artifacts:

1. task.md or equivalent
   - current goal
   - constraints
   - acceptance criteria
   - discovered facts
   - decisions
   - blockers
   - outputs

2. todo.md or equivalent
   - checklist of remaining work
   - nested subtasks when scope becomes clearer
   - exactly one current unit of work at a time

If the environment does not support files, maintain the same structure in a canvas, scratch document, or compact chat-visible state block.

### 2. Rewrite state instead of appending logs
State should reflect current truth, not a running diary.

Do:
- compress aggressively
- replace stale facts with current facts
- remove completed or irrelevant notes
- keep only durable information that helps future steps

Do not:
- dump full chain of thought
- keep repetitive status logs
- record every command or tool call
- preserve outdated assumptions once corrected

### 3. Discovery first, execution second
Start by understanding the landscape before making broad changes.

Typical early tasks:
- identify scope
- map current structure
- find patterns already in use
- identify ambiguities and risk areas
- define acceptance criteria

Only after discovery should you expand the plan into route-level, file-level, or module-level subtasks.

### 4. Verify before marking done
After each meaningful step:
- confirm the result
- update durable facts
- mark the todo item complete only if verified
- refine downstream subtasks if the new information changes scope

### 5. Escalate only for policy or architecture ambiguity
Self-correct local technical issues such as:
- broken imports
- inferable naming inconsistencies
- small mismatches with existing conventions
- local plan updates caused by new discoveries

Ask the user only when the blocker affects policy, ownership, or architecture, such as:
- two valid target structures exist
- a public API may change
- cross-team ownership is unclear
- the desired convention conflicts with an established project rule

## Operating procedure

### Step 1: Normalize the task
Create or update the goal section with:
- user goal in one paragraph
- hard constraints
- acceptance criteria
- current known scope

### Step 2: Initialize the todo list
Create a short high-level todo list first.
Example:
- Discover current structure
- Map relevant modules or routes
- Propose or infer target structure
- Execute changes
- Verify behavior and summarize results

### Step 3: Run discovery
Inspect the codebase, artifacts, or documents needed to understand the task.
Capture only durable findings in task.md.
Mark uncertain items as one of:
- Confirmed
- Inferred
- Needs user decision

### Step 4: Expand the todo tree
Once the scope is clear, replace broad tasks with actionable subtasks.
Example:
- Migrate settings/profile screen files
- Migrate settings/security screen files
- Update shared imports
- Validate route ownership assumptions

### Step 5: Execute one unit at a time
Pick one actionable todo.
Complete it fully before moving to the next unless batching is clearly safer.
Keep user-visible progress updates concise and tied to milestones.

### Step 6: Verify
Use the strongest available checks for the environment:
- run tests or type checks when available
- inspect imports and references after moves
- confirm outputs, artifacts, or structure match the acceptance criteria
- note any residual risk explicitly

### Step 7: Replan when reality changes
If new information changes scope:
- update the facts section
- rewrite the remaining plan
- add or remove subtasks
- preserve only current blockers and current risks

### Step 8: Close out cleanly
Provide:
- completed work
- important decisions made
- remaining risks
- unresolved blockers
- recommended next steps only if needed

## Recommended task.md structure
Use the template in references/task-template.md.

Minimum sections:
- Task
- User Goal
- Constraints
- Acceptance Criteria
- Discovered Facts
- Decisions
- Outputs
- Open Questions or Blockers

## Recommended todo.md structure
Use the template in references/todo-template.md.

Rules:
- keep it hierarchical
- let discovery expand the plan
- do not keep stale subtasks
- mark items done only after verification
- keep exactly one active unit of work whenever practical

## Blocker protocol
When a blocker appears, record:
- what happened
- what was tried
- whether it was resolved
- whether user input is required
- the next chosen path

## Failure modes to avoid

### Over-documentation
A task document that grows into a diary becomes useless.
Compress it.
Keep only durable facts and decisions.

### Frozen plans
Do not lock the todo tree too early.
Broad tasks should become detailed only after discovery.

### Facts mixed with guesses
Label uncertain statements clearly.
Do not treat inference as confirmation.

### Excessive escalation
Do not interrupt the user for every uncertainty.
Resolve local technical issues yourself when the project pattern is reasonably inferable.

### Blind continuation after a blocker
Do not keep pushing forward without updating state.
Whenever the plan changes, rewrite the task and todo artifacts to match the new reality.

## Example workflow
A route migration usually has two phases.

### Phase 1: Discovery
- enumerate routes
- map each route to current feature ownership
- identify which areas already follow the target pattern
- identify ambiguous ownership or shared modules

### Phase 2: Migration
- create per-route subtasks
- move route-level files
- update imports and exports
- run validation checks
- summarize changes and remaining risks

See references/examples/route-migration-example.md for a concrete example.

## Quality bar
A good run should show these traits:
- the state remains compact and readable
- the plan becomes more specific as facts improve
- completed items are actually verified
- blockers are visible and actionable
- the final summary explains what changed and what still needs attention

## Final reminder
The purpose of this skill is not to create more documentation.
The purpose is to create the minimum state needed for reliable execution.
