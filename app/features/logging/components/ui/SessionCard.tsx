import { Dumbbell, Clock, Activity, Target } from "lucide-react";
import { ExerciseLogGroup } from "./ExerciseLogGroup";

interface SessionCardProps {
    workoutName: string;
    groupName: string;
    startTime: Date | null;
    endTime: Date | null;
    exerciseGroups: {
        exercise: { id: string; name: string; muscle_group: string };
        sets: { id: string; weight: number | null; rpe: number | null; reps: number }[];
    }[];
}

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
        <div className="group relative bg-card text-card-foreground rounded-[2rem] border border-border/60 overflow-hidden transition-all duration-300 hover:border-accent/40 elevation-2">
            {/* Session Hero Header */}
            <div className="relative px-6 py-6 bg-muted/20 border-b border-border/40 overflow-hidden">
                {/* Background decorative element */}
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest px-2 py-0.5 bg-accent/10 rounded-lg border border-accent/20">
                                {groupName}
                            </span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-foreground truncate tracking-tight">
                            {workoutName}
                        </h3>
                    </div>
                    {startTime && endTime && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-background/50 backdrop-blur-sm rounded-xl border border-border/40 shadow-sm shrink-0">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                            <span className="text-xs font-bold text-foreground">
                                {formatDuration(startTime, endTime)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Session Highlights */}
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/40 shadow-sm">
                        <Target className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-bold text-foreground">{totalSets} Sets</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border/40 shadow-sm">
                        <Dumbbell className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-bold text-foreground">{totalVolume.toLocaleString()}kg Volume</span>
                    </div>
                    <div className="flex -space-x-1.5 items-center ml-auto">
                        {uniqueMuscleGroups.slice(0, 3).map((mg, i) => (
                            <div 
                                key={mg} 
                                className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center elevation-1"
                                title={mg}
                            >
                                <Activity className="w-3 h-3 text-accent/70" />
                            </div>
                        ))}
                        {uniqueMuscleGroups.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground elevation-1">
                                +{uniqueMuscleGroups.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Exercise logs with improved visual rhythm */}
            <div className="p-2">
                <div className="divide-y divide-border/20 bg-muted/10 rounded-2xl border border-border/30">
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

function formatDuration(start: Date, end: Date) {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const mins = Math.round(diff / 60_000);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return hrs > 0 ? `${hrs}h ${rem}m` : `${rem}m`;
}
