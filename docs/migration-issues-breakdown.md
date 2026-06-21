# React Native Migration: Proposed Issues Breakdown

This document outlines the proposed vertical tracer-bullet slices for migrating the Workout Tracker client from web (`react-client`) to a native application (`react-native-client`).

---

## Proposed Vertical Slices (Tracer Bullets)

### 1. Slice 1: Native App Bootstrap & Backend Token Auth Integration
*   **Description:** Initialize `/react-native-client` with Expo SDK and basic config. Modify NestJS `BackendAuthGuard` to accept Bearer tokens, and expose JWT strings on backend auth responses. Establish a running dev shell.
*   **Blocked by:** None - can start immediately.
*   **User stories covered:** User Story 1, 6.

### 2. Slice 2: Native Authentication & Secure Session Storage
*   **Description:** Implement login/signup screens, persist JWT token in `expo-secure-store` (keychain/keystore), write the custom API fetch client that injects the auth headers, and route-protect authenticated screens.
*   **Blocked by:** Slice 1.
*   **User stories covered:** User Story 1, 6.

### 3. Slice 3: Offline Caching & Synchronous Query/Mutation Store (MMKV)
*   **Description:** Set up TanStack Query, build the MMKV custom adapter for `PersistQueryClientProvider`, and configure mutation retry with offline queuing. Create a diagnostic screen proving offline caching works.
*   **Blocked by:** Slice 2.
*   **User stories covered:** User Story 5.

### 4. Slice 4: Exercise Catalog & Log Modules Migration
*   **Description:** Port the `exercises` and `logging` feature modules. Build the native Exercise Selector drawer, muscle group filter, custom exercise creator, and log set mutations. Verify data persistence in local MMKV cache.
*   **Blocked by:** Slice 3.
*   **User stories covered:** User Story 5, 6.

### 5. Slice 5: Rest Timer & Native Notifications
*   **Description:** Port the `rest-timer` module. Integrate `expo-notifications` and `expo-haptics` to allow rest timer updates and haptic alert vibrations when the device is locked/app is in the background.
*   **Blocked by:** Slice 3.
*   **User stories covered:** User Story 3.

### 6. Slice 6: Active Workout Session Coordination
*   **Description:** Port the `programmes` and `workouts` modules. Create the active workout UI, set logger cards, and active rest-timer overlay bridge. Ensure active session state persists synchronously in MMKV to survive OS-level app suspends.
*   **Blocked by:** Slice 4, Slice 5.
*   **User stories covered:** User Story 2.

### 7. Slice 7: Analytics Dashboard & Native Charts
*   **Description:** Port the `analytics` and `dashboard` screens. Implement GPU-accelerated Line, Bar, and Pie components using `victory-native` to display volume, muscle distribution, and fatigue trends.
*   **Blocked by:** Slice 6.
*   **User stories covered:** User Story 4.
