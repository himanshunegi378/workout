import { Loader2 } from "lucide-react";
import { PageHeader } from "@/app/features/page-header";

export function LoadingHeader() {
    return (
        <>
            <PageHeader title="Loading…" backHref="/" />
            <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-8">
                <div className="flex min-h-[36vh] flex-col items-center justify-center px-2 py-12 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                    <p className="mt-4 text-sm">Loading workouts...</p>
                    <div className="mt-6 w-full max-w-md space-y-3">
                        <div className="h-4 w-2/3 rounded-full bg-border/70" />
                        <div className="h-3.5 w-full rounded-full bg-border/50" />
                        <div className="h-3.5 w-5/6 rounded-full bg-border/40" />
                    </div>
                </div>
            </main>
        </>
    );
}
