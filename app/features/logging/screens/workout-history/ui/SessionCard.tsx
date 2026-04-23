import { Dumbbell, Activity, Target } from "lucide-react";
import { ExerciseLogGroup } from "./ExerciseLogGroup";

/**
 * Represents the set shape rendered within each exercise group on a session card.
 */
type SessionCardExerciseSet = {
    id: string;
    weight: number | null;
    rpe: number | null;
    reps: number;
    set_order_index: number;
    pr_type?: string | null;
    isAdHoc?: boolean;
};

/**
 * Props for the SessionCard component.
 */
interface SessionCardProps {
    /** The display name of the workout. */
    workoutName: string;
    /** The name of the workout programme or group. */
    groupName: string;
    /** The start time of the session. */
    startTime: Date | string | null;
    /** The end time of the session. */
    endTime: Date | string | null;
    /** A collection of exercise logs grouped by exercise. */
    exerciseGroups: {
        exercise: { id: string; name: string; muscle_group: string };
        sets: SessionCardExerciseSet[];
    }[];
}

/**
 * A card component that displays a summary of a single workout session.
 * Shows session metadata (duration, volume, sets) and expands into individual exercise logs.
 * 
 * @param {SessionCardProps} props - The session data to display.
 * @returns {JSX.Element} The rendered session card.
 */
export function SessionCard({
    workoutName,
    groupName,
    startTime,
    endTime,
    exerciseGroups,
}: SessionCardProps) {
    const totalVolume = exerciseGroups.reduce((acc, group) => {
        return acc + group.sets.reduce((sAcc, set) => sAcc + (set.weight || 0) * set.reps, 0);
    }, 0);

    const totalSets = exerciseGroups.reduce((acc, group) => acc + group.sets.length, 0);
    const uniqueMuscleGroups = Array.from(new Set(exerciseGroups.map(g => g.exercise.muscle_group)));

    return (
        <section className="group relative border-b border-border/60 pb-6 text-card-foreground last:border-b-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        {groupName}
                    </p>
                    <h3 className="mt-2 truncate font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                        {workoutName}
                    </h3>
                </div>

                {startTime && endTime && (
                    <div className="inline-flex shrink-0 items-center rounded-full border border-border/60 bg-background/55 px-3 py-1.5 text-xs font-medium text-foreground/90">
                        {formatDuration(startTime, endTime)}
                    </div>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/85">
                <span className="flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-accent" />
                    {totalSets} sets
                </span>
                <span className="flex items-center gap-1.5">
                    <Dumbbell className="h-3.5 w-3.5 text-accent" />
                    {totalVolume.toLocaleString()}kg volume
                </span>
                <span className="flex items-center gap-1.5">
                    <Activity className="h-3.5 w-3.5 text-accent" />
                    {uniqueMuscleGroups.length} muscle groups
                </span>
            </div>

            <div className="mt-5 space-y-2">
                {exerciseGroups.map(({ exercise, sets }) => (
                    <ExerciseLogGroup
                        key={exercise.id}
                        exerciseId={exercise.id}
                        exerciseName={exercise.name}
                        muscleGroup={exercise.muscle_group}
                        sets={sets}
                        sessionDate={startTime instanceof Date ? startTime.toISOString() : startTime || undefined}
                    />
                ))}
            </div>
        </section>
    );
}

/**
 * Formats the duration between two dates into a user-friendly string.
 * E.g., "1h 20m" or "45m".
 * 
 * @param {Date | string} start - The starting time.
 * @param {Date | string} end - The ending time.
 * @returns {string} The formatted duration string.
 */
function formatDuration(start: Date | string, end: Date | string) {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const mins = Math.round(diff / 60_000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return hrs > 0 ? `${hrs}h ${rem}m` : `${rem}m`;
}
