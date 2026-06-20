### Task

Set up UI testing for the frontend application using **Vitest** with **MSW (Mock Service Worker)** for API mocking.

The objective is to create a reliable and scalable UI testing environment that supports:

* React component testing
* User interaction testing
* API mocking via MSW
* Test isolation
* Future expansion of test coverage

The setup must provide a clean developer experience and follow modern frontend testing practices.

---

### Constraints

* Use **Vitest** as the test runner (Jest is not allowed).
* Use **MSW** for all API/network mocking.
* Tests must run in a **jsdom** environment.
* Must support React + TypeScript.
* Must work with an existing **Vite** setup.
* No real network requests during tests.
* Configuration should remain minimal and maintainable.
* Tests must run via CLI without manual setup.
* Compatible with CI environments.

---

### Rules

#### Testing Rules

* Follow **Arrange → Act → Assert** pattern.
* Test user behavior, not implementation details.
* Prefer accessibility queries:

  * `getByRole`
  * `getByLabelText`
  * `getByText`
* Avoid querying by class names or IDs.
* Avoid snapshot testing unless justified.
* Tests must be deterministic and independent.

#### File Structure Rules

* Each component must have:

  ```
  ComponentName.test.tsx
  ```
* Shared utilities go inside:

  ```
  /test-utils
  ```

#### Mocking Rules (MSW)

* All API calls must be mocked using MSW.
* Do not mock `fetch` or `axios` directly.
* Handlers must live in:

  ```
  /mocks/handlers.ts
  ```
* MSW server setup must be centralized.
* Tests should override handlers only when required.
* Mock responses should resemble real API contracts.

#### Code Quality Rules

* No duplicated business logic inside tests.
* Tests must remain readable and intention-revealing.
* Keep setup reusable and DRY.

---

### Definition of Done

The task is complete when:

* Vitest is installed and configured.
* jsdom environment works correctly.
* MSW is fully integrated with Vitest lifecycle.
* No real API requests occur during tests.
* Tests run successfully using:

  ```
  npm run test
  ```
* Coverage reporting is enabled.
* Example tests exist demonstrating:

  * Component rendering
  * User interaction
  * API request mocked via MSW
* Centralized MSW setup (`setupTests.ts` or equivalent) exists.
* Documentation explains:

  * How to run tests
  * How to add new mocks
  * How to write UI tests
* Tests pass locally and in CI.

---

### Next Steps Once done with above task

* Create `renderWithProviders` helper for global providers (router, query client, theme).
* Add MSW scenario-based handlers (success/error/loading).
* Introduce coverage thresholds.
* Add CI test workflow.
* Start covering critical flows first (authentication, forms, data fetching screens).
