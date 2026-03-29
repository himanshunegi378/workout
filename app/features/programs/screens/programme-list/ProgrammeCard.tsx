import Link from "next/link";
import { ChevronRight, Dumbbell, Star } from "lucide-react";
import { useUpdateProgramme } from "../../api/mutation-hooks/use-update-programme";

interface ProgrammeCardProps {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
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
export function ProgrammeCard({ id, name, description, isActive, workoutCount }: ProgrammeCardProps) {
    const { mutate: updateProgramme, isPending } = useUpdateProgramme();

    const handleToggleActive = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        updateProgramme({ id, is_active: !isActive });
    };

    return (
        <div className="relative group">
            <Link
                href={`/programmes/${id}`}
                className="flex w-full items-start gap-4 rounded-2xl px-3 py-4 text-card-foreground transition-all duration-200 hover:bg-background/35"
            >
                <div className={`mt-1 h-10 w-1 shrink-0 rounded-full transition-all duration-300 ${isActive ? "bg-accent shadow-[0_0_8px_rgba(var(--accent),0.4)]" : "bg-accent/45 group-hover:bg-accent"}`} />
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/70">Program</p>
                                {isActive && (
                                    <span className="flex items-center gap-1 rounded-full bg-accent/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent ring-1 ring-inset ring-accent/20">
                                        Active
                                    </span>
                                )}
                            </div>
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
                    <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-foreground/80">
                            <Dumbbell className="h-4 w-4" />
                            <span>
                                {workoutCount} workout{workoutCount !== 1 ? "s" : ""}
                            </span>
                        </div>
                        <button
                            onClick={handleToggleActive}
                            disabled={isPending}
                            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-semibold transition-all duration-200 ${isActive
                                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                                : "bg-background/50 text-foreground/70 hover:bg-background/80 hover:text-foreground"
                                }`}
                        >
                            <Star className={`h-3 w-3 ${isActive ? "fill-current" : ""}`} />
                            {isActive ? "Active" : "Set Active"}
                        </button>
                    </div>
                </div>
            </Link>
        </div>
    );
}
