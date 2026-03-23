import { muscleColorMap } from "@/app/components/ui";

interface ExerciseListCardProps {
    name: string;
    description: string | null;
    muscleGroup: string;
}

/**
 * A specialized card component for displaying individual exercises in a list.
 * 
 * Context:
 * This card is used to visually represent an exercise within the library or workout builders. 
 * It prioritizes clear identification of the muscle group through color-coded status stripes and badges.
 * 
 * Why:
 * - Visual Scannability: Users often browse by muscle group; the color-coding (e.g., chest, back, legs) 
 *   makes it easy to scan a long list of exercises for a specific category.
 * - UX Visuals: The combination of labels and descriptors provides just enough context 
 *   to identify the movement without overwhelming the user with detail.
 */
export function ExerciseListCard({ name, description, muscleGroup }: ExerciseListCardProps) {
    const colorClass = muscleColorMap[muscleGroup] ?? "bg-accent";

    return (
        <div className="group flex items-start gap-4 border-b border-border/40 px-1 py-4 text-card-foreground transition-colors duration-200 hover:border-border/70">
            <div className={`mt-1 h-10 w-1.5 shrink-0 rounded-full ${colorClass}`} />

            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Exercise</p>
                        <p className="mt-2 truncate font-display text-lg font-semibold tracking-tight text-foreground">{name}</p>
                    </div>
                    <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0c0c0e] ${colorClass}`}
                    >
                        {muscleGroup}
                    </span>
                </div>
                {description && (
                    <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
                )}
            </div>
        </div>
    );
}
