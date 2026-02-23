import { useQuery } from "@tanstack/react-query";
import { programKeys } from "../query-keys";
import { getProgramById } from "../queries";

export function useProgram(id: string) {
    return useQuery({
        queryKey: programKeys.detail(id),
        queryFn: () => getProgramById(id),
        enabled: !!id,
    });
}
