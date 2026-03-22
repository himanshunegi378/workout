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
            className="block bg-card text-card-foreground rounded-2xl p-4
                       border border-border hover:border-accent/40
                       elevation-2 hover:elevation-4
                       transition-all duration-300 active:animate-press group"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-lg font-semibold">
                    {name}
                </h3>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
            </div>
            {description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {description}
                </p>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Dumbbell className="w-4 h-4" />
                <span>
                    {workoutCount} workout{workoutCount !== 1 ? "s" : ""}
                </span>
            </div>
        </Link>
    );
}
