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
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
                {label && <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>}
                {stepOptions.length > 1 && (
                    <div className="flex bg-muted/50 p-0.5 rounded-lg border border-border/50">
                        {stepOptions.map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => setCurrentStep(opt)}
                                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${currentStep === opt
                                    ? "bg-accent text-accent-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                ±{opt}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between bg-muted border border-border rounded-xl p-1 elevation-2">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="w-12 h-10 flex items-center justify-center rounded-lg text-foreground hover:bg-background transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                    <Minus className="w-5 h-5" />
                </button>
                <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center">
                    <div /> {/* Spacer to force center alignment */}
                    <input
                        type="number"
                        inputMode="decimal"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className="w-16 bg-transparent text-center font-display font-semibold text-lg text-foreground focus:outline-none focus:ring-1 focus:ring-accent rounded-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="text-left pl-0.5">
                        {suffix && <span className="text-sm text-muted-foreground font-semibold">{suffix}</span>}
                    </div>
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
