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
import { EmptyState } from "@/app/components/ui";
import { SessionCard } from "./ui/SessionCard";
import { useInfiniteSessions } from "../../api/query-hooks/use-sessions";
import { QuickLogActions } from "./ui/QuickLogActions";
import type { SessionWithLogs } from "../../types";

/**
 * The main container component for the logging feature's timeline view.
 * It fetches paginated session data, calculates consistency/streak stats, 
 * and renders a timeline of workout sessions including quick log actions.
 * 
 * @returns {JSX.Element} The rendered logging dashboard and timeline.
 */
export function LogContent() {
    const {
        data,
        isLoading,
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
                    const prevDate = parseISO(uniqueSessionDays[i-1]!);
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

    // ... (Loading and Error states remain the same)

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                <span className="text-sm text-muted-foreground animate-pulse font-medium">Retrieving your journey...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <EmptyState
                icon={Check}
                title="Something went wrong"
                description="Could not load your log. Please try again."
            />
        );
    }

    if (!grouped || grouped.length === 0) {
        return (
            <EmptyState
                icon={Check}
                title="Your Journey Starts Here"
                description="Log your first training session to begin your consistency streak."
            />
        );
    }

    return (
        <div className="flex flex-col pb-20">
            {/* Training Journey Dashboard */}
            <section className="mb-10 animate-slide-up">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-accent/10 border border-accent/20 rounded-[2rem] p-6 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-accent">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Consistency</span>
                        </div>
                        <h4 className="font-display text-2xl font-bold text-foreground">
                            {stats.streak > 5 ? 'Elite Effort' : stats.streak > 2 ? 'Gaining Momentum' : 'Keep Going'}
                        </h4>
                        <div className="flex gap-1.5 mt-2">
                            {stats.consistency.map((active, i) => (
                                <div 
                                    key={i} 
                                    className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${active ? 'bg-accent shadow-[0_0_8px_rgba(236,72,153,0.4)]' : 'bg-muted'}`} 
                                />
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-card border border-border/60 rounded-[2rem] p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Zap className="w-4 h-4 text-warning" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Active Streak</span>
                        </div>
                        <span className="font-display text-3xl font-bold text-foreground">{stats.streak} Days</span>
                    </div>

                    <div className="bg-card border border-border/60 rounded-[2rem] p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <Calendar className="w-4 h-4 text-info" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Sessions</span>
                        </div>
                        <span className="font-display text-3xl font-bold text-foreground">{stats.monthlySessions} This Month</span>
                    </div>
                </div>
            </section>

            {/* Timeline View */}
            <div className="space-y-12 relative">
                {/* Vertical Timeline Thread */}
                <div className="absolute left-[17px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/40 via-border to-transparent hidden md:block" />

                {grouped.map(({ label, sessions: daySessions }, gi) => (
                    <section
                        key={label}
                        className="relative space-y-6 animate-slide-up"
                        style={{ animationDelay: `${gi * 100}ms` }}
                    >
                        {/* Enhanced Date Label */}
                        <div className="flex items-center gap-4 group">
                            <div className="w-9 h-9 rounded-2xl bg-card border border-border flex items-center justify-center shadow-sm group-hover:border-accent/40 transition-colors z-10">
                                <Calendar className="w-4 h-4 text-accent" />
                            </div>
                            <h2 className="text-sm font-bold text-foreground uppercase tracking-[0.2em]">
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
                                    groupsMap.get(exercise.id)!.sets.push(sel.exerciseLog);
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
                    <div className="pt-8 flex justify-center w-full md:ml-6">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="px-8 py-3 text-xs font-bold uppercase tracking-widest text-muted-foreground bg-card border border-border rounded-2xl hover:bg-muted hover:text-foreground hover:border-accent/40 transition-all disabled:opacity-50 flex items-center gap-3 shadow-sm"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                                    SYNCING...
                                </>
                            ) : (
                                "Load More Entries"
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
