## User Story: Reliable Background Timer With Completion Notification

---

## **Context**

The application includes a timer feature implemented in React. Currently, the timer relies on JavaScript intervals (`setInterval`) which become throttled or paused when the browser tab or application is minimized, inactive, or the device enters sleep mode.

Because of browser lifecycle behavior:

* Timer callbacks may stop executing while the app is minimized.
* The timer may not finish at the correct time.
* Users may not receive notification when the timer completes in the background.

To ensure reliability, the timer must be redesigned to use **timestamp-based calculations** as the source of truth and support **background-safe completion detection** with user notifications.

The system must correctly determine timer state (running, paused, finished) regardless of app visibility or execution suspension.

---

## **User Story**

**As a user**,
I want the timer to continue progressing accurately even when the app is minimized or inactive,
so that I am notified as soon as the timer finishes without needing to keep the app open.

---

## **Acceptance Criteria (Testable)**

### **AC1 — Timer Accuracy Based on Real Time**

**Given** a timer is started with a defined duration
**When** the application tab is minimized or becomes inactive
**Then** the timer completion must be calculated using timestamps instead of interval ticks.

**Test Steps**

1. Start a 2-minute timer.
2. Minimize the browser for 90 seconds.
3. Restore the app.
4. Remaining time must be approximately 30 seconds (±1 second tolerance).

---

### **AC2 — Timer Completion Detection After Resume**

**Given** a running timer
**When** the timer duration elapses while the app is minimized
**Then** the application must immediately detect the timer as finished upon visibility restoration.

**Test Steps**

1. Start a 10-second timer.
2. Minimize app after 2 seconds.
3. Wait 15 seconds.
4. Restore app.
5. Timer state must be `finished` instantly without additional delay.

---

### **AC3 — User Notification on Completion**

**Given** notification permission is granted
**When** the timer finishes
**Then** a system notification must be displayed to the user.

**Test Steps**

1. Grant browser notification permission.
2. Start timer.
3. Allow timer to complete.
4. Verify OS-level notification appears.

---

### **AC4 — Pause State Preservation**

**Given** a timer is paused
**When** the app is minimized and later restored
**Then** elapsed time must not increase during the paused period.

**Test Steps**

1. Start timer.
2. Pause timer.
3. Minimize for 60 seconds.
4. Restore app.
5. Remaining time must remain unchanged.

---

### **AC5 — Resume After Pause Maintains Correct Timing**

**Given** a paused timer
**When** the user resumes the timer
**Then** elapsed time must exclude all paused durations.

**Test Steps**

1. Start 60-second timer.
2. Pause after 20 seconds.
3. Wait 30 seconds.
4. Resume timer.
5. Remaining time must be ~40 seconds.

---

### **AC6 — State Recovery on App Reload**

**Given** a timer is running
**When** the page is refreshed or reopened
**Then** the timer state must be reconstructed from persisted timestamps.

**Test Steps**

1. Start timer.
2. Refresh browser.
3. Timer continues with correct remaining time.

---

### **AC7 — Visibility Change Handling**

**Given** the app transitions from hidden → visible state
**When** visibility changes
**Then** timer completion must be recalculated immediately.

**Test Steps**

1. Start timer.
2. Switch browser tabs.
3. Return after duration elapsed.
4. Timer shows finished immediately.

---

## **Edge Cases to Be Handled**

### **EC1 — Interval Execution Stops**

* Timer logic must not depend on interval accuracy.
* Completion must rely on timestamp comparison.

---

### **EC2 — Device Sleep / Lock**

* If device sleeps longer than remaining duration, timer must finish immediately on wake.

---

### **EC3 — Multiple Visibility Changes**

* Repeated minimize/restore cycles must not duplicate notifications.

---

### **EC4 — Notification Permission Denied**

* Timer must still finish correctly without throwing errors.
* UI should reflect finished state even without notification.

---

### **EC5 — System Clock Drift**

* Timer calculations must always use current `Date.now()` comparison.
* No accumulated tick counters allowed.

---

### **EC6 — Timer Already Finished on Load**

* If persisted finish time is in the past, timer must initialize directly as `finished`.

---

### **EC7 — Paused While Minimized**

* Timer must remain paused regardless of elapsed real-world time.

---

## **Developer Responsibilities**

The developer will implement:

* Timestamp-based timer calculation (`startTime`, `duration`, `pausedDuration`)
* Explicit timer state machine:

  * `idle`
  * `running`
  * `paused`
  * `finished`
* Visibility change listener
* Persistent timer storage
* Notification triggering logic
* Duplicate notification prevention

---

## **Definition of Done**

The feature is considered complete when:

* All acceptance criteria pass manual testing.
* Timer behavior remains correct under minimized, inactive, sleep, refresh, and pause scenarios.
* Notifications trigger exactly once per timer completion.
* No reliance exists on interval tick counting for correctness.

---