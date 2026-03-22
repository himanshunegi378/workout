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
        <div className="bg-card text-card-foreground rounded-2xl p-4 border border-border flex items-center gap-3 elevation-2">
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
