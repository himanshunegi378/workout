"use client";

import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    suffix?: string;
}

export function NumberStepper({
    value,
    onChange,
    min = 0,
    max = 999,
    step = 1,
    label,
    suffix,
}: NumberStepperProps) {
    const handleDecrement = () => {
        if (value - step >= min) {
            onChange(value - step);
        } else {
            onChange(min);
        }
    };

    const handleIncrement = () => {
        if (value + step <= max) {
            onChange(value + step);
        } else {
            onChange(max);
        }
    };

    return (
        <div className="flex flex-col gap-1.5 w-full">
            {label && <label className="text-sm font-medium text-foreground">{label}</label>}
            <div className="flex items-center justify-between bg-muted border border-border rounded-xl p-1 elevation-2">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="w-12 h-10 flex items-center justify-center rounded-lg text-foreground hover:bg-background transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <div className="flex-1 text-center font-display font-semibold text-lg flex items-center justify-center gap-1">
                    <span>{value}</span>
                    {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
                </div>
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={value >= max}
                    className="w-12 h-10 flex items-center justify-center rounded-lg text-foreground hover:bg-background transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
