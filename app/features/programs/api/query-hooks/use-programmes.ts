import { useQuery } from "@tanstack/react-query";
import { programmeKeys } from "../query-keys";

type ProgrammeSummary = {
    id: string;
    name: string;
    description: string | null;
    workouts: { id: string }[];
};

export function useProgrammes() {
    return useQuery({
        queryKey: programmeKeys.lists(),
        queryFn: async (): Promise<ProgrammeSummary[]> => {
            const res = await fetch("/api/programmes");
            if (!res.ok) throw new Error("Failed to fetch programmes");
            return res.json() as Promise<ProgrammeSummary[]>;
        },
    });
}
