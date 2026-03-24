"use client";

import { useEffect, useRef } from "react";
import { usePageHeaderActions } from "@/app/features/page-header";
import { useRestTimer } from "../context/RestTimerContext";
import { RestTimerHeaderValue } from "./RestTimerHeaderValue";

/**
 * Ensures the timer is visible in the top navigation bar during active rest
 * periods by bridging the state into the page header action system.
 */
export function RestTimerHeaderActionBridge() {
    const { isActive } = useRestTimer();
    const headerActions = usePageHeaderActions();
    const actionIdRef = useRef<string | null>(null);
    const addAction = headerActions?.addAction;
    const removeAction = headerActions?.removeAction;

    useEffect(() => {
        if (!addAction || !removeAction) return;

        // Register only when active to avoid reserving space in the header on every page.
        if (isActive && !actionIdRef.current) {
            actionIdRef.current = addAction(<RestTimerHeaderValue />);
        }

        if (!isActive && actionIdRef.current) {
            removeAction(actionIdRef.current);
            actionIdRef.current = null;
        }
    }, [addAction, removeAction, isActive]);

    useEffect(() => {
        return () => {
            // The timer can outlive the current page, so we must unregister the action to prevent stale header values.
            if (removeAction && actionIdRef.current) {
                removeAction(actionIdRef.current);
                actionIdRef.current = null;
            }
        };
    }, [removeAction]);

    return null;
}
