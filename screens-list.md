I want a mobile responsive application with the following screens:

### Authentication Area
1. **Login Page** (`/login`) - Auth sign-in screen
2. **Sign Up Page** (`/signup`) - Auth sign-up screen

### Main Flow (Bottom Nav: Programs / Log / Exercises)

**1. Programs Tab (Home - `/`)**
- **Workout Group List** - List of all created training programs (e.g., bulk cycle, GZCLP, 5x5)
- **Add Program Form** (`/groups/new`) - Create a new workout group

**2. Within a Program (`/groups/[groupId]`)**
- **Workout List** - List of specific workouts (e.g., Push, Pull, Legs) within that program
- **Add Workout Form** (`/groups/[groupId]/workouts/new`) - Create a new workout in the group

**3. Within a Workout (`/groups/[groupId]/workouts/[workoutId]`)**
- **Exercise List with Metadata** - List of exercises prescribed for this workout, including metadata (sets, reps, rest, tempo)
- **Add/Link Exercise Form** - Screen to add an existing exercise to this specific workout with its prescribed metadata

**4. Exercises Tab (`/exercises`)**
- **Global Exercise Library** - List of all available exercises with muscle group filters
- **Add New Exercise Form** (`/exercises/new`) - Create a brand new exercise definition

**5. Log Tab (`/log`)**
- **Workout Log Dashboard** - Show a chronological history of logged workout sessions
- **Active Session/Log Data Input** (`/log/[sessionId]` or similar) - Real-time input screen for logging actual sets, weight, and reps performed during a workout