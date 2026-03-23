import Link from "next/link";
import { ChevronRight, Dumbbell } from "lucide-react";

interface ProgrammeCardProps {
    id: string;
    name: string;
    description: string | null;
    workoutCount: number;
}

/**
 * A navigational card displaying basic information about a training programme.
 * 
 * Context:
 * This card is used in the main dashboard or programme list to give users a 
 * visual overview of their training cycles. It shows the programme name, 
 * description, and total workout count.
 */
export function ProgrammeCard({ id, name, description, workoutCount }: ProgrammeCardProps) {
    return (
        <Link
            href={`/programmes/${id}`}
            className="group block rounded-[1.5rem] border border-border bg-card px-4 py-4 text-card-foreground transition-colors duration-200 hover:border-border/80"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-semibold tracking-tight text-foreground">
                        {name}
                    </h3>
                    {description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-border/40 pt-3 text-xs text-muted-foreground">
                <Dumbbell className="h-4 w-4" />
                <span>{workoutCount} workout{workoutCount !== 1 ? "s" : ""}</span>
            </div>
        </Link>
    );
}
