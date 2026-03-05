interface MetadataChipProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

export function MetadataChip({ label, value, icon }: MetadataChipProps) {
    return (
        <div className="bg-card/40 border border-border/60 rounded-xl p-2.5 flex flex-col items-center justify-center transition-colors hover:border-accent/20">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <span className="opacity-70">{icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
            </div>
            <span className="font-display text-sm font-bold text-foreground">
                {value}
            </span>
        </div>
    );
}
