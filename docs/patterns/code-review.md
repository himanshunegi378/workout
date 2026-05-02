# Code Review Pattern

> This pattern has two parts: a **fixed checklist** for known problem classes, and a **dynamic review layer** to catch unknown problem classes. Both must be run on every review. The dynamic layer is what prevents the fixed checklist from creating blind spots.

A reusable checklist and instruction set for reviewing frontend code in this repository.
Generate a code review file with findings from each review session.

---

## 1. Code Quality
- **JSDoc**: Every new function, component, or hook must have a short JSDoc description.
- **Naming**: Variables and functions should be descriptive enough that their purpose is clear without comments.
- **Typing**: Strict TypeScript usage (no `any`, proper interface definitions).
- **Standards**: Adherence to the project's styling and architectural boundaries (e.g., cross-feature imports via `index.ts`).

## 2. Duplication & AI Slop
- **Redundancy**: Identify code that repeats logic already available in the component or via shared utilities.
- **AI Slop**: Remove verbose explanations of obvious code, "safety" code that isn't actually needed, and generic boilerplate that doesn't fit the project's premium aesthetic.
- **Refactoring**: If a pattern is repeated 2 or more times, consider extracting a helper or shared variant.

## 3. Complexity
- **State Management**: Avoid unnecessary state or complex `useEffect` chains. Prefer derived state where possible.
- **Component Size**: Ensure components remain focused. Extract sub-components if a file exceeds 200-300 lines or addresses multiple concerns.
- **Logic Flow**: Keep logic simple and readable. Avoid deeply nested ternaries or complex conditional rendering where a simple early return would suffice.

## 4. Logical Issues
- **Edge Cases**: Check for potential null/undefined errors, empty state handling, and loading states.
- **Performance**: Monitor for unnecessary re-renders or heavy computations during the render cycle.
- **Bugs**: Verify that the implemented logic actually solves the problem without introducing side effects or breaking existing functionality.


---

## Dynamic Review Layer

> This section exists specifically because a fixed checklist will always miss unknown problem classes. Run this AFTER the four pillars. The goal is to reason about the code without the checklist as a crutch.

### Step 1: Rotating Lens

Pick the lens below that has NOT been used in the last two reviews, and apply it to every changed file:

| Lens | Question to Ask |
|---|---|
| **Security** | Does any changed code expose user data, bypass authorization, or trust unvalidated input? (e.g., raw API payloads rendered in JSX, filter values passed unsanitized to queries) |
| **Race Conditions** | Can two concurrent events (two rapid clicks, fast tab switching, StrictMode double-invoke) produce an inconsistent state? |
| **Network Failure** | What happens if the API call inside this effect fails or is slow? Is there an error state, a retry, or does the UI silently freeze? |
| **Shared Package Impact** | Does a change in `packages/common` silently break mobile? Run a mental simulation: what does this component look like on a 375px screen with no mouse? |
| **Prop Contract Integrity** | Are optional props actually safe to omit? Does the component crash or render incorrectly when they are undefined? |
| **Memory / Subscription Leaks** | Are event listeners, intervals, or subscriptions cleaned up? Are debounced functions cancelled on unmount? |

### Step 2: Open-Ended Questions

After running the checklist, ask these questions without referencing the checklist. They are intentionally broad:

1. **What is the simplest thing that could go wrong here?** - Ignore architecture. Think about the user clicking the wrong button at the wrong time.
2. **What does this code assume is always true?** - Every assumption is a potential bug. List them. Are they valid?
3. **If this code was written by an AI assistant, what would it have gotten subtly wrong?** - AI tends to produce code that looks correct but misses edge cases in control flow, cleanup, and shared state.
4. **What would break if the data from the API was empty, null, or structured differently than expected?**
5. **Is there anything in this diff that is solving a problem that should not exist?** - Sometimes a complex workaround signals that a simpler architectural change is needed upstream.

### Step 3: Checklist Self-Update

At the end of every review, answer this: **Did I find an issue that is NOT covered by any item in Pillars 1-4?**

- If YES: Add it to the appropriate pillar in `docs/patterns/code-review.md` when the review scope includes process changes; otherwise call out the proposed checklist update in the review findings.
- If NO: Note it at the bottom of the review file as: `No new issue classes found this session.`

This keeps the pattern growing based on real issues found in this codebase, not generic best practices.

---

## Commit Scope Constraints

> Before starting a review, also verify the branch stays within its defined scope.

- [ ] Are there any unrelated files changed (e.g., `workspace_map.txt`, `tsc_output.txt`, build artifacts) included in the diff? These must not be committed.
- [ ] Does the diff touch shared/common packages (`packages/common`)? If so, verify mobile parity is not broken by web-specific additions.
- [ ] Are test files updated to reflect the new behavior? New features without test coverage are a risk.

---

## Output Format for review file

Each finding must include the following fields:

```
### [Severity Indicator] Short Title
- **Pillar:** Logical Issue / Duplication / Code Quality / Complexity
- **File:** [filename with link]
- **Lines:** L<start>-L<end>
- **Problem:** What the code does wrong.
- **Impact:** What breaks or degrades at runtime or maintainability.
```

Severity indicators:
- `CRITICAL` - Incorrect runtime behavior, data corruption risk
- `MAJOR` - Degrades UX, breaks reusability, or causes TS compile errors
- `MINOR` - Style, redundancy, or cleanup

---

## Lens Rotation Log

Track which lens was used each session to ensure rotation.

| Date | Branch | Lens Used |
|---|---|---|
