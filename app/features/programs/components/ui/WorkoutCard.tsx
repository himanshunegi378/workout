import Link from "next/link";
import { Activity, ChevronRight, Dumbbell } from "lucide-react";

interface WorkoutCardProps {
    id: string;
    groupId: string;
    name: string;
    exercisePreview: string;
    exerciseCount: number;
}

export function WorkoutCard({
    id,
    groupId,
    name,
    exercisePreview,
    exerciseCount,
}: WorkoutCardProps) {
    return (
        <Link
            href={`/groups/${groupId}/workouts/${id}`}
            className="block bg-card text-card-foreground rounded-2xl p-4
                       border border-border hover:border-accent/40
                       transition-all duration-300 active:animate-press"
        >
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-5 h-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold truncate">
                        {name}
                    </h3>
                    {exercisePreview && (
                        <p className="text-xs text-muted-foreground truncate">
                            {exercisePreview}
                        </p>
                    )}
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
                </span>
            </div>
        </Link>
    );
}
