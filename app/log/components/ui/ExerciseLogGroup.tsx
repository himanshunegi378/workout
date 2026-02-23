import { Check } from "lucide-react";
import { muscleColorMap } from "@/app/components/ui";

interface SetRowProps {
    index: number;
    weight: number | null;
    reps: number;
}

export function SetRow({ index, weight, reps }: SetRowProps) {
    return (
        <div className="flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
                {index}
            </span>
            <div className="flex-1 flex items-center gap-2">
                <span className="font-display text-sm font-semibold text-foreground">
                    {weight ? `${weight}kg` : "BW"}
                </span>
                <span className="text-muted-foreground">×</span>
                <span className="font-display text-sm font-semibold text-foreground">
                    {reps}
                </span>
            </div>
            <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-success" />
            </div>
        </div>
    );
}

interface ExerciseLogGroupProps {
    exerciseName: string;
    muscleGroup: string;
    sets: { id: string; weight: number | null; reps: number }[];
}

export function ExerciseLogGroup({ exerciseName, muscleGroup, sets }: ExerciseLogGroupProps) {
    const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";

    return (
        <div className="px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
                <div className={`w-1.5 h-5 rounded-full ${colorClass}`} />
                <span className="font-display text-sm font-semibold">
                    {exerciseName}
                </span>
            </div>
            <div className="space-y-1 ml-3.5">
                {sets.map((log, si) => (
                    <SetRow
                        key={log.id}
                        index={si + 1}
                        weight={log.weight}
                        reps={log.reps}
                    />
                ))}
            </div>
        </div>
    );
}
