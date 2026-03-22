import { Layers, Plus } from "lucide-react";
import { Button, EmptyState } from "@/app/components/ui";

/**
 * A specialized empty state component for when no training programmes exist.
 */
export function ProgrammesEmptyState() {
    return (
        <EmptyState
            icon={Layers}
            title="No Programs Yet"
            description="Create your first workout program to start tracking your exercises"
            action={
                <Button variant="primary">
                    <Plus className="w-4 h-4" /> Create Program
                </Button>
            }
        />
    );
}
