/**
 * A stylized visual representation of the user.
 * 
 * Context:
 * Simply displays user initials in a colored circle to personalize the 
 * settings screen.
 */
export function Avatar({ initial }: { initial: string }) {
    return (
        <div className="w-20 h-20 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-4xl font-bold uppercase shadow-lg">
            {initial}
        </div>
    );
}
