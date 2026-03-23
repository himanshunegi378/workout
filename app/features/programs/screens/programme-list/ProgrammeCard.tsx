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
            className="group flex w-full items-start gap-4 border-b border-border/50 py-4 text-card-foreground transition-colors duration-200 hover:border-border/70"
        >
            <div className="mt-1 h-10 w-1 shrink-0 rounded-full bg-accent/45 transition-colors group-hover:bg-accent" />
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">Program</p>
                        <h3 className="mt-2 truncate font-display text-xl font-semibold tracking-tight text-foreground">
                            {name}
                        </h3>
                        {description && (
                            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-foreground/80">
                                {description}
                            </p>
                        )}
                    </div>
                    <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-foreground/65 transition-colors group-hover:text-foreground" />
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-foreground/80">
                    <Dumbbell className="h-4 w-4" />
                    <span>
                        {workoutCount} workout{workoutCount !== 1 ? "s" : ""}
                    </span>
                </div>
            </div>
        </Link>
    );
}
