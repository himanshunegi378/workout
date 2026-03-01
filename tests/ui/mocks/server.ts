import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW server instance for Node-side request interception.
 *
 * Lifecycle is managed in `tests/ui/setup.ts`:
 * - `beforeAll` → server.listen()
 * - `afterEach` → server.resetHandlers()
 * - `afterAll`  → server.close()
 */
export const server = setupServer(...handlers);
