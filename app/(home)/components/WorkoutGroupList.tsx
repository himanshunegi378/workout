import prisma from "@/lib/prisma";
import { requireUserId } from "@/lib/auth-helpers";
import { GroupCard } from "./ui/GroupCard";
import { GroupsEmptyState } from "./ui/GroupsEmptyState";

export async function WorkoutGroupList() {
    const userId = await requireUserId();

    const groups = await prisma.workoutGroup.findMany({
        where: { user_id: userId },
        include: {
            workouts: {
                select: { id: true },
            },
        },
        orderBy: { name: "asc" },
    });

    if (groups.length === 0) {
        return <GroupsEmptyState />;
    }

    return (
        <div className="space-y-3">
            {groups.map((group, i) => (
                <div
                    key={group.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${i * 60}ms` }}
                >
                    <GroupCard
                        id={group.id}
                        name={group.name}
                        description={group.description}
                        workoutCount={group.workouts.length}
                    />
                </div>
            ))}
        </div>
    );
}
