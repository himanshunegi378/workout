# Example: Route migration to screens pattern

## Task
Apply the screens-folder pattern across remaining feature folders.

## User Goal
Create a table of all routes and the feature folder they belong to, then move files so route-level screens follow the screens-folder pattern.

## Constraints
- Preserve existing behavior
- Follow the existing screens-folder convention already present in the repo
- Update imports after moves
- Ask only if ownership or architectural policy is ambiguous

## Acceptance Criteria
- All app routes are mapped to feature folders
- Each applicable route follows the screens-folder pattern
- Imports and exports are updated logically after the move
- Ambiguous ownership issues are documented explicitly

## Discovered Facts
- Confirmed: 18 routes were found
- Confirmed: 6 routes already follow the pattern
- Confirmed: 12 routes still need migration
- Inferred: Some shared components are intentionally colocated at the feature root
- Needs user decision: Billing ownership may be split between account and payments

## Decisions
- Shared components stay outside screens
- Only route-level files move under screens

## Outputs
- Route-to-feature mapping table
- Refactored folder structure
- Updated imports and exports

## Open Questions or Blockers
- Billing route ownership is ambiguous
  - Tried: Mapped files by current imports and folder ownership
  - Status: Unresolved
  - User input required: Yes
  - Next path: Pause only the billing subtree and continue the unambiguous migrations

## Example todo
- [x] Discover all app routes
- [x] Map routes to current feature folders
- [x] Save route mapping in task state
- [ ] Expand migration subtasks
  - [ ] Migrate settings/profile
  - [ ] Migrate settings/security
  - [ ] Migrate dashboard/overview
- [ ] Update imports and exports
- [ ] Run verification
- [ ] Summarize changes and remaining risks
