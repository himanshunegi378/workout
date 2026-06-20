# Code Review Pattern

> This pattern has two parts: a **fixed checklist** for known problem classes, and a **dynamic review layer** to catch unknown problem classes. Both must be run on every review. The dynamic layer is what prevents the fixed checklist from creating blind spots.

A reusable checklist and instruction set for reviewing frontend code in this repository.
Generate a code review file with findings from each review session.

---

## How to Use

1. Generate a diff patch of the branch against `master` for frontend directory:
   ```bash
   git diff master..<branch-name> > branch_diff_patch.patch
   ```
2. Review the patch against the four pillars below.
3. Write findings into `ai-docs/review/<file name>` with file links, problem statements, and impact.

---

## Pillar 1: Logical Issues

> These are the most critical. Bugs that ship silently and surface at runtime.

### Checklist

- [ ] **Debounce misuse**: Is debounce applied to non-search triggers like pagination or hard filters? Debounce must ONLY wrap `searchText` changes. Page, limit, and filter changes require immediate API calls.
- [ ] **Client-side operations on server-paginated data**: Is sorting, filtering, or searching happening locally on a paginated subset of data? Any sorting/filtering flag enabled on a server-side paginated list MUST be backed by a corresponding API callback (`onSort`, `onFilterChange`). Local fallbacks on paginated data produce incorrect results.
- [ ] **Missing cleanup**: Are debounced or async effects returning a cleanup function (e.g., `debouncedFetch.cancel()`)? Missing cleanup can trigger state updates on unmounted components.
- [ ] **Effect dependency completeness**: Are all values read inside `useEffect` listed in the dependency array? Missing deps lead to stale closures. Extra deps lead to unnecessary re-fetches.
- [ ] **Conditional API calls inside effects**: If an API call inside `useEffect` is conditional (e.g., `if (pmsDetails?.id)`), verify it does not cause a permanent no-fetch state on initial load when the condition is false.
- [ ] **Type coercion in API payloads**: Are filter values being cast with `as number` before being passed to API params without a null/undefined guard? Passing `undefined as number` yields `NaN` or unexpected results.
- [ ] **Collapsed persisted statuses**: Do new database fields use a vague boolean/status that merges distinct states such as not applicable, not configured, missing dependency, provider failure, skipped, and sent? Persisted state must preserve the distinctions needed for admin views, retries, analytics, and support.

---

## Pillar 2: Duplication / AI Slop

> Code that is bloated, redundant, or leaks context-specific knowledge into generic abstractions.

### Checklist

- [ ] **Business logic in generic components**: Does a reusable component (e.g., `Table`, `Modal`, `SearchBar`) contain hardcoded domain-specific keys (e.g., `role_id`, `pms_id`, `asset_id`)? Generic components must be domain-agnostic. Domain logic belongs in the page/module layer.
- [ ] **Duplicated comments or JSDoc blocks**: Are any comment blocks or JSDoc descriptions copy-pasted consecutively without changes? Delete duplicates.
- [ ] **Dead code and unused props**: Are props or config options declared in an interface but never passed or consumed? Remove them.
- [ ] **Redundant state variables**: Is there state that mirrors Redux store values or can be derived from existing state? Eliminate redundant local state.
- [ ] **Repeated inline style objects**: Are the same padding, color, or layout values repeated across multiple style blocks without using a shared theme token? Extract into the `styles` object or use `theme.*` tokens.

---

## Pillar 3: Code Quality

### TypeScript

- [ ] **Avoid `any` escape hatches**: Usage of `as any`, `as unknown as T`, or `// @ts-ignore` must be justified with a comment. Every occurrence is a potential silent runtime error.
- [ ] **`unknown` indexing**: Does any code index an `unknown`-typed variable without a type guard or cast? TypeScript strict mode will reject this. Example: `(acc as Record<string, unknown>)[part]`.
- [ ] **Loose action types**: Are Redux action creators using `Record<string, any>` for payloads? Type payloads explicitly with dedicated interfaces to get compile-time safety across the saga/reducer chain.
- [ ] **Consistent naming**: Do exported types follow the `I` prefix convention used in this codebase (e.g., `IColumn`, `IFilterConfig`, `IPaginationConfig`)?

### React / React Native

- [ ] **Stable callback references**: Are callbacks defined inline inside JSX (e.g., `onPress={() => setPage(1)}`)? Prefer `useCallback` for handlers passed to heavy child components.
- [ ] **`useMemo` dependency hygiene**: Are all variables read inside `useMemo` listed as dependencies? Omissions cause stale memoized values.
- [ ] **Web-specific styles in shared components**: Is any style using web-only values (e.g., `'max-content'`, `'100vh'`, `cursor`) in a component inside `packages/common`? These break React Native mobile builds.

---

## Pillar 4: Complexity

### Checklist

- [ ] **Mixed responsibilities in `useEffect`**: Does a single effect handle initialization, search, filter, AND pagination? Split effects by concern. One effect for one responsibility.
- [ ] **Oversized memoized blocks**: Is a `useMemo` computing more than one logical concern (search + filter + sort all in one)? Break it into discrete derived values.
- [ ] **Local fallbacks that duplicate server-side logic**: If the parent already handles filtering/sorting server-side via callbacks, does the component also contain a full local implementation as a fallback? Decide on one source of truth. Keep the fallback only if local mode is a documented requirement.
- [ ] **Deeply nested ternaries in JSX**: Are there more than 2 levels of conditional JSX nesting? Extract into named variables or sub-components.
- [ ] **Recursive helpers defined inside `useMemo`**: Are utility functions (e.g., `flattenHierarchy`) defined inside a memoized block? Move them outside the component or into a `utils/` file.

---

## Pillar 5: Domain & Architecture

> Ensures the implementation respects domain boundaries, separates concerns, and maintains a predictable structure.

### Checklist

- [ ] **Business logic in UI components**: Is heavy business logic (e.g., volume calculations, session progress, complex state transitions) residing directly inside a React component? Extract into utility modules (`progress.ts`) or custom hooks (`useWorkoutSession`).
- [ ] **Feature Boundary Violations**: Are there "deep imports" into other features (e.g., `import { X } from "@/app/features/other/ui/SubComponent"`)? Cross-feature communication must go through the feature's public `index.ts`.
- [ ] **Orchestration vs. Rendering**: Is a view component coordinating side effects (e.g., starting timers, triggering PR celebrations, optimistic UI) directly in its handlers? Move orchestration logic to a feature-local hook.
- [ ] **Predictable Structure**: Does the folder structure follow the established pattern (`api/`, `hooks/`, `screens/`, `ui/`)? New files must be placed in their respective functional directories.
- [ ] **Centralized Data Types**: Are complex data types (e.g., API responses, shared entities) defined locally in hooks or components? Centralize them in the feature's `types.ts` to ensure single source of truth and avoid redundant declarations.

---

## Dynamic Review Layer

> This section exists specifically because a fixed checklist will always miss unknown problem classes. Run this AFTER the four pillars. The goal is to reason about the code without the checklist as a crutch.

### Step 0: Hostile Senior Reviewer Pass

Before using the rotating lens, review the diff as if you actively dislike the implementation and are trying to stop a polished-looking bug from shipping. Be direct, skeptical, and specific. The goal is not to be rude in the written findings; the goal is to force sharper reasoning before writing them.

Ask:

1. **What user-visible promise does this diff now make, and where can that promise become false?**
2. **Which states are being collapsed into one boolean, status, fallback, or generic error?** Separate "not applicable", "not configured", "missing data", "provider failed", "validation failed", and "success" if they have different operational meaning.
3. **What happens when the happy path succeeds but the bookkeeping fails afterward?** Look for saved records followed by secondary saves, notifications, audit logs, cache invalidation, or analytics.
4. **What happens when the secondary work fails but the primary action succeeds?** Decide whether that should be visible to users, admins, retries, or metrics.
5. **What production dependency is assumed to exist?** Check environment variables, uploaded files, public assets, external APIs, mail providers, time zones, and deployment paths.
6. **What exact string, enum, filename, or route is now a hidden contract?** Hardcoded values must be treated as API contracts and reviewed for drift.
7. **Can this leak, misreport, duplicate, or silently drop data under retries or concurrent submissions?**
8. **If an admin or future automation reads the new stored fields, what wrong action could they take because the state is too vague?**

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

- If YES: Add it to the appropriate pillar as a new checklist item. Commit the updated `review-pattern.md` along with the review findings.
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
- **Pillar:** Logical Issue / Duplication / Code Quality / Complexity / Domain & Architecture
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
| 2026-04-23 | feature/apply-filters-search-pagination-userlist | (initial review, no lens applied yet) |