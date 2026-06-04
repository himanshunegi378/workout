import { http } from "msw";
import { exercise } from "./exercise.resolver";

export const exerciseHandlers = [
    http.get("http://backend.test/api/exercises", exercise.success()),
];
