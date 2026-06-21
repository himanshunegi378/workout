function normalizeHistoryIds(exerciseId?: string | string[]) {
  return [...new Set((Array.isArray(exerciseId) ? exerciseId : [exerciseId])
    .filter((id): id is string => Boolean(id)))]
    .sort();
}

function normalizeHistoryRange(range?: { from?: string; to?: string }) {
  return {
    from: range?.from ?? null,
    to: range?.to ?? null,
  };
}

export const logKeys = {
  all: ['logs'] as const,
  lists: () => [...logKeys.all, 'list'] as const,
  list: (filters: string) => [...logKeys.lists(), { filters }] as const,
  sessions: () => [...logKeys.all, 'sessions'] as const,
  history: (exerciseId?: string | string[], range?: { from?: string; to?: string }) =>
    [...logKeys.all, 'history', normalizeHistoryIds(exerciseId), normalizeHistoryRange(range)] as const,
  lastLog: (exerciseId?: string) => [...logKeys.all, 'last-log', exerciseId].filter(Boolean),
};
