"use client";

import { useEffect, useRef } from "react";
import { usePageHeaderActions } from "@/app/components/ui";
import { useRestTimer } from "../context/RestTimerContext";
import { RestTimerHeaderValue } from "./RestTimerHeaderValue";

export function RestTimerHeaderActionBridge() {
    const { isActive } = useRestTimer();
    const headerActions = usePageHeaderActions();
    const actionIdRef = useRef<string | null>(null);
    const addAction = headerActions?.addAction;
    const removeAction = headerActions?.removeAction;

    useEffect(() => {
        if (!addAction || !removeAction) return;

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
            if (removeAction && actionIdRef.current) {
                removeAction(actionIdRef.current);
                actionIdRef.current = null;
            }
        };
    }, [removeAction]);

    return null;
}
