import { http } from "msw";
import { exercise } from "./exercise.resolver";

export const exerciseHandlers = [
    http.get("/api/exercises", exercise.success()),
];
