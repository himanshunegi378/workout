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
        // Horizontal Focus
        { name: "Incline Dumbbell Press", description: "Upper chest focus", muscle_group: MuscleGroup.Chest },
        { name: "Barbell Row", description: "Compound horizontal pull", muscle_group: MuscleGroup.Back },
        { name: "Machine Row", description: "Horizontal pull variation", muscle_group: MuscleGroup.Back },
        { name: "Flat Dumbbell Press", description: "Standard dumbbell chest press", muscle_group: MuscleGroup.Chest },
        { name: "Chest-Supported Reverse Flyes", description: "Upper back and rear delt focus", muscle_group: MuscleGroup.Back },
        { name: "Dumbbell Bicep Curls", description: "Isolation for biceps", muscle_group: MuscleGroup.Arms },
        { name: "Tricep Cable Pushdowns", description: "Isolation for triceps", muscle_group: MuscleGroup.Arms },

        // Quad + Core
        { name: "Barbell Squats", description: "Compound lower body movement", muscle_group: MuscleGroup.Legs },
        { name: "Leg Press", description: "Lower body focus", muscle_group: MuscleGroup.Legs },
        { name: "Romanian Deadlifts (RDLs)", description: "Hamstring and glute focus", muscle_group: MuscleGroup.Legs },
        { name: "Bulgarian Split Squats", description: "Unilateral leg focus", muscle_group: MuscleGroup.Legs },
        { name: "Leg Extensions", description: "Quad isolation", muscle_group: MuscleGroup.Legs },
        { name: "Standing Calf Raises", description: "Calf focus", muscle_group: MuscleGroup.Legs },
        { name: "Hanging Leg Raises", description: "Abdominal and hip flexor focus", muscle_group: MuscleGroup.Core },

        // Vertical Focus
        { name: "Overhead Press (DB/BB)", description: "Compound vertical press", muscle_group: MuscleGroup.Shoulders },
        { name: "Lat Pulldowns", description: "Vertical pull focus", muscle_group: MuscleGroup.Back },
        { name: "Pull-ups", description: "Vertical pull compound", muscle_group: MuscleGroup.Back },
        { name: "Cable Lateral Raises", description: "Lateral delt isolation", muscle_group: MuscleGroup.Shoulders },
        { name: "Seated Cable Row", description: "Horizontal pull variation", muscle_group: MuscleGroup.Back },
        { name: "Hammer Curls", description: "Brachialis and brachioradialis focus", muscle_group: MuscleGroup.Arms },
        { name: "Overhead Tricep Extensions", description: "Long head of tricep focus", muscle_group: MuscleGroup.Arms },

        // Hams/Glutes + Core
        { name: "Trap Bar Deadlift", description: "Hinge variation", muscle_group: MuscleGroup.Legs },
        { name: "Conventional Deadlift", description: "Compound posterior chain", muscle_group: MuscleGroup.Back },
        { name: "Leg Press (High & Wide)", description: "Glute and hamstring focus on leg press", muscle_group: MuscleGroup.Legs },
        { name: "Seated Leg Curls", description: "Hamstring isolation", muscle_group: MuscleGroup.Legs },
        { name: "Lying Leg Curls", description: "Hamstring isolation variation", muscle_group: MuscleGroup.Legs },
        { name: "Walking Lunges", description: "Dynamic lower body movement", muscle_group: MuscleGroup.Legs },
        { name: "Seated Calf Raises", description: "Soleus focus", muscle_group: MuscleGroup.Legs },
        { name: "Plank", description: "Core stability focus", muscle_group: MuscleGroup.Core },
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

    // 3. Create "4-Day Upper/Lower Hypertrophy Program" if it doesn't exist
    const groupName = "4-Day Upper/Lower Hypertrophy Program";
    let program = await prisma.workoutGroup.findFirst({
        where: { name: groupName, user_id: user.id },
    });

    if (!program) {
        console.log(`Creating Workout Program: ${groupName}...`);
        program = await prisma.workoutGroup.create({
            data: {
                name: groupName,
                description: "Goal: Body Recomposition (Fixing the skinny-fat physique)",
                user_id: user.id,
            },
        });

        // Fetch all user exercises to link them by name
        const allExercises = await prisma.exercise.findMany({
            where: { user_id: user.id }
        });

        const getExId = (nameMatch: string) => {
            const ex = allExercises.find(e => e.name.toLowerCase().includes(nameMatch.toLowerCase()));
            if (!ex) throw new Error(`Exercise not found: ${nameMatch}`);
            return ex.id;
        };

        const workoutsData = [
            {
                name: "Workout A: Upper Body (Horizontal Focus)",
                order_index: 0,
                exercises: [
                    { name: "Incline Dumbbell Press", sets: 3, reps_min: 8, reps_max: 10, rpe: "8" },
                    { name: "Barbell Row", sets: 3, reps_min: 8, reps_max: 10, rpe: "8" },
                    { name: "Flat Dumbbell Press", sets: 3, reps_min: 10, reps_max: 12, rpe: "8.5" },
                    { name: "Chest-Supported Reverse Flyes", sets: 3, reps_min: 12, reps_max: 15, rpe: "7" },
                    { name: "Dumbbell Bicep Curls", sets: 3, reps_min: 10, reps_max: 12, rpe: "9" },
                    { name: "Tricep Cable Pushdowns", sets: 3, reps_min: 10, reps_max: 12, rpe: "9" },
                ]
            },
            {
                name: "Workout B: Lower Body (Quad + Core A)",
                order_index: 1,
                exercises: [
                    { name: "Barbell Squats", sets: 3, reps_min: 6, reps_max: 8, rpe: "8" },
                    { name: "Romanian Deadlifts", sets: 3, reps_min: 8, reps_max: 10, rpe: "8" },
                    { name: "Bulgarian Split Squats", sets: 3, reps_min: 10, reps_max: 10, rpe: "8.5" }, // 10/leg -> 10 reps
                    { name: "Leg Extensions", sets: 3, reps_min: 12, reps_max: 15, rpe: "9" },
                    { name: "Standing Calf Raises", sets: 4, reps_min: 12, reps_max: 15, rpe: "9" },
                    { name: "Hanging Leg Raises", sets: 3, reps_min: 12, reps_max: 15, rpe: "8" },
                ]
            },
            {
                name: "Workout C: Upper Body (Vertical Focus)",
                order_index: 2,
                exercises: [
                    { name: "Overhead Press", sets: 3, reps_min: 8, reps_max: 10, rpe: "8" },
                    { name: "Lat Pulldowns", sets: 3, reps_min: 8, reps_max: 10, rpe: "8" },
                    { name: "Cable Lateral Raises", sets: 4, reps_min: 12, reps_max: 15, rpe: "9" },
                    { name: "Seated Cable Row", sets: 3, reps_min: 10, reps_max: 12, rpe: "8" },
                    { name: "Hammer Curls", sets: 3, reps_min: 10, reps_max: 12, rpe: "9" },
                    { name: "Overhead Tricep Extensions", sets: 3, reps_min: 10, reps_max: 12, rpe: "9" },
                ]
            },
            {
                name: "Workout D: Lower Body (Hams/Glutes + Core B)",
                order_index: 3,
                exercises: [
                    { name: "Trap Bar Deadlift", sets: 3, reps_min: 5, reps_max: 7, rpe: "8.5" },
                    { name: "Leg Press", sets: 3, reps_min: 10, reps_max: 12, rpe: "8" },
                    { name: "Seated Leg Curls", sets: 3, reps_min: 12, reps_max: 15, rpe: "9" },
                    { name: "Walking Lunges", sets: 3, reps_min: 12, reps_max: 12, rpe: "8.5" }, // 12/leg -> 12 reps
                    { name: "Seated Calf Raises", sets: 4, reps_min: 15, reps_max: 15, rpe: "9" },
                    { name: "Plank", sets: 3, reps_min: 60, reps_max: 60, rpe: "8", tempo: "60s hold" }, // 60s -> reps mapping representation or tempo hack
                ]
            }
        ];

        for (const wData of workoutsData) {
            const workout = await prisma.workout.create({
                data: {
                    name: wData.name,
                    order_index: wData.order_index,
                    workout_group_id: program.id,
                }
            });

            for (let i = 0; i < wData.exercises.length; i++) {
                const ex = wData.exercises[i];
                await prisma.exerciseWithMetadata.create({
                    data: {
                        exercise_id: getExId(ex.name),
                        workout_id: workout.id,
                        order_index: i,
                        sets_min: ex.sets,
                        sets_max: ex.sets,
                        reps_min: ex.reps_min,
                        reps_max: ex.reps_max,
                        rest_min: 60,
                        rest_max: 120,
                        tempo: ex.tempo || "2-0-1-0",
                    }
                });
            }
            console.log(`Created Workout: ${wData.name} with ${wData.exercises.length} exercises.`);
        }
    } else {
        console.log(`Program "${groupName}" already exists.`);
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
