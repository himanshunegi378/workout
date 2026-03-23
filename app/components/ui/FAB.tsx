import { Plus } from "lucide-react";
import Link from "next/link";

export function FAB({ href }: { href: string }) {
    return (
        <Link
            href={href}
            className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-accent/25 bg-accent text-accent-foreground transition-all duration-200 hover:-translate-y-px hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:bottom-8 md:right-8"
        >
            <Plus className="w-6 h-6" />
        </Link>
    );
}
