# Design Document: Rest Timer Header Integration And Minimize Flow

**Date:** 2026-03-24
**Status:** Draft

## Purpose
Expose the active rest timer in the workout page header as a small clickable time value, allow the full timer overlay to be minimized and reopened, and default new timers to the minimized state unless the caller explicitly chooses otherwise.

## Problem Statement
The current rest timer is global and persistent, but its UI always appears as an expanded floating overlay whenever a timer is active. This creates two gaps:

- The user has no compact way to keep track of the timer while focusing on the exercise list.
- The user cannot minimize the expanded timer and later restore it from the header.

The new design adds a header-level timer surface, explicit minimize behavior, and a page-header action injection mechanism that lets the timer participate in the header without tightly coupling `PageHeader` to rest-timer logic.

## User Experience

### Primary Flow
- A rest timer can be started with a new option that controls whether it begins minimized.
- The default start behavior is minimized.
- When minimized, the user sees a small text-style countdown value in the page header on the right side.
- Clicking the header timer value opens the full floating rest timer overlay.
- The expanded overlay includes an explicit minimize control.
- Clicking minimize hides the expanded overlay and returns the timer to its header-only representation.

### Visibility Rules
- The header timer value is shown while the timer is active, including when the timer is paused.
- The timer disappears when it finishes.
- If there is no mounted `PageHeader` context consumer for the current page, the timer falls back to floating-overlay behavior only.

### Replace-On-Restart Behavior
- Starting a new timer while another timer is active resets the timer to the new duration.
- If the current timer is expanded and a new timer is started with `startMinimized: true`, the UI switches to minimized.
- If the current timer is expanded and a new timer is started with `startMinimized: false`, the UI remains expanded.

## Scope

### In Scope
- Add minimized and expanded UI state to the global rest timer.
- Add a small header timer value component from the rest timer module.
- Add a page-header action injection context with merge behavior.
- Persist the timer minimized state in local storage with the existing timer state.
- Remove injected header actions when the timer finishes or stops.

### Out Of Scope
- Redesigning the visual language of `PageHeader`.
- Adding confirmation prompts when replacing an active timer.
- Persisting any overlay UI state beyond `isMinimized`.
- Changing the timer to remain visible after completion.

## Technical Architecture

### 1. Rest Timer Context
`RestTimerContext` remains the source of truth for the timer state and gains UI state needed by both the floating overlay and the header timer value.

New state:
- `isMinimized: boolean`

New actions:
- `openTimer(): void`
- `minimizeTimer(): void`

Updated action:
- `startTimer(seconds, { closeOnFinish?: boolean, startMinimized?: boolean })`

Behavior changes:
- `startMinimized` defaults to `true`.
- Starting a timer replaces any existing timer state.
- Expiry fully deactivates the timer so both the overlay and header action disappear.
- `isMinimized` is persisted with the rest of the timer state.

### 2. Page Header Action Context
A new page-header context will connect pages to `PageHeader` and expose action registration instead of requiring all actions to be passed directly through the `action` prop.

Requirements:
- The context exposes `addAction(...)`.
- `addAction(...)` returns an action id.
- The same context exposes a removal mechanism using that returned id.
- Multiple actions can coexist in the right slot with stable merge behavior.
- Existing page-level actions and injected actions render together in the header's right-side area.

Expected responsibilities:
- `PageHeader` reads the registered actions from context.
- Pages can still provide direct actions.
- Injected actions are ordered predictably and do not prevent existing actions from rendering.

### 3. Rest Timer Header Value
A small text-style `RestTimerHeaderValue` component will live in the rest timer module and register itself into the page-header context.

Requirements:
- It renders only when the timer is active.
- It displays the current formatted time value.
- It remains visible when the timer is paused.
- Clicking it opens the full overlay.
- It unregisters itself when the timer stops or expires.

### 4. Floating Overlay
The floating overlay remains the expanded interaction surface for timer controls.

Changes:
- It only renders when the timer is active and `isMinimized === false`.
- It includes an explicit minimize icon/button.
- Minimize does not stop or pause the timer.
- If no page header action host is available, the overlay still works as the timer's only UI surface.

## State Model

### Active Timer States
- `inactive`: no timer, no overlay, no header value
- `active + minimized`: timer visible in header only
- `active + expanded`: timer visible in overlay and optionally also represented in header registration state
- `active + paused + minimized`: timer visible in header, not counting down
- `active + paused + expanded`: timer visible in overlay, resumable

### State Transitions
- `startTimer(..., startMinimized: true)` -> active + minimized
- `startTimer(..., startMinimized: false)` -> active + expanded
- `openTimer()` -> active + expanded
- `minimizeTimer()` -> active + minimized
- `stopTimer()` -> inactive
- `expire` -> inactive

## Persistence
The existing local-storage payload in `RestTimerContext` will be extended to persist:

- `isMinimized`

Persistence rules:
- Timer duration and running state continue to restore as they do today.
- The restored UI state honors the last minimized state.
- Only `isMinimized` is persisted for UI behavior.

## Integration Notes

### Workout Session Page
- The workout session page header should host both the existing right-side action and the injected timer value.
- Merge behavior is required so the timer does not replace the current add-exercise action.

### Pages Without Header Registration
- Since `RestTimerProvider` is global, the timer may continue running across navigation.
- On pages that do not mount a `PageHeader` action host, the timer should remain controllable through the floating overlay only.
- No errors should occur when the timer cannot inject a header action.

## Implementation Notes
- Keep timer business state and timer UI state together in `RestTimerContext`.
- Keep the header timer value component in the rest timer module rather than making `PageHeader` timer-aware.
- Treat timer expiry as a full cleanup path that clears active timer state and unregisters the header action.
- The page-header context should be generic enough to support future injected actions beyond the rest timer.

## Acceptance Criteria

1. Starting a rest timer without specifying `startMinimized` opens the timer in minimized mode by default.
2. Starting a rest timer with `startMinimized: false` opens the timer in expanded floating-overlay mode.
3. While a timer is active and a page-header action host is mounted, a small text-style countdown value appears on the right side of the header.
4. The header timer value coexists with existing right-side header actions rather than replacing them.
5. Clicking the header timer value opens the full rest timer overlay.
6. The expanded overlay exposes an explicit minimize control.
7. Clicking minimize hides the expanded overlay without stopping or pausing the timer.
8. While minimized, the timer remains visible in the header even if the timer is paused.
9. Starting a new timer while another timer is active replaces the previous timer with the new duration.
10. If the current timer is expanded and the new timer is started with `startMinimized: true`, the timer switches to minimized state immediately.
11. If the current timer is expanded and the new timer is started with `startMinimized: false`, the timer stays expanded.
12. When the timer finishes, the timer is deactivated and the header timer value is removed.
13. When the timer stops manually, the header timer value is removed.
14. The page-header context returns an action id on registration and supports removing that action by id.
15. If no page-header action host is mounted, the timer continues to function through the floating overlay without errors.
16. The minimized state is restored after refresh when an active timer is rehydrated from local storage.

## Open Implementation Detail To Standardize In Code
- Whether merged header actions are rendered in registration order or according to an explicit priority field. This does not block implementation, but the behavior should be made deterministic.
