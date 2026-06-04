import { Outlet } from "react-router-dom";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BottomDrawerProvider, BottomNav, Sidebar } from "@/components/ui";
import { PageHeaderStatusProvider } from "@/features/page-header";
import { PageHeaderActionsProvider } from "@/features/page-header/internal";
import { PRCelebrationProvider } from "@/features/personal-records/hooks/PRCelebrationContext";
import { PRCelebrationOverlay } from "@/features/personal-records/ui/PRCelebrationOverlay";
import {
    RestTimerFloatingBubble,
    RestTimerHeaderActionBridge,
    RestTimerOverlay,
    RestTimerProvider,
} from "@/features/rest-timer";

/**
 * Hosts app-wide providers and persistent mobile-first navigation.
 */
export function AppShell() {
    return (
        <ThemeProvider>
            <QueryProvider>
                <PageHeaderStatusProvider>
                    <PageHeaderActionsProvider>
                        <RestTimerProvider>
                            <PRCelebrationProvider>
                                <BottomDrawerProvider>
                                    <div className="flex min-h-screen">
                                        <Sidebar />
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <Outlet />
                                        </div>
                                    </div>
                                    <BottomNav />
                                </BottomDrawerProvider>
                                <PRCelebrationOverlay />
                                <RestTimerOverlay />
                                <RestTimerFloatingBubble />
                            </PRCelebrationProvider>
                            <RestTimerHeaderActionBridge />
                        </RestTimerProvider>
                    </PageHeaderActionsProvider>
                </PageHeaderStatusProvider>
            </QueryProvider>
        </ThemeProvider>
    );
}
