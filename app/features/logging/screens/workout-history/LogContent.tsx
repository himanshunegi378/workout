"use client";

import { Check, Loader2, Calendar, TrendingUp, Zap } from "lucide-react";
import {
    subDays,
    isSameDay,
    startOfMonth,
    isWithinInterval,
    endOfMonth,
    differenceInDays,
    parseISO
} from "date-fns";
import { List } from "@/app/components/ui";
import { SessionCard } from "./ui/SessionCard";
import { useInfiniteSessions } from "../../api/query-hooks/use-sessions";
import { QuickLogActions } from "./ui/QuickLogActions";
import type { SessionWithLogs } from "../../types";

/**
 * The primary container for the training journey timeline and analytics dashboard.
 * 
 * Context:
 * This component acts as the user's historical record ("The Log"). It provides 
 * a high-level view of their training consistency (streaks, monthly volume) 
 * while maintaining a chronological timeline of every training session performed.
 * 
 * Why:
 * - Motivation through Data: By visualizing streaks and monthly session counts 
 *   as soon as the page loads, it provides immediate positive reinforcement.
 * - Performance Trends: Aggregates complex relational data (sessions -> logs -> sets) 
 *   into a simplified timeline view, allowing users to quickly review past 
 *   performance on specific exercises.
 * - Infinite Exploration: Uses paginated results to ensure the dashboard remains 
 *   performant even as the user's training history grows over many years.
 */
export function LogContent() {
    const {
        data,
        isPending,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteSessions({ grouped: true, limit: 20 });

    const allSessions = data?.pages.flatMap(page => page.data.flatMap(g => g.sessions)) || [];

    // ── Calculations ───────────────────────────────────────────────────────

    /**
     * Internal analytics for the user's training journey.
     * Calculates monthly session count, active streaks, and last 7-day consistency.
     */
    const stats = (() => {
        const now = new Date();
        const startOfThisMonth = startOfMonth(now);
        const endOfThisMonth = endOfMonth(now);

        // 1. Consistency Ribbon (Last 7 Days)
        const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(now, 6 - i));
        const consistency = last7Days.map(day =>
            allSessions.some(s => s.start_time && isSameDay(parseISO(s.start_time.toString()), day))
        );

        // 2. Monthly Count
        const monthlySessions = allSessions.filter(s =>
            s.start_time && isWithinInterval(parseISO(s.start_time.toString()), {
                start: startOfThisMonth,
                end: endOfThisMonth
            })
        ).length;

        // 3. Streak Calculation
        // Sort unique days with sessions descending
        const uniqueSessionDays = Array.from(new Set(
            allSessions.map(s => s.start_time ? s.start_time.toString().split('T')[0] : null).filter(Boolean)
        )).sort((a, b) => b!.localeCompare(a!));

        let streak = 0;
        if (uniqueSessionDays.length > 0) {
            // If the most recent session wasn't today or yesterday, the streak is broken
            const latestSessionDate = parseISO(uniqueSessionDays[0]!);
            const gapToToday = differenceInDays(now, latestSessionDate);

            if (gapToToday <= 1) {
                streak = 1;
                for (let i = 1; i < uniqueSessionDays.length; i++) {
                    const prevDate = parseISO(uniqueSessionDays[i - 1]!);
                    const currDate = parseISO(uniqueSessionDays[i]!);
                    if (differenceInDays(prevDate, currDate) === 1) {
                        streak++;
                    } else {
                        break;
                    }
                }
            }
        }

        return { consistency, monthlySessions, streak };
    })();

    /**
     * Merges paginated session data into a flat grouped array for rendering.
     */
    const grouped = (() => {
        if (!data?.pages) return [];
        const merged = new Map<string, { label: string; sessions: SessionWithLogs[] }>();
        for (const page of data.pages) {
            for (const group of page.data) {
                if (!merged.has(group.label)) {
                    merged.set(group.label, { label: group.label, sessions: [] });
                }
                merged.get(group.label)!.sessions.push(...group.sessions);
            }
        }
        return Array.from(merged.values());
    })();

    if (isPending) {
        return (
            <List.Loading
                title="Retrieving your journey..."
                icon={Loader2}
                className="py-24"
            />
        );
    }

    if (isError) {
        return (
            <List.Error
                icon={Check}
                title="Something went wrong"
                description="Could not load your log. Please try again."
            />
        );
    }

    if (!grouped || grouped.length === 0) {
        return (
            <List.Empty
                icon={Check}
                title="Your Journey Starts Here"
                description="Log your first training session to begin your consistency streak."
            />
        );
    }

    return (
        <div className="flex flex-col pb-20">
            <List.Header className="mb-10 animate-slide-up pb-6">
                <List.Intro className="grid gap-5 md:flex md:flex-row md:items-end md:justify-between">

                    <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
                        <div className="min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-accent" />
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/80">Consistency</p>
                            </div>
                            <p className="text-sm text-foreground/90">
                                {stats.streak > 5 ? "Elite effort" : stats.streak > 2 ? "Gaining momentum" : "Building rhythm"}
                            </p>
                        </div>
                        <div className="min-w-0 space-y-1.5">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-warning" />
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/80">Streak</p>
                            </div>
                            <p className="text-sm text-foreground/90">{stats.streak} days</p>
                        </div>
                        <div className="col-span-2 min-w-0 space-y-1.5 sm:col-span-1">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-info" />
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-foreground/80">This month</p>
                            </div>
                            <p className="text-sm text-foreground/90">{stats.monthlySessions} sessions</p>
                        </div>
                    </div>
                </List.Intro>

                <div className="mt-6 grid grid-cols-7 gap-2">
                    {stats.consistency.map((active, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-colors duration-500 ${active ? "bg-accent/80" : "bg-border/70"
                                }`}
                        />
                    ))}
                </div>
            </List.Header>

            {/* Timeline View */}
            <div className="space-y-12 relative">
                {/* Vertical Timeline Thread */}
                <div className="absolute left-4.25 top-4 bottom-4 w-px bg-linear-to-b from-accent/40 via-border to-transparent hidden md:block" />

                {grouped.map(({ label, sessions: daySessions }, gi) => (
                    <section
                        key={label}
                        className="relative space-y-6 animate-slide-up"
                        style={{ animationDelay: `${gi * 100}ms` }}
                    >
                        {/* Enhanced Date Label */}
                        <div className="group flex items-center gap-4">
                            <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-card/70 transition-colors group-hover:bg-accent/10">
                                <Calendar className="w-4 h-4 text-accent" />
                            </div>
                            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-foreground">
                                {label}
                            </h2>
                            <div className="flex-1 h-px bg-border/40" />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:ml-12">
                            {daySessions.map((session) => {
                                const groupsMap = new Map<string, {
                                    exercise: { id: string; name: string; muscle_group: string };
                                    sets: { id: string; weight: number | null; reps: number; rpe: number | null; set_order_index: number }[];
                                }>();

                                for (const sel of session.sessionExerciseLogs) {
                                    const exercise = sel.exerciseWithMetadata?.exercise ?? sel.exerciseLog?.exercise;
                                    if (!exercise || !sel.exerciseLog) continue;

                                    if (!groupsMap.has(exercise.id)) {
                                        groupsMap.set(exercise.id, { exercise, sets: [] });
                                    }
                                    groupsMap.get(exercise.id)!.sets.push({
                                        ...sel.exerciseLog,
                                        isAdHoc: sel.exercise_with_metadata_id === null
                                    });
                                }

                                const exerciseGroups = Array.from(groupsMap.values()).map(group => ({
                                    ...group,
                                    sets: group.sets.sort((a, b) => a.set_order_index - b.set_order_index)
                                }));

                                return (
                                    <div key={session.id} className="relative">
                                        <SessionCard
                                            workoutName={session.workout?.name ?? "Ad-hoc Exercises"}
                                            groupName={session.workout?.programme?.name ?? "Quick Log"}
                                            startTime={session.start_time}
                                            endTime={session.end_time}
                                            exerciseGroups={exerciseGroups}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {hasNextPage && (
                    <div className="flex w-full justify-center pt-2 md:ml-6">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="inline-flex items-center gap-3 rounded-full bg-background/60 px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-foreground/85 transition-colors hover:bg-background/80 hover:text-foreground disabled:opacity-50"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                                    Syncing
                                </>
                            ) : (
                                "Load more entries"
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* Quick Log Component */}
            <QuickLogActions />
        </div>
    );
}

// ── Helpers ──

export type { GroupedSession, SessionWithLogs, SessionExerciseLogWithRelations } from "../../types";
