import { Plus } from "lucide-react";
import Link from "next/link";

export function FAB({ href }: { href: string }) {
    return (
        <Link
            href={href}
            className="fixed bottom-20 right-4 w-14 h-14 rounded-full
                 bg-accent hover:bg-accent-hover text-accent-foreground
                 elevation-5 flex items-center justify-center
                 transition-all duration-200 active:animate-press hover:-translate-y-0.5 z-40"
        >
            <Plus className="w-6 h-6" />
        </Link>
    );
}
