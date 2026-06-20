import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppShell } from "@/app/AppShell";
import { NotFound } from "@/app/NotFound";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import {
    AddExercisePage,
    AddProgrammePage,
    AddWorkoutPage,
    DashboardPage,
    ExerciseListPage,
    ExercisesPage,
    FeedbackPage,
    LogPage,
    SettingsPage,
    WorkoutListPage,
} from "@/pages/AppRoutes";

const router = createBrowserRouter([
    {
        element: <AppShell />,
        errorElement: <NotFound />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/signup", element: <SignupPage /> },
            { path: "/dashboard", element: <DashboardPage /> },
            { path: "/log", element: <LogPage /> },
            { path: "/exercises", element: <ExercisesPage /> },
            { path: "/exercises/new", element: <AddExercisePage /> },
            { path: "/programmes/new", element: <AddProgrammePage /> },
            { path: "/programmes/:programmeId", element: <WorkoutListPage /> },
            { path: "/programmes/:programmeId/workouts/new", element: <AddWorkoutPage /> },
            { path: "/programmes/:programmeId/workouts/:workoutId", element: <ExerciseListPage /> },
            { path: "/settings", element: <SettingsPage /> },
            { path: "/settings/feedback", element: <FeedbackPage /> },
            { path: "*", element: <NotFound /> },
        ],
    },
]);

/**
 * React Router entrypoint for the Vite client.
 */
export function App() {
    return <RouterProvider router={router} />;
}
