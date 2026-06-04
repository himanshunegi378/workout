import { Suspense, lazy } from "react";
import { useParams } from "react-router-dom";
import { PageShell, CardSkeletonList } from "@/components/ui";
import { PageHeader } from "@/features/page-header";
import { LoadingHeader } from "@/features/programmes/screens/workout-list/ui/LoadingHeader";
import { LoadingState } from "@/features/workouts/screens";
import { NotFound } from "@/app/NotFound";

// Lazy-loaded feature components to enable bundle code-splitting
const DashboardContent = lazy(() =>
  import("@/features/dashboard/screens").then((m) => ({ default: m.DashboardContent }))
);
const ExercisesContent = lazy(() =>
  import("@/features/exercises/screens").then((m) => ({ default: m.ExercisesContent }))
);
const AddExerciseForm = lazy(() =>
  import("@/features/exercises/screens").then((m) => ({ default: m.AddExerciseForm }))
);
const LogContent = lazy(() =>
  import("@/features/logging/screens").then((m) => ({ default: m.LogContent }))
);
const WorkoutListContent = lazy(() =>
  import("@/features/programmes/screens").then((m) => ({ default: m.WorkoutListContent }))
);
const AddProgrammeForm = lazy(() =>
  import("@/features/programmes/screens").then((m) => ({ default: m.AddProgrammeForm }))
);
const SettingsContent = lazy(() =>
  import("@/features/settings/screens").then((m) => ({ default: m.SettingsContent }))
);
const FeedbackForm = lazy(() =>
  import("@/features/settings/screens/feedback/FeedbackForm").then((m) => ({ default: m.FeedbackForm }))
);
const AddWorkoutForm = lazy(() =>
  import("@/features/workouts/screens").then((m) => ({ default: m.AddWorkoutForm }))
);
const ExerciseListContent = lazy(() =>
  import("@/features/workouts/screens").then((m) => ({ default: m.ExerciseListContent }))
);

export function DashboardPage() {
    return (
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted/20" />}>
            <DashboardContent />
        </Suspense>
    );
}

export function LogPage() {
    return (
        <PageShell
            size="xl"
            header={<PageHeader title="Workout Log" subtitle="History of previous sessions" />}
        >
            <Suspense fallback={<CardSkeletonList count={3} />}>
                <LogContent />
            </Suspense>
        </PageShell>
    );
}

export function ExercisesPage() {
    return (
        <PageShell
            size="xl"
            header={<PageHeader title="Exercises" subtitle="Browse and manage your exercise library" />}
        >
            <Suspense fallback={<CardSkeletonList count={6} />}>
                <ExercisesContent />
            </Suspense>
        </PageShell>
    );
}

export function AddExercisePage() {
    return (
        <PageShell
            size="md"
            spacing="comfortable"
            header={<PageHeader title="New Exercise" backHref="/exercises" showBackDefault />}
        >
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted/20" />}>
                <AddExerciseForm />
            </Suspense>
        </PageShell>
    );
}

export function AddProgrammePage() {
    return (
        <PageShell
            size="md"
            spacing="comfortable"
            header={<PageHeader title="New Program" backHref="/" showBackDefault />}
        >
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted/20" />}>
                <AddProgrammeForm />
            </Suspense>
        </PageShell>
    );
}

export function WorkoutListPage() {
    const { programmeId } = useParams<{ programmeId: string }>();

    if (!programmeId) return <NotFound />;

    return (
        <div className="min-h-screen pb-20">
            <Suspense fallback={<LoadingHeader />}>
                <WorkoutListContent programmeId={programmeId} />
            </Suspense>
        </div>
    );
}

export function AddWorkoutPage() {
    const { programmeId } = useParams<{ programmeId: string }>();

    if (!programmeId) return <NotFound />;

    return (
        <PageShell
            size="md"
            spacing="comfortable"
            header={<PageHeader title="New Workout" backHref={`/programmes/${programmeId}`} showBackDefault />}
        >
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted/20" />}>
                <AddWorkoutForm programmeId={programmeId} />
            </Suspense>
        </PageShell>
    );
}

export function ExerciseListPage() {
    const { programmeId, workoutId } = useParams<{ programmeId: string; workoutId: string }>();

    if (!programmeId || !workoutId) return <NotFound />;

    return (
        <Suspense fallback={<LoadingState programmeId={programmeId} />}>
            <ExerciseListContent programmeId={programmeId} workoutId={workoutId} />
        </Suspense>
    );
}

export function SettingsPage() {
    return (
        <PageShell size="lg" header={<PageHeader title="Settings" />}>
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
                <SettingsContent />
            </Suspense>
        </PageShell>
    );
}

export function FeedbackPage() {
    return (
        <PageShell
            size="md"
            header={<PageHeader title="Feedback" subtitle="Suggestions and issues" backHref="/settings" />}
        >
            <Suspense fallback={<div className="h-64 animate-pulse rounded-2xl bg-muted" />}>
                <FeedbackForm />
            </Suspense>
        </PageShell>
    );
}
