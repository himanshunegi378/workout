import prisma from "@/lib/prisma";
import { MuscleGroup } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";



async function main() {
    const username = "himanshu";
    const password = "12345678";

    console.log(`Checking for user: ${username}...`);

    // 1. Ensure user exists
    let user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        console.log("Creating user...");
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        user = await prisma.user.create({
            data: {
                username,
                password_hash,
            },
        });
        console.log(`User created with ID: ${user.id}`);
    } else {
        console.log(`User already exists with ID: ${user.id}`);
    }

    // 2. Add 10 exercises
    const exercises: { name: string; description: string; muscle_group: MuscleGroup }[] = [
        { name: "Bench Press", description: "Standard barbell chest press", muscle_group: MuscleGroup.Chest },
        { name: "Deadlift", description: "Conventional barbell deadlift", muscle_group: MuscleGroup.Back },
        { name: "Squat", description: "Barbell back squat", muscle_group: MuscleGroup.Legs },
        { name: "Overhead Press", description: "Standing barbell shoulder press", muscle_group: MuscleGroup.Shoulders },
        { name: "Pull-ups", description: "Bodyweight or weighted pull-ups", muscle_group: MuscleGroup.Back },
        { name: "Dips", description: "Tricep-focused parallel bar dips", muscle_group: MuscleGroup.Arms },
        { name: "Barbell Rows", description: "Bent over barbell rows", muscle_group: MuscleGroup.Back },
        { name: "Incline Dumbbell Press", description: "Upper chest focus", muscle_group: MuscleGroup.Chest },
        { name: "Lateral Raises", description: "Dumbbell side raises for side delts", muscle_group: MuscleGroup.Shoulders },
        { name: "Hanging Leg Raises", description: "Core strength and stability", muscle_group: MuscleGroup.Core },
    ];

    console.log("Adding exercises...");
    for (const ex of exercises) {
        const existingEx = await prisma.exercise.findFirst({
            where: { name: ex.name, user_id: user.id },
        });

        if (!existingEx) {
            await prisma.exercise.create({
                data: {
                    ...ex,
                    user_id: user.id,
                },
            });
            console.log(`Added: ${ex.name}`);
        } else {
            console.log(`Skipped (already exists): ${ex.name}`);
        }
    }

    console.log("Done!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
