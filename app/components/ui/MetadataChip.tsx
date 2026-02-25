interface MetadataChipProps {
    label: string;
    value: string;
    icon: React.ReactNode;
}

export function MetadataChip({ label, value, icon }: MetadataChipProps) {
    return (
        <div className="bg-muted rounded-xl p-2.5 text-center elevation-1">
            <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                {icon}
                <span className="text-[10px] uppercase tracking-wider">{label}</span>
            </div>
            <span className="font-display text-sm font-semibold text-foreground">
                {value}
            </span>
        </div>
    );
}
