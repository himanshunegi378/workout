interface MetadataChipProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

export function MetadataChip({ label, value, icon }: MetadataChipProps) {
    return (
        <div className="rounded-2xl border border-border bg-background px-3 py-3 transition-colors hover:bg-muted/20">
            <div className="mb-1 flex items-center gap-1.5 text-muted-foreground">
                <span className="opacity-70">{icon}</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">{label}</span>
            </div>
            <span className="font-display text-sm font-semibold text-foreground">
                {value}
            </span>
        </div>
    );
}
