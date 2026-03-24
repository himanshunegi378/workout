import Link from "next/link";
import { ChevronRight, Dumbbell } from "lucide-react";

interface WorkoutCardProps {
    id: string;
    programmeId: string;
    name: string;
    exercisePreview: string;
    exerciseCount: number;
}

/**
 * A navigational card displaying basic information about a workout session.
 * 
 * Context:
 * This card is used in a specific programme's workout list to allow users 
 * to quickly see the contents of a session and navigate into details.
 */
export function WorkoutCard({
    id,
    programmeId,
    name,
    exercisePreview,
    exerciseCount,
}: WorkoutCardProps) {
    return (
        <Link
            href={`/programmes/${programmeId}/workouts/${id}`}
            className="group flex w-full items-start gap-4 rounded-2xl px-3 py-4 text-card-foreground transition-colors duration-300 hover:bg-background/35 active:animate-press"
        >
            <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent/45 transition-colors group-hover:bg-accent" />
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">Workout</p>
                        <h3 className="mt-2 truncate font-display text-lg font-semibold tracking-tight text-foreground">
                            {name}
                        </h3>
                        {exercisePreview && (
                            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-foreground/80">
                                {exercisePreview}
                            </p>
                        )}
                    </div>
                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-foreground/65 transition-colors group-hover:text-foreground" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-foreground/80">
                    <Dumbbell className="w-5 h-5 text-accent" />
                    <span>
                        {exerciseCount} exercise{exerciseCount !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>
        </Link>
    );
}
