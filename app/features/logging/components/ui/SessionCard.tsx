import { ExerciseLogGroup } from "./ExerciseLogGroup";

interface SessionCardProps {
    workoutName: string;
    groupName: string;
    startTime: Date | null;
    endTime: Date | null;
    exerciseGroups: {
        exercise: { id: string; name: string; muscle_group: string };
        sets: { id: string; weight: number | null; reps: number }[];
    }[];
}

export function SessionCard({
    workoutName,
    groupName,
    startTime,
    endTime,
    exerciseGroups,
}: SessionCardProps) {
    return (
        <div className="bg-card text-card-foreground rounded-2xl border border-border overflow-hidden elevation-2">
            {/* Session header */}
            <div className="px-4 py-3 border-b border-border">
                <h3 className="font-display text-base font-semibold">
                    {workoutName}
                </h3>
                <p className="text-xs text-muted-foreground">
                    {groupName}
                    {startTime && endTime && (
                        <> · {formatDuration(startTime, endTime)}</>
                    )}
                </p>
            </div>

            {/* Exercise logs */}
            <div className="divide-y divide-border">
                {exerciseGroups.map(({ exercise, sets }) => (
                    <ExerciseLogGroup
                        key={exercise.id}
                        exerciseName={exercise.name}
                        muscleGroup={exercise.muscle_group}
                        sets={sets}
                    />
                ))}
            </div>
        </div>
    );
}

function formatDuration(start: Date, end: Date) {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const mins = Math.round(diff / 60_000);
    if (mins < 60) return `${mins}min`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `${hrs}h ${rem}min`;
}
