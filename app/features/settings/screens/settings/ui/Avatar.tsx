/**
 * A stylized visual representation of the user.
 * 
 * Context:
 * Simply displays user initials in a colored circle to personalize the 
 * settings screen.
 */
export function Avatar({ initial }: { initial: string }) {
    return (
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-border/70 bg-card/80 text-3xl font-semibold uppercase text-foreground">
            {initial}
        </div>
    );
}
