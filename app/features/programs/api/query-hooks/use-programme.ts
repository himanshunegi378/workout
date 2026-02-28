import { useQuery } from "@tanstack/react-query";
import { programmeKeys } from "../query-keys";

type ProgrammeDetails = {
    id: string;
    name: string;
    workouts: {
        id: string;
        name: string;
        order_index: number;
        exercisesWithMetadata: {
            exercise: { name: string };
        }[];
        _count: {
            exercisesWithMetadata: number;
        };
    }[];
};

export function useProgramme(programmeId: string) {
    return useQuery({
        queryKey: programmeKeys.detail(programmeId),
        queryFn: async (): Promise<ProgrammeDetails> => {
            const res = await fetch(`/api/programmes/${programmeId}`);
            if (!res.ok) throw new Error("Failed to fetch programme");
            return res.json() as Promise<ProgrammeDetails>;
        },
        enabled: !!programmeId,
    });
}
