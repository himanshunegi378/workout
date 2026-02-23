import { muscleColorMap } from "@/app/components/ui";

interface ExerciseListCardProps {
    name: string;
    description: string | null;
    muscleGroup: string;
}

export function ExerciseListCard({ name, description, muscleGroup }: ExerciseListCardProps) {
    const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";

    return (
        <div className="bg-card text-card-foreground rounded-2xl p-4 border border-border flex items-center gap-3">
            {/* Muscle group color stripe */}
            <div className={`w-1.5 self-stretch rounded-full ${colorClass}`} />

            <div className="flex-1 min-w-0">
                <p className="font-display text-base font-semibold truncate">{name}</p>
                {description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{description}</p>
                )}
            </div>

            {/* Muscle group badge */}
            <span
                className={`shrink-0 text-[10px] font-semibold uppercase tracking-wider
                    px-2 py-1 rounded-lg text-white/90 ${colorClass}`}
            >
                {muscleGroup}
            </span>
        </div>
    );
}
