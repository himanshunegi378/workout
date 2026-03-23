"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    label?: string;
    suffix?: string;
    stepOptions?: number[];
}

export function NumberStepper({
    value,
    onChange,
    min = 0,
    max = 999,
    step = 1,
    label,
    suffix,
    stepOptions = [],
}: NumberStepperProps) {
    const [currentStep, setCurrentStep] = useState(step);
    const [inputValue, setInputValue] = useState(value.toString());

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    const handleDecrement = () => {
        const newValue = Math.max(min, value - currentStep);
        onChange(newValue);
    };

    const handleIncrement = () => {
        const newValue = Math.min(max, value + currentStep);
        onChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        let parsed = parseFloat(inputValue);
        if (isNaN(parsed)) {
            parsed = min;
        } else {
            parsed = Math.max(min, Math.min(max, parsed));
        }
        setInputValue(parsed.toString());
        onChange(parsed);
    };

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between min-h-[26px]">
                {label && <label className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground/90">{label}</label>}
                {stepOptions.length > 0 ? (
                    <div className="flex rounded-lg border border-border/70 bg-card/50 p-0.5">
                        {stepOptions.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => setCurrentStep(opt)}
                                className={`rounded-md px-2 py-0.5 text-[11px] font-bold transition-all ${currentStep === opt
                                    ? "bg-accent text-accent-foreground shadow-sm shadow-accent/20"
                                    : "text-muted-foreground/90 hover:bg-muted/30 hover:text-foreground"
                                    }`}
                            >
                                ±{opt}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="h-6" /> // Placeholder to maintain vertical alignment
                )}
            </div>

            <div className="group flex items-center justify-between rounded-xl border border-border/70 bg-card/50 p-1.5 transition-colors focus-within:border-accent/50">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-all hover:bg-muted/35 active:scale-95 disabled:opacity-30 disabled:active:scale-100"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <div className="grid flex-1 grid-cols-[1fr_auto_1fr] items-center">
                    <div className="w-8" /> {/* Fixed-width spacer for symmetry */}
                    <input
                        type="number"
                        inputMode="decimal"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className="w-16 bg-transparent text-center font-display font-bold text-lg text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="flex w-8 items-center pl-1">
                        {suffix && <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground/90">{suffix}</span>}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={value >= max}
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-all hover:bg-muted/35 active:scale-95 disabled:opacity-30 disabled:active:scale-100"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
