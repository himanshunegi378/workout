# Logging Feature Code Dependency Graph

```mermaid
graph TD
    subgraph Components
        LogContent[components/LogContent.tsx]
        SessionCard[components/ui/SessionCard.tsx]
        ExerciseLogGroup[components/ui/ExerciseLogGroup.tsx]
        SetRow[components/ui/SetRow.tsx]
        QuickLogActions[components/ui/QuickLogActions.tsx]
        QuickLogFAB[components/ui/QuickLogFAB.tsx]
        ExerciseQuickLogDrawer[components/ui/ExerciseQuickLogDrawer.tsx]
    end

    subgraph API
        useLogSet[api/mutation-hooks/use-log-set.ts]
        useDeleteLogSet[api/mutation-hooks/use-delete-log-set.ts]
        useUpdateLogSet[api/mutation-hooks/use-update-log-set.ts]
        useExerciseHistory[api/query-hooks/use-exercise-history.ts]
        useLastLog[api/query-hooks/use-last-log.ts]
        useSessions[api/query-hooks/use-sessions.ts]
        mutations[api/mutations.ts]
        queryKeys[api/query-keys.ts]
    end

    subgraph Types
        types[types.ts]
    end

    LogContent --> useSessions
    LogContent --> SessionCard
    LogContent --> QuickLogActions
    
    SessionCard --> ExerciseLogGroup
    
    ExerciseLogGroup --> SetRow
    
    SetRow --> useDeleteLogSet
    
    QuickLogActions --> QuickLogFAB
    QuickLogActions --> ExerciseQuickLogDrawer
    
    ExerciseQuickLogDrawer --> useExerciseHistory
    ExerciseQuickLogDrawer --> useLogSet
    ExerciseQuickLogDrawer --> useLastLog

    useLogSet --> mutations
    useDeleteLogSet --> mutations
    useUpdateLogSet --> mutations
    useSessions --> types
```

## Component/Function Descriptions

### types.ts
- `SessionExerciseLogWithRelations`: Represents a simplified session exercise log.
- `SessionWithLogs`: Metadata and logs for a single workout session.
- `GroupedSession`: Collections of sessions grouped by time labels.
- `PaginatedResponse<T>`: Generic API pagination wrapper.

### api/
- **mutations.ts**: Core `fetch` logic for POST/DELETE/PATCH operations on logs.
- **query-keys.ts**: Factory for React Query keys ensuring cache consistency.
- **mutation-hooks/**: `useLogSet`, `useDeleteLogSet`, `useUpdateLogSet` provide high-level React Query mutations with optimistic updates.
- **query-hooks/**: `useInfiniteSessions` and `useLastLog` provide data fetching with support for pagination.

### components/
- `LogContent`: The feature's entry point. Orchestrates the dashboard stats, timeline rendering, and quick log interactivity.
- `ui/SessionCard`: Visual summary of a workout session, including volume and muscle group targets.
- `ui/ExerciseLogGroup`: Organizes individual sets under an exercise header; links to full exercise history.
- `ui/SetRow`: Detail row for a single logged set; handles set removal.
- `ui/QuickLogActions`: Coordinator for the floating "Quick Log" action flow.
- `ui/QuickLogFAB`: Floating visual trigger for starting a manual log entry.
- `ui/ExerciseQuickLogDrawer`: Shared exercise detail drawer that combines quick logging with full history.
