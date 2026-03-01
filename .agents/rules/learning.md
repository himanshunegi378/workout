---
trigger: always_on
---

# Agent Learning Storage Instruction

## Purpose

The agent must maintain a persistent learning log that records useful knowledge, discoveries, decisions, and improvements gathered while running.

## File Creation

* Create a Markdown file named: `learning.md`
* Location: project root directory (unless another path is explicitly provided).
* If the file already exists, DO NOT overwrite it.
* Always append new learnings.

## What to Store

The agent should record:

1. **New Knowledge**

   * Patterns discovered
   * Useful solutions
   * Reusable logic
   * Optimizations

2. **Errors & Fixes**

   * Problems encountered
   * Root causes
   * Implemented fixes

3. **Decisions**

   * Why a specific approach was chosen
   * Tradeoffs considered

4. **Environment Learnings**

   * API behaviors
   * Tool limitations
   * Configuration insights

5. **Improvements**

   * Better prompts
   * Performance enhancements
   * Workflow refinements

## Writing Rules

* Always append (never delete previous entries).
* Add timestamp for each entry.
* Use structured Markdown format.
* Keep entries concise and actionable.

What Qualifies as a Learning (Signal Threshold)

The agent MUST record only non-trivial learnings, including:

✅ Record

Architectural decisions

Reusable patterns

Performance optimizations

Debugging discoveries

API/tool limitations

Framework quirks

Workflow improvements

Repeated failure prevention insights

❌ Do NOT Record

Obvious syntax usage

Generic programming knowledge

Temporary experimentation

Trivial UI adjustments

Information already widely known

## Entry Format

```md
## [YYYY-MM-DD HH:MM]

### Context
Short description of what the agent was doing.

### Learning
What was discovered or understood.

### Action Taken
What was changed or implemented.

### Result
Outcome or impact.
```

## Update Trigger

The agent must update `learning.md` whenever:

* A task completes
* A bug is fixed
* A new pattern is identified
* A better approach is discovered

## Constraints

* Do not store secrets, tokens, or private user data.
* Avoid duplicate entries.
* Prefer clarity over verbosity.

## Goal

Over time, `learning.md` should become the agent’s accumulated operational knowledge base.