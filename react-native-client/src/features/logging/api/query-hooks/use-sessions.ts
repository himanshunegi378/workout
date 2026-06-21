import { useInfiniteQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { logKeys } from '../query-keys';
import type { GroupedSession, PaginatedResponse } from '../../types';

export function useInfiniteSessions({
  grouped = true,
  limit = 10,
}: { grouped?: boolean; limit?: number } = {}) {
  return useInfiniteQuery<PaginatedResponse<GroupedSession[]>>({
    queryKey: [...logKeys.sessions(), { grouped, limit }],
    queryFn: async ({ pageParam }) => {
      let url = `/api/log/sessions?limit=${limit}`;
      if (grouped) url += '&grouped=true';
      if (pageParam && typeof pageParam === 'string') {
        url += `&from=${encodeURIComponent(pageParam)}`;
      }

      const res = await apiFetch(url);
      if (!res.ok) {
        throw new Error('Failed to fetch sessions');
      }
      return res.json() as Promise<PaginatedResponse<GroupedSession[]>>;
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      return lastPage.pagination.hasMore ? lastPage.pagination.to : undefined;
    },
  });
}
