import { useQuery } from "@tanstack/react-query";
import { programKeys } from "../query-keys";
import { getPrograms } from "../queries";

export function usePrograms() {
    return useQuery({
        queryKey: programKeys.lists(),
        queryFn: getPrograms,
    });
}

