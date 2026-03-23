import { Dumbbell, Activity, Target } from "lucide-react";
import { ExerciseLogGroup } from "./ExerciseLogGroup";

/**
 * Props for the SessionCard component.
 */
interface SessionCardProps {
    /** The display name of the workout. */
    workoutName: string;
    /** The name of the workout programme or group. */
    groupName: string;
    /** The start time of the session. */
    startTime: Date | null;
    /** The end time of the session. */
    endTime: Date | null;
    /** A collection of exercise logs grouped by exercise. */
    exerciseGroups: {
        exercise: { id: string; name: string; muscle_group: string };
        sets: { id: string; weight: number | null; rpe: number | null; reps: number }[];
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
        <div className="group relative rounded-[1.5rem] border border-border bg-card text-card-foreground transition-colors duration-200 hover:border-border/80">
            <div className="px-5 py-5 md:px-6 md:py-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            {groupName}
                        </p>
                        <h3 className="mt-2 truncate font-display text-xl font-semibold tracking-tight text-foreground">
                            {workoutName}
                        </h3>
                    </div>
                    {startTime && endTime && (
                        <div className="shrink-0 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground">
                            {formatDuration(startTime, endTime)}
                        </div>
                    )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
            </div>

            <div className="px-5 pb-5 md:px-6 md:pb-6">
                <div className="space-y-2">
                    {exerciseGroups.map(({ exercise, sets }) => (
                        <ExerciseLogGroup
                            key={exercise.id}
                            exerciseId={exercise.id}
                            exerciseName={exercise.name}
                            muscleGroup={exercise.muscle_group}
                            sets={sets}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

/**
 * Formats the duration between two dates into a user-friendly string.
 * E.g., "1h 20m" or "45m".
 * 
 * @param {Date} start - The starting time.
 * @param {Date} end - The ending time.
 * @returns {string} The formatted duration string.
 */
function formatDuration(start: Date, end: Date) {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const mins = Math.round(diff / 60_000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return hrs > 0 ? `${hrs}h ${rem}m` : `${rem}m`;
}
